import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const ICON_COLORS = [
  'text-accent-coral',
  'text-accent-sky',
  'text-accent-green',
  'text-accent-purple',
  'text-accent-coral',
  'text-accent-purple',
];

export function Beneficios() {
  return (
    <section id="beneficios" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.beneficios.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.beneficios.items.map((item, index) => (
            <Card
              key={item.titulo}
              className="relative transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {item.icon === 'trophy' && (
                <span className="absolute -right-2 -top-2 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-bold text-brand-blue shadow">
                  🎉
                </span>
              )}
              <Icon name={item.icon} className={`mb-3 h-8 w-8 ${ICON_COLORS[index % ICON_COLORS.length]}`} />
              <h3 className="mb-2 text-lg font-bold text-brand-blue">{item.titulo}</h3>
              <p className="text-sm text-gray-600">{item.descripcion}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">{content.beneficios.disclaimer}</p>
      </div>
    </section>
  );
}
