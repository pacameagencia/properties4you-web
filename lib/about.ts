import type { Locale } from "./i18n/config";

/**
 * Página "Sobre nosotros": la historia de Reinier y Karina y por qué comprar
 * con ellos. Texto original del cliente en inglés (2026-09-25), traducido a
 * es/de/nl/fr. Los fragmentos entre ** van en negrita.
 */

/** Perfil de Instagram del cliente. Mientras sea null, la sección de Instagram
 *  se muestra sin botón (no se inventa un enlace). */
export const INSTAGRAM_URL: string | null = null;

export type AboutContent = {
  kicker: string;
  title: string;
  photoAlt: string;
  story: string[];
  whyTitle: string;
  why: { title: string; body: string[] }[];
  followTitle: string;
  followBody: string;
  followCta: string;
};

export const ABOUT: Record<Locale, AboutContent> = {
  en: {
    kicker: "About us",
    title: "We didn't just move to Spain. We chose a different way of living.",
    photoAlt: "Reinier and Karina, founders of Properties4You",
    story: [
      "Hi! We're **Reinier and Karina**.",
      "A few years ago, we made a life-changing decision. We sold our home in the Netherlands, packed our bags and started travelling the world in search of a place where we truly felt at home.",
      "During that journey, we got married in Bali and continued building something we had already started in the Netherlands: **TribeScroll**. A European social media platform designed to bring people together through positivity, meaningful connections and personal growth.",
      "As a husband-and-wife team, we've invested our own time, energy and savings into making that dream a reality. TribeScroll has grown with us—from the Netherlands, through Bali and every country we've visited since. Today, we continue to improve and expand the platform.",
      "While travelling, we weren't just working remotely. We were also searching for the place where we wanted to build our future.",
      "Eventually, we arrived in Spain.",
      "And we instantly fell in love.",
      "Not only with the sunshine and beautiful coastline, but also with the relaxed lifestyle, friendly people and welcoming international community. We were surprised by how many Dutch and other European families had already made Spain their home.",
      "That experience inspired **Properties4You**.",
      "Because we know what it's like to search for a home in another country. We understand the excitement, the questions and sometimes even the uncertainty that come with such an important decision.",
      "We're your personal buying partner in Spain.",
      "Whether you're looking for a holiday home, an investment property or a place to start a new chapter, we're here to help you find the property that truly fits your lifestyle and your goals.",
      "Both TribeScroll and Properties4You are built on the same values: helping people create a life they truly love.",
      "If you'd like to follow our journey and life in Spain, we'd love to welcome you on Instagram.",
    ],
    whyTitle: "Why buy with us?",
    why: [
      { title: "A personal approach", body: ["When you work with us, you'll deal directly with us from start to finish. No call centres, no unnecessary pressure and no pushy sales tactics—just honest advice and personal guidance."] },
      { title: "We know what it's like", body: ["We've gone through the process ourselves. We know what it feels like to leave your home country, start a new chapter and build a life abroad. That's why we genuinely understand the questions and concerns international buyers have."] },
      { title: "We make every trip count", body: [
        "Most of our clients travel from abroad—often from the Netherlands—to view properties in Spain.",
        "That's why we first take the time to understand your wishes, lifestyle, budget and future plans. Before you travel, we carefully select properties that genuinely match your criteria.",
        "When you arrive in Spain, we'll personally welcome you and guide you through the scheduled viewings. Our goal is simple: every property you visit should be worth your time.",
      ] },
      { title: "Honest advice", body: [
        "Our goal isn't to sell you just any property.",
        "Our goal is to help you find the **right** property.",
        "If we believe a property isn't the right fit for you, we'll tell you. We'd rather help you make the right decision than rush you into the wrong one.",
      ] },
      { title: "A long-term relationship", body: [
        "Buying a home in Spain is more than a transaction—it's the start of a new chapter.",
        "We want you to feel confident throughout the entire process. From your first questions to receiving the keys, we'll be there to guide you every step of the way.",
      ] },
    ],
    followTitle: "Follow our journey",
    followBody: "Besides helping people find their dream home in Spain, we also love sharing our own life on the Costa Blanca. Follow us on Instagram for behind-the-scenes moments, local recommendations, new properties and a glimpse into the lifestyle that made us fall in love with Spain.",
    followCta: "Follow us on Instagram",
  },

  es: {
    kicker: "Sobre nosotros",
    title: "No solo nos mudamos a España. Elegimos otra forma de vivir.",
    photoAlt: "Reinier y Karina, fundadores de Properties4You",
    story: [
      "¡Hola! Somos **Reinier y Karina**.",
      "Hace unos años tomamos una decisión que nos cambió la vida. Vendimos nuestra casa en los Países Bajos, hicimos las maletas y empezamos a recorrer el mundo en busca de un lugar donde sentirnos de verdad en casa.",
      "Durante ese viaje nos casamos en Bali y seguimos construyendo algo que ya habíamos empezado en los Países Bajos: **TribeScroll**. Una red social europea pensada para unir a las personas a través de la positividad, las conexiones con sentido y el crecimiento personal.",
      "Como matrimonio, hemos invertido nuestro propio tiempo, energía y ahorros en hacer realidad ese sueño. TribeScroll ha crecido con nosotros: desde los Países Bajos, pasando por Bali y por cada país que hemos visitado desde entonces. Hoy seguimos mejorando y ampliando la plataforma.",
      "Mientras viajábamos no solo trabajábamos en remoto. También buscábamos el lugar donde queríamos construir nuestro futuro.",
      "Y al final llegamos a España.",
      "Nos enamoramos al instante.",
      "No solo del sol y de su preciosa costa, sino también del estilo de vida tranquilo, de su gente amable y de una comunidad internacional muy acogedora. Nos sorprendió cuántas familias neerlandesas y de otros países europeos ya habían hecho de España su hogar.",
      "De esa experiencia nació **Properties4You**.",
      "Porque sabemos lo que es buscar casa en otro país. Entendemos la ilusión, las preguntas y, a veces, también la incertidumbre que acompañan a una decisión tan importante.",
      "Somos tu socio personal de compra en España.",
      "Tanto si buscas una casa de vacaciones, una inversión o un lugar donde empezar una nueva etapa, estamos aquí para ayudarte a encontrar la vivienda que de verdad encaja con tu estilo de vida y tus objetivos.",
      "TribeScroll y Properties4You se apoyan en los mismos valores: ayudar a las personas a crear una vida que de verdad les guste.",
      "Si quieres seguir nuestro viaje y nuestra vida en España, estaremos encantados de recibirte en Instagram.",
    ],
    whyTitle: "¿Por qué comprar con nosotros?",
    why: [
      { title: "Un trato personal", body: ["Cuando trabajas con nosotros, tratas directamente con nosotros de principio a fin. Sin centralitas, sin presiones innecesarias y sin técnicas de venta agresivas: solo consejo honesto y acompañamiento personal."] },
      { title: "Sabemos lo que se siente", body: ["Hemos pasado por el proceso en primera persona. Sabemos lo que es dejar tu país, empezar una nueva etapa y construir una vida en el extranjero. Por eso entendemos de verdad las preguntas y las inquietudes de los compradores internacionales."] },
      { title: "Cada viaje merece la pena", body: [
        "La mayoría de nuestros clientes viajan desde el extranjero, a menudo desde los Países Bajos, para ver viviendas en España.",
        "Por eso primero nos tomamos el tiempo de entender tus deseos, tu estilo de vida, tu presupuesto y tus planes de futuro. Antes de que viajes, seleccionamos con cuidado las viviendas que de verdad encajan con lo que buscas.",
        "Cuando llegues a España te recibiremos en persona y te acompañaremos en las visitas programadas. Nuestro objetivo es sencillo: que cada vivienda que visites merezca tu tiempo.",
      ] },
      { title: "Consejo honesto", body: [
        "Nuestro objetivo no es venderte una vivienda cualquiera.",
        "Nuestro objetivo es ayudarte a encontrar la vivienda **adecuada**.",
        "Si creemos que una vivienda no encaja contigo, te lo diremos. Preferimos ayudarte a tomar la decisión correcta antes que precipitarte hacia la equivocada.",
      ] },
      { title: "Una relación a largo plazo", body: [
        "Comprar una casa en España es mucho más que una transacción: es el comienzo de una nueva etapa.",
        "Queremos que te sientas seguro durante todo el proceso. Desde tus primeras preguntas hasta la entrega de llaves, estaremos a tu lado en cada paso.",
      ] },
    ],
    followTitle: "Sigue nuestro viaje",
    followBody: "Además de ayudar a otras personas a encontrar la casa de sus sueños en España, nos encanta compartir nuestra propia vida en la Costa Blanca. Síguenos en Instagram para ver el día a día entre bastidores, recomendaciones locales, nuevas viviendas y un poco del estilo de vida que nos enamoró de España.",
    followCta: "Síguenos en Instagram",
  },

  de: {
    kicker: "Über uns",
    title: "Wir sind nicht einfach nach Spanien gezogen. Wir haben uns für eine andere Art zu leben entschieden.",
    photoAlt: "Reinier und Karina, Gründer von Properties4You",
    story: [
      "Hallo! Wir sind **Reinier und Karina**.",
      "Vor ein paar Jahren haben wir eine Entscheidung getroffen, die unser Leben verändert hat. Wir haben unser Haus in den Niederlanden verkauft, unsere Koffer gepackt und sind um die Welt gereist, auf der Suche nach einem Ort, an dem wir uns wirklich zu Hause fühlen.",
      "Auf dieser Reise haben wir auf Bali geheiratet und weiter an etwas gearbeitet, das wir schon in den Niederlanden begonnen hatten: **TribeScroll**. Eine europäische Social-Media-Plattform, die Menschen durch Positivität, echte Verbindungen und persönliches Wachstum zusammenbringt.",
      "Als Ehepaar haben wir unsere eigene Zeit, Energie und Ersparnisse investiert, um diesen Traum wahr werden zu lassen. TribeScroll ist mit uns gewachsen: von den Niederlanden über Bali bis in jedes Land, das wir seitdem besucht haben. Bis heute entwickeln wir die Plattform weiter.",
      "Unterwegs haben wir nicht nur remote gearbeitet. Wir haben auch den Ort gesucht, an dem wir unsere Zukunft aufbauen wollten.",
      "Schließlich kamen wir nach Spanien.",
      "Und haben uns sofort verliebt.",
      "Nicht nur in die Sonne und die wunderschöne Küste, sondern auch in den entspannten Lebensstil, die freundlichen Menschen und die herzliche internationale Gemeinschaft. Es hat uns überrascht, wie viele niederländische und andere europäische Familien Spanien schon zu ihrem Zuhause gemacht hatten.",
      "Aus dieser Erfahrung ist **Properties4You** entstanden.",
      "Denn wir wissen, wie es ist, in einem anderen Land ein Zuhause zu suchen. Wir kennen die Vorfreude, die Fragen und manchmal auch die Unsicherheit, die mit einer so wichtigen Entscheidung einhergehen.",
      "Wir sind Ihr persönlicher Kaufpartner in Spanien.",
      "Ob Sie ein Ferienhaus, eine Kapitalanlage oder einen Ort für einen neuen Lebensabschnitt suchen: Wir helfen Ihnen, die Immobilie zu finden, die wirklich zu Ihrem Lebensstil und Ihren Zielen passt.",
      "TribeScroll und Properties4You beruhen auf denselben Werten: Menschen dabei zu helfen, ein Leben zu gestalten, das sie wirklich lieben.",
      "Wenn Sie unsere Reise und unser Leben in Spanien verfolgen möchten, freuen wir uns, Sie auf Instagram willkommen zu heißen.",
    ],
    whyTitle: "Warum mit uns kaufen?",
    why: [
      { title: "Persönliche Betreuung", body: ["Wenn Sie mit uns arbeiten, haben Sie von Anfang bis Ende direkt mit uns zu tun. Keine Callcenter, kein unnötiger Druck und keine aufdringlichen Verkaufsmethoden, sondern ehrliche Beratung und persönliche Begleitung."] },
      { title: "Wir wissen, wie es sich anfühlt", body: ["Wir haben den ganzen Prozess selbst durchlaufen. Wir wissen, wie es ist, das eigene Land zu verlassen, einen neuen Lebensabschnitt zu beginnen und sich im Ausland ein Leben aufzubauen. Deshalb verstehen wir die Fragen und Sorgen internationaler Käufer wirklich."] },
      { title: "Jede Reise soll sich lohnen", body: [
        "Die meisten unserer Kunden reisen aus dem Ausland an, oft aus den Niederlanden, um Immobilien in Spanien zu besichtigen.",
        "Deshalb nehmen wir uns zuerst die Zeit, Ihre Wünsche, Ihren Lebensstil, Ihr Budget und Ihre Zukunftspläne zu verstehen. Noch vor Ihrer Reise wählen wir sorgfältig die Immobilien aus, die wirklich zu Ihren Kriterien passen.",
        "Wenn Sie in Spanien ankommen, empfangen wir Sie persönlich und begleiten Sie bei den geplanten Besichtigungen. Unser Ziel ist einfach: Jede Immobilie, die Sie besichtigen, soll Ihre Zeit wert sein.",
      ] },
      { title: "Ehrliche Beratung", body: [
        "Unser Ziel ist nicht, Ihnen irgendeine Immobilie zu verkaufen.",
        "Unser Ziel ist, Ihnen zu helfen, die **richtige** Immobilie zu finden.",
        "Wenn wir glauben, dass eine Immobilie nicht zu Ihnen passt, sagen wir es Ihnen. Wir helfen Ihnen lieber zur richtigen Entscheidung, als Sie in die falsche zu drängen.",
      ] },
      { title: "Eine langfristige Beziehung", body: [
        "Ein Haus in Spanien zu kaufen ist mehr als eine Transaktion: Es ist der Beginn eines neuen Lebensabschnitts.",
        "Wir möchten, dass Sie sich während des gesamten Prozesses sicher fühlen. Von Ihren ersten Fragen bis zur Schlüsselübergabe begleiten wir Sie bei jedem Schritt.",
      ] },
    ],
    followTitle: "Begleiten Sie unsere Reise",
    followBody: "Neben unserer Arbeit, Menschen zu ihrem Traumhaus in Spanien zu verhelfen, teilen wir gern unser eigenes Leben an der Costa Blanca. Folgen Sie uns auf Instagram für Einblicke hinter die Kulissen, lokale Tipps, neue Immobilien und einen Eindruck von dem Lebensstil, in den wir uns in Spanien verliebt haben.",
    followCta: "Folgen Sie uns auf Instagram",
  },

  nl: {
    kicker: "Over ons",
    title: "We zijn niet zomaar naar Spanje verhuisd. We kozen voor een andere manier van leven.",
    photoAlt: "Reinier en Karina, oprichters van Properties4You",
    story: [
      "Hoi! Wij zijn **Reinier en Karina**.",
      "Een paar jaar geleden namen we een beslissing die ons leven veranderde. We verkochten ons huis in Nederland, pakten onze koffers en gingen de wereld rond, op zoek naar een plek waar we ons echt thuis voelden.",
      "Tijdens die reis trouwden we op Bali en bouwden we verder aan iets waar we in Nederland al mee begonnen waren: **TribeScroll**. Een Europees socialemediaplatform dat mensen samenbrengt via positiviteit, betekenisvolle verbindingen en persoonlijke groei.",
      "Als man en vrouw hebben we onze eigen tijd, energie en spaargeld gestoken in het waarmaken van die droom. TribeScroll is met ons meegegroeid: vanuit Nederland, via Bali en elk land dat we sindsdien hebben bezocht. Vandaag blijven we het platform verbeteren en uitbreiden.",
      "Onderweg werkten we niet alleen op afstand. We zochten ook naar de plek waar we onze toekomst wilden opbouwen.",
      "Uiteindelijk kwamen we in Spanje terecht.",
      "En we werden meteen verliefd.",
      "Niet alleen op de zon en de prachtige kust, maar ook op de ontspannen levensstijl, de vriendelijke mensen en de gastvrije internationale gemeenschap. Het verraste ons hoeveel Nederlandse en andere Europese gezinnen Spanje al hun thuis hadden gemaakt.",
      "Die ervaring inspireerde ons tot **Properties4You**.",
      "Want we weten hoe het is om in een ander land een huis te zoeken. We begrijpen de spanning, de vragen en soms ook de onzekerheid die bij zo'n belangrijke beslissing horen.",
      "Wij zijn jouw persoonlijke aankooppartner in Spanje.",
      "Of je nu een vakantiehuis zoekt, een investering of een plek om een nieuw hoofdstuk te beginnen: we helpen je de woning te vinden die echt past bij jouw levensstijl en doelen.",
      "TribeScroll en Properties4You zijn gebouwd op dezelfde waarden: mensen helpen een leven te creëren waar ze echt van houden.",
      "Wil je onze reis en ons leven in Spanje volgen? We verwelkomen je graag op Instagram.",
    ],
    whyTitle: "Waarom kopen via ons?",
    why: [
      { title: "Een persoonlijke aanpak", body: ["Als je met ons werkt, heb je van begin tot eind rechtstreeks contact met ons. Geen callcenters, geen onnodige druk en geen opdringerige verkooptechnieken: alleen eerlijk advies en persoonlijke begeleiding."] },
      { title: "We weten hoe het voelt", body: ["We hebben het hele proces zelf doorgemaakt. We weten hoe het voelt om je eigen land te verlaten, een nieuw hoofdstuk te beginnen en een leven in het buitenland op te bouwen. Daarom begrijpen we echt de vragen en zorgen van internationale kopers."] },
      { title: "We maken elke reis de moeite waard", body: [
        "De meeste van onze klanten reizen vanuit het buitenland, vaak vanuit Nederland, om woningen in Spanje te bekijken.",
        "Daarom nemen we eerst de tijd om jouw wensen, levensstijl, budget en toekomstplannen te begrijpen. Nog voordat je reist, selecteren we zorgvuldig de woningen die echt bij jouw criteria passen.",
        "Als je in Spanje aankomt, heten we je persoonlijk welkom en begeleiden we je bij de geplande bezichtigingen. Ons doel is simpel: elke woning die je bezoekt, moet je tijd waard zijn.",
      ] },
      { title: "Eerlijk advies", body: [
        "Ons doel is niet om je zomaar een woning te verkopen.",
        "Ons doel is je te helpen de **juiste** woning te vinden.",
        "Als we denken dat een woning niet bij je past, zeggen we dat. We helpen je liever de juiste beslissing te nemen dan je te haasten naar de verkeerde.",
      ] },
      { title: "Een relatie voor de lange termijn", body: [
        "Een huis kopen in Spanje is meer dan een transactie: het is het begin van een nieuw hoofdstuk.",
        "We willen dat je je tijdens het hele proces zeker voelt. Van je eerste vragen tot de sleuteloverdracht staan we bij elke stap naast je.",
      ] },
    ],
    followTitle: "Volg onze reis",
    followBody: "Naast het helpen van mensen bij het vinden van hun droomhuis in Spanje, delen we ook graag ons eigen leven aan de Costa Blanca. Volg ons op Instagram voor kijkjes achter de schermen, lokale tips, nieuwe woningen en een blik op de levensstijl waardoor we verliefd werden op Spanje.",
    followCta: "Volg ons op Instagram",
  },

  fr: {
    kicker: "À propos",
    title: "Nous ne nous sommes pas simplement installés en Espagne. Nous avons choisi une autre façon de vivre.",
    photoAlt: "Reinier et Karina, fondateurs de Properties4You",
    story: [
      "Bonjour ! Nous sommes **Reinier et Karina**.",
      "Il y a quelques années, nous avons pris une décision qui a changé notre vie. Nous avons vendu notre maison aux Pays-Bas, fait nos valises et commencé à parcourir le monde à la recherche d'un endroit où nous sentir vraiment chez nous.",
      "Pendant ce voyage, nous nous sommes mariés à Bali et avons continué à construire un projet lancé aux Pays-Bas : **TribeScroll**. Un réseau social européen conçu pour rassembler les gens autour de la positivité, de liens sincères et du développement personnel.",
      "En tant que couple, nous avons investi notre propre temps, notre énergie et nos économies pour faire de ce rêve une réalité. TribeScroll a grandi avec nous : des Pays-Bas à Bali, puis dans chaque pays que nous avons visité depuis. Aujourd'hui, nous continuons à améliorer et à développer la plateforme.",
      "En voyageant, nous ne faisions pas que travailler à distance. Nous cherchions aussi l'endroit où construire notre avenir.",
      "Finalement, nous sommes arrivés en Espagne.",
      "Et ce fut le coup de foudre.",
      "Pas seulement pour le soleil et le magnifique littoral, mais aussi pour le mode de vie détendu, la gentillesse des gens et l'accueil de la communauté internationale. Nous avons été surpris de voir combien de familles néerlandaises et européennes avaient déjà fait de l'Espagne leur foyer.",
      "C'est de cette expérience qu'est né **Properties4You**.",
      "Parce que nous savons ce que c'est de chercher un logement dans un autre pays. Nous comprenons l'enthousiasme, les questions et parfois même l'incertitude qui accompagnent une décision aussi importante.",
      "Nous sommes votre partenaire d'achat personnel en Espagne.",
      "Que vous cherchiez une résidence secondaire, un investissement ou un lieu pour commencer un nouveau chapitre, nous sommes là pour vous aider à trouver le bien qui correspond vraiment à votre mode de vie et à vos objectifs.",
      "TribeScroll et Properties4You reposent sur les mêmes valeurs : aider les gens à se construire une vie qu'ils aiment vraiment.",
      "Si vous souhaitez suivre notre aventure et notre vie en Espagne, nous serons ravis de vous accueillir sur Instagram.",
    ],
    whyTitle: "Pourquoi acheter avec nous ?",
    why: [
      { title: "Un accompagnement personnel", body: ["En travaillant avec nous, vous traitez directement avec nous du début à la fin. Pas de centre d'appels, pas de pression inutile ni de techniques de vente agressives : seulement des conseils honnêtes et un accompagnement personnel."] },
      { title: "Nous savons ce que c'est", body: ["Nous sommes passés par là nous-mêmes. Nous savons ce que l'on ressent en quittant son pays, en commençant un nouveau chapitre et en construisant une vie à l'étranger. C'est pourquoi nous comprenons vraiment les questions et les inquiétudes des acheteurs internationaux."] },
      { title: "Chaque voyage compte", body: [
        "La plupart de nos clients viennent de l'étranger, souvent des Pays-Bas, pour visiter des biens en Espagne.",
        "C'est pourquoi nous prenons d'abord le temps de comprendre vos souhaits, votre mode de vie, votre budget et vos projets. Avant votre voyage, nous sélectionnons avec soin les biens qui correspondent vraiment à vos critères.",
        "À votre arrivée en Espagne, nous vous accueillons personnellement et vous accompagnons lors des visites prévues. Notre objectif est simple : chaque bien que vous visitez doit valoir votre temps.",
      ] },
      { title: "Des conseils honnêtes", body: [
        "Notre but n'est pas de vous vendre n'importe quel bien.",
        "Notre but est de vous aider à trouver le **bon** bien.",
        "Si nous pensons qu'un bien ne vous convient pas, nous vous le dirons. Nous préférons vous aider à prendre la bonne décision plutôt que de vous précipiter vers la mauvaise.",
      ] },
      { title: "Une relation sur le long terme", body: [
        "Acheter une maison en Espagne, c'est plus qu'une transaction : c'est le début d'un nouveau chapitre.",
        "Nous voulons que vous vous sentiez en confiance tout au long du processus. De vos premières questions à la remise des clés, nous vous accompagnons à chaque étape.",
      ] },
    ],
    followTitle: "Suivez notre aventure",
    followBody: "En plus d'aider les gens à trouver la maison de leurs rêves en Espagne, nous aimons partager notre propre vie sur la Costa Blanca. Suivez-nous sur Instagram pour les coulisses, nos bonnes adresses locales, les nouveaux biens et un aperçu du mode de vie qui nous a fait tomber amoureux de l'Espagne.",
    followCta: "Suivez-nous sur Instagram",
  },
};
