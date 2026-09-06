import Image from 'next/image';
import { Catalog } from '@/components/store/Catalog';
import { ContactLink } from '@/components/store/ContactLink';
import { JoinLink } from '@/components/store/JoinLink';
import { getCatalog } from '@/lib/platform/catalog';
import { club } from '@/lib/club';
import { siteUrl } from '@/lib/seo';

export const metadata = { alternates: { canonical: '/' } };

function Logo() {
  return <a href="/" className="brand-logo" aria-label="Tendy Perú, inicio"><Image src="/images/tendyperu-logo.png" alt="Tendy Perú" width={187} height={186} priority /></a>;
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products, campaigns } = await getCatalog();
  return <>
    {siteUrl && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Tendy Perú', url: siteUrl, logo: `${siteUrl}/images/tendyperu-logo.png` }).replace(/</g, '\\u003c') }} />}
    <div className="announcement"><span>✦</span> Grandes sonrisas. Beneficios para ti. <a href="#membresia">Conoce el Club Fundadores <b>↗</b></a></div>
    <header className="store-header">
      <Logo />
      <nav aria-label="Navegación principal"><a href="#beneficios">Beneficios</a><a href="#como-funciona">Cómo funciona</a><a href="/catalogo">Juguetes</a><a href="#membresia">Membresía <b className="mini-tag">VIP</b></a></nav>
      <a href="/mi-club" className="account-nav">Mi Club <span>↗</span></a><JoinLink location="header" className="button button-small">Quiero unirme <span>↗</span></JoinLink>
    </header>
    <main id="contenido">
      <section className="membership-hero" id="top">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> BIENVENIDO AL CLUB TENDY PERÚ</div>
          <h1>Para ellos,<br />un mundo de <em>alegría.</em><br />Para ti, <em>beneficios.</em></h1>
          <p>Elige su próximo juguete con precio de socio. Una membresía para descubrir novedades, aprovechar campañas y regalar con más ilusión.</p>
          <div className="hero-price"><span className="price-intro">MEMBRESÍA FUNDADORES</span><strong>S/ {club.price}</strong><span>/ mes</span></div>
          <div className="hero-actions"><JoinLink location="hero">Quiero ser fundador <span>↗</span></JoinLink><a className="text-link" href="#como-funciona">¿Cómo funciona? <span>↓</span></a></div>
          <p className="hero-note"><span>✓ Sin permanencia durante el piloto</span><span>✓ Tu cuenta en Mi Club</span></p>
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

      <section className="how-section" id="como-funciona"><div className="section-wrap"><div className="section-heading"><div className="eyebrow">DE “ME INTERESA” A “¡QUÉ BUEN REGALO!”</div><h2>Así de fácil es <em>ser del Club.</em></h2><p>De tu cuenta a tus beneficios, paso a paso.</p></div><div className="steps-grid">{club.steps.map((step,i) => <article key={step.title}><div className="step-number">0{i+1}<span aria-hidden="true">↗</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><div className="how-bottom"><span>Tu cuenta es del adulto. No pedimos datos personales de tus hijos.</span><JoinLink location="steps" className="text-link">Quiero empezar →</JoinLink></div></div></section>

      <section className="plan-section section-wrap single-plan" id="membresia">
        <div className="plan-copy"><div className="eyebrow">UNA MEMBRESÍA PENSADA PARA TU FAMILIA</div><h2>Ellos ponen<br />la imaginación.<br /><em>Tú eliges el Club.</em></h2><p>Un solo plan mensual, con tus beneficios, vigencia y pagos en un mismo lugar.</p><div className="parent-note"><span aria-hidden="true">♡</span><div><strong>Decide con información real.</strong><p>Compara los precios del catálogo antes de unirte. No necesitas comprar juguetes todos los meses.</p></div></div><a href="/catalogo" className="text-link">Ver productos participantes ↗</a></div>
        <article className="membership-card"><div className="plan-ribbon">✦ CLUB FUNDADORES</div><div className="plan-card-inner"><div className="plan-topline"><span>TENDY PERÚ</span><b>MENSUAL</b></div><h3>Tu familia.<br />Sus grandes momentos.</h3><div className="plan-price"><span>S/</span><strong>{club.price}</strong><span>/ mes</span></div><p className="plan-subtitle">Cobro mensual. Tú controlas la renovación.</p><ul>{club.planBeneficios.map(item => <li key={item}>{item}</li>)}</ul><JoinLink location="plan">Quiero ser del Club ↗</JoinLink><p className="plan-footnote">Juguetes y envíos se pagan por separado.<br /><a href="/terminos">Conoce los términos antes de afiliarte.</a></p></div></article>
      </section>

      <section className="club-account-band section-wrap"><div><div className="eyebrow">TU CLUB, SIEMPRE A MANO</div><h2>Bienvenido a <em>Mi Club.</em></h2><p>Consulta tu membresía, descubre campañas y revisa tus pagos. La alegría de pertenecer, con todo claro desde el inicio.</p><a className="button" href="/mi-club">Entrar a Mi Club ↗</a></div><div className="account-preview"><span className="status-pill">ASÍ SERÁ TU ESPACIO</span><h3>Hola, familia Tendy ♡</h3><div><span>✦ Mi membresía</span><small>Estado y próxima renovación</small></div><div><span>↘ Mis beneficios</span><small>Campañas y productos participantes</small></div><div><span>✓ Mis pagos y pedidos</span><small>Todo en un solo lugar</small></div></div></section>

      {campaigns.length > 0 && <section className="section-wrap campaign-section"><div className="eyebrow">PARA APROVECHAR HOY</div><h2>Lo nuevo en <em>tu Club.</em></h2><div className="campaign-grid">{campaigns.map(campaign => <article className="campaign-card" key={campaign.id}><span className="status-pill">CAMPAÑA VIGENTE</span><h3>{campaign.title}</h3><p>{campaign.description}</p><details><summary>Condiciones y vigencia</summary><p>{campaign.conditions}</p><p>Hasta {new Date(campaign.ends_at).toLocaleDateString('es-PE',{timeZone:'America/Lima'})}</p></details><a href="/catalogo" className="text-link">Explorar juguetes ↗</a></article>)}</div></section>}

      <Catalog products={products.filter(product => product.featured).slice(0,4).length ? products.filter(product => product.featured).slice(0,4) : products.slice(0,4)} compact />


      <section className="family-band section-wrap"><div className="family-photo"><Image src="/images/hero-family.webp" alt="Papá y mamá comparten con su hijo un momento de juego" fill sizes="(max-width: 760px) 90vw, 40vw" /></div><div><div className="eyebrow">EL MEJOR REGALO TAMBIÉN ES TU TIEMPO</div><h2>Hoy juegan juntos.<br />Mañana, <em>lo recuerdan.</em></h2><p>Detrás de cada juguete hay una historia por inventar. En Tendy queremos acompañarte a elegir esos momentos, con beneficios pensados para quien los hace posibles: tú.</p><JoinLink location="family">Quiero conocer el Club ↗</JoinLink></div></section>

      <section id="faq" className="faq-section section-wrap"><div><div className="eyebrow">TODO CLARO, DESDE EL INICIO</div><h2>Un Club sin<br /><em>letra pequeña.</em></h2><p>Las preguntas que también nos haríamos como papás.</p><ContactLink location="faq" className="text-link">Tengo otra pregunta ↗</ContactLink></div><div>{club.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>

      <section id="contacto" className="final-club"><div className="final-content"><div className="eyebrow">TENDY PERÚ · CLUB FUNDADORES</div><h2>Su próxima sonrisa<br />tiene un gran comienzo.<br /><em>Contigo.</em></h2><p>Forma parte del Club por S/ {club.price} al mes.</p><JoinLink location="final" className="button button-light">Sí, quiero ser del Club ↗</JoinLink><small>Crea tu cuenta y consulta la disponibilidad de afiliación.</small></div><Image src="/images/tendy-avatar.webp" alt="Tendy te da la bienvenida al Club" width={380} height={380} sizes="(max-width: 760px) 230px, 350px" /></section>
    </main>
    <footer className="store-footer"><div><Logo /><p>Todo lo que necesitas, en un solo lugar.</p></div><div><a href="#beneficios">Beneficios</a><a href="#como-funciona">Cómo funciona</a><a href="/terminos">Términos del Club</a><a href="/privacidad">Privacidad y cookies</a><a href="/libro-de-reclamaciones">Libro de Reclamaciones</a><small>© {new Date().getFullYear()} Tendy Perú</small></div></footer>
    <div className="mobile-join"><span><strong>S/ {club.price}</strong> / mes<small>Club Fundadores</small></span><JoinLink location="mobile_sticky" className="button button-small">Quiero unirme ↗</JoinLink></div>
  </>;
}
