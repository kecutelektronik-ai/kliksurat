import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variabel lingkungan Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) belum terpasang dengan benar di file .env.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

