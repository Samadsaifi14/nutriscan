"""
Scrape Indian grocery product pages from bigbasket, blinkit, and amazon.in
using Scrapling's StealthyFetcher to bypass Cloudflare and other anti-bot
systems. Returns structured nutrition data.
"""

import re
import logging
from urllib.parse import quote_plus

from scrapling.fetchers import StealthyFetcher, Fetcher

logger = logging.getLogger("nutriscan-scraper.indian")


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


def _extract_ingredients(page, selectors: list[str]) -> str | None:
    """Try multiple selectors to find ingredients text."""
    for sel in selectors:
        els = page.css(sel)
        if els:
            text = els[0].get_all_text(separator=" ").strip()
            if len(text) > 10:
                return text
    return None


def _extract_nutrition_table(page) -> str:
    """Attempt to extract the full nutrition table text for parsing."""
    selectors = [
        "table.nutrition-table",
        "table[class*='nutrition']",
        "div[class*='nutrition'] table",
        "div[class*='nutrition-info']",
        "div[class*='nutrition_info']",
        "div[class*='nutritional']",
        "section[class*='nutrition']",
        "[data-testid*='nutrition']",
        "table",
    ]
    for sel in selectors:
        els = page.css(sel)
        if els:
            text = els[0].get_all_text(separator=" ").strip()
            if any(kw in text.lower() for kw in ("calor", "protein", "fat", "carb")):
                return text
    return ""


def _extract_image(page) -> str | None:
    """Extract the main product image URL."""
    selectors = [
        "img[class*='product']",
        "img[class*='main']",
        "img[class*='hero']",
        "img[data-testid*='product']",
        "meta[property='og:image']",
    ]
    for sel in selectors:
        els = page.css(sel)
        if els:
            el = els[0]
            if el.tag == "meta":
                return el.attrib.get("content")
            return el.attrib.get("src") or el.attrib.get("data-src")
    return None


# ── BigBasket scraper ────────────────────────────────────────────────────────

def _scrape_bigbasket(search_hint: str, brand: str | None = None) -> dict | None:
    """Search and scrape a product from bigbasket.com."""
    query = f"{brand} {search_hint}" if brand else search_hint
    search_url = f"https://www.bigbasket.com/ps/?q={quote_plus(query)}"

    logger.info(f"BigBasket search: {search_url}")

    try:
        page = StealthyFetcher.fetch(search_url, headless=True)

        if not page or not page.status or page.status >= 400:
            logger.warning(f"BigBasket returned status {page.status if page else 'None'}")
            return None

        product_links = page.css("a[href*='/pd/']")
        if not product_links:
            product_links = page.css("a[href*='/product']")

        if not product_links:
            logger.info("No BigBasket product links found")
            return None

        href = product_links[0].attrib.get("href", "")
        if not href.startswith("http"):
            href = f"https://www.bigbasket.com{href}"

        product_page = StealthyFetcher.fetch(href, headless=True)
        if not product_page:
            return None

        name = None
        for sel in ["h1[class*='name']", "h1[class*='title']", "[class*='product-name']", "h1"]:
            els = product_page.css(sel)
            if els:
                name = els[0].get_all_text(separator=" ").strip()
                if name:
                    break

        brand_name = brand
        if not brand_name:
            for sel in ["[class*='brand']", "[class*='manufacturer']"]:
                els = product_page.css(sel)
                if els:
                    brand_name = els[0].get_all_text(separator=" ").strip()
                    if brand_name:
                        break

        nutrition_text = _extract_nutrition_table(product_page)
        nutrition = _parse_nutrition_text(nutrition_text)

        ingredients = _extract_ingredients(product_page, [
            "[class*='ingredients']",
            "[class*='ingredient']",
            "[data-testid*='ingredient']",
        ])

        image = _extract_image(product_page)

        return {
            "name": name,
            "brand": brand_name,
            "image_url": image,
            "ingredients_text": ingredients,
            "nutrition_per_100g": nutrition,
            "source": "bigbasket",
            "source_url": href,
        }
    except Exception:
        logger.exception("BigBasket scrape failed")
        return None


