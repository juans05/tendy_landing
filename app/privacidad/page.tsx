import { content } from '@/lib/content';

export const metadata = { alternates: { canonical: '/privacidad' }, title: `Política de privacidad | ${content.marca.nombre}` };

export default function PrivacidadPage() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-black">Política de Privacidad</h1>
      <a href="/" className="mb-6 inline-block text-sm text-brand-black underline">
        ← Volver al inicio
      </a>

      <p className="mb-4">
        En {content.marca.nombre} nos tomamos en serio la protección de tus datos personales, conforme a la Ley
        N° 29733 de Protección de Datos Personales del Perú y su reglamento.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">¿Qué datos recopilamos?</h2>
      <p className="mb-4">
        A través de nuestro formulario del Club VIP Fundadores solicitamos únicamente tu nombre, tu número de
        WhatsApp y, de forma opcional, un rango de edad de interés y tus preferencias de producto. No solicitamos
        ni almacenamos DNI, nombre completo, colegio, dirección permanente ni fecha exacta de nacimiento de
        ningún menor de edad.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">¿Para qué usamos tus datos?</h2>
      <p className="mb-4">
        Usamos los datos que nos envías para atender consultas por WhatsApp y brindarte información sobre juguetes y el Club VIP
        Fundadores y sus promociones. Con tu permiso, también medimos el uso de la web para mejorarla.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Analítica y cookies</h2><p className="mb-4">La analítica opcional solo se carga cuando la aceptas. Medimos visitas, categorías consultadas y clics hacia WhatsApp. Puedes activarla o desactivarla mediante el control de la parte inferior. La preferencia se guarda en tu navegador. Desactivarla detiene nuevas mediciones; puedes eliminar cookies anteriores desde los ajustes del navegador.</p><h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Base legal</h2>
      <p className="mb-4">
        Tratamos tus datos en base a la autorización expresa que otorgas al marcar la casilla correspondiente en
        nuestro formulario.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">¿Compartimos tus datos?</h2>
      <p className="mb-4">
        Al contactarnos por WhatsApp, los datos que envías se procesan también en esa plataforma. Si aceptas analítica, Google y, cuando esté configurado, Meta reciben datos de navegación e interacciones. No enviamos tu nombre, teléfono ni el texto de tus mensajes como parámetros de eventos.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">¿Cuánto tiempo conservamos tus datos?</h2>
      <p className="mb-4">
        Conservamos tus datos mientras mantengas una relación con el Club o hasta que solicites su eliminación.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Tus derechos</h2>
      <p className="mb-4">
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (derechos ARCO)
        escribiéndonos directamente por WhatsApp.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-bold text-brand-black">Cambios a esta política</h2>
      <p className="mb-4">
        Podemos actualizar esta política durante la etapa piloto. Cualquier cambio relevante será comunicado a
        través de nuestros canales oficiales.
      </p>
    </main>
  );
}
