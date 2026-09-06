import { content } from '@/lib/content';

export const metadata = { alternates: { canonical: '/terminos' }, title: `Términos del Club | ${content.marca.nombre}` };

export default function TerminosPage() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-black">Términos del Club VIP Fundadores</h1>
      <a href="/" className="mb-6 inline-block text-sm text-brand-black underline">
        ← Volver al inicio
      </a>

      <p className="mb-4">
        El Club VIP Fundadores es un programa piloto de {content.marca.nombre}. Estos términos aplican durante la
        etapa piloto y pueden actualizarse conforme el programa evoluciona.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Membresía</h2>
      <p className="mb-4">
        La membresía tiene un costo de S/ 14.90 al mes durante la etapa piloto. Sin permanencia durante el piloto:
        puedes solicitar la cancelación de tu membresía cuando quieras, escribiéndonos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Beneficios</h2>
      <p className="mb-4">
        Los beneficios del Club (Precio Socio, acceso anticipado y promociones privadas) están sujetos a disponibilidad, producto, campaña y condiciones comerciales
        vigentes en cada momento. No garantizan un descuento en todos los productos ni delivery gratuito
        ilimitado.
      </p>
      <p className="mb-4">
        Los juguetes y envíos se pagan por separado. La membresía no incluye un juguete ni una caja mensual.
        Puntos dobles, fechas especiales y delivery especial solo se aplican si existe una campaña vigente,
        con reglas comunicadas previamente. Antes de activar la membresía, el equipo confirma por WhatsApp
        los beneficios disponibles, productos participantes, vigencia, pago y renovación. Esta web no realiza cobros automáticos.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Etapa piloto</h2>
      <p className="mb-4">
        Durante esta etapa mediremos qué beneficios son más valorados por nuestros miembros fundadores.
        {' '}
        {content.marca.nombre} puede modificar, ampliar o finalizar el programa piloto, informando previamente a
        los miembros activos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Cancelación</h2>
      <p className="mb-4">
        Puedes cancelar tu membresía en cualquier momento solicitándolo por WhatsApp, sin penalidad.
      </p>
    </main>
  );
}
