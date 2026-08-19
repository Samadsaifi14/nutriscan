-- Fix get_leaderboard: require recent activity (30 days) + minimum scan count (3)
-- Previously showed all-time users with any number of scans, making the
-- leaderboard dominated by stale or one-off entries.

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
  where fl.logged_at >= now() - interval '30 days'
  group by fl.user_id, up.name
  having count(*) >= 3
  order by avg_score desc
  limit limit_count;
$$;
