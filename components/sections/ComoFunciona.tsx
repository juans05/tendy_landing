import Image from 'next/image';
import { content } from '@/lib/content';

const STEP_MASCOTS: Record<number, string> = {
  1: '/images/mascot-paso1.png',
  2: '/images/mascot-paso2.png',
  3: '/images/mascot-paso3.png',
  4: '/images/mascot-paso4.png',
};

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-brand-blue sm:text-3xl">{content.comoFunciona.titulo}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.comoFunciona.pasos.map((paso) => (
            <div key={paso.numero} className="flex flex-col items-center text-center">
              <div className="relative mb-3 h-32 w-32 sm:h-36 sm:w-36">
                <Image
                  src={STEP_MASCOTS[paso.numero]}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-contain drop-shadow-lg"
                />
              </div>
              <span className="mb-2 inline-block rounded-full bg-accent-coral px-3 py-1 text-xs font-bold text-white">
                PASO {paso.numero}
              </span>
              <h3 className="mb-1 font-bold text-brand-blue">{paso.titulo}</h3>
              <p className="text-sm text-gray-600">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
