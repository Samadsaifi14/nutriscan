"""
Scrape Indian grocery product pages using Scrapling.
- bigbasket: parses the server-rendered application/json state for full
  nutrition, ingredients, and barcode (primary, richest data).
- amazon.in: returns name/brand/image/ingredients as a fallback (Amazon does
  not publish a structured nutrition table in its HTML).

Both are wrapped so the FastAPI service can run them in a thread executor.
"""

import re
import json
import time
import html as htmllib
import logging
from urllib.parse import quote_plus

from scrapling.fetchers import StealthyFetcher, Fetcher

logger = logging.getLogger("nutriscan-scraper.indian")


def _html_to_text(content: str) -> str:
    """Unescape embedded HTML and strip tags to plain text."""
    text = htmllib.unescape(content or "")
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _clean_ingredients(text: str) -> str | None:
    """Clean up ingredient text (drop the leading CSS import if present)."""
    if not text:
        return None
    text = text.replace("@import url(\"https://www.bbassets.com/static/froala_style_v2.min.css\");", " ")
    text = re.sub(r'\s+', ' ', text).strip()
    return text or None


def _parse_nutrition_text(text: str) -> dict:
    """Extract nutrition values from freeform text like a nutrition table."""
    result: dict[str, float | None] = {
        "calories": None,
        "protein": None,
        "carbs": None,
        "fat": None,
        "saturated_fat": None,
        "sugar": None,
        "sodium": None,
        "fiber": None,
    }
    if not text:
        return result

    lower = text.lower()

    patterns = {
        "calories": [
            r"(?:energy|calories?)[^\d]*(\d+(?:\.\d+)?)\s*kcal",
            r"(\d+(?:\.\d+)?)\s*kcal",
        ],
        "protein": [
            r"protein[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "carbs": [
            r"carbohydrate[s]?[^\d]*(\d+(?:\.\d+)?)\s*g",
            r"total\s*carb[s]?[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "fat": [
            r"(?:total\s*)?fat[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "saturated_fat": [
            r"saturated\s*fat[^\d]*(\d+(?:\.\d+)?)\s*g",
            r"sat\.?\s*fat[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "sugar": [
            r"(?:total\s*)?sugars?[^\d]*(\d+(?:\.\d+)?)\s*g",
            r"added\s*sugars?[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "sodium": [
            r"sodium[^\d]*(\d+(?:\.\d+)?)\s*mg",
            r"sodium[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "fiber": [
            r"(?:dietary\s*)?fib(?:er|re)[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
    }

    for key, pats in patterns.items():
        for pat in pats:
            m = re.search(pat, lower)
            if m:
                val = float(m.group(1))
                if key == "sodium" and val < 10:
                    val *= 1000
                result[key] = val
                break

    return result


# ── BigBasket scraper ────────────────────────────────────────────────────────

def _bb_search_for_product_urls(
    search_hint: str, brand: str | None = None, limit: int = 6
) -> list[str]:
    """Return several BigBasket /pd/ product URLs for a search term.

    The search results page is a JS SPA so StealthyFetcher is required; the
    product page itself is server-rendered so Fetcher is enough for the rest.
    Returning multiple candidates lets us pick the one that best matches the
    query AND has nutrition data, since BigBasket's relevance ranking is loose.
    """
    query = f"{brand} {search_hint}" if brand else search_hint
    search_url = f"https://www.bigbasket.com/ps/?q={quote_plus(query)}"

    try:
        page = StealthyFetcher.fetch(search_url, headless=True)
        if not page or not page.status or page.status >= 400:
            return []

        links = page.css("a[href*='/pd/']")
        if not links:
            links = page.css("a[href*='/product']")

        urls = []
        seen = set()
        for link in links:
            href = link.attrib.get("href", "")
            if href in seen:
                continue
            seen.add(href)
            if not href.startswith("http"):
                href = f"https://www.bigbasket.com{href}"
            # normalize: strip query-string tracking params
            clean = href.split("?")[0]
            if clean not in seen and clean:
                seen.add(clean)
                urls.append(clean)
            if len(urls) >= limit:
                break
        return urls
    except Exception:
        logger.exception("BigBasket search failed")
        return []


def _bb_score(result: dict, query_tokens: set[str]) -> float:
    """Score a parsed BigBasket result by query relevance + data completeness."""
    score = 0.0
    name = (result.get("name") or "").lower()
    brand = (result.get("brand") or "").lower()
    haystack = f"{name} {brand}"

    for tok in query_tokens:
        if tok in haystack:
            score += 2.0

    if result.get("nutrition_per_100g") and any(
        v is not None for v in result["nutrition_per_100g"].values()
    ):
        score += 3.0
    if result.get("ingredients_text"):
        score += 2.0
    if result.get("barcode"):
        score += 1.0
    return score



def _bb_parse_json(product_url: str) -> dict | None:
    """Fetch a BigBasket product page and parse its embedded JSON state.

    BigBasket renders product details (name, brand, image, ingredients and a
    full nutritional facts table) inside a <script type="application/json">
    preloaded-state blob. Parsing this with a plain Fetcher is far faster and
    far more reliable than scraping the rendered DOM (which needs a headless
    browser and hides nutrition in a tab).
    """
    resp = Fetcher.get(product_url)
    if not resp or not resp.status or resp.status >= 400:
        return None

    raw = resp.body
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8", errors="ignore")

    m = re.search(
        r'<script[^>]*type="application/json"[^>]*>(.*?)</script>',
        raw,
        re.DOTALL,
    )
    if not m:
        logger.info("No application/json preloaded state on BigBasket page")
        return None
    try:
        data = json.loads(m.group(1))
    except Exception:
        logger.exception("Failed to parse BigBasket JSON state")
        return None

    # Navigate: props.pageProps.productDetails.children[0] holds the product.
    prod = None
    try:
        details = data["props"]["pageProps"]["productDetails"]
        if details.get("isError") or not details.get("children"):
            return None
        prod = details["children"][0]
        if not isinstance(prod, dict):
            return None
    except (KeyError, IndexError, TypeError):
        logger.warning("Unexpected BigBasket JSON shape")
        return None

    # Name + pack description
    name_parts = []
    if prod.get("desc"):
        name_parts.append(prod["desc"])
    if prod.get("pack_desc"):
        name_parts.append(prod["pack_desc"])
    name = " ".join(p for p in name_parts if p).strip() or None

    brand_name = None
    if isinstance(prod.get("brand"), dict):
        brand_name = prod["brand"].get("name") or None

    image = None
    images = prod.get("images") or []
    if images and isinstance(images[0], dict):
        for size in ("l", "m", "s"):
            if images[0].get(size):
                image = images[0][size]
                break

    ingredients = None
    nutrition_text = ""
    barcode = None
    for tab in prod.get("tabs") or []:
        title = (tab.get("title") or "").lower()
        content = tab.get("content") or ""
        text = _html_to_text(content)
        if "ingredient" in title:
            ingredients = _clean_ingredients(text)
        elif "nutrition" in title:
            nutrition_text = text
        elif "other product info" in title or "other info" in title:
            m_barcode = re.search(r"ean\s*code:?\s*([0-9]{8,14})", text, re.I)
            if m_barcode:
                barcode = m_barcode.group(1)

    nutrition = _parse_nutrition_text(nutrition_text)
    return {
        "name": name,
        "brand": brand_name,
        "image_url": image,
        "ingredients_text": ingredients,
        "nutrition_per_100g": nutrition,
        "barcode": barcode,
        "source": "bigbasket",
        "source_url": product_url,
    }


def _scrape_bigbasket(search_hint: str, brand: str | None = None) -> dict | None:
    """Search and scrape the best-matching product from bigbasket.com."""
    try:
        query = f"{brand} {search_hint}" if brand else search_hint
        query_tokens = {
            t
            for t in re.findall(r"[a-z0-9]+", query.lower())
            if len(t) > 2 and t not in {"sir", "the", "and", "with", "for"}
        }

        urls = _bb_search_for_product_urls(search_hint, brand)
        if not urls:
            logger.info("No BigBasket product URLs found")
            return None

        best = None
        best_score = -1.0
        for url in urls:
            result = _bb_parse_json(url)
            if not result or not result.get("name"):
                continue
            score = _bb_score(result, query_tokens)
            if score > best_score:
                best_score = score
                best = result

        if best:
            logger.info(
                f"BigBasket: {best['name']} | score={best_score:.1f} "
                f"| ingredients={'yes' if best['ingredients_text'] else 'no'} "
                f"| nutrition={'yes' if any(v is not None for v in best['nutrition_per_100g'].values()) else 'no'}"
            )
        return best
    except Exception:
        logger.exception("BigBasket scrape failed")
        return None


# ── Amazon.in scraper ────────────────────────────────────────────────────────

def _amz_clean_url(href: str) -> str:
    """Return a clean https://www.amazon.in/dp/{ASIN} URL from any product link."""
    m = re.search(r"/dp/([A-Z0-9]{10})", href)
    if m:
        return f"https://www.amazon.in/dp/{m.group(1)}"
    if href.startswith("http"):
        return href.split("?")[0]
    return f"https://www.amazon.in{href}"


def _scrape_amazon_in(search_hint: str, brand: str | None = None) -> dict | None:
    """Search and scrape a product from amazon.in.

    Amazon.in does not publish a structured nutrition table in its server HTML
    for most grocery items, so this returns name/brand/image/ingredients only.
    The NutriScan pipeline fills missing nutrition via AI estimation using the
    product name (see fillNutritionIfMissing), so this still adds real coverage.
    """
    query = f"{brand} {search_hint}" if brand else search_hint
    search_url = f"https://www.amazon.in/s?k={quote_plus(query)}&i=grocery"

    logger.info(f"Amazon.in search: {search_url}")

    try:
        page = Fetcher.get(search_url)
        if not page or not page.status or page.status >= 400:
            return None

        product_links = page.css("a.a-link-normal[href*='/dp/']")
        if not product_links:
            product_links = page.css("a[href*='/dp/']")
        if not product_links:
            logger.info("No Amazon.in product links found")
            return None

        href = _amz_clean_url(product_links[0].attrib.get("href", ""))
        product_page = Fetcher.get(
            href,
            extra_headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
                )
            },
        )
        if not product_page:
            return None

        raw = product_page.body
        if isinstance(raw, bytes):
            raw = raw.decode("utf-8", errors="ignore")

        name = None
        m_name = re.search(r'<span[^>]*id="productTitle"[^>]*>(.*?)</span>', raw, re.S)
        if m_name:
            name = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m_name.group(1))).strip()
            name = htmllib.unescape(name) or None
        if not name:
            for sel in ["#productTitle", "h1.a-size-large", "h1"]:
                els = product_page.css(sel)
                if els:
                    name = els[0].get_all_text(separator=" ").strip()
                    if name:
                        break

        brand_name = brand
        if not brand_name:
            els = product_page.css("#bylineInfo")
            if els:
                brand_name = els[0].get_all_text(separator=" ").strip().replace("Brand: ", "")
                # Amazon often renders brand as "Visit the X Store" / "Visit the X Brand Store"
                m = re.search(r"Visit the (.+?)(?: Brand)? Store$", brand_name)
                if m:
                    brand_name = m.group(1)
                brand_name = brand_name or None

        # Ingredients often live in the "About this item" feature bullets.
        ingredients = None
        for sel in ["#feature-bullets", "[class*='ingredients']", "#productDetails_techSpec_section_1"]:
            els = product_page.css(sel)
            if els:
                text = els[0].get_all_text(separator=" ").strip()
                if len(text) > 10:
                    ingredients = text
                    break

        image = None
        els = product_page.css("#landingImage")
        if els:
            image = els[0].attrib.get("src")
        if not image:
            els = product_page.css("meta[property='og:image']")
            if els:
                image = els[0].attrib.get("content")

        return {
            "name": name,
            "brand": brand_name,
            "image_url": image,
            "ingredients_text": ingredients,
            "nutrition_per_100g": {},
            "source": "amazon_in",
            "source_url": href,
        }
    except Exception:
        logger.exception("Amazon.in scrape failed")
        return None


