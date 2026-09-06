export interface Beneficio {
  icon: string;
  titulo: string;
  descripcion: string;
}

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export interface PasoComoFunciona {
  numero: number;
  titulo: string;
  descripcion: string;
}

export interface PlanPrecio {
  id: string;
  badge: string;
  nombre: string;
  subtitulo: string;
  precio: string;
  periodo: string;
  equivalencia: string | null;
  recomendado: boolean;
}

export const content = {
  marca: { nombre: 'Tendy', anioCopyright: 2026 },
  seo: {
    title: 'Club VIP de Juguetes | Beneficios exclusivos',
    description:
      'Únete a nuestro Club VIP de juguetes y accede a precios especiales, promociones privadas, novedades y beneficios exclusivos.',
  },
  header: {
    links: [
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Preguntas frecuentes', href: '#faq' },
    ],
    ctaLabel: 'Quiero ser miembro',
  },
  hero: {
    badge: 'CLUB VIP FUNDADORES',
    headline: 'Convierte cada compra en más beneficios 🎁',
    headlineAlt: 'Únete al Club VIP de Juguetes',
    subtitulo:
      'Accede a precios especiales, promociones privadas, novedades antes que todos y beneficios creados para nuestros clientes.',
    precio: 'S/14.90 / mes',
    ctaPrincipal: 'QUIERO SER MIEMBRO',
    ctaSecundario: 'Ver beneficios',
    microcopy: 'Te atenderemos directamente por WhatsApp.',
  },
  queEsElClub: {
    titulo: 'Más que comprar juguetes. Queremos premiar que vuelvas.',
    texto:
      'Nuestro Club VIP está diseñado para clientes que quieren acceder a beneficios especiales cada vez que buscan un juguete o regalo.',
    puntos: [
      'No necesitas comprar todos los meses para formar parte.',
      'La membresía te da acceso a beneficios, campañas y oportunidades exclusivas.',
    ],
  },
  beneficios: {
    titulo: 'Todo esto por ser miembro',
    items: [
      { icon: 'tag', titulo: 'Precio Socio', descripcion: 'Accede a precios especiales en juguetes seleccionados.' },
      {
        icon: 'star',
        titulo: 'Puntos Dobles',
        descripcion: 'En campañas seleccionadas podrás acumular más beneficios por tus compras.',
      },
      {
        icon: 'rocket',
        titulo: 'Antes que todos',
        descripcion: 'Conoce nuevos juguetes y lanzamientos antes de nuestras campañas generales.',
      },
      {
        icon: 'gift',
        titulo: 'Promociones privadas',
        descripcion: 'Accede a promociones creadas exclusivamente para miembros.',
      },
      {
        icon: 'truck',
        titulo: 'Beneficios de delivery',
        descripcion: 'Accede a condiciones especiales de envío en determinadas compras, zonas o campañas.',
      },
      {
        icon: 'trophy',
        titulo: 'Sorteos y sorpresas',
        descripcion: 'Participa en dinámicas especiales disponibles para los miembros del club.',
      },
    ] as Beneficio[],
    disclaimer: 'Los beneficios pueden variar según producto, campaña, disponibilidad y condiciones comerciales.',
  },
  comparacion: {
    titulo: 'Comprar normalmente vs. pertenecer al Club',
    clienteNormal: {
      titulo: 'CLIENTE NORMAL',
      items: [
        { texto: 'Puede comprar cualquier producto', incluido: true },
        { texto: 'Accede a promociones públicas', incluido: true },
        { texto: 'No tiene Precio Socio', incluido: false },
        { texto: 'No tiene acceso anticipado', incluido: false },
        { texto: 'No participa en beneficios exclusivos del Club', incluido: false },
      ],
    },
    miembroVip: {
      titulo: 'MIEMBRO VIP',
      items: [
        { texto: 'Precio Socio en productos seleccionados', incluido: true },
        { texto: 'Acceso anticipado', incluido: true },
        { texto: 'Promociones privadas', incluido: true },
        { texto: 'Puntos dobles en campañas', incluido: true },
        { texto: 'Sorteos', incluido: true },
        { texto: 'Beneficios especiales', incluido: true },
      ],
    },
  },
  pricing: {
    titulo: 'Elige tu plan del Club',
    subtitulo: 'Todos los planes incluyen los mismos beneficios. Solo cambia cada cuánto tiempo pagas.',
    lista: [
      'Precios especiales',
      'Promociones exclusivas',
      'Puntos dobles en campañas seleccionadas',
      'Acceso anticipado',
      'Sorteos',
      'Beneficios especiales de delivery',
    ],
    cta: 'QUIERO UNIRME',
    sinPermanencia: 'Sin permanencia durante el piloto.',
    cancelacion: 'Puedes solicitar la cancelación de tu membresía cuando quieras.',
    planes: [
      {
        id: 'mensual',
        badge: 'PLAN MENSUAL',
        nombre: 'Carinito',
        subtitulo: 'Pagas mes a mes',
        precio: 'S/ 14.90',
        periodo: 'Mensuales',
        equivalencia: null,
        recomendado: false,
      },
      {
        id: 'trimestral',
        badge: 'PLAN TRIMESTRAL',
        nombre: 'Detallista',
        subtitulo: 'Te animaste por 3 meses',
        precio: 'S/ 44.70',
        periodo: 'Trimestrales',
        equivalencia: 'Es como pagar S/14.90 al mes',
        recomendado: false,
      },
      {
        id: 'semestral',
        badge: 'PLAN SEMESTRAL',
        nombre: 'Consentidor',
        subtitulo: 'Medio año consintiendo a los tuyos',
        precio: 'S/ 81.95',
        periodo: 'Semestrales',
        equivalencia: 'Es como pagar S/13.66 al mes',
        recomendado: false,
      },
      {
        id: 'anual',
        badge: 'PLAN ANUAL',
        nombre: 'Fundador',
        subtitulo: 'Te uniste para todo el año',
        precio: 'S/ 163.90',
        periodo: 'Anuales',
        equivalencia: 'Es como pagar S/13.66 al mes',
        recomendado: true,
      },
    ] as PlanPrecio[],
  },
  comoFunciona: {
    titulo: 'Comenzar es muy fácil',
    pasos: [
      { numero: 1, titulo: 'Solicita información', descripcion: 'Haz clic y escríbenos por WhatsApp.' },
      {
        numero: 2,
        titulo: 'Confirma tu membresía',
        descripcion: 'Nuestro equipo te explicará las condiciones del programa.',
      },
      {
        numero: 3,
        titulo: 'Activa tus beneficios',
        descripcion: 'Una vez confirmado tu registro podrás acceder a los beneficios disponibles.',
      },
      {
        numero: 4,
        titulo: 'Disfruta el Club',
        descripcion: 'Compra productos participantes y accede a promociones exclusivas.',
      },
    ] as PasoComoFunciona[],
  },
  fundadores: {
    titulo: 'Queremos construir el Club contigo',
    texto1:
      'Estamos comenzando nuestro programa de membresía y queremos trabajar con nuestro primer grupo de clientes fundadores.',
    texto2: 'Durante esta etapa mediremos cuáles beneficios son realmente más valorados por nuestros clientes.',
    cta: 'QUIERO SER FUNDADOR',
  },
  whatsappCta: {
    titulo: '¿Tienes alguna duda?',
    texto: 'Habla directamente con nosotros por WhatsApp.',
    boton: 'HABLAR POR WHATSAPP',
    mensajePrellenado:
      'Hola 👋 Vi información sobre el Club VIP Fundadores de juguetes y quisiera conocer cómo funciona la membresía de S/14.90.',
  },
  formulario: {
    titulo: 'Quiero recibir información',
    campos: { nombre: 'Nombre', whatsapp: 'WhatsApp' },
    rangoEdadLabel: 'Rango de edad de interés',
    preferenciasLabel: 'Preferencias',
    rangoEdad: ['3 a 5 años', '6 a 8 años', '9 a 12 años', '13+ años', 'Prefiero no indicar'],
    preferencias: ['Juguetes educativos', 'Juguetes electrónicos', 'Juegos', 'Carritos', 'Muñecas', 'Creatividad', 'Otros'],
    autorizacion: 'Autorizo que me contacten por WhatsApp para brindarme información sobre el Club y promociones.',
    linkPrivacidad: 'Política de privacidad',
    boton: 'QUIERO INFORMACIÓN',
  },
  faq: {
    titulo: 'Preguntas frecuentes',
    items: [
      {
        pregunta: '¿La membresía incluye un juguete todos los meses?',
        respuesta:
          'No. El Club ofrece beneficios, promociones, precios especiales y ventajas exclusivas. Algunos regalos, sorteos o promociones especiales podrán realizarse de acuerdo con cada campaña.',
      },
      {
        pregunta: '¿Todos los juguetes tienen Precio Socio?',
        respuesta: 'No. El Precio Socio se aplica únicamente a productos seleccionados.',
      },
      {
        pregunta: '¿El delivery es siempre gratis?',
        respuesta: 'No. Los beneficios de delivery dependen del monto, ubicación, producto o campaña correspondiente.',
      },
      { pregunta: '¿Puedo cancelar?', respuesta: 'Sí. Durante el piloto no existe obligación de permanencia.' },
      {
        pregunta: '¿Cómo recibo los beneficios?',
        respuesta: 'Principalmente a través de WhatsApp y nuestros canales oficiales.',
      },
      {
        pregunta: '¿Puedo comprar aunque no sea miembro?',
        respuesta: 'Sí. La tienda continuará atendiendo normalmente. El Club simplemente brinda beneficios adicionales.',
      },
    ] as FaqItem[],
  },
  testimonios: {
    visible: false,
    placeholder: 'Pronto conocerás experiencias de nuestros miembros fundadores.',
    items: [] as { nombre: string; texto: string }[],
  },
  ctaFinal: {
    titulo: 'Cada juguete crea un momento. Queremos que cada compra también te dé beneficios.',
    texto: 'Forma parte de nuestro primer grupo de miembros y descubre una nueva manera de comprar juguetes.',
    precio: 'S/14.90 / mes',
    ctaPrincipal: 'QUIERO SER MIEMBRO',
    ctaSecundario: 'TENGO UNA PREGUNTA',
  },
  footer: {
    links: [
      { label: 'Inicio', href: '#top' },
      { label: 'Beneficios', href: '#beneficios' },
      { label: 'Preguntas frecuentes', href: '#faq' },
      { label: 'Términos del Club', href: '/terminos' },
      { label: 'Política de privacidad', href: '/privacidad' },
      { label: 'Contáctanos', href: '#whatsapp' },
    ],
    redes: [
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
      { label: 'WhatsApp', href: '#whatsapp' },
    ],
    copyright: (anio: number, nombre: string) => `© ${anio} ${nombre}. Todos los derechos reservados.`,
  },
  floatingWhatsApp: {
    microcopy: '¿Tienes dudas?',
    delayMs: 3000,
  },
} as const;
