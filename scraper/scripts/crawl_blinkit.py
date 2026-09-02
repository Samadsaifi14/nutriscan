"""
Batch crawl Blinkit product categories using Scrapling's CrawlSpider.
Exports results to JSON for import into Supabase.

Usage:
    python -m scripts.crawl_blinkit --category "snacks" --max-pages 50
    python -m scripts.crawl_blinkit --category "beverages" --max-pages 30 --output beverages.json
"""

import argparse
import json
import logging
import re
import sys
from pathlib import Path

from scrapling.spiders import CrawlSpider, Request, Response

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("crawl-blinkit")


def _parse_nutrition(text: str) -> dict:
    result: dict[str, float | None] = {
        "calories": None, "protein": None, "carbs": None, "fat": None,
        "saturated_fat": None, "sugar": None, "sodium": None, "fiber": None,
    }
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


class BlinkitSpider(CrawlSpider):
    name = "blinkit"
    allowed_domains = {"blinkit.com"}

    def __init__(self, category: str = "snacks", max_pages: int = 50, **kwargs):
        super().__init__(**kwargs)
        self.category = category
        self.max_pages = max_pages
        self.start_urls = [
            f"https://blinkit.com/search?q={category}"
        ]
        self._scraped = 0

    async def parse(self, response: Response):
        product_links = response.css("a[href*='/product/']")
        if not product_links:
            product_links = response.css("a[href*='/pn/']")

        for link in product_links[:20]:
            href = link.attrib.get("href", "")
            if not href.startswith("http"):
                href = f"https://blinkit.com{href}"
            yield Request(href, callback=self.parse_product)

        if self._scraped < self.max_pages:
            next_links = response.css("a[href*='page=']")
            for link in next_links[:1]:
                href = link.attrib.get("href", "")
                if href and not href.startswith("http"):
                    href = f"https://blinkit.com{href}"
                yield Request(href, callback=self.parse)

    async def parse_product(self, response: Response):
        if self._scraped >= self.max_pages:
            return

        name = None
        for sel in ["h1", "[class*='product-name']"]:
            els = response.css(sel)
            if els:
                name = els[0].get_all_text(separator=" ").strip()
                if name:
                    break

        brand = None
        els = response.css("[class*='brand']")
        if els:
            brand = els[0].get_all_text(separator=" ").strip()

        nutrition_text = ""
        for sel in ["[class*='nutrition']", "table"]:
            els = response.css(sel)
            if els:
                nutrition_text = els[0].get_all_text(separator=" ").strip()
                if any(k in nutrition_text.lower() for k in ("calor", "protein")):
                    break

        nutrition = _parse_nutrition(nutrition_text)

        ingredients = None
        els = response.css("[class*='ingredients']")
        if els:
            ingredients = els[0].get_all_text(separator=" ").strip()

        image = None
        els = response.css("img[class*='product']")
        if els:
            image = els[0].attrib.get("src") or els[0].attrib.get("data-src")

        if name and any(v is not None for v in nutrition.values()):
            self._scraped += 1
            yield {
                "name": name,
                "brand": brand,
                "image_url": image,
                "ingredients_text": ingredients,
                "nutrition_per_100g": nutrition,
                "source": "blinkit",
                "source_url": response.url,
                "category": self.category,
            }


def main():
    parser = argparse.ArgumentParser(description="Crawl Blinkit for product data")
    parser.add_argument("--category", default="snacks", help="Product category to crawl")
    parser.add_argument("--max-pages", type=int, default=50, help="Max products to scrape")
    parser.add_argument("--output", default=None, help="Output JSON file path")
    args = parser.parse_args()

    output_file = args.output or f"blinkit_{args.category}.json"

    spider = BlinkitSpider(category=args.category, max_pages=args.max_pages)
    result = spider.start()

    items = list(result.items) if hasattr(result, "items") else []

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"Scraped {len(items)} products from Blinkit ({args.category})")
    print(f"Output: {output_file}")


if __name__ == "__main__":
    main()
