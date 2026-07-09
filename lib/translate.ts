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

// Regla PACAME: LLM en código = Opus. Override por env si hace falta.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

/**
 * Traduce el contenido español de una propiedad a DE/NL/EN.
 * Si no hay API key, devuelve solo el español (degradación elegante).
 */
export async function translateProperty(
  es: PropertyContent,
): Promise<Translations> {
  const result: Translations = { es };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || (!es.description && !(es.features && es.features.length))) {
    for (const t of TARGETS) result[t] = es;
    return result;
  }

  const client = new Anthropic({ apiKey });

  await Promise.all(
    TARGETS.map(async (target) => {
      try {
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
        const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const parsed = JSON.parse(json) as PropertyContent;
        result[target] = {
          description: parsed.description ?? es.description,
          features: parsed.features ?? es.features,
        };
      } catch {
        result[target] = es; // fallback: copia el español
      }
    }),
  );

  return result;
}
