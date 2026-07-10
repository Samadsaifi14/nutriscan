-- get_user_daily_stats
-- Returns daily aggregated stats for a user: scan count + avg health score
-- Used by /api/dashboard for streak, overallScore, thisWeek, bestWeek, trend
-- Run this SQL in Supabase SQL Editor

create or replace function get_user_daily_stats(uid text, since_date date)
returns table(log_date date, scan_count int, avg_score numeric)
language sql
stable
as $$
  select
    date_trunc('day', fl.logged_at)::date as log_date,
    count(*)::int as scan_count,
    coalesce(avg(p.health_score), 0)::numeric as avg_score
  from food_logs fl
  left join products p on p.barcode = fl.barcode
  where fl.user_id = uid and fl.logged_at >= since_date
  group by 1
  order by 1 desc;
$$;

-- get_leaderboard
-- Top users by average health score, joined to profile for display name
create or replace function get_leaderboard(limit_count int default 10)
returns table(user_id text, display_name text, avg_score numeric, total_scans int)
language sql
stable
as $$
  select
    fl.user_id,
    coalesce(up.name, 'Unknown') as display_name,
    coalesce(avg(p.health_score), 0)::numeric as avg_score,
    count(*)::int as total_scans
  from food_logs fl
  left join products p on p.barcode = fl.barcode
  left join user_profiles up on up.user_id = fl.user_id
  group by fl.user_id, up.name
  order by avg_score desc
  limit limit_count;
$$;