# ── Blinkit scraper ──────────────────────────────────────────────────────────

def _scrape_blinkit(search_hint: str, brand: str | None = None) -> dict | None:
    """Search and scrape a product from blinkit.com."""
    query = f"{brand} {search_hint}" if brand else search_hint
    search_url = f"https://blinkit.com/search?q={quote_plus(query)}"

    logger.info(f"Blinkit search: {search_url}")

    try:
        page = StealthyFetcher.fetch(search_url, headless=True)

        if not page or not page.status or page.status >= 400:
            return None

        product_links = page.css("a[href*='/product/']")
        if not product_links:
            product_links = page.css("a[href*='/pn/']")

        if not product_links:
            logger.info("No Blinkit product links found")
            return None

        href = product_links[0].attrib.get("href", "")
        if not href.startswith("http"):
            href = f"https://blinkit.com{href}"

        product_page = StealthyFetcher.fetch(href, headless=True)
        if not product_page:
            return None

        name = None
        for sel in ["h1", "[class*='product-name']", "[class*='title']"]:
            els = product_page.css(sel)
            if els:
                name = els[0].get_all_text(separator=" ").strip()
                if name:
                    break

        brand_name = brand
        if not brand_name:
            for sel in ["[class*='brand']", "[class*='manufacturer']"]:
                els = product_page.css(sel)
                if els:
                    brand_name = els[0].get_all_text(separator=" ").strip()
                    if brand_name:
                        break

        nutrition_text = _extract_nutrition_table(product_page)
        nutrition = _parse_nutrition_text(nutrition_text)

        ingredients = _extract_ingredients(product_page, [
            "[class*='ingredients']",
            "[class*='ingredient']",
        ])

        image = _extract_image(product_page)

        return {
            "name": name,
            "brand": brand_name,
            "image_url": image,
            "ingredients_text": ingredients,
            "nutrition_per_100g": nutrition,
            "source": "blinkit",
            "source_url": href,
        }
    except Exception:
        logger.exception("Blinkit scrape failed")
        return None


# ── Amazon.in scraper ────────────────────────────────────────────────────────

def _scrape_amazon_in(search_hint: str, brand: str | None = None) -> dict | None:
    """Search and scrape a product from amazon.in."""
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

        href = product_links[0].attrib.get("href", "")
        if not href.startswith("http"):
            href = f"https://www.amazon.in{href}"

        product_page = Fetcher.get(href)
        if not product_page:
            return None

        name = None
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

        nutrition_text = _extract_nutrition_table(product_page)
        nutrition = _parse_nutrition_text(nutrition_text)

        ingredients = _extract_ingredients(product_page, [
            "[class*='ingredients']",
            "#productDetails_techSpec_section_1",
            "table.a-keyvalue",
        ])

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
            "nutrition_per_100g": nutrition,
            "source": "amazon_in",
            "source_url": href,
        }
    except Exception:
        logger.exception("Amazon.in scrape failed")
        return None


# ── Main entry point ─────────────────────────────────────────────────────────

def scrape_indian_product_sync(
    search_hint: str,
    brand: str | None = None,
    barcode: str | None = None,
) -> dict | None:
    """
    Try scraping an Indian product from multiple grocery sites.
    Returns the first successful result with nutrition data.
    """
    scrapers = [
        ("bigbasket", _scrape_bigbasket),
        ("blinkit", _scrape_blinkit),
        ("amazon_in", _scrape_amazon_in),
    ]

    for name, scraper in scrapers:
        logger.info(f"Trying {name} for: {search_hint}")
        result = scraper(search_hint, brand)
        if result and result.get("name"):
            has_nutrition = any(
                v is not None
                for v in result.get("nutrition_per_100g", {}).values()
            )
            if has_nutrition:
                logger.info(f"Got nutrition data from {name}")
                if barcode:
                    result["barcode"] = barcode
                return result
            logger.info(f"{name} returned product but no nutrition data")

    logger.info("No nutrition data found from any Indian grocery site")
    return None
