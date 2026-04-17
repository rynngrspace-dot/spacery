import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration missing. Persistence and Realtime features will be disabled until environment variables are configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
