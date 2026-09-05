import { content } from '@/lib/content';

export const metadata = { title: `Términos del Club | ${content.marca.nombre}` };

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-blue">Términos del Club VIP Fundadores</h1>

      <p className="mb-4">
        El Club VIP Fundadores es un programa piloto de {content.marca.nombre}. Estos términos aplican durante la
        etapa piloto y pueden actualizarse conforme el programa evoluciona.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Membresía</h2>
      <p className="mb-4">
        La membresía tiene un costo de S/ 14.90 al mes durante la etapa piloto. Sin permanencia durante el piloto:
        puedes solicitar la cancelación de tu membresía cuando quieras, escribiéndonos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Beneficios</h2>
      <p className="mb-4">
        Los beneficios del Club (Precio Socio, puntos dobles, acceso anticipado, promociones privadas, beneficios
        de delivery y sorteos) están sujetos a disponibilidad, producto, campaña y condiciones comerciales
        vigentes en cada momento. No garantizan un descuento en todos los productos ni delivery gratuito
        ilimitado.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Etapa piloto</h2>
      <p className="mb-4">
        Durante esta etapa mediremos qué beneficios son más valorados por nuestros miembros fundadores.
        {' '}
        {content.marca.nombre} puede modificar, ampliar o finalizar el programa piloto, informando previamente a
        los miembros activos por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-blue">Cancelación</h2>
      <p className="mb-4">
        Puedes cancelar tu membresía en cualquier momento solicitándolo por WhatsApp, sin penalidad.
      </p>
    </main>
  );
}
