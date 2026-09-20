import type { Locale } from "./i18n/config";

/**
 * Textos legales del sitio: aviso legal, privacidad y cookies, en los cinco
 * idiomas.
 *
 * POR QUÉ EXISTE ESTO
 *   Properties4You es una empresa española que capta nombre y teléfono en el
 *   formulario "Reservar una visita" y guarda esos datos en Supabase. Hasta
 *   ahora lo hacía sin aviso legal, sin política de privacidad, sin informar
 *   de la base jurídica y sin recoger consentimiento. Eso incumple el RGPD
 *   (arts. 6 y 13) y la LSSI-CE española (art. 10, datos identificativos del
 *   prestador). Buena parte del público es alemán, neerlandés y francés, que
 *   es justo el que mira esto antes de dejar un teléfono.
 *
 * ⚠️ DATOS QUE HAY QUE RELLENAR ANTES DE PUBLICAR
 *   Los marcados como `PENDIENTE` son datos registrales que no están en el
 *   repositorio y que NO se pueden inventar: hacerlo sería peor que no tener
 *   aviso legal. Sustitúyelos en TITULAR (aquí abajo) y listo: aparecen solos
 *   en los cinco idiomas.
 */

/** Marcador de dato pendiente: la página legal oculta las líneas que lo contienen. */
export const PENDIENTE = "«PENDIENTE DE COMPLETAR»";

export const TITULAR = {
  /** Razón social completa, p. ej. "Properties4You Costa Blanca, S.L." */
  razonSocial: PENDIENTE,
  /** NIF / CIF de la sociedad o del empresario individual. */
  nif: PENDIENTE,
  /** Domicilio social completo. */
  domicilio: "03187 Los Montesinos, Alicante, España",
  /** Datos del Registro Mercantil, si es sociedad. Si es autónomo, ponlo a "". */
  registro: PENDIENTE,
  email: "info@properties4you.es",
  telefono: "+34 650 37 92 58",
  /** Fecha de la última revisión de los textos. */
  actualizado: "2026-09-20",
} as const;

export type LegalSection = { h: string; p: string[] };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };
export type LegalSlug = "aviso-legal" | "privacidad" | "cookies";

export const LEGAL_SLUGS: LegalSlug[] = ["aviso-legal", "privacidad", "cookies"];

const { razonSocial, nif, domicilio, registro, email, telefono } = TITULAR;

