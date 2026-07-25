export type ChatLocale = "en" | "es" | "pl";

export const CHAT_LOCALES: { code: ChatLocale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pl", label: "PL" },
];

export const LANGUAGE_INSTRUCTION: Record<ChatLocale, string> = {
  en: "Reply in English.",
  es: "Responde siempre en español, incluso si el usuario escribe en otro idioma.",
  pl: "Odpowiadaj zawsze po polsku, nawet jeśli użytkownik pisze w innym języku.",
};

type ChatStrings = {
  headerTitle: string;
  headerSubtitleOnline: string;
  headerSubtitleAssistant: string;
  leadFormIntro: string;
  namePlaceholder: string;
  nameAriaLabel: string;
  emailPlaceholder: string;
  emailAriaLabel: string;
  phonePlaceholder: string;
  phoneAriaLabel: string;
  servicePlaceholder: string;
  serviceAriaLabel: string;
  serviceOptions: string[];
  startChat: string;
  preferToCall: (phone: string) => string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  greeting: (firstName: string, service: string | null) => string;
  contactUs: string;
  callNow: string;
  inputPlaceholder: string;
  inputAriaLabel: string;
  sendMessage: string;
  errorMessage: string;
  proactiveBubble: string;
  dismiss: string;
  openChat: string;
  closeChatAria: string;
  languageAriaLabel: string;
};

export const CHAT_STRINGS: Record<ChatLocale, ChatStrings> = {
  en: {
    headerTitle: "Nexus Chicago",
    headerSubtitleOnline: "Online - Typically replies instantly",
    headerSubtitleAssistant: "Virtual Assistant",
    leadFormIntro: "Quick intro so we can help you better:",
    namePlaceholder: "Your name *",
    nameAriaLabel: "Your name",
    emailPlaceholder: "Email address *",
    emailAriaLabel: "Your email",
    phonePlaceholder: "Phone (optional)",
    phoneAriaLabel: "Your phone number",
    servicePlaceholder: "What can we help with?",
    serviceAriaLabel: "Select a service",
    serviceOptions: [
      "Buying a Home",
      "Selling a Home",
      "REO / Short Sale",
      "New Construction",
      "Other / Not Sure",
    ],
    startChat: "Start Chat",
    preferToCall: (phone) => `Prefer to talk? Call ${phone}`,
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    emailInvalid: "Enter a valid email",
    greeting: (firstName, service) =>
      `Hi ${firstName}! I'm the Nexus Chicago virtual assistant.${
        service ? ` I see you're interested in ${service.toLowerCase()}.` : ""
      } How can I help you today?`,
    contactUs: "Contact Us",
    callNow: "Call Now",
    inputPlaceholder: "Type your question...",
    inputAriaLabel: "Type your question",
    sendMessage: "Send message",
    errorMessage: "Something went wrong. Please try again or call us directly.",
    proactiveBubble:
      "Questions about buying or selling in Chicago? Chat with us!",
    dismiss: "Dismiss",
    openChat: "Open chat",
    closeChatAria: "Close chat",
    languageAriaLabel: "Chat language",
  },
  es: {
    headerTitle: "Nexus Chicago",
    headerSubtitleOnline: "En línea - Generalmente responde al instante",
    headerSubtitleAssistant: "Asistente Virtual",
    leadFormIntro: "Una breve introducción para poder ayudarte mejor:",
    namePlaceholder: "Tu nombre *",
    nameAriaLabel: "Tu nombre",
    emailPlaceholder: "Correo electrónico *",
    emailAriaLabel: "Tu correo electrónico",
    phonePlaceholder: "Teléfono (opcional)",
    phoneAriaLabel: "Tu número de teléfono",
    servicePlaceholder: "¿En qué podemos ayudarte?",
    serviceAriaLabel: "Selecciona un servicio",
    serviceOptions: [
      "Comprar una Casa",
      "Vender una Casa",
      "REO / Venta Corta",
      "Construcción Nueva",
      "Otro / No estoy seguro",
    ],
    startChat: "Iniciar Chat",
    preferToCall: (phone) => `¿Prefieres hablar? Llama al ${phone}`,
    nameRequired: "El nombre es obligatorio",
    emailRequired: "El correo electrónico es obligatorio",
    emailInvalid: "Introduce un correo electrónico válido",
    greeting: (firstName, service) =>
      `¡Hola ${firstName}! Soy el asistente virtual de Nexus Chicago.${
        service ? ` Veo que te interesa ${service.toLowerCase()}.` : ""
      } ¿En qué puedo ayudarte hoy?`,
    contactUs: "Contáctanos",
    callNow: "Llamar",
    inputPlaceholder: "Escribe tu pregunta...",
    inputAriaLabel: "Escribe tu pregunta",
    sendMessage: "Enviar mensaje",
    errorMessage:
      "Algo salió mal. Por favor, inténtalo de nuevo o llámanos directamente.",
    proactiveBubble:
      "¿Preguntas sobre comprar o vender en Chicago? ¡Chatea con nosotros!",
    dismiss: "Descartar",
    openChat: "Abrir chat",
    closeChatAria: "Cerrar chat",
    languageAriaLabel: "Idioma del chat",
  },
  pl: {
    headerTitle: "Nexus Chicago",
    headerSubtitleOnline: "Online - Zazwyczaj odpowiada natychmiast",
    headerSubtitleAssistant: "Asystent Wirtualny",
    leadFormIntro: "Krótkie wprowadzenie, abyśmy mogli lepiej Ci pomóc:",
    namePlaceholder: "Twoje imię *",
    nameAriaLabel: "Twoje imię",
    emailPlaceholder: "Adres e-mail *",
    emailAriaLabel: "Twój e-mail",
    phonePlaceholder: "Telefon (opcjonalnie)",
    phoneAriaLabel: "Twój numer telefonu",
    servicePlaceholder: "W czym możemy pomóc?",
    serviceAriaLabel: "Wybierz usługę",
    serviceOptions: [
      "Kupno Domu",
      "Sprzedaż Domu",
      "REO / Krótka Sprzedaż",
      "Nowe Budownictwo",
      "Inne / Nie jestem pewien",
    ],
    startChat: "Rozpocznij Czat",
    preferToCall: (phone) => `Wolisz porozmawiać? Zadzwoń pod ${phone}`,
    nameRequired: "Imię jest wymagane",
    emailRequired: "E-mail jest wymagany",
    emailInvalid: "Wprowadź prawidłowy adres e-mail",
    greeting: (firstName, service) =>
      `Cześć ${firstName}! Jestem wirtualnym asystentem Nexus Chicago.${
        service ? ` Widzę, że interesuje Cię ${service.toLowerCase()}.` : ""
      } W czym mogę dziś pomóc?`,
    contactUs: "Kontakt",
    callNow: "Zadzwoń",
    inputPlaceholder: "Napisz swoje pytanie...",
    inputAriaLabel: "Napisz swoje pytanie",
    sendMessage: "Wyślij wiadomość",
    errorMessage:
      "Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas bezpośrednio.",
    proactiveBubble:
      "Masz pytania o kupno lub sprzedaż w Chicago? Napisz do nas!",
    dismiss: "Zamknij",
    openChat: "Otwórz czat",
    closeChatAria: "Zamknij czat",
    languageAriaLabel: "Język czatu",
  },
};
