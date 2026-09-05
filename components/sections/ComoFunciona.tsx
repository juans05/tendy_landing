import { content } from '@/lib/content';

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.comoFunciona.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.comoFunciona.pasos.map((paso) => (
            <div key={paso.numero} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow font-bold text-brand-blue">
                {paso.numero}
              </div>
              <h3 className="mb-1 font-bold text-brand-blue">{paso.titulo}</h3>
              <p className="text-sm text-gray-600">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
