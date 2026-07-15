import type { Locale } from "./i18n/config";

export type Testimonial = {
  name: string;
  origin: Record<Locale, string>; // bandera + país, por idioma
  text: Record<Locale, string>;
};

/**
 * Testimonios de compradores (contenido inicial — sustituir por reales
 * del cliente cuando los facilite).
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marlies & Jan",
    origin: { es: "🇳🇱 Países Bajos", en: "🇳🇱 Netherlands", de: "🇳🇱 Niederlande", nl: "🇳🇱 Nederland", fr: "🇳🇱 Pays-Bas" },
    text: {
      es: "Compramos nuestra villa sin hablar español y todo el proceso fue impecable: visitas, notaría y entrega de llaves, siempre acompañados en nuestro idioma.",
      en: "We bought our villa without speaking Spanish and the whole process was flawless: viewings, notary and key handover, always guided in our own language.",
      de: "Wir haben unsere Villa gekauft, ohne Spanisch zu sprechen — Besichtigungen, Notar und Schlüsselübergabe verliefen reibungslos, immer in unserer Sprache begleitet.",
      nl: "We kochten onze villa zonder Spaans te spreken en het hele proces verliep vlekkeloos: bezichtigingen, notaris en sleuteloverdracht, altijd begeleid in onze eigen taal.",
      fr: "Nous avons acheté notre villa sans parler espagnol et tout le processus a été impeccable : visites, notaire et remise des clés, toujours accompagnés dans notre langue.",
    },
  },
  {
    name: "Stefan K.",
    origin: { es: "🇩🇪 Alemania", en: "🇩🇪 Germany", de: "🇩🇪 Deutschland", nl: "🇩🇪 Duitsland", fr: "🇩🇪 Allemagne" },
    text: {
      es: "La calidad de la obra nueva superó lo que vimos en fotos. Un año después, la garantía y el servicio postventa siguen respondiendo de maravilla.",
      en: "The quality of the new build exceeded what we saw in the photos. A year later, the warranty and after-sales service are still responding wonderfully.",
      de: "Die Qualität des Neubaus übertraf die Fotos. Ein Jahr später funktionieren Garantie und Kundendienst noch immer hervorragend.",
      nl: "De kwaliteit van de nieuwbouw overtrof wat we op de foto's zagen. Een jaar later reageren de garantie en de service nog steeds uitstekend.",
      fr: "La qualité du neuf a dépassé ce que nous avions vu en photos. Un an plus tard, la garantie et le service après-vente répondent toujours parfaitement.",
    },
  },
  {
    name: "Familia Moreno",
    origin: { es: "🇪🇸 España", en: "🇪🇸 Spain", de: "🇪🇸 Spanien", nl: "🇪🇸 Spanje", fr: "🇪🇸 Espagne" },
    text: {
      es: "Buscábamos una segunda residencia cerca del mar y encontramos algo mejor: un lugar al que ya llamamos casa. El acompañamiento fue cercano de principio a fin.",
      en: "We were looking for a second home near the sea and found something better: a place we already call home. The support was personal from start to finish.",
      de: "Wir suchten einen Zweitwohnsitz am Meer und fanden etwas Besseres: einen Ort, den wir bereits Zuhause nennen. Die Betreuung war von Anfang bis Ende persönlich.",
      nl: "We zochten een tweede woning aan zee en vonden iets beters: een plek die we nu al thuis noemen. De begeleiding was persoonlijk van begin tot eind.",
      fr: "Nous cherchions une résidence secondaire près de la mer et avons trouvé mieux : un endroit que nous appelons déjà chez nous. L'accompagnement a été proche du début à la fin.",
    },
  },
];
