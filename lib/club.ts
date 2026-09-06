import { monthlyPlan } from './platform/types';
const MONTHLY_PRICE = monthlyPlan.price;

export const club = {
  name: 'Club Tendy Perú',
  price: MONTHLY_PRICE.toFixed(2),
  planBeneficios: [
    'Precio socio en juguetes seleccionados',
    'Acceso anticipado a novedades y preventas',
    'Promociones exclusivas para miembros',
    'Atención directa por WhatsApp',
  ],
  benefits: [
    { icon: '↘', title: 'Precio de socio', text: 'Accede a precios especiales en juguetes seleccionados. Consulta cuáles participan antes de comprar.', label: 'PARA ELEGIR MEJOR' },
    { icon: '✦', title: 'Novedades primero', text: 'Conoce nuevos juguetes y preventas antes de las campañas generales.', label: 'PARA SORPRENDERLOS' },
    { icon: '♡', title: 'Promociones del Club', text: 'Descubre combinaciones de juguetes y campañas especiales para miembros.', label: 'PARA REGALAR CON AMOR' },
  ],
  steps: [
    { title: 'Crea tu cuenta', text: 'Entra con tu correo y el código de acceso. Solo necesitamos los datos del adulto.' },
    { title: 'Paga con MercadoPago', text: 'Revisa la membresía mensual de S/ 14.90 y autoriza el pago recurrente en MercadoPago.' },
    { title: 'Activación automática', text: 'Cuando MercadoPago confirme el cobro, verás tu membresía activa en Mi Club.' },
    { title: 'Disfruta el Club', text: 'Entra a Mi Club para revisar tu vigencia, campañas, pagos y productos con precio de socio.' },
  ],
  faqs: [
    { question: '¿Qué estoy pagando con la membresía?', answer: 'El acceso mensual al Club y sus beneficios comerciales vigentes: precios de socio en productos seleccionados, acceso anticipado y promociones para miembros. Los juguetes se compran por separado.' },
    { question: '¿Recibiré un juguete o una caja cada mes?', answer: 'No. Esta membresía es un Club de beneficios, no una suscripción de juguetes mensuales. Cualquier juguete, regalo o caja adicional tendrá sus propias condiciones.' },
    { question: '¿Cuánto cuesta y cómo se activa?', answer: 'El plan Fundadores cuesta S/ 14.90 al mes, con cobro recurrente. Crea tu cuenta y paga con MercadoPago. Mi Club muestra la activación cuando se verifica el cobro; volver desde la pasarela no equivale a un pago confirmado.' },
    { question: '¿Tengo que comprar todos los meses?', answer: 'No hay obligación de comprar juguetes cada mes. La cuota corresponde al acceso al Club durante el periodo contratado; revisa las promociones disponibles para decidir si te conviene.' },
    { question: '¿Todos los juguetes tienen descuento? ¿El envío es gratis?', answer: 'El precio de socio aplica solo a productos participantes. El delivery se cotiza por pedido. Las campañas de envío especial, puntos dobles o fechas especiales dependen de sus reglas vigentes y se confirman antes de comprar.' },
    { question: '¿Puedo cancelar la membresía?', answer: 'Sí. Durante el piloto no hay obligación de permanencia ni penalidad por cancelación. Puedes detener la renovación desde Mi Club. Conservas el acceso del periodo ya pagado, salvo devolución o reversión del pago. La cancelación no solicita un reembolso automático.' },
    { question: '¿Puedo comprar sin ser parte del Club?', answer: 'Claro. Puedes consultar modelos y comprar sin membresía. El Club es una opción adicional para quienes quieren acceder a sus beneficios.' },
  ],
} as const;
