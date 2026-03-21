import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Forces session to die when the browser tab is closed !!
  }
});
