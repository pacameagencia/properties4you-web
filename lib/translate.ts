import Anthropic from "@anthropic-ai/sdk";
import type { Locale } from "./i18n/config";
import type { PropertyContent, Translations } from "./types";

const TARGETS: Locale[] = ["en", "de", "nl", "fr"];
const LANG_NAME: Record<Locale, string> = {
  es: "español",
  en: "inglés",
  de: "alemán",
  nl: "neerlandés",
  fr: "francés",
};

/**
 * Modelo de traducción.
 *
 * Sonnet 5 y no Opus: traducir una ficha inmobiliaria (una descripción de
 * 200-400 palabras y una decena de calidades) es una tarea de traducción
 * directa, no de razonamiento. Sonnet da calidad equivalente en este registro
 * a una fracción del coste, y aquí el volumen manda: cada alta son 4 llamadas
 * (en/de/nl/fr), así que el coste se multiplica por cuatro en cada propiedad.
 *
 * Override por env si alguna vez hace falta más músculo:
 *   ANTHROPIC_MODEL=claude-opus-5
 */
const DEFAULT_MODEL = "claude-sonnet-5";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

/** Modelos que existen de verdad. Evita repetir el fiasco de "claude-opus-4-8". */
const KNOWN_MODELS = [
  "claude-opus-5",
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001",
];

export class TranslationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "TranslationError";
  }
}

/**
 * Comprobación de arranque. Se ejecuta al importar el módulo para que el
 * problema se vea en los logs del servidor al levantar, no cuando un comercial
 * intente dar de alta una propiedad un viernes por la tarde.
 */
function checkConfig(): string[] {
  const problems: string[] = [];

  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    problems.push(
      "ANTHROPIC_API_KEY está vacía o no definida: NO se puede traducir. " +
        "Añádela en .env.local (local) y en las variables de entorno del hosting (producción).",
    );
  }

  if (!KNOWN_MODELS.includes(MODEL)) {
    problems.push(
      `ANTHROPIC_MODEL="${MODEL}" no es un modelo conocido. ` +
        `Usa uno de: ${KNOWN_MODELS.join(", ")}.`,
    );
  }

  return problems;
}

const CONFIG_PROBLEMS = checkConfig();

if (CONFIG_PROBLEMS.length) {
  console.error(
    "\n[translate] ⚠️  AUTOTRADUCCIÓN MAL CONFIGURADA:\n" +
      CONFIG_PROBLEMS.map((p) => `  · ${p}`).join("\n") +
      "\n  Las altas y ediciones de propiedades fallarán al guardar.\n",
  );
}

/** Estado de la configuración, para que el panel pueda avisar antes de guardar. */
export function translationConfigStatus(): { ok: boolean; problems: string[] } {
  const problems = checkConfig();
  return { ok: problems.length === 0, problems };
}

/**
 * Traduce el contenido español de una propiedad a EN/DE/NL/FR.
 *
 * LANZA si la traducción no se puede completar. Es deliberado: antes se
 * devolvía el español copiado en los cuatro idiomas y el fallo pasaba
 * inadvertido, con lo que la web quedaba en español fingiendo estar traducida.
 * Un error visible al guardar es preferible a datos corruptos en silencio.
 */
export async function translateProperty(
  es: PropertyContent,
): Promise<Translations> {
  const result: Translations = { es };

  const hasContent = Boolean(
    es.description?.trim() || (es.features && es.features.length),
  );

  // Sin contenido en español no hay nada que traducir: no es un error.
  if (!hasContent) {
    for (const t of TARGETS) result[t] = es;
    return result;
  }

  const problems = checkConfig();
  if (problems.length) {
    throw new TranslationError(
      `No se puede traducir la propiedad. ${problems.join(" ")}`,
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const settled = await Promise.allSettled(
    TARGETS.map(async (target) => {
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        system:
          "Eres traductor profesional del sector inmobiliario de lujo. Traduce con naturalidad y registro premium, sin añadir ni omitir información. Devuelve EXCLUSIVAMENTE un JSON válido con las claves 'description' (string) y 'features' (array de strings), sin texto adicional.",
        messages: [
          {
            role: "user",
            content: `Traduce del español al ${LANG_NAME[target]} el siguiente contenido de una ficha de propiedad. Mantén el mismo número de elementos en 'features'.\n\n${JSON.stringify(
              { description: es.description ?? "", features: es.features ?? [] },
              null,
              2,
            )}`,
          },
        ],
      });

      const text = msg.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("")
        .trim();

      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start === -1 || end === -1) {
        throw new Error(
          `respuesta sin JSON reconocible (empezaba por: ${text.slice(0, 80)}…)`,
        );
      }

      let parsed: PropertyContent;
      try {
        parsed = JSON.parse(text.slice(start, end + 1)) as PropertyContent;
      } catch (e) {
        throw new Error(
          `JSON inválido en la respuesta: ${e instanceof Error ? e.message : String(e)}`,
        );
      }

      const description = parsed.description?.trim();
      const features = parsed.features;

      if (!description && !(features && features.length)) {
        throw new Error("la traducción vino vacía");
      }

      // Aviso sin bloquear: el número de calidades debería coincidir.
      const esCount = es.features?.length ?? 0;
      if (esCount && features && features.length !== esCount) {
        console.warn(
          `[translate] ${target}: ${features.length} calidades frente a ${esCount} en español.`,
        );
      }

      return {
        locale: target,
        content: {
          description: description || es.description,
          features: features?.length ? features : es.features,
        } satisfies PropertyContent,
      };
    }),
  );

  const failures: string[] = [];

  settled.forEach((r, i) => {
    const target = TARGETS[i];
    if (r.status === "fulfilled") {
      result[r.value.locale] = r.value.content;
    } else {
      const reason =
        r.reason instanceof Error ? r.reason.message : String(r.reason);
      console.error(`[translate] fallo traduciendo a ${target}:`, r.reason);
      failures.push(`${LANG_NAME[target]} (${reason})`);
    }
  });

  if (failures.length) {
    throw new TranslationError(
      `La traducción falló en ${failures.length} de ${TARGETS.length} idiomas: ${failures.join("; ")}. ` +
        "No se ha guardado nada para no publicar texto en español haciéndose pasar por traducido.",
    );
  }

  return result;
}
