"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales incorrectas.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8"
      >
        <div className="mb-8 flex items-center justify-center gap-[2px]">
          <span className="font-display text-xl text-ink">PROPERTIES</span>
          <span className="font-display text-xl text-gold">4</span>
          <span className="font-display text-xl text-ink">YOU</span>
        </div>
        <p className="kicker mb-6 text-center">Panel de gestión</p>

        <label className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold"
        />

        <label className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold px-6 py-3.5 text-[0.78rem] uppercase tracking-[0.16em] text-bg transition-opacity disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