# ── AapkaBaazar scraper ────────────────────────────────────────────────────────
#
# AapkaBaazar (aapkabazar.co) is a Next.js grocery store. Product pages are
# server-rendered with a __NEXT_DATA__ blob holding productData: name, brand,
# a real EAN barcode (barCode), manufacturer, image and often an ingredient
# list inside the FAQ ("What are the ingredients..."). All products are listed
# in a single public sitemap.xml, so a product can be located by name without
# reverse-engineering the site's internal search API. The sitemap is cached
# in-memory for a day to keep subsequent lookups cheap.

AAPKA_BAZAAR_SITEMAP = "https://aapkabazar.co/sitemap.xml"
AAPKA_BAZAAR_IMAGE = "https://image.aapkabazar.co"

_aapka_cache: dict | None = None
_AAPKA_CACHE_TTL = 24 * 60 * 60  # seconds


def _aapka_load_index() -> list[tuple[str, str]] | None:
    """Return (product_url, slug) pairs from the sitemap, cached in-memory."""
    global _aapka_cache
    now = time.time()
    if _aapka_cache and (now - _aapka_cache["ts"]) < _AAPKA_CACHE_TTL:
        return _aapka_cache["items"]

    try:
        page = Fetcher.get(AAPKA_BAZAAR_SITEMAP)
        if not page or not page.status or page.status >= 400:
            return _aapka_cache["items"] if _aapka_cache else None

        raw = page.body
        if isinstance(raw, bytes):
            raw = raw.decode("utf-8", errors="ignore")

        items: list[tuple[str, str]] = []
        for m in re.finditer(r"<loc>\s*(https://aapkabazar\.co/(\d+)/pd/([^<]+?))\s*</loc>", raw):
            url, _pid, slug = m.group(1), m.group(2), m.group(3).strip()
            items.append((url, slug))
        if not items:
            return _aapka_cache["items"] if _aapka_cache else None

        _aapka_cache = {"ts": now, "items": items}
        logger.info(f"AapkaBaazar sitemap loaded: {len(items)} products")
        return items
    except Exception:
        logger.exception("AapkaBaazar sitemap load failed")
        return _aapka_cache["items"] if _aapka_cache else None


