import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

export function Beneficios() {
  return (
    <section id="beneficios" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.beneficios.titulo}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.beneficios.items.map((item) => (
            <Card key={item.titulo}>
              <Icon name={item.icon} className="mb-3 h-8 w-8 text-accent-coral" />
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
