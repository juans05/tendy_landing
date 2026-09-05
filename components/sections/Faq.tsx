import { content } from '@/lib/content';
import { Accordion } from '@/components/ui/Accordion';

export function Faq() {
  const items = content.faq.items.map((item) => ({ question: item.pregunta, answer: item.respuesta }));

  return (
    <section id="faq" className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.faq.titulo}</h2>
        <Accordion items={items} />
      </div>
    </section>
  );
}
