import { content } from '@/lib/content';

export function Comparacion() {
  const { clienteNormal, miembroVip } = content.comparacion;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-black sm:text-3xl">{content.comparacion.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-center font-bold text-gray-500">{clienteNormal.titulo}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {clienteNormal.items.map((item) => (
                <li key={item.texto} className="flex items-start gap-2">
                  <span aria-hidden>{item.incluido ? '✓' : '✗'}</span>
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-4 border-brand-orange bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-center font-bold text-brand-black">{miembroVip.titulo}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {miembroVip.items.map((item) => (
                <li key={item.texto} className="flex items-start gap-2">
                  <span className="text-green-500" aria-hidden>
                    ✓
                  </span>
                  {item.texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
