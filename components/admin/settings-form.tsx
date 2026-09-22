"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { settingsSchema } from "@/lib/settings-validation";
import { saveSettings } from "@/app/admin/actions";

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold";

export function SettingsForm({
  initial,
}: {
  initial: { contact_email: string; contact_phone: string; address: string };
}) {
  const [f, setF] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    const checked = settingsSchema.safeParse(f);
    if (!checked.success) {
      setError(checked.error.issues[0].message);
      (e.currentTarget as HTMLFormElement).querySelector<HTMLElement>(`[name="${String(checked.error.issues[0].path[0])}"]`)?.focus();
      return;
    }
    setSaved(false);
    setError(null);
    start(async () => {
      try {
        const res = await saveSettings(checked.data);
        if (res.ok) setSaved(true);
        else setError(res.error ?? "Error al guardar.");
      } catch { setError("No se pudo guardar. Comprueba la conexión y vuelve a intentarlo."); }
    });
  }

  return (
    <form
      noValidate
      aria-busy={pending}
      onSubmit={submit}
      className="max-w-xl space-y-5 rounded-2xl border border-line bg-surface p-6"
    >
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Teléfono de contacto
        </span>
        <input
          name="contact_phone"
          disabled={pending}
          value={f.contact_phone}
          onChange={(e) => setF({ ...f, contact_phone: e.target.value })}
          placeholder="+34 650 37 92 58"
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Email de contacto
        </span>
        <input
          type="email"
          name="contact_email"
          disabled={pending}
          value={f.contact_email}
          onChange={(e) => setF({ ...f, contact_email: e.target.value })}
          placeholder="info@properties4you.es"
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Dirección
        </span>
        <input
          name="address"
          disabled={pending}
          value={f.address}
          onChange={(e) => setF({ ...f, address: e.target.value })}
          placeholder="03187 Los Montesinos, Alicante"
          className={inputCls}
        />
      </label>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {saved && (
        <p className="text-sm text-gold" role="status">
          ✓ Guardado — datos de contacto actualizados.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-[0.75rem] uppercase tracking-widest text-bg disabled:opacity-50"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        Guardar cambios
      </button>
    </form>
  );
}