const es: Record<LegalSlug, LegalDoc> = {
  "aviso-legal": {
    title: "Aviso legal",
    intro:
      "Condiciones de uso de properties4you.es y datos identificativos del titular, conforme al artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
    sections: [
      {
        h: "Titular del sitio web",
        p: [
          `Denominación social: ${razonSocial}`,
          `NIF: ${nif}`,
          `Domicilio: ${domicilio}`,
          `Correo electrónico: ${email}`,
          `Teléfono: ${telefono}`,
          `Datos registrales: ${registro}`,
        ],
      },
      {
        h: "Objeto",
        p: [
          "Este sitio web ofrece información sobre promociones de obra nueva en la Costa Blanca (Alicante) y permite solicitar visitas o información a través de formularios de contacto.",
          "El acceso al sitio es gratuito y no requiere registro previo.",
        ],
      },
      {
        h: "Carácter de la información publicada",
        p: [
          "Las descripciones, superficies, precios, planos, imágenes e infografías de las promociones tienen carácter informativo y no constituyen oferta contractual vinculante.",
          "Las imágenes e infografías pueden corresponder a viviendas piloto o a recreaciones virtuales, y pueden no coincidir exactamente con la vivienda final.",
          "Los precios no incluyen impuestos ni gastos de compraventa salvo que se indique expresamente. Las condiciones definitivas son siempre las del contrato de compraventa.",
          "El titular se reserva el derecho a modificar la información publicada, así como la disponibilidad de las promociones, sin previo aviso.",
        ],
      },
      {
        h: "Propiedad intelectual e industrial",
        p: [
          "Los contenidos de este sitio (textos, imágenes, logotipos, diseño y código) son titularidad de la empresa o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.",
          "No se permite su reproducción, distribución ni comunicación pública sin autorización expresa y por escrito.",
        ],
      },
      {
        h: "Responsabilidad",
        p: [
          "El titular no se responsabiliza del uso que terceros hagan de la información publicada, ni de los daños derivados de interrupciones del servicio ajenas a su control.",
          "Este sitio puede enlazar a páginas de terceros. El titular no controla ni responde de sus contenidos.",
        ],
      },
      {
        h: "Legislación aplicable",
        p: [
          "Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a derecho.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    intro:
      "Cómo tratamos los datos personales que nos facilitas, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).",
    sections: [
      {
        h: "Responsable del tratamiento",
        p: [
          `${razonSocial} — NIF ${nif}`,
          `Domicilio: ${domicilio}`,
          `Correo de contacto para asuntos de privacidad: ${email}`,
        ],
      },
      {
        h: "Qué datos recogemos",
        p: [
          "A través de los formularios de visita, contacto y colaboración: nombre, correo electrónico, teléfono (opcional), fecha preferida de visita y, opcionalmente, el mensaje que escribas. En el formulario para agencias, además, el nombre de la agencia, el país y su web.",
          "La propiedad concreta sobre la que preguntas y el idioma en el que navegas, para poder responderte con sentido y en tu idioma.",
          "No recogemos categorías especiales de datos. No pedimos DNI, dirección postal ni datos bancarios a través de la web.",
        ],
      },
      {
        h: "Para qué los usamos y con qué base jurídica",
        p: [
          "Atender tu solicitud de visita o de información y ponernos en contacto contigo. Base jurídica: tu consentimiento (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).",
          "No usamos tus datos para enviarte comunicaciones comerciales sobre otras promociones salvo que nos lo autorices de forma separada.",
          "No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.",
        ],
      },
      {
        h: "Cuánto tiempo los conservamos",
        p: [
          "Mientras dure la relación con la persona interesada y, después, durante el plazo en que puedan derivarse responsabilidades legales.",
          "Si nos pides que los suprimamos y no existe obligación legal de conservarlos, los eliminamos.",
        ],
      },
      {
        h: "Quién más puede acceder a ellos",
        p: [
          "Supabase, proveedor de la base de datos donde se registran las solicitudes, que actúa como encargado del tratamiento.",
          "Hostinger, proveedor del buzón de correo al que llegan los formularios, que actúa como encargado del tratamiento.",
          "Si eliges continuar la conversación por WhatsApp, el mensaje que envías queda sujeto además a las condiciones y a la política de privacidad de WhatsApp (Meta), sobre las que no tenemos control.",
          "No vendemos ni cedemos tus datos a terceros con fines comerciales.",
        ],
      },
      {
        h: "Transferencias internacionales",
        p: [
          "Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso el tratamiento se ampara en las garantías previstas en el capítulo V del RGPD, como las cláusulas contractuales tipo de la Comisión Europea.",
        ],
      },
      {
        h: "Tus derechos",
        p: [
          "Puedes solicitar el acceso a tus datos, su rectificación o supresión, la limitación u oposición al tratamiento, y la portabilidad. También puedes retirar tu consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.",
          `Para ejercerlos, escribe a ${email} indicando qué derecho quieres ejercer.`,
          "Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    intro:
      "Qué se guarda en tu navegador cuando visitas properties4you.es y qué servicios de terceros pueden intervenir.",
    sections: [
      {
        h: "Cookies propias",
        p: [
          "Este sitio no utiliza cookies propias de analítica, publicidad ni seguimiento.",
          "Sí usa almacenamiento técnico en tu propio navegador para que la web funcione: recordar el idioma elegido, saber que la animación de entrada ya se ha mostrado en esta sesión y guardar tus propiedades favoritas.",
          "Esa información se queda en tu dispositivo, no se envía a ningún servidor y puedes borrarla vaciando los datos del sitio desde tu navegador. Al ser estrictamente necesaria o solicitada por ti, está exenta del deber de consentimiento previo.",
        ],
      },
      {
        h: "Contenido de terceros incrustado",
        p: [
          "En las fichas de propiedad se muestra un mapa de Google Maps y, cuando la promoción tiene vídeo, un reproductor. Estos servicios son de terceros y pueden instalar cookies o tecnologías similares en tu navegador cuando cargan. El mapa no se carga hasta que lo aceptas expresamente, desde el aviso de cookies o con el botón «Cargar mapa» de la ficha.",
          "Los vídeos de YouTube se incrustan en modo de privacidad reforzada (youtube-nocookie.com), que evita las cookies de seguimiento hasta que reproduces el vídeo.",
          "Para conocer el detalle de esos tratamientos, consulta las políticas de privacidad de Google y de los proveedores correspondientes.",
        ],
      },
      {
        h: "Cómo gestionarlas",
        p: [
          "Puedes bloquear o eliminar cookies y almacenamiento local desde la configuración de tu navegador. Bloquear el almacenamiento técnico puede impedir que se recuerden tus favoritos o tu idioma.",
        ],
      },
    ],
  },
};

const en: Record<LegalSlug, LegalDoc> = {
  "aviso-legal": {
    title: "Legal notice",
    intro:
      "Terms of use of properties4you.es and identification of the site owner, under article 10 of Spanish Act 34/2002 on Information Society Services (LSSI-CE).",
    sections: [
      {
        h: "Site owner",
        p: [
          `Company name: ${razonSocial}`,
          `Spanish tax ID (NIF): ${nif}`,
          `Registered address: ${domicilio}`,
          `Email: ${email}`,
          `Phone: ${telefono}`,
          `Company register details: ${registro}`,
        ],
      },
      {
        h: "Purpose",
        p: [
          "This website provides information about new-build developments on the Costa Blanca (Alicante) and lets you request viewings or information through contact forms.",
          "Access to the site is free and requires no registration.",
        ],
      },
      {
        h: "Status of the published information",
        p: [
          "Descriptions, floor areas, prices, plans, photographs and computer-generated images are provided for information only and do not constitute a binding contractual offer.",
          "Images may correspond to show homes or to virtual renderings and may differ from the finished property.",
          "Prices exclude taxes and purchase costs unless expressly stated otherwise. The binding terms are always those of the purchase contract.",
          "The owner may change the published information and the availability of any development without prior notice.",
        ],
      },
      {
        h: "Intellectual and industrial property",
        p: [
          "The contents of this site (text, images, logos, design and code) belong to the company or to third parties who have authorised their use, and are protected by intellectual and industrial property law.",
          "Reproduction, distribution or public communication is not permitted without express written authorisation.",
        ],
      },
      {
        h: "Liability",
        p: [
          "The owner is not liable for third-party use of the published information, nor for damage arising from service interruptions beyond its control.",
          "This site may link to third-party pages. The owner does not control and is not responsible for their content.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by Spanish law. Any dispute shall be heard by the courts having jurisdiction under applicable law.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Privacy policy",
    intro:
      "How we handle the personal data you give us, under Regulation (EU) 2016/679 (GDPR) and Spanish Organic Act 3/2018 (LOPDGDD).",
    sections: [
      {
        h: "Data controller",
        p: [
          `${razonSocial} — NIF ${nif}`,
          `Address: ${domicilio}`,
          `Privacy contact: ${email}`,
        ],
      },
      {
        h: "What we collect",
        p: [
          "Through the viewing, contact and partner forms: your name, email address, phone number (optional), preferred viewing date and, optionally, your message. The agency form also asks for the agency name, country and website.",
          "Which property you are asking about and the language you are browsing in, so we can reply sensibly and in your language.",
          "We do not collect special categories of data. We do not ask for ID documents, postal addresses or bank details through this website.",
        ],
      },
      {
        h: "Why we use it, and on what legal basis",
        p: [
          "To handle your viewing or information request and to contact you. Legal basis: your consent (art. 6(1)(a) GDPR) and pre-contractual steps taken at your request (art. 6(1)(b) GDPR).",
          "We will not use your data to send you marketing about other developments unless you separately agree to that.",
          "We do not carry out automated decision-making or profiling with your data.",
        ],
      },
      {
        h: "How long we keep it",
        p: [
          "For as long as our relationship with you lasts and thereafter for the period during which legal liabilities may arise.",
          "If you ask us to delete it and no legal obligation requires us to keep it, we delete it.",
        ],
      },
      {
        h: "Who else can access it",
        p: [
          "Supabase, the database provider where requests are stored, acting as our data processor.",
          "Hostinger, the provider of the mailbox that receives the forms, acting as our data processor.",
          "If you choose to continue the conversation on WhatsApp, the message you send is also subject to WhatsApp's (Meta's) terms and privacy policy, over which we have no control.",
          "We do not sell or share your data with third parties for commercial purposes.",
        ],
      },
      {
        h: "International transfers",
        p: [
          "Some providers may process data outside the European Economic Area. Where that happens, the transfer relies on the safeguards in Chapter V GDPR, such as the European Commission's standard contractual clauses.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You may request access to your data, its rectification or erasure, restriction of or objection to processing, and data portability. You may also withdraw your consent at any time, without affecting the lawfulness of processing carried out beforehand.",
          `To exercise these rights, write to ${email} stating which right you wish to exercise.`,
          "If you believe your request has not been handled properly, you may lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie policy",
    intro:
      "What is stored in your browser when you visit properties4you.es, and which third-party services may be involved.",
    sections: [
      {
        h: "Our own cookies",
        p: [
          "This site uses no analytics, advertising or tracking cookies of its own.",
          "It does use technical storage in your browser so the site works: remembering your chosen language, knowing the intro animation has already played in this session, and saving your favourite properties.",
          "That information stays on your device, is not sent to any server, and you can remove it by clearing the site data in your browser. Being strictly necessary or requested by you, it is exempt from the prior consent requirement.",
        ],
      },
      {
        h: "Embedded third-party content",
        p: [
          "Property pages show a Google Maps map and, where the development has one, a video player. These are third-party services and may set cookies or similar technologies in your browser when they load. The map does not load until you expressly accept it, either in the cookie notice or with the “Load map” button on the property page.",
          "YouTube videos are embedded in privacy-enhanced mode (youtube-nocookie.com), which avoids tracking cookies until you play the video.",
          "For details of that processing, see the privacy policies of Google and the relevant providers.",
        ],
      },
      {
        h: "How to manage them",
        p: [
          "You can block or delete cookies and local storage from your browser settings. Blocking technical storage may prevent your favourites or language from being remembered.",
        ],
      },
    ],
  },
};

const de: Record<LegalSlug, LegalDoc> = {
  "aviso-legal": {
    title: "Impressum",
    intro:
      "Nutzungsbedingungen von properties4you.es und Angaben zum Betreiber gemäß Artikel 10 des spanischen Gesetzes 34/2002 über Dienste der Informationsgesellschaft (LSSI-CE).",
    sections: [
      {
        h: "Betreiber der Website",
        p: [
          `Firma: ${razonSocial}`,
          `Spanische Steuernummer (NIF): ${nif}`,
          `Anschrift: ${domicilio}`,
          `E-Mail: ${email}`,
          `Telefon: ${telefono}`,
          `Handelsregisterangaben: ${registro}`,
        ],
      },
      {
        h: "Gegenstand",
        p: [
          "Diese Website informiert über Neubauprojekte an der Costa Blanca (Alicante) und ermöglicht es, über Kontaktformulare Besichtigungen oder Informationen anzufragen.",
          "Der Zugang ist kostenlos und erfordert keine Registrierung.",
        ],
      },
      {
        h: "Charakter der veröffentlichten Angaben",
        p: [
          "Beschreibungen, Flächen, Preise, Grundrisse, Fotos und Visualisierungen dienen ausschließlich der Information und stellen kein verbindliches Vertragsangebot dar.",
          "Abbildungen können Musterhäuser oder virtuelle Darstellungen zeigen und vom fertigen Objekt abweichen.",
          "Die Preise verstehen sich ohne Steuern und Kaufnebenkosten, sofern nicht ausdrücklich anders angegeben. Maßgeblich sind stets die Bedingungen des Kaufvertrags.",
          "Der Betreiber behält sich vor, die veröffentlichten Angaben und die Verfügbarkeit der Projekte ohne Vorankündigung zu ändern.",
        ],
      },
      {
        h: "Urheber- und gewerbliche Schutzrechte",
        p: [
          "Die Inhalte dieser Website (Texte, Bilder, Logos, Gestaltung und Code) stehen dem Unternehmen oder Dritten zu, die deren Nutzung gestattet haben, und sind rechtlich geschützt.",
          "Vervielfältigung, Verbreitung und öffentliche Wiedergabe sind ohne ausdrückliche schriftliche Genehmigung nicht gestattet.",
        ],
      },
      {
        h: "Haftung",
        p: [
          "Der Betreiber haftet weder für die Verwendung der veröffentlichten Informationen durch Dritte noch für Schäden aus Betriebsunterbrechungen außerhalb seines Einflussbereichs.",
          "Diese Website kann auf Seiten Dritter verlinken. Auf deren Inhalte hat der Betreiber keinen Einfluss.",
        ],
      },
      {
        h: "Anwendbares Recht",
        p: [
          "Es gilt spanisches Recht. Für Streitigkeiten sind die nach dem Gesetz zuständigen Gerichte zuständig.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Datenschutzerklärung",
    intro:
      "Wie wir mit Ihren personenbezogenen Daten umgehen, gemäß Verordnung (EU) 2016/679 (DSGVO) und dem spanischen Gesetz 3/2018 (LOPDGDD).",
    sections: [
      {
        h: "Verantwortlicher",
        p: [
          `${razonSocial} — NIF ${nif}`,
          `Anschrift: ${domicilio}`,
          `Kontakt für Datenschutzfragen: ${email}`,
        ],
      },
      {
        h: "Welche Daten wir erheben",
        p: [
          "Über die Formulare für Besichtigung, Kontakt und Partnerschaft: Name, E-Mail-Adresse, Telefonnummer (optional), Wunschtermin und optional Ihre Nachricht. Im Formular für Agenturen zusätzlich Name der Agentur, Land und Website.",
          "Das Objekt, nach dem Sie fragen, und die Sprache, in der Sie surfen, damit wir sinnvoll und in Ihrer Sprache antworten können.",
          "Besondere Kategorien personenbezogener Daten erheben wir nicht. Über die Website fragen wir weder Ausweisdaten noch Postanschrift oder Bankverbindung ab.",
        ],
      },
      {
        h: "Zweck und Rechtsgrundlage",
        p: [
          "Bearbeitung Ihrer Besichtigungs- oder Informationsanfrage und Kontaktaufnahme mit Ihnen. Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie vorvertragliche Maßnahmen auf Ihre Anfrage hin (Art. 6 Abs. 1 lit. b DSGVO).",
          "Wir verwenden Ihre Daten nicht für Werbung zu anderen Projekten, sofern Sie dem nicht gesondert zustimmen.",
          "Eine automatisierte Entscheidungsfindung oder ein Profiling findet nicht statt.",
        ],
      },
      {
        h: "Speicherdauer",
        p: [
          "Für die Dauer der Beziehung zu Ihnen und anschließend für den Zeitraum, in dem rechtliche Ansprüche entstehen können.",
          "Wenn Sie die Löschung verlangen und keine gesetzliche Aufbewahrungspflicht besteht, löschen wir die Daten.",
        ],
      },
      {
        h: "Wer noch Zugriff hat",
        p: [
          "Supabase als Anbieter der Datenbank, in der die Anfragen gespeichert werden, handelt als Auftragsverarbeiter.",
          "Hostinger als Anbieter des Postfachs, in dem die Formulare eingehen, handelt als Auftragsverarbeiter.",
          "Wenn Sie das Gespräch über WhatsApp fortsetzen, unterliegt Ihre Nachricht zusätzlich den Bedingungen und der Datenschutzerklärung von WhatsApp (Meta), auf die wir keinen Einfluss haben.",
          "Wir verkaufen Ihre Daten nicht und geben sie nicht zu Werbezwecken an Dritte weiter.",
        ],
      },
      {
        h: "Übermittlung in Drittländer",
        p: [
          "Einzelne Dienstleister können Daten außerhalb des Europäischen Wirtschaftsraums verarbeiten. In diesem Fall stützt sich die Übermittlung auf die Garantien des Kapitels V DSGVO, etwa die Standardvertragsklauseln der Europäischen Kommission.",
        ],
      },
      {
        h: "Ihre Rechte",
        p: [
          "Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, die Verarbeitung einschränken lassen, ihr widersprechen und Datenübertragbarkeit verlangen. Eine erteilte Einwilligung können Sie jederzeit widerrufen; die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.",
          `Zur Ausübung schreiben Sie an ${email} und nennen Sie das gewünschte Recht.`,
          "Wenn Sie der Ansicht sind, dass Ihre Anfrage nicht ordnungsgemäß bearbeitet wurde, können Sie sich bei der spanischen Datenschutzbehörde beschweren (www.aepd.es).",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie-Richtlinie",
    intro:
      "Was beim Besuch von properties4you.es in Ihrem Browser gespeichert wird und welche Dienste Dritter beteiligt sein können.",
    sections: [
      {
        h: "Eigene Cookies",
        p: [
          "Diese Website verwendet keine eigenen Cookies für Analyse, Werbung oder Tracking.",
          "Sie nutzt technischen Speicher in Ihrem Browser, damit die Seite funktioniert: die gewählte Sprache, der Hinweis, dass die Eingangsanimation in dieser Sitzung bereits gezeigt wurde, und Ihre gemerkten Objekte.",
          "Diese Angaben verbleiben auf Ihrem Gerät, werden an keinen Server gesendet und lassen sich über das Löschen der Website-Daten im Browser entfernen. Da sie unbedingt erforderlich bzw. von Ihnen angefordert sind, besteht keine Einwilligungspflicht.",
        ],
      },
      {
        h: "Eingebettete Inhalte Dritter",
        p: [
          "Auf den Objektseiten wird eine Google-Maps-Karte und, sofern vorhanden, ein Videoplayer eingebunden. Diese Dienste Dritter können beim Laden Cookies oder ähnliche Technologien setzen. Die Karte wird erst geladen, wenn Sie dem ausdrücklich zustimmen, über den Cookie-Hinweis oder die Schaltfläche „Karte laden“ auf der Objektseite.",
          "YouTube-Videos werden im erweiterten Datenschutzmodus (youtube-nocookie.com) eingebunden, der Tracking-Cookies bis zum Abspielen vermeidet.",
          "Einzelheiten entnehmen Sie den Datenschutzerklärungen von Google und der jeweiligen Anbieter.",
        ],
      },
      {
        h: "Verwaltung",
        p: [
          "Cookies und lokalen Speicher können Sie in den Einstellungen Ihres Browsers blockieren oder löschen. Das Blockieren des technischen Speichers kann dazu führen, dass Merkliste und Sprache nicht erhalten bleiben.",
        ],
      },
    ],
  },
};

const nl: Record<LegalSlug, LegalDoc> = {
  "aviso-legal": {
    title: "Juridische mededeling",
    intro:
      "Gebruiksvoorwaarden van properties4you.es en gegevens van de eigenaar, conform artikel 10 van de Spaanse wet 34/2002 inzake diensten van de informatiemaatschappij (LSSI-CE).",
    sections: [
      {
        h: "Eigenaar van de website",
        p: [
          `Statutaire naam: ${razonSocial}`,
          `Spaans fiscaal nummer (NIF): ${nif}`,
          `Adres: ${domicilio}`,
          `E-mail: ${email}`,
          `Telefoon: ${telefono}`,
          `Handelsregistergegevens: ${registro}`,
        ],
      },
      {
        h: "Doel",
        p: [
          "Deze website geeft informatie over nieuwbouwprojecten aan de Costa Blanca (Alicante) en maakt het mogelijk bezichtigingen of informatie aan te vragen via contactformulieren.",
          "Toegang tot de site is gratis en vereist geen registratie.",
        ],
      },
      {
        h: "Aard van de gepubliceerde informatie",
        p: [
          "Beschrijvingen, oppervlakten, prijzen, plattegronden, foto's en impressies zijn uitsluitend informatief en vormen geen bindend contractueel aanbod.",
          "Afbeeldingen kunnen modelwoningen of virtuele impressies betreffen en kunnen afwijken van de opgeleverde woning.",
          "Prijzen zijn exclusief belastingen en aankoopkosten, tenzij uitdrukkelijk anders vermeld. Bindend zijn steeds de voorwaarden van de koopovereenkomst.",
          "De eigenaar behoudt zich het recht voor de gepubliceerde informatie en de beschikbaarheid van projecten zonder voorafgaande kennisgeving te wijzigen.",
        ],
      },
      {
        h: "Intellectuele en industriële eigendom",
        p: [
          "De inhoud van deze site (teksten, afbeeldingen, logo's, ontwerp en code) behoort toe aan het bedrijf of aan derden die het gebruik hebben toegestaan, en is wettelijk beschermd.",
          "Reproductie, verspreiding of openbaarmaking is niet toegestaan zonder uitdrukkelijke schriftelijke toestemming.",
        ],
      },
      {
        h: "Aansprakelijkheid",
        p: [
          "De eigenaar is niet aansprakelijk voor het gebruik dat derden van de gepubliceerde informatie maken, noch voor schade door storingen buiten zijn macht.",
          "Deze site kan naar pagina's van derden verwijzen. De eigenaar heeft geen zeggenschap over en is niet verantwoordelijk voor die inhoud.",
        ],
      },
      {
        h: "Toepasselijk recht",
        p: [
          "Op deze voorwaarden is Spaans recht van toepassing. Geschillen worden voorgelegd aan de volgens de wet bevoegde rechter.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Privacybeleid",
    intro:
      "Hoe wij omgaan met de persoonsgegevens die u ons verstrekt, conform Verordening (EU) 2016/679 (AVG) en de Spaanse wet 3/2018 (LOPDGDD).",
    sections: [
      {
        h: "Verwerkingsverantwoordelijke",
        p: [
          `${razonSocial} — NIF ${nif}`,
          `Adres: ${domicilio}`,
          `Contact voor privacyzaken: ${email}`,
        ],
      },
      {
        h: "Welke gegevens wij verzamelen",
        p: [
          "Via de formulieren voor bezichtiging, contact en samenwerking: naam, e-mailadres, telefoonnummer (optioneel), voorkeursdatum en optioneel uw bericht. In het formulier voor makelaars ook de naam van het kantoor, het land en de website.",
          "De woning waarnaar u vraagt en de taal waarin u surft, zodat wij zinnig en in uw taal kunnen antwoorden.",
          "Wij verzamelen geen bijzondere categorieën van persoonsgegevens. Via de website vragen wij geen identiteitsbewijs, postadres of bankgegevens.",
        ],
      },
      {
        h: "Waarvoor en op welke grondslag",
        p: [
          "Om uw aanvraag voor een bezichtiging of informatie te behandelen en contact met u op te nemen. Grondslag: uw toestemming (art. 6, lid 1, onder a AVG) en precontractuele maatregelen op uw verzoek (art. 6, lid 1, onder b AVG).",
          "Wij gebruiken uw gegevens niet om u reclame over andere projecten te sturen, tenzij u daar apart mee instemt.",
          "Wij nemen geen geautomatiseerde besluiten en stellen geen profielen op.",
        ],
      },
      {
        h: "Hoe lang wij ze bewaren",
        p: [
          "Zolang de relatie met u duurt en daarna gedurende de periode waarin juridische aansprakelijkheid kan ontstaan.",
          "Als u om verwijdering vraagt en er geen wettelijke bewaarplicht geldt, verwijderen wij ze.",
        ],
      },
      {
        h: "Wie er nog toegang toe heeft",
        p: [
          "Supabase, de aanbieder van de database waarin aanvragen worden opgeslagen, treedt op als verwerker.",
          "Hostinger, de aanbieder van de mailbox waarin de formulieren binnenkomen, treedt op als verwerker.",
          "Als u het gesprek via WhatsApp voortzet, valt uw bericht tevens onder de voorwaarden en het privacybeleid van WhatsApp (Meta), waarop wij geen invloed hebben.",
          "Wij verkopen uw gegevens niet en delen ze niet met derden voor commerciële doeleinden.",
        ],
      },
      {
        h: "Doorgifte buiten de EER",
        p: [
          "Sommige dienstverleners kunnen gegevens buiten de Europese Economische Ruimte verwerken. In dat geval berust de doorgifte op de waarborgen van hoofdstuk V AVG, zoals de modelcontractbepalingen van de Europese Commissie.",
        ],
      },
      {
        h: "Uw rechten",
        p: [
          "U kunt inzage, rectificatie of verwijdering van uw gegevens vragen, de verwerking laten beperken, daartegen bezwaar maken en overdraagbaarheid verlangen. U kunt uw toestemming te allen tijde intrekken, zonder dat dit afdoet aan de rechtmatigheid van de eerdere verwerking.",
          `Schrijf daarvoor naar ${email} en geef aan welk recht u wilt uitoefenen.`,
          "Meent u dat uw verzoek niet goed is behandeld, dan kunt u een klacht indienen bij de Spaanse toezichthouder (www.aepd.es).",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookiebeleid",
    intro:
      "Wat er in uw browser wordt opgeslagen wanneer u properties4you.es bezoekt, en welke diensten van derden daarbij betrokken kunnen zijn.",
    sections: [
      {
        h: "Eigen cookies",
        p: [
          "Deze site gebruikt geen eigen cookies voor analyse, advertenties of tracking.",
          "Wel gebruikt de site technische opslag in uw browser om te functioneren: de gekozen taal onthouden, weten dat de introanimatie in deze sessie al is getoond, en uw favoriete woningen bewaren.",
          "Die informatie blijft op uw apparaat, wordt naar geen enkele server gestuurd en kunt u wissen door de sitegegevens in uw browser te verwijderen. Omdat zij strikt noodzakelijk of door u gevraagd is, geldt geen voorafgaande toestemmingsplicht.",
        ],
      },
      {
        h: "Ingesloten inhoud van derden",
        p: [
          "Op de woningpagina's wordt een Google Maps-kaart getoond en, als het project er een heeft, een videospeler. Deze diensten van derden kunnen bij het laden cookies of vergelijkbare technologie plaatsen. De kaart laadt pas nadat u dat uitdrukkelijk accepteert, via de cookiemelding of met de knop 'Kaart laden' op de woningpagina.",
          "YouTube-video's worden ingesloten in de privacyvriendelijke modus (youtube-nocookie.com), die trackingcookies vermijdt totdat u de video afspeelt.",
          "Raadpleeg voor details het privacybeleid van Google en de betreffende aanbieders.",
        ],
      },
      {
        h: "Beheer",
        p: [
          "U kunt cookies en lokale opslag blokkeren of verwijderen via de instellingen van uw browser. Het blokkeren van technische opslag kan verhinderen dat uw favorieten of taal worden onthouden.",
        ],
      },
    ],
  },
};

const fr: Record<LegalSlug, LegalDoc> = {
  "aviso-legal": {
    title: "Mentions légales",
    intro:
      "Conditions d'utilisation de properties4you.es et identification de l'éditeur, conformément à l'article 10 de la loi espagnole 34/2002 sur les services de la société de l'information (LSSI-CE).",
    sections: [
      {
        h: "Éditeur du site",
        p: [
          `Dénomination sociale : ${razonSocial}`,
          `Numéro fiscal espagnol (NIF) : ${nif}`,
          `Adresse : ${domicilio}`,
          `Courriel : ${email}`,
          `Téléphone : ${telefono}`,
          `Informations d'immatriculation : ${registro}`,
        ],
      },
      {
        h: "Objet",
        p: [
          "Ce site présente des programmes immobiliers neufs sur la Costa Blanca (Alicante) et permet de demander une visite ou des informations via des formulaires de contact.",
          "L'accès au site est gratuit et ne nécessite aucune inscription.",
        ],
      },
      {
        h: "Nature des informations publiées",
        p: [
          "Les descriptifs, surfaces, prix, plans, photographies et images de synthèse sont fournis à titre informatif et ne constituent pas une offre contractuelle ferme.",
          "Les images peuvent correspondre à des logements témoins ou à des représentations virtuelles et différer du bien livré.",
          "Les prix s'entendent hors taxes et hors frais d'acquisition, sauf mention expresse contraire. Seules les conditions du contrat de vente font foi.",
          "L'éditeur se réserve le droit de modifier les informations publiées et la disponibilité des programmes sans préavis.",
        ],
      },
      {
        h: "Propriété intellectuelle et industrielle",
        p: [
          "Les contenus de ce site (textes, images, logos, design et code) appartiennent à la société ou à des tiers en ayant autorisé l'usage, et sont protégés par le droit de la propriété intellectuelle et industrielle.",
          "Toute reproduction, distribution ou communication publique est interdite sans autorisation écrite expresse.",
        ],
      },
      {
        h: "Responsabilité",
        p: [
          "L'éditeur n'est pas responsable de l'usage que des tiers feraient des informations publiées, ni des dommages résultant d'interruptions de service indépendantes de sa volonté.",
          "Ce site peut renvoyer vers des pages de tiers. L'éditeur n'en contrôle pas le contenu et n'en répond pas.",
        ],
      },
      {
        h: "Droit applicable",
        p: [
          "Les présentes conditions sont régies par le droit espagnol. Tout litige relèvera des juridictions compétentes selon la loi.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Politique de confidentialité",
    intro:
      "Comment nous traitons les données personnelles que vous nous communiquez, conformément au règlement (UE) 2016/679 (RGPD) et à la loi espagnole 3/2018 (LOPDGDD).",
    sections: [
      {
        h: "Responsable du traitement",
        p: [
          `${razonSocial} — NIF ${nif}`,
          `Adresse : ${domicilio}`,
          `Contact pour les questions de confidentialité : ${email}`,
        ],
      },
      {
        h: "Données collectées",
        p: [
          "Via les formulaires de visite, de contact et de collaboration : nom, adresse e-mail, téléphone (facultatif), date de visite souhaitée et, facultativement, votre message. Le formulaire pour les agences demande en outre le nom de l'agence, le pays et le site web.",
          "Le bien sur lequel porte votre demande et la langue de navigation, afin de vous répondre utilement et dans votre langue.",
          "Nous ne collectons aucune catégorie particulière de données. Nous ne demandons ni pièce d'identité, ni adresse postale, ni coordonnées bancaires via le site.",
        ],
      },
      {
        h: "Finalités et base légale",
        p: [
          "Traiter votre demande de visite ou d'information et vous recontacter. Base légale : votre consentement (art. 6.1.a RGPD) et les mesures précontractuelles prises à votre demande (art. 6.1.b RGPD).",
          "Nous n'utilisons pas vos données pour vous adresser des communications commerciales sur d'autres programmes, sauf accord distinct de votre part.",
          "Aucune décision automatisée ni profilage n'est effectué.",
        ],
      },
      {
        h: "Durée de conservation",
        p: [
          "Pendant la durée de la relation avec vous puis pendant le délai durant lequel des responsabilités légales peuvent être engagées.",
          "Si vous demandez la suppression et qu'aucune obligation légale n'impose la conservation, nous supprimons les données.",
        ],
      },
      {
        h: "Destinataires",
        p: [
          "Supabase, fournisseur de la base de données où sont enregistrées les demandes, agit en qualité de sous-traitant.",
          "Hostinger, fournisseur de la boîte mail qui reçoit les formulaires, agit en qualité de sous-traitant.",
          "Si vous poursuivez l'échange sur WhatsApp, votre message est en outre soumis aux conditions et à la politique de confidentialité de WhatsApp (Meta), sur lesquelles nous n'avons aucun contrôle.",
          "Nous ne vendons ni ne cédons vos données à des tiers à des fins commerciales.",
        ],
      },
      {
        h: "Transferts hors UE",
        p: [
          "Certains prestataires peuvent traiter des données hors de l'Espace économique européen. Le cas échéant, le transfert repose sur les garanties du chapitre V du RGPD, telles que les clauses contractuelles types de la Commission européenne.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, la limitation ou l'opposition au traitement, ainsi que la portabilité. Vous pouvez retirer votre consentement à tout moment, sans que cela remette en cause la licéité du traitement antérieur.",
          `Pour les exercer, écrivez à ${email} en précisant le droit concerné.`,
          "Si vous estimez que votre demande n'a pas été correctement traitée, vous pouvez saisir l'autorité espagnole de protection des données (www.aepd.es).",
        ],
      },
    ],
  },
  cookies: {
    title: "Politique relative aux cookies",
    intro:
      "Ce qui est enregistré dans votre navigateur lorsque vous visitez properties4you.es, et quels services tiers peuvent intervenir.",
    sections: [
      {
        h: "Cookies propres",
        p: [
          "Ce site n'utilise aucun cookie propre de mesure d'audience, de publicité ou de suivi.",
          "Il utilise en revanche un stockage technique dans votre navigateur pour fonctionner : mémoriser la langue choisie, savoir que l'animation d'accueil a déjà été affichée pendant cette session, et conserver vos biens favoris.",
          "Ces informations restent sur votre appareil, ne sont envoyées à aucun serveur et peuvent être effacées en supprimant les données du site dans votre navigateur. Strictement nécessaires ou demandées par vous, elles sont exemptées de consentement préalable.",
        ],
      },
      {
        h: "Contenus tiers intégrés",
        p: [
          "Les fiches de biens affichent une carte Google Maps et, lorsque le programme en dispose, un lecteur vidéo. Ces services tiers peuvent déposer des cookies ou technologies similaires lors de leur chargement. La carte ne se charge qu'après votre acceptation expresse, via le bandeau de cookies ou le bouton « Charger la carte » de la fiche.",
          "Les vidéos YouTube sont intégrées en mode de confidentialité renforcée (youtube-nocookie.com), qui évite les cookies de suivi tant que la vidéo n'est pas lancée.",
          "Pour le détail de ces traitements, consultez les politiques de confidentialité de Google et des prestataires concernés.",
        ],
      },
      {
        h: "Gestion",
        p: [
          "Vous pouvez bloquer ou supprimer les cookies et le stockage local depuis les réglages de votre navigateur. Bloquer le stockage technique peut empêcher la mémorisation de vos favoris ou de votre langue.",
        ],
      },
    ],
  },
};

export const LEGAL: Record<Locale, Record<LegalSlug, LegalDoc>> = { es, en, de, nl, fr };
