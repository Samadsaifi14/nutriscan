"""Unit tests for the Indian grocery scrapers.

These tests exercise the pure parsing / matching helpers without hitting the
network: the AapkaBaazar sitemap index and product pages are stubbed, and the
Rajmandir search response is stubbed.
"""

import pytest

from scrapers import indian_products as ip


class FakeResponse:
    def __init__(self, body: str, status: int = 200):
        self.body = body.encode("utf-8") if isinstance(body, str) else body
        self.status = status


# ── _aapka_normalize_tokens ───────────────────────────────────────────────────

def test_normalize_tokens_splits_and_filters():
    # ml, pack dropped (stopwords); 200 kept (size tokens help disambiguate)
    toks = ip._aapka_normalize_tokens("Amul Masti Buttermilk 200 ml pack")
    assert toks == {"amul", "masti", "buttermilk", "200"}


def test_normalize_tokens_empty_for_stopwords():
    assert ip._aapka_normalize_tokens("with the and for ml pack") == set()


# ── _aapka_parse_ingredients ──────────────────────────────────────────────────

def test_parse_ingredients_from_faq():
    pd = {
        "faq": [
            {"question": "What is Amul Masti?", "answer": "A drink."},
            {
                "question": "What are the ingredients used?",
                "answer": "Water, toned milk, salt, spices.",
            },
        ]
    }
    assert ip._aapka_parse_ingredients(pd) == "Water, toned milk, salt, spices."


def test_parse_ingredients_none_when_missing():
    assert ip._aapka_parse_ingredients({"faq": []}) is None
    assert ip._aapka_parse_ingredients({"faq": [{"question": "X", "answer": ""}]}) is None


def test_parse_ingredients_handles_html():
    pd = {"faq": [{"question": "what ingredients?", "answer": "<p>Milk &amp; salt</p>"}]}
    assert ip._aapka_parse_ingredients(pd) == "Milk & salt"


# ── _aapka_parse_nutrition ────────────────────────────────────────────────────

def test_parse_nutrition_empty_when_no_facts():
    assert ip._aapka_parse_nutrition({"nutritionalFacts": []}) == {}


def test_parse_nutrition_from_label_value_list():
    pd = {
        "nutritionalFacts": [
            {"nutritionName": "Energy", "nutritionalValue": "350 kcal"},
            {"nutritionName": "Protein", "nutritionalValue": "12 g"},
            {"nutritionName": "Carbohydrates", "nutritionalValue": "60 g"},
        ]
    }
    parsed = ip._aapka_parse_nutrition(pd)
    assert parsed["calories"] == 350.0
    assert parsed["protein"] == 12.0
    assert parsed["carbs"] == 60.0


# ── _aapka_find_product_url (matching precision) ──────────────────────────────

INDEX = [
    ("https://aapkabazar.co/1/pd/amul-masti-spiced-buttermilk-200-ml", "amul-masti-spiced-buttermilk-200-ml"),
    ("https://aapkabazar.co/2/pd/parle-g-glucose-biscuits-248-g", "parle-g-glucose-biscuits-248-g"),
    ("https://aapkabazar.co/3/pd/twinings-green-tea-lemon-25-teabags-2-gm", "twinings-green-tea-lemon-25-teabags-2-gm"),
    ("https://aapkabazar.co/4/pd/parle-monaco-cheeslings-150-gm", "parle-monaco-cheeslings-150-gm"),
]


@pytest.fixture
def stub_index(monkeypatch):
    monkeypatch.setattr(ip, "_aapka_load_index", lambda: INDEX)
    return ip


def test_match_multi_token_picks_correct_product(stub_index):
    url = stub_index._aapka_find_product_url("buttermilk", "amul")
    assert url == "https://aapkabazar.co/1/pd/amul-masti-spiced-buttermilk-200-ml"


def test_match_weak_single_generic_token_rejected(stub_index):
    # "green" alone matches the tea slug, but "pascal"/"basil" don't, so the
    # multi-word query must be rejected rather than returning an unrelated item.
    assert stub_index._aapka_find_product_url("green pascal", "basil") is None


def test_match_single_token_accepted(stub_index):
    assert stub_index._aapka_find_product_url("amul", None) == (
        "https://aapkabazar.co/1/pd/amul-masti-spiced-buttermilk-200-ml"
    )


# ── _aapka_parse_product (stubbed Fetcher) ────────────────────────────────────

PRODUCT_NEXT_DATA = """<html><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"productData":{"id":4466,"name":"amul masti spiced buttermilk 1 ltr","brand":"amul","brandData":{"name":"amul"},"images":["1672927827264.png"],"barCode":"8901262200233","manufacturerDetails":"kaira union","faq":[{"question":"What are the ingredients?","answer":"Water, milk, salt."}]}}}}</script></html>"""


def test_parse_product_full(monkeypatch):
    monkeypatch.setattr(ip.Fetcher, "get", lambda url: FakeResponse(PRODUCT_NEXT_DATA))
    result = ip._aapka_parse_product("https://aapkabazar.co/4466/pd/x")
    assert result["name"] == "amul masti spiced buttermilk 1 ltr"
    assert result["brand"] == "amul"
    assert result["barcode"] == "8901262200233"
    assert result["ingredients_text"] == "Water, milk, salt."
    assert result["image_url"] == "https://image.aapkabazar.co/product/4466/1672927827264.png"
    assert result["source"] == "aapkabaazar"


def test_parse_product_http_error_returns_none(monkeypatch):
    monkeypatch.setattr(ip.Fetcher, "get", lambda url: FakeResponse("", status=404))
    assert ip._aapka_parse_product("https://aapkabazar.co/1/pd/x") is None


def test_parse_product_missing_next_data_returns_none(monkeypatch):
    monkeypatch.setattr(ip.Fetcher, "get", lambda url: FakeResponse("<html>no json</html>"))
    assert ip._aapka_parse_product("https://aapkabazar.co/1/pd/x") is None


# ── _scrape_rajmandir (stubbed suggest response) ──────────────────────────────

RAJ_SUGGEST = """{"resources":{"results":{"products":[
  {"title":"Amul Butter","vendor":"Raj Mandir","handle":"amul-butter","image":"https://cdn.shopify.com/s/files/1/x.jpg?v=1"},
  {"title":"Amul Masti","vendor":"Raj Mandir","handle":"amul-masti","image":null}
]}}}"""


def test_scrape_rajmandir_maps_result(monkeypatch):
    monkeypatch.setattr(ip.Fetcher, "get", lambda url: FakeResponse(RAJ_SUGGEST))
    result = ip._scrape_rajmandir("butter", "amul")
    assert result["name"] == "Amul Butter"
    assert result["brand"] == "Raj Mandir"
    assert result["source"] == "rajmandir"
    assert result["source_url"] == "https://rajmandir.com/products/amul-butter"
    assert result["ingredients_text"] is None
    assert result["nutrition_per_100g"] == {}
