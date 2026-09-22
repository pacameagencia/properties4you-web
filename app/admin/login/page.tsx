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
    if (loading) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Introduce un email válido y tu contraseña.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) { setError("No se ha podido iniciar sesión. Revisa el email y la contraseña e inténtalo de nuevo."); return; }
      router.push("/admin");
      router.refresh();
    } catch { setError("No se ha podido conectar. Comprueba la conexión y vuelve a intentarlo."); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <form
        noValidate
        aria-busy={loading}
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8"
      >
        <div className="mb-8 flex items-center justify-center gap-[2px]">
          <span className="font-display text-xl text-ink">PROPERTIES</span>
          <span className="font-display text-xl text-gold">4</span>
          <span className="font-display text-xl text-ink">YOU</span>
        </div>
        <p className="kicker mb-6 text-center">Panel de gestión</p>

        <label htmlFor="admin-email" className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          autoComplete="username"
          aria-describedby={error ? "login-error" : undefined}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold"
        />

        <label htmlFor="admin-password" className="mb-2 block text-xs uppercase tracking-widest text-faint">
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          autoComplete="current-password"
          aria-describedby={error ? "login-error" : undefined}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold"
        />

        {error && <p id="login-error" role="alert" className="mb-4 text-sm text-red-400">{error}</p>}

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
