import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink">Ajustes</h1>
        <p className="mt-1 text-sm text-muted">
          Datos de contacto que aparecen en la web: footer, botones de
          WhatsApp/llamada/email y formularios.
        </p>
      </div>
      <SettingsForm
        initial={{
          contact_email: data?.contact_email ?? "",
          contact_phone: data?.contact_phone ?? "",
          address: data?.address ?? "",
        }}
      />
    </>
  );
}
