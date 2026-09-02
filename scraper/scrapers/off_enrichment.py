"""
Enrich product data by scraping Open Food Facts HTML pages.
This is a fallback when the OFF JSON API returns incomplete data
(e.g., product exists but nutrition or ingredients are missing from the API
 yet present in the HTML page).
"""

import logging
import re

from scrapling.fetchers import Fetcher

logger = logging.getLogger("nutriscan-scraper.off")


def _parse_nutrition_from_html(text: str) -> dict:
    """Parse nutrition values from OFF HTML page text."""
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
        ],
        "fat": [
            r"(?:total\s*)?fat[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "saturated_fat": [
            r"-saturated[^\d]*(\d+(?:\.\d+)?)\s*g",
            r"saturated\s*fat[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "sugar": [
            r"sugars?[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "sodium": [
            r"sodium[^\d]*(\d+(?:\.\d+)?)\s*g",
        ],
        "fiber": [
            r"fib(?:er|re)[^\d]*(\d+(?:\.\d+)?)\s*g",
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


def enrich_from_off_html_sync(
    barcode: str,
    product_name: str | None = None,
) -> dict | None:
    """
    Scrape the Open Food Facts product page HTML to extract nutrition
    and ingredients data that may be missing from the JSON API.
    """
    url = f"https://world.openfoodfacts.org/product/{barcode}/"
    logger.info(f"Enriching from OFF HTML: {url}")

    try:
        page = Fetcher.get(url)

        if not page or not page.status or page.status >= 400:
            logger.warning(f"OFF HTML returned status {page.status if page else 'None'}")
            return None

        name = product_name
        if not name:
            for sel in ["h1[property='food:name']", "h1", "[class*='product-name']"]:
                els = page.css(sel)
                if els:
                    name = els[0].get_all_text(separator=" ").strip()
                    if name:
                        break

        brand = None
        for sel in ["[property='food:brand']", "[class*='brand']"]:
            els = page.css(sel)
            if els:
                brand = els[0].get_all_text(separator=" ").strip()
                if brand:
                    break

        ingredients = None
        for sel in [
            "#panel_ingredients",
            "#panel_ingredients_content",
            "[property='food:ingredients_text_en']",
        ]:
            els = page.css(sel)
            if els:
                ingredients = els[0].get_all_text(separator=" ").strip()
                if ingredients and len(ingredients) > 10:
                    break

        nutrition_text = ""
        for sel in [
            "table",
            "div[class*='nutrition']",
            "#nutrition",
        ]:
            els = page.css(sel)
            if els:
                nutrition_text = els[0].get_all_text(separator=" ").strip()
                if "kcal" in nutrition_text.lower() or "protein" in nutrition_text.lower():
                    break

        nutrition = _parse_nutrition_from_html(nutrition_text)

        image = None
        els = page.css("meta[property='og:image']")
        if els:
            image = els[0].attrib.get("content")
        if not image:
            els = page.css("img[class*='product']")
            if els:
                image = els[0].attrib.get("src")

        has_nutrition = any(v is not None for v in nutrition.values())
        if not has_nutrition and not ingredients:
            logger.info("OFF HTML had no additional data beyond API")
            return None

        return {
            "name": name,
            "brand": brand,
            "barcode": barcode,
            "image_url": image,
            "ingredients_text": ingredients,
            "nutrition_per_100g": nutrition,
            "source": "openfoodfacts_html",
            "source_url": url,
        }
    except Exception:
        logger.exception("OFF HTML enrichment failed")
        return None
