import { createClient } from '@supabase/supabase-js'

// Frontend client — safe to use in components
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)