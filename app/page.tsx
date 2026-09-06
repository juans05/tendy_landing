import Image from 'next/image';
import { Catalog } from '@/components/store/Catalog';
import { ContactLink } from '@/components/store/ContactLink';
import { JoinLink } from '@/components/store/JoinLink';
import { SubscribeCheckout } from '@/components/store/SubscribeCheckout';
import { club } from '@/lib/club';
import { siteUrl } from '@/lib/seo';

export const metadata = { alternates: { canonical: '/' } };

function Logo() {
  return <a href="/" className="brand-logo" aria-label="Tendy Perú, inicio"><Image src="/images/tendyperu-logo.png" alt="Tendy Perú" width={187} height={186} priority /></a>;
}

export default function HomePage() {
  return <>
    {siteUrl && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Tendy Perú', url: siteUrl, logo: `${siteUrl}/images/tendyperu-logo.png` }).replace(/</g, '\\u003c') }} />}
    <div className="announcement"><span>✦</span> Grandes sonrisas. Beneficios para ti. <a href="#membresia">Conoce el Club Fundadores <b>↗</b></a></div>
    <header className="store-header">
      <Logo />
      <nav aria-label="Navegación principal"><a href="#beneficios">Beneficios</a><a href="#como-funciona">Cómo funciona</a><a href="#juguetes">Juguetes</a><a href="#membresia">Membresía <b className="mini-tag">VIP</b></a></nav>
      <JoinLink location="header" className="button button-small">Quiero unirme <span>↗</span></JoinLink>
    </header>
    <main id="contenido">
      <section className="membership-hero" id="top">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> BIENVENIDO AL CLUB TENDY PERÚ</div>
          <h1>Para ellos,<br />un mundo de <em>alegría.</em><br />Para ti, <em>beneficios.</em></h1>
          <p>Que sorprender a tu peque sea todavía más especial. Únete al Club y descubre precios de socio, novedades y promociones para regalar con ilusión.</p>
          <div className="hero-price"><span className="price-intro">MEMBRESÍA FUNDADORES</span><strong>S/ {club.price}</strong><span>/ mes</span></div>
          <div className="hero-actions"><JoinLink location="hero">Quiero ser fundador <span>↗</span></JoinLink><a className="text-link" href="#como-funciona">¿Cómo funciona? <span>↓</span></a></div>
          <p className="hero-note"><span>✓ Sin permanencia durante el piloto</span><span>✓ Atención por WhatsApp</span></p>
        </div>
        <div className="mascot-stage">
          <span className="stage-ring ring-one" aria-hidden="true" /><span className="stage-ring ring-two" aria-hidden="true" />
          <span className="stage-spark spark-one" aria-hidden="true">✳</span><span className="stage-spark spark-two" aria-hidden="true">✦</span>
          <div className="mascot-intro">¡Hola! Soy <strong>Tendy</strong> <span>♡</span></div>
          <Image className="hero-mascot" src="/images/tendy-avatar.webp" alt="Tendy, la bolsa naranja del logo convertida en un personaje sonriente que saluda con un regalo" width={640} height={640} priority sizes="(max-width: 760px) 90vw, 45vw" />
          <Image className="floating-toy plane" src="/images/toy-plane.webp" alt="" width={150} height={150} sizes="130px" />
          <Image className="floating-toy ball" src="/images/toy-ball.webp" alt="" width={110} height={110} sizes="100px" />
          <div className="member-pass"><div className="pass-icon">t<span>✦</span></div><div><small>EL LADO BONITO DE SER SOCIO</small><strong>Su ilusión. Tus beneficios.</strong><span>CLUB TENDY PERÚ · FUNDADORES</span></div><b>↗</b></div>
        </div>
      </section>
      <div className="joy-strip"><span>PRECIO SOCIO</span><b aria-hidden="true">✳</b><span>NOVEDADES PRIMERO</span><b aria-hidden="true">✳</b><span>PROMOCIONES DEL CLUB</span><b aria-hidden="true">✳</b><span>MÁS MOTIVOS PARA SONREÍR</span></div>

      <section className="benefits-section section-wrap" id="beneficios">
        <div className="section-heading"><div className="eyebrow">PARA ELLOS ES MAGIA. PARA TI, UNA BUENA ELECCIÓN.</div><h2>El regalo les encanta.<br /><em>El Club te conviene a ti.</em></h2><p>Beneficios para acompañarte cuando eliges su próxima aventura.</p></div>
        <div className="benefit-grid">{club.benefits.map((benefit, i) => <article className={`benefit-card benefit-${i}`} key={benefit.title}><span className="benefit-icon" aria-hidden="true">{benefit.icon}</span><small>{benefit.label}</small><h3>{benefit.title}</h3><p>{benefit.text}</p><a href="#membresia">Conocer la membresía <span>↗</span></a></article>)}</div>
        <p className="benefits-note">También podrán activarse puntos dobles, fechas especiales y delivery especial según campaña. Te confirmamos sus condiciones antes de afiliarte.</p>
      </section>

      <section className="how-section" id="como-funciona"><div className="section-wrap"><div className="section-heading"><div className="eyebrow">DE “ME INTERESA” A “¡QUÉ BUEN REGALO!”</div><h2>Así de fácil es <em>ser del Club.</em></h2><p>Te acompañamos por WhatsApp, paso a paso.</p></div><div className="steps-grid">{club.steps.map((step,i) => <article key={step.title}><div className="step-number">0{i+1}<span aria-hidden="true">↗</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><div className="how-bottom"><span>Sin formularios largos. Sin datos personales de tus hijos.</span><JoinLink location="steps" className="text-link">Quiero empezar →</JoinLink></div></div></section>

      <section className="plan-section section-wrap" id="membresia"><div className="plan-copy"><div className="eyebrow">TU PRÓXIMO REGALO EMPIEZA AQUÍ</div><h2>Hazle espacio<br />a la alegría.<br /><em>Únete a Tendy.</em></h2><p>Si te gusta descubrir juguetes y aprovechar oportunidades para tu familia, este Club es para ti.</p><div className="parent-note"><span aria-hidden="true">♡</span><div><strong>Tú eliges cuándo regalar.</strong><p>No tienes que comprar juguetes todos los meses. Explora los beneficios vigentes y decide si encajan contigo.</p></div></div><a href="/terminos" className="text-link">Ver términos del piloto ↗</a></div><article className="membership-card"><div className="plan-ribbon">✦ EDICIÓN FUNDADORES</div><div className="plan-card-inner"><div className="plan-topline"><span>CLUB TENDY PERÚ</span><b>VIP</b></div><h3>Pequeñas sorpresas.<br />Grandes momentos.</h3><div className="plan-price"><span>S/</span><strong>{club.price}</strong><span>/ mes</span></div><p className="plan-subtitle">Precio de prueba durante el piloto.</p><ul><li>Precio socio en juguetes seleccionados</li><li>Acceso anticipado a novedades y preventas</li><li>Promociones exclusivas para miembros</li><li>Atención directa por WhatsApp</li></ul><JoinLink location="plan">Quiero ser fundador <span>↗</span></JoinLink><p className="plan-footnote">Sin obligación de permanencia durante el piloto.<br />Juguetes y envíos se pagan por separado.</p></div></article><SubscribeCheckout /></section>

      <Catalog />

      <section className="family-band section-wrap"><div className="family-photo"><Image src="/images/hero-family.webp" alt="Papá y mamá comparten con su hijo un momento de juego" fill sizes="(max-width: 760px) 90vw, 40vw" /></div><div><div className="eyebrow">EL MEJOR REGALO TAMBIÉN ES TU TIEMPO</div><h2>Hoy juegan juntos.<br />Mañana, <em>lo recuerdan.</em></h2><p>Detrás de cada juguete hay una historia por inventar. En Tendy queremos acompañarte a elegir esos momentos, con beneficios pensados para quien los hace posibles: tú.</p><JoinLink location="family">Quiero conocer el Club ↗</JoinLink></div></section>

      <section id="faq" className="faq-section section-wrap"><div><div className="eyebrow">TODO CLARO, DESDE EL INICIO</div><h2>Un Club sin<br /><em>letra pequeña.</em></h2><p>Las preguntas que también nos haríamos como papás.</p><ContactLink location="faq" className="text-link">Tengo otra pregunta ↗</ContactLink></div><div>{club.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>

      <section id="contacto" className="final-club"><div className="final-content"><div className="eyebrow">TENDY PERÚ · CLUB FUNDADORES</div><h2>Su próxima sonrisa<br />tiene un gran comienzo.<br /><em>Contigo.</em></h2><p>Forma parte del Club por S/ {club.price} al mes.</p><JoinLink location="final" className="button button-light">Sí, quiero ser del Club ↗</JoinLink><small>Consulta condiciones y activación por WhatsApp.</small></div><Image src="/images/tendy-avatar.webp" alt="Tendy te da la bienvenida al Club" width={380} height={380} sizes="(max-width: 760px) 230px, 350px" /></section>
    </main>
    <footer className="store-footer"><div><Logo /><p>Todo lo que necesitas, en un solo lugar.</p></div><div><a href="#beneficios">Beneficios</a><a href="#como-funciona">Cómo funciona</a><a href="/terminos">Términos del Club</a><a href="/privacidad">Privacidad y cookies</a><small>© {new Date().getFullYear()} Tendy Perú</small></div></footer>
    <div className="mobile-join"><span><strong>S/ {club.price}</strong> / mes<small>Club Fundadores</small></span><JoinLink location="mobile_sticky" className="button button-small">Quiero unirme ↗</JoinLink></div>
  </>;
}
