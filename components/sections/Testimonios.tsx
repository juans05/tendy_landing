import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

interface TestimoniosProps {
  visible?: boolean;
  items?: { nombre: string; texto: string }[];
  placeholder?: string;
}

export function Testimonios({
  visible = content.testimonios.visible,
  items = content.testimonios.items as { nombre: string; texto: string }[],
  placeholder = content.testimonios.placeholder,
}: TestimoniosProps = {}) {
  if (!visible) {
    return (
      <section className="px-4 py-12 text-center">
        <p className="text-gray-500">{placeholder}</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {items.map((t) => (
          <Card key={t.nombre}>
            <p className="mb-2 text-gray-700">&ldquo;{t.texto}&rdquo;</p>
            <p className="text-sm font-semibold text-brand-blue">{t.nombre}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
