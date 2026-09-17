import { AlertTriangle } from "lucide-react";

/**
 * Aviso en el panel cuando la autotraducción no está bien configurada.
 * Se muestra ANTES de que el comercial rellene la ficha entera, para que no
 * descubra el problema al pulsar Guardar.
 */
export function TranslationWarning({ problems }: { problems: string[] }) {
  if (!problems.length) return null;

  return (
    <div
      role="alert"
      className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5"
    >
      <p className="flex items-center gap-2 font-medium text-amber-300">
        <AlertTriangle size={18} aria-hidden />
        La traducción automática no está configurada
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-amber-200/90">
        {problems.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-amber-200/70">
        Mientras no se arregle, al guardar saldrá un error y la propiedad no se
        creará. Es intencionado: es preferible a publicar la ficha en español en
        los cinco idiomas sin que nadie se entere.
      </p>
    </div>
  );
}
