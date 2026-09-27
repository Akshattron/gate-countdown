import { createClient } from '@supabase/supabase-js';

const env = import.meta.env ?? {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Supabase could not be initialised. Syllabus sync stays disabled.', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
export const supabaseConfigured = Boolean(supabase);

// Read-only probe so the UI can tell "session still resolving" apart from
// "definitely signed out", and avoid flashing the wrong auth control.
export function hasPendingSession() {
  if (!supabaseConfigured || typeof window === 'undefined') return false;
  try {
    if (/(access_token|refresh_token|[?&]code)=/.test(window.location.hash + window.location.search)) return true;
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token') && window.localStorage.getItem(key)) return true;
    }
  } catch {
    return false;
  }
  return false;
}
