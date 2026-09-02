import os
import asyncio
import logging
from contextlib import asynccontextmanager
from functools import partial

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from scrapers.indian_products import scrape_indian_product_sync
from scrapers.off_enrichment import enrich_from_off_html_sync
from scrapers.alternatives import scrape_alternatives_sync

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nutriscan-scraper")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("NutriScan Scraper service starting")
    yield
    logger.info("NutriScan Scraper service shutting down")


app = FastAPI(
    title="NutriScan Scraper",
    description="Scrapling-powered web scraper service for NutriScan",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ────────────────────────────────────────────────

class IndianProductRequest(BaseModel):
    search_hint: str
    brand: str | None = None
    barcode: str | None = None


class OffEnrichRequest(BaseModel):
    barcode: str
    product_name: str | None = None


class AlternativesRequest(BaseModel):
    product_name: str
    category: str | None = None
    brand: str | None = None
    ingredients_text: str | None = None
    max_results: int = Field(default=10, ge=1, le=30)


class NutritionData(BaseModel):
    calories: float | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None
    saturated_fat: float | None = None
    sugar: float | None = None
    sodium: float | None = None
    fiber: float | None = None


class ScrapedProduct(BaseModel):
    name: str
    brand: str | None = None
    barcode: str | None = None
    image_url: str | None = None
    ingredients_text: str | None = None
    nutrition_per_100g: NutritionData
    source: str
    source_url: str | None = None


class AlternativeProduct(BaseModel):
    name: str
    brand: str | None = None
    image_url: str | None = None
    nutrition_per_100g: NutritionData
    ingredients_text: str | None = None
    source: str
    score: float | None = None


class ScrapeResponse(BaseModel):
    success: bool
    product: ScrapedProduct | None = None
    error: str | None = None


class AlternativesResponse(BaseModel):
    success: bool
    alternatives: list[AlternativeProduct] = []
    error: str | None = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()


@app.post("/scrape/indian-product", response_model=ScrapeResponse)
async def scrape_indian(req: IndianProductRequest):
    try:
        loop = asyncio.get_event_loop()
        product = await loop.run_in_executor(
            None,
            partial(
                scrape_indian_product_sync,
                search_hint=req.search_hint,
                brand=req.brand,
                barcode=req.barcode,
            ),
        )
        if product is None:
            return ScrapeResponse(success=False, error="No product data found")
        return ScrapeResponse(success=True, product=product)
    except Exception as e:
        logger.exception("Indian product scrape failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/scrape/off-enrich", response_model=ScrapeResponse)
async def off_enrich(req: OffEnrichRequest):
    try:
        loop = asyncio.get_event_loop()
        product = await loop.run_in_executor(
            None,
            partial(
                enrich_from_off_html_sync,
                barcode=req.barcode,
                product_name=req.product_name,
            ),
        )
        if product is None:
            return ScrapeResponse(success=False, error="No enrichment data found")
        return ScrapeResponse(success=True, product=product)
    except Exception as e:
        logger.exception("OFF enrichment failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/scrape/alternatives", response_model=AlternativesResponse)
async def scrape_alts(req: AlternativesRequest):
    try:
        loop = asyncio.get_event_loop()
        alts = await loop.run_in_executor(
            None,
            partial(
                scrape_alternatives_sync,
                product_name=req.product_name,
                category=req.category,
                brand=req.brand,
                ingredients_text=req.ingredients_text,
                max_results=req.max_results,
            ),
        )
        return AlternativesResponse(success=True, alternatives=alts)
    except Exception as e:
        logger.exception("Alternatives scrape failed")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host=os.getenv("SCRAPER_HOST", "0.0.0.0"),
        port=int(os.getenv("SCRAPER_PORT", "8100")),
        workers=int(os.getenv("SCRAPER_WORKERS", "1")),
        reload=False,
    )
