-- Atomic, cross-instance rate limiting. The advisory transaction lock serializes
-- requests for the same user/action pair before counting and inserting.
CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  p_user_id TEXT,
  p_action TEXT,
  p_max_requests INTEGER,
  p_window_seconds INTEGER
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, reset_in_seconds INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_cutoff TIMESTAMPTZ := NOW() - make_interval(secs => p_window_seconds);
  v_used INTEGER;
  v_oldest TIMESTAMPTZ;
BEGIN
  IF p_user_id IS NULL OR p_user_id = '' OR p_action IS NULL OR p_action = ''
     OR p_max_requests < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Invalid rate limit arguments';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_action || ':' || p_user_id, 0));

  SELECT COUNT(*)::INTEGER, MIN(created_at)
    INTO v_used, v_oldest
    FROM public.rate_limits
   WHERE user_id = p_user_id
     AND action = p_action
     AND created_at >= v_cutoff;

  IF v_used >= p_max_requests THEN
    RETURN QUERY SELECT FALSE, 0,
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_oldest + make_interval(secs => p_window_seconds) - NOW())))::INTEGER);
    RETURN;
  END IF;

  INSERT INTO public.rate_limits(user_id, action, created_at)
  VALUES (p_user_id, p_action, NOW());

  RETURN QUERY SELECT TRUE, GREATEST(0, p_max_requests - v_used - 1), p_window_seconds;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO service_role;

CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON public.rate_limits(created_at);