def _aapka_normalize_tokens(text: str) -> set[str]:
    return {
        t
        for t in re.findall(r"[a-z0-9]+", (text or "").lower())
        if len(t) > 2
        and t
        not in {
            "the", "and", "with", "for", "pack", "ml", "kg", "gm", "g", "l",
            "box", "bottle", "gram", "ltr", "pcs", "off",
        }
    }


def _aapka_find_product_url(search_hint: str, brand: str | None = None) -> str | None:
    """Find the best-matching AapkaBaazar product URL by name/brand slug match."""
    items = _aapka_load_index()
    if not items:
        return None

    query = f"{brand} {search_hint}" if brand else search_hint
    query_tokens = _aapka_normalize_tokens(query)
    if not query_tokens:
        return None

    best_url = None
    best_score = 0
    for url, slug in items:
        slug_lower = slug.lower()
        score = 0
        for tok in query_tokens:
            if tok in slug_lower:
                score += 1
        if score > best_score:
            best_score = score
            best_url = url

    if best_url is None:
        return None

    # Precision guard: require that a meaningful fraction of the query tokens
    # match the slug, otherwise a single generic token ("green", "tea") could
    # pull in an unrelated product. Single-word queries still pass if the one
    # token matches, while multi-word queries need at least half (and >= 2)
    # of their tokens to appear.
    if len(query_tokens) > 1:
        need = (len(query_tokens) + 1) // 2
        if best_score < max(2, need):
            return None
    elif best_score < 1:
        return None

    logger.info(f"AapkaBaazar matched '{query}' -> {best_url} (tokens={best_score})")
    return best_url


