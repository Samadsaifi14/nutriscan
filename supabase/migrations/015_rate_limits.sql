-- Rate limiting for API actions (analyze, scan, log, etc.)
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action_created
  ON rate_limits (user_id, action, created_at DESC);

-- Service role only — all access via API using supabaseAdmin
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE rate_limits IS 'Per-user API rate limit counters; cleaned periodically';
