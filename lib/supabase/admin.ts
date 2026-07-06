import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role — SOLO para scripts server-side de confianza
 * (import/seed). Nunca exponer al navegador.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
