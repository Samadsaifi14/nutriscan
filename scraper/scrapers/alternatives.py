"""
Scrape healthier product alternatives from Indian grocery sites
and international food databases using Scrapling.
"""

import logging
import re
from urllib.parse import quote_plus

import httpx
from scrapling.fetchers import StealthyFetcher

logger = logging.getLogger("nutriscan-scraper.alternatives")


def _parse_nutrition_from_text(text: str) -> dict:
    """Extract nutrition values from freeform text."""
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
        "calories": [r"(\d+(?:\.\d+)?)\s*kcal"],
        "protein": [r"protein[^\d]*(\d+(?:\.\d+)?)\s*g"],
        "carbs": [r"carbohydrate[s]?[^\d]*(\d+(?:\.\d+)?)\s*g"],
        "fat": [r"(?:total\s*)?fat[^\d]*(\d+(?:\.\d+)?)\s*g"],
        "saturated_fat": [r"saturated\s*fat[^\d]*(\d+(?:\.\d+)?)\s*g"],
        "sugar": [r"sugars?[^\d]*(\d+(?:\.\d+)?)\s*g"],
        "sodium": [r"sodium[^\d]*(\d+(?:\.\d+)?)\s*mg"],
        "fiber": [r"fib(?:er|re)[^\d]*(\d+(?:\.\d+)?)\s*g"],
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


def _search_bigbasket_alternatives(
    product_name: str,
    category: str | None = None,
    max_results: int = 10,
) -> list[dict]:
    """Search bigbasket for alternative products in the same category."""
    query = category or product_name
    search_url = f"https://www.bigbasket.com/ps/?q={quote_plus(query)}"

    logger.info(f"BigBasket alternatives search: {search_url}")

    try:
        page = StealthyFetcher.fetch(search_url, headless=True)

        if not page or not page.status or page.status >= 400:
            return []

        product_links = page.css("a[href*='/pd/']")
        if not product_links:
            product_links = page.css("a[href*='/product']")

        results = []
        seen_names = set()

        for link in product_links[:max_results * 2]:
            href = link.attrib.get("href", "")
            if not href or not href.startswith("http"):
                href = f"https://www.bigbasket.com{href}"

            name = link.get_all_text(separator=" ").strip()
            if not name or len(name) < 3 or name.lower() in seen_names:
                continue
            seen_names.add(name.lower())

            try:
                product_page = StealthyFetcher.fetch(href, headless=True)
                if not product_page:
                    continue

                full_name = name
                for sel in ["h1", "[class*='name']"]:
                    els = product_page.css(sel)
                    if els:
                        full_name = els[0].get_all_text(separator=" ").strip()
                        if full_name:
                            break

                nutrition_text = ""
                for sel in [
                    "table[class*='nutrition']",
                    "div[class*='nutrition']",
                    "table",
                ]:
                    els = product_page.css(sel)
                    if els:
                        nutrition_text = els[0].get_all_text(separator=" ").strip()
                        if any(k in nutrition_text.lower() for k in ("calor", "protein")):
                            break

                nutrition = _parse_nutrition_from_text(nutrition_text)
                has_nutrition = any(v is not None for v in nutrition.values())
                if not has_nutrition:
                    continue

                brand = None
                for sel in ["[class*='brand']"]:
                    els = product_page.css(sel)
                    if els:
                        brand = els[0].get_all_text(separator=" ").strip()
                        if brand:
                            break

                image = None
                els = product_page.css("img[class*='product']")
                if els:
                    image = els[0].attrib.get("src") or els[0].attrib.get("data-src")

                results.append({
                    "name": full_name,
                    "brand": brand,
                    "image_url": image,
                    "nutrition_per_100g": nutrition,
                    "ingredients_text": None,
                    "source": "bigbasket",
                })

                if len(results) >= max_results:
                    break
            except Exception:
                continue

        return results
    except Exception:
        logger.exception("BigBasket alternatives search failed")
        return []


def _search_off_alternatives(
    product_name: str,
    category: str | None = None,
    max_results: int = 10,
) -> list[dict]:
    """Search Open Food Facts (JSON API) for alternatives."""
    query = category or product_name
    search_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={quote_plus(query)}&search_simple=1&action=process&json=1&page_size={max_results}"

    logger.info(f"OFF alternatives search: {search_url}")

    try:
        import httpx
        resp = httpx.get(search_url, timeout=15, headers={"User-Agent": "NutriScanScraper/0.1"})
        if resp.status_code >= 400:
            return []

        data = resp.json()
        results = []

        for p in data.get("products", []):
            name = p.get("product_name") or p.get("product_name_en")
            n = p.get("nutriments", {})
            if not name or not n:
                continue

            nutrition = {
                "calories": _num(n.get("energy-kcal_100g") or n.get("energy-kcal")),
                "protein": _num(n.get("proteins_100g") or n.get("proteins")),
                "carbs": _num(n.get("carbohydrates_100g") or n.get("carbohydrates")),
                "fat": _num(n.get("fat_100g") or n.get("fat")),
                "saturated_fat": _num(n.get("saturated-fat_100g") or n.get("saturated_fat")),
                "sugar": _num(n.get("sugars_100g") or n.get("sugars")),
                "sodium": _num(n.get("sodium_100g") or n.get("sodium")),
                "fiber": _num(n.get("fiber_100g") or n.get("fiber")),
            }

            if not any(v is not None for v in nutrition.values()):
                continue

            results.append({
                "name": name,
                "brand": p.get("brands"),
                "image_url": p.get("image_url") or p.get("image_front_url"),
                "nutrition_per_100g": nutrition,
                "ingredients_text": p.get("ingredients_text"),
                "source": "openfoodfacts",
            })

            if len(results) >= max_results:
                break

        return results
    except Exception:
        logger.exception("OFF alternatives search failed")
        return []


def _num(v):
    try:
        f = float(v)
        return f if f == f else None
    except (TypeError, ValueError):
        return None


def scrape_alternatives_sync(
    product_name: str,
    category: str | None = None,
    brand: str | None = None,
    ingredients_text: str | None = None,
    max_results: int = 10,
) -> list[dict]:
    """
    Find alternative products by scraping multiple sources.
    Returns a list of alternative product dicts.
    """
    all_results = []

    # OFF JSON API first — fast, reliable, rich nutrition data
    off_results = _search_off_alternatives(
        product_name, category, max_results=max_results
    )
    all_results.extend(off_results)

    # BigBasket as complementary source (best-effort; nutrition is JS-loaded so
    # often empty). Cap low since each product needs a headless browser launch.
    if len(all_results) < max_results:
        bb_limit = max(1, min(3, max_results - len(all_results)))
        bb_results = _search_bigbasket_alternatives(
            product_name, category, max_results=bb_limit
        )
        all_results.extend(bb_results)

    seen_names = set()
    unique = []
    for r in all_results:
        key = r["name"].lower().strip()
        if key and key not in seen_names:
            seen_names.add(key)
            unique.append(r)

    logger.info(f"Found {len(unique)} unique alternatives")
    return unique[:max_results]
