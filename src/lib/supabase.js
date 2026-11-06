import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

const isConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.VITE_SUPABASE_ANON_KEY)
);

if (!isConfigured) {
  console.warn(
    'Variabel lingkungan Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_ANON_KEY) belum terpasang dengan benar di file .env atau Vercel Environment Variables. Aplikasi berjalan dalam mode penyimpanan lokal (offline-first).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = isConfigured;

