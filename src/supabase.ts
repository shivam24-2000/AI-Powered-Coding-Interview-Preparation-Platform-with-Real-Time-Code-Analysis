import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY inside .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage, // Saves into Tab memory (Survives refreshes) !!
    persistSession: true, // Keep loading from the storage adapter upfront !!
  }
});
