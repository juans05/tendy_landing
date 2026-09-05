import { content } from '@/lib/content';

export function QueEsElClub() {
  return (
    <section id="que-es" className="px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold text-brand-blue sm:text-3xl">{content.queEsElClub.titulo}</h2>
        <p className="mb-6 text-gray-600">{content.queEsElClub.texto}</p>
        <ul className="space-y-2 text-left text-gray-700">
          {content.queEsElClub.puntos.map((punto) => (
            <li key={punto} className="flex items-start gap-2">
              <span className="text-accent-green" aria-hidden>
                ✓
              </span>
              {punto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
