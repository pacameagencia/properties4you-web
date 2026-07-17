"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
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
    setSaved(false);
    setError(null);
    start(async () => {
      const res = await saveSettings(f);
      if (res.ok) setSaved(true);
      else setError(res.error ?? "Error al guardar.");
    });
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-xl space-y-5 rounded-2xl border border-line bg-surface p-6"
    >
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Teléfono de contacto (también recibe los WhatsApp)
        </span>
        <input
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
          value={f.address}
          onChange={(e) => setF({ ...f, address: e.target.value })}
          placeholder="03187 Los Montesinos, Alicante"
          className={inputCls}
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && (
        <p className="text-sm text-gold" role="status">
          ✓ Guardado — la web lo muestra ya en todas las páginas.
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
