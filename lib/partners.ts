import type { Locale } from "./i18n/config";

/**
 * Contenido de la página "Colabora con nosotros" (programa de referidos para
 * agencias inmobiliarias en el extranjero), en los cinco idiomas.
 *
 * Es un BORRADOR escrito a partir del único dato que ha dado el cliente: una
 * comisión del 5 % por venta cerrada. El cliente ha dicho que enviará el texto
 * definitivo: cuando llegue, se sustituye aquí y sale en las cinco lenguas.
 * Nada de lo que hay abajo promete plazos, exclusividades ni cifras que no
 * estén en ese mensaje.
 */
export type PartnerStep = { h: string; p: string };
export type PartnerContent = {
  title: string;
  intro: string;
  commission: string;
  commissionNote: string;
  stepsTitle: string;
  steps: PartnerStep[];
  whyTitle: string;
  why: string[];
  formTitle: string;
  formBody: string;
};

export const PARTNERS: Record<Locale, PartnerContent> = {
  es: {
    title: "Colabora con nosotros",
    intro:
      "Trabajamos con agencias inmobiliarias de fuera de España que tienen clientes interesados en comprar en la Costa Blanca. Tú aportas el contacto; nosotros ponemos la cartera de obra nueva, las visitas sobre el terreno y el acompañamiento en su idioma hasta la firma.",
    commission: "5 %",
    commissionNote: "de comisión por cada venta cerrada con un cliente que nos hayas presentado.",
    stepsTitle: "Cómo funciona",
    steps: [
      { h: "1 · Nos presentas al cliente", p: "Nos envías el contacto y lo que busca: zona, tipo de vivienda, presupuesto y fechas en las que puede viajar. Queda registrado a tu nombre desde ese momento." },
      { h: "2 · Nosotros hacemos el trabajo en España", p: "Seleccionamos promociones, organizamos las visitas, resolvemos dudas sobre impuestos, NIE y proceso de compra, y te mantenemos informado de cada paso." },
      { h: "3 · Cobras al cerrar", p: "Cuando el cliente firma, recibes el 5 % del importe de la operación. Las condiciones se detallan en el acuerdo de colaboración que firmamos antes de la primera presentación." },
    ],
    whyTitle: "Qué te ofrecemos",
    why: [
      "Cartera de obra nueva en la Costa Blanca sur: villas, apartamentos y bungalows de promotores con los que trabajamos directamente.",
      "Atención a tu cliente en español, inglés, alemán, neerlandés o francés.",
      "Registro del cliente a tu nombre desde la primera presentación.",
      "Información puntual del estado de cada operación.",
    ],
    formTitle: "Empecemos",
    formBody: "Cuéntanos quién eres y desde dónde trabajas. Te respondemos por correo con el acuerdo de colaboración y los siguientes pasos.",
  },
  en: {
    title: "Partner with us",
    intro:
      "We work with estate agencies outside Spain whose clients want to buy on the Costa Blanca. You bring the contact; we provide the new-build portfolio, the viewings on the ground and support in their language all the way to completion.",
    commission: "5%",
    commissionNote: "commission on every completed sale to a client you introduce to us.",
    stepsTitle: "How it works",
    steps: [
      { h: "1 · You introduce the client", p: "Send us the contact and what they are looking for: area, type of home, budget and when they can travel. The client is registered under your name from that moment." },
      { h: "2 · We do the work in Spain", p: "We shortlist developments, arrange the viewings, answer questions on taxes, NIE and the buying process, and keep you informed at every step." },
      { h: "3 · You get paid at completion", p: "When the client signs, you receive 5% of the sale amount. The terms are set out in the partner agreement we sign before the first introduction." },
    ],
    whyTitle: "What you get",
    why: [
      "A new-build portfolio on the southern Costa Blanca: villas, apartments and bungalows from developers we work with directly.",
      "Your client looked after in Spanish, English, German, Dutch or French.",
      "The client registered under your name from the first introduction.",
      "Regular updates on the status of every deal.",
    ],
    formTitle: "Let's start",
    formBody: "Tell us who you are and where you work from. We will reply by email with the partner agreement and the next steps.",
  },
  de: {
    title: "Partner werden",
    intro:
      "Wir arbeiten mit Immobilienagenturen außerhalb Spaniens zusammen, deren Kunden an der Costa Blanca kaufen möchten. Sie bringen den Kontakt; wir stellen das Neubau-Portfolio, die Besichtigungen vor Ort und die Betreuung in der Sprache des Kunden bis zur Beurkundung.",
    commission: "5 %",
    commissionNote: "Provision für jeden abgeschlossenen Verkauf an einen von Ihnen vermittelten Kunden.",
    stepsTitle: "So funktioniert es",
    steps: [
      { h: "1 · Sie stellen uns den Kunden vor", p: "Sie schicken uns den Kontakt und die Wünsche: Gegend, Wohnungstyp, Budget und mögliche Reisetermine. Ab diesem Moment ist der Kunde auf Ihren Namen registriert." },
      { h: "2 · Wir erledigen die Arbeit in Spanien", p: "Wir wählen passende Projekte aus, organisieren die Besichtigungen, klären Fragen zu Steuern, NIE und Kaufablauf und halten Sie über jeden Schritt auf dem Laufenden." },
      { h: "3 · Sie werden beim Abschluss bezahlt", p: "Sobald der Kunde unterschreibt, erhalten Sie 5 % des Kaufpreises. Die Bedingungen stehen in der Partnervereinbarung, die wir vor der ersten Vermittlung unterzeichnen." },
    ],
    whyTitle: "Was wir Ihnen bieten",
    why: [
      "Ein Neubau-Portfolio an der südlichen Costa Blanca: Villen, Apartments und Bungalows von Bauträgern, mit denen wir direkt zusammenarbeiten.",
      "Betreuung Ihres Kunden auf Spanisch, Englisch, Deutsch, Niederländisch oder Französisch.",
      "Registrierung des Kunden auf Ihren Namen ab der ersten Vermittlung.",
      "Laufende Information zum Stand jedes Vorgangs.",
    ],
    formTitle: "Legen wir los",
    formBody: "Sagen Sie uns, wer Sie sind und von wo aus Sie arbeiten. Wir antworten per E-Mail mit der Partnervereinbarung und den nächsten Schritten.",
  },
  nl: {
    title: "Samenwerken",
    intro:
      "We werken samen met makelaars buiten Spanje die klanten hebben die aan de Costa Blanca willen kopen. U brengt het contact aan; wij zorgen voor het nieuwbouwaanbod, de bezichtigingen ter plaatse en de begeleiding in hun taal tot aan de notaris.",
    commission: "5 %",
    commissionNote: "commissie op elke afgeronde verkoop aan een klant die u bij ons aanbrengt.",
    stepsTitle: "Zo werkt het",
    steps: [
      { h: "1 · U stelt de klant voor", p: "U stuurt ons het contact en de wensen: regio, type woning, budget en wanneer de klant kan reizen. Vanaf dat moment staat de klant op uw naam geregistreerd." },
      { h: "2 · Wij doen het werk in Spanje", p: "We selecteren projecten, organiseren de bezichtigingen, beantwoorden vragen over belastingen, NIE en het aankoopproces, en houden u op de hoogte van elke stap." },
      { h: "3 · U wordt betaald bij de afronding", p: "Zodra de klant tekent, ontvangt u 5 % van het verkoopbedrag. De voorwaarden staan in de samenwerkingsovereenkomst die we vóór de eerste introductie ondertekenen." },
    ],
    whyTitle: "Wat u krijgt",
    why: [
      "Een nieuwbouwaanbod aan de zuidelijke Costa Blanca: villa's, appartementen en bungalows van ontwikkelaars met wie we rechtstreeks werken.",
      "Begeleiding van uw klant in het Spaans, Engels, Duits, Nederlands of Frans.",
      "Registratie van de klant op uw naam vanaf de eerste introductie.",
      "Regelmatige updates over de stand van elk dossier.",
    ],
    formTitle: "Laten we beginnen",
    formBody: "Vertel ons wie u bent en van waaruit u werkt. We antwoorden per e-mail met de samenwerkingsovereenkomst en de volgende stappen.",
  },
  fr: {
    title: "Collaborer avec nous",
    intro:
      "Nous travaillons avec des agences immobilières hors d'Espagne dont les clients souhaitent acheter sur la Costa Blanca. Vous apportez le contact ; nous fournissons le portefeuille de programmes neufs, les visites sur place et l'accompagnement dans leur langue jusqu'à la signature.",
    commission: "5 %",
    commissionNote: "de commission sur chaque vente conclue avec un client que vous nous avez présenté.",
    stepsTitle: "Comment ça marche",
    steps: [
      { h: "1 · Vous nous présentez le client", p: "Vous nous envoyez le contact et ses critères : zone, type de bien, budget et dates possibles de voyage. Le client est enregistré à votre nom dès cet instant." },
      { h: "2 · Nous faisons le travail en Espagne", p: "Nous sélectionnons les programmes, organisons les visites, répondons aux questions sur la fiscalité, le NIE et le processus d'achat, et vous tenons informé à chaque étape." },
      { h: "3 · Vous êtes payé à la signature", p: "Lorsque le client signe, vous recevez 5 % du montant de la vente. Les conditions figurent dans l'accord de collaboration que nous signons avant la première présentation." },
    ],
    whyTitle: "Ce que nous vous apportons",
    why: [
      "Un portefeuille de programmes neufs sur la Costa Blanca sud : villas, appartements et bungalows de promoteurs avec lesquels nous travaillons en direct.",
      "Votre client accompagné en espagnol, anglais, allemand, néerlandais ou français.",
      "L'enregistrement du client à votre nom dès la première présentation.",
      "Des informations régulières sur l'avancement de chaque dossier.",
    ],
    formTitle: "Commençons",
    formBody: "Dites-nous qui vous êtes et d'où vous travaillez. Nous vous répondons par e-mail avec l'accord de collaboration et les prochaines étapes.",
  },
};
