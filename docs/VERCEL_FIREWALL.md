# Production traffic protection

Vercel provides automatic network-level DDoS mitigation. Application code cannot replace that edge protection, so NutriScan adds bounded upstream calls, request validation, a shared database rate limit, and a per-instance burst guard while leaving the edge policy explicit for the deployment owner.

## Recommended staged WAF rules

Create these rules in the Vercel Firewall dashboard in **Log** mode first, inspect at least a day of legitimate traffic, then change them to **Challenge** or **Block**. Publishing a firewall rule is intentionally a manual production-owner action.

1. `/api/scan`: challenge clients exceeding 30 requests in 10 minutes per IP; block malformed methods other than POST.
2. `/api/analyze`: challenge clients exceeding 15 requests in 10 minutes per IP; POST only.
3. `/api/ingredients/research`: challenge clients exceeding 10 requests in 10 minutes per IP; POST only.
4. `/api/search`: challenge clients exceeding 60 requests in 10 minutes per IP; GET only.
5. `/api/enrich`, cron and admin endpoints: allow only the expected internal-secret flow or authenticated administrator path.
6. Add a managed bot rule for obvious automated abuse, excluding verified search crawlers only where public indexing is required.

## Operational checks

- Alert on sustained 429, 5xx and upstream timeout rates.
- Keep Supabase service-role credentials server-only.
- Rotate `INTERNAL_API_SECRET`, `CRON_SECRET` and AI-provider keys if exposed.
- Test rate-limit rules from a preview deployment before production publishing.
- If traffic grows across many serverless instances, move the burst counter to a global Redis-backed limiter such as Upstash while keeping the edge WAF.