def _aapka_parse_ingredients(pd: dict) -> str | None:
    """Pull the ingredient list from the FAQ "What are the ingredients..." answer."""
    for faq in pd.get("faq") or []:
        if not isinstance(faq, dict):
            continue
        question = (faq.get("question") or "").lower()
        if "ingredient" in question:
            answer = _html_to_text(faq.get("answer") or "")
            if answer:
                return answer
    return None


def _aapka_parse_nutrition(pd: dict) -> dict:
    """Convert AapkaBaazar nutritionalFacts list into the standard per-100g dict.

    The list is usually empty (like Amazon, nutrition is filled by AI later),
    but when present each item has a label + value, so we build a freeform text
    block and reuse the shared parser to stay schema-agnostic.
    """
    facts = pd.get("nutritionalFacts")
    if not facts:
        return {}
    lines = []
    if isinstance(facts, list):
        for f in facts:
            if not isinstance(f, dict):
                continue
            label = f.get("nutritionName") or f.get("name") or f.get("label")
            value = f.get("nutritionalValue") or f.get("value") or f.get("qty")
            if label and value is not None:
                lines.append(f"{label} {value}")
    text = " ".join(lines)
    if not text.strip():
        return {}
    parsed = _parse_nutrition_text(text)
    return {k: v for k, v in parsed.items() if v is not None}


