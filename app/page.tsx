import { StickyHeader } from '@/components/ui/StickyHeader';
import { Hero } from '@/components/sections/Hero';
import { QueEsElClub } from '@/components/sections/QueEsElClub';
import { Beneficios } from '@/components/sections/Beneficios';
import { Comparacion } from '@/components/sections/Comparacion';
import { Pricing } from '@/components/sections/Pricing';
import { ComoFunciona } from '@/components/sections/ComoFunciona';
import { Fundadores } from '@/components/sections/Fundadores';
import { WhatsappCta } from '@/components/sections/WhatsappCta';
import { Formulario } from '@/components/sections/Formulario';
import { Faq } from '@/components/sections/Faq';
import { Testimonios } from '@/components/sections/Testimonios';
import { CtaFinal } from '@/components/sections/CtaFinal';
import { Footer } from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <>
      <StickyHeader />
      <main>
        <Hero />
        <QueEsElClub />
        <Beneficios />
        <Comparacion />
        <Pricing />
        <ComoFunciona />
        <Fundadores />
        <WhatsappCta />
        <Formulario />
        <Faq />
        <Testimonios />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
