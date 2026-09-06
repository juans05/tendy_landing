import { ClaimsBookForm } from '@/components/store/ClaimsBookForm';
import { content } from '@/lib/content';

export const metadata = { alternates: { canonical: '/libro-de-reclamaciones' }, title: `Libro de Reclamaciones | ${content.marca.nombre}` };

export default function LibroDeReclamacionesPage() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-16 text-gray-700">
      <h1 className="mb-6 text-3xl font-bold text-brand-black">Libro de Reclamaciones</h1>
      <a href="/" className="mb-6 inline-block text-sm text-brand-black underline">
        ← Volver al inicio
      </a>

      <p className="mb-4">
        Conforme al Código de Protección y Defensa del Consumidor, {content.marca.nombre} cuenta con este Libro de
        Reclamaciones a tu disposición. Formular un reclamo no impide acudir a otras vías de solución de
        controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. Daremos respuesta en
        un plazo no mayor a treinta (30) días calendario.
      </p>

      <div className="mt-8">
        <ClaimsBookForm />
      </div>
    </main>
  );
}
