import { createClient } from "@supabase/supabase-js";
// Publishable browser key. Access to private data is enforced by database RLS.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ojqgfcshtatdoxfeyxpj.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_juqPPXr6MGxh7p8RExn7kg_gahvC3mW",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
export function usernameEmail(username: string) {
  return `${username.trim().toLowerCase()}@users.lokabasa.invalid`;
}
export function validUsername(username: string) {
  return /^[a-z][a-z0-9_]{2,19}$/.test(username);
}
