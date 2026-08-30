# Architecture research — 30 August 2026

Repository metrics were read from the GitHub API on 30 August 2026. Stars are a useful adoption signal, not a security or medical-quality guarantee. Licensing, recent maintenance, tests, publisher history, and whether the project is the upstream source were weighted more heavily.

| Repository | Stars | Publisher signal | License / activity | Decision |
| --- | ---: | --- | --- | --- |
| [openfoodfacts/openfoodfacts-server](https://github.com/openfoodfacts/openfoodfacts-server) | 1,146 | Official Open Food Facts organisation; 127 public repositories and 1,533 followers | AGPL; pushed 30 Aug 2026 | Use Open Food Facts as the live product-data fallback and disclose the source. |
| [openfoodfacts/openfoodfacts-js](https://github.com/openfoodfacts/openfoodfacts-js) | 260 | Official Open Food Facts client | Apache-2.0; pushed 29 Aug 2026 | Adopt bounded fetches, explicit user-agent and typed transformation patterns. |
| [zxing-js/library](https://github.com/zxing-js/library) | 2,929 | Established barcode-scanning project | Apache-2.0; pushed 20 Aug 2026 | Keep the current scanner architecture compatible with ZXing-style browser scanning; no rewrite was needed for this pass. |
| [upstash/ratelimit-js](https://github.com/upstash/ratelimit-js) | 2,044 | Upstash organisation; 137 public repositories and 1,562 followers | MIT; pushed 27 Aug 2026 | Follow its distributed-limit model conceptually. NutriScan now combines a shared database limit with a per-instance burst guard; Redis remains an optional later upgrade. |
| [rezahedi/NutriScan](https://github.com/rezahedi/NutriScan) | 15 | Individual publisher, 38 public repositories | No declared license; last pushed Jan 2024 | Reviewed as a comparable scanner only; no code copied. |
| `rootsbymenda/food-mcp-server` | 0 | New individual publisher, 10 public repositories | MIT; very new | Useful only as a pointer to JECFA/EFSA concepts; not used as an authority or architecture source. |
| `eroesch/mcp-openfoodtox` | 0 | Individual publisher, 91 public repositories | Stale one-shot project | Not adopted. NutriScan links directly to EFSA and NIH sources instead. |
| `priyamjyotsna/ScanSafe` | 0 | New individual publisher, 8 public repositories | No declared license | Retry/timeout ideas reviewed; no code copied and no in-memory-only production limit adopted. |

## Public evidence sources used by the ingredient layer

- [EFSA OpenFoodTox](https://www.efsa.europa.eu/en/data-report/chemical-hazards-database-openfoodtox)
- [EFSA nitrite and nitrate assessment](https://www.efsa.europa.eu/en/press/news/170615)
- [EFSA glutamate group ADI](https://www.efsa.europa.eu/en/press/news/170712)
- [EFSA titanium dioxide assessment](https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive)
- [EFSA aspartame opinion](https://www.efsa.europa.eu/en/efsajournal/pub/3496)
- [FAO/JECFA databases](https://www.fao.org/food-safety/scientific-advice/jecfa/databases-tools/en/)
- [NIH PubChem PUG REST](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest)
- [Codex GSFA](https://www.fao.org/gsfaonline/index.html?lang=en)

The app distinguishes three different claims: a label match, a chemical identity lookup, and an official toxicology reference. It does not convert a PubChem description into a harm verdict, and it does not estimate exposure when the additive amount is absent from the label.