def _aapka_parse_product(product_url: str) -> dict | None:
    """Fetch an AapkaBaazar product page and parse its __NEXT_DATA__ productData."""
    resp = Fetcher.get(product_url)
    if not resp or not resp.status or resp.status >= 400:
        return None

    raw = resp.body
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8", errors="ignore")

    m = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        raw,
        re.DOTALL,
    )
    if not m:
        logger.info("No __NEXT_DATA__ on AapkaBaazar product page")
        return None
    try:
        data = json.loads(m.group(1))
        pd = data["props"]["pageProps"]["productData"]
    except Exception:
        logger.exception("Failed to parse AapkaBaazar product JSON")
        return None
    if not isinstance(pd, dict):
        return None

    name = pd.get("name") or None
    if not name:
        return None

    brand_obj = pd.get("brandData") if isinstance(pd.get("brandData"), dict) else None
    brand_name = (brand_obj or {}).get("name") or pd.get("brand") or None

    image = None
    images = pd.get("images") or []
    pid = pd.get("id")
    if images and pid is not None:
        first = images[0]
        image = f"{AAPKA_BAZAAR_IMAGE}/product/{pid}/{first}"

    barcode = pd.get("barCode") or None
    if barcode:
        barcode = str(barcode)

    manufacturer = None
    if pd.get("manufacturerDetails"):
        manufacturer = _html_to_text(str(pd["manufacturerDetails"]))

    ingredients = _aapka_parse_ingredients(pd)
    nutrition = _aapka_parse_nutrition(pd)

    return {
        "name": name,
        "brand": brand_name,
        "image_url": image,
        "ingredients_text": ingredients,
        "nutrition_per_100g": nutrition,
        "barcode": barcode,
        "manufacturer": manufacturer,
        "source": "aapkabaazar",
        "source_url": product_url,
    }


def _scrape_aapkabaazar(search_hint: str, brand: str | None = None) -> dict | None:
    """Locate and scrape the best-matching product from aapkabazar.co."""
    try:
        product_url = _aapka_find_product_url(search_hint, brand)
        if not product_url:
            logger.info("No AapkaBaazar product URL found")
            return None
        result = _aapka_parse_product(product_url)
        if result:
            logger.info(
                f"AapkaBaazar: {result['name']} | "
                f"barcode={'yes' if result['barcode'] else 'no'} "
                f"| ingredients={'yes' if result['ingredients_text'] else 'no'}"
            )
        return result
    except Exception:
        logger.exception("AapkaBaazar scrape failed")
        return None


# ── Main entry point ─────────────────────────────────────────────────────────

def scrape_indian_product_sync(
    search_hint: str,
    brand: str | None = None,
    barcode: str | None = None,
) -> dict | None:
    """
    Try scraping an Indian product from multiple grocery sites.

    Prefers the result with the most complete data (full nutrition + ingredients
    + barcode), but falls back to a name/ingredients-only result from another
    source if no source returns structured nutrition. The NutriScan client then
    fills missing nutrition via AI estimation, so returning a name+ingredients
    result is still far more useful than returning nothing.
    """
    scrapers = [
        ("bigbasket", _scrape_bigbasket),
        ("aapkabaazar", _scrape_aapkabaazar),
        ("amazon_in", _scrape_amazon_in),
    ]

    best = None
    best_score = -1.0
    for name, scraper in scrapers:
        logger.info(f"Trying {name} for: {search_hint}")
        result = scraper(search_hint, brand)
        if not result or not result.get("name"):
            continue
        if result.get("barcode") and not barcode:
            barcode = result["barcode"]

        nutrition = result.get("nutrition_per_100g") or {}
        has_nutrition = any(v is not None for v in nutrition.values())
        score = 0.0
        if has_nutrition:
            score += 5.0
        if result.get("ingredients_text"):
            score += 2.0
        if result.get("barcode"):
            score += 1.0

        if score > best_score:
            best_score = score
            best = result

    if best is None:
        logger.info("No product found from any Indian grocery site")
        return None
    if barcode:
        best["barcode"] = barcode
    logger.info(
        f"Best result: {best['source']} | {best['name']} | "
        f"nutrition={'yes' if any(v is not None for v in (best.get('nutrition_per_100g') or {}).values()) else 'no'}"
    )
    return best
