'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="contenido" className="platform-main"><section className="empty-state"><h1>No pudimos cargar esta página.</h1><p>Tu información no se ha modificado. Puedes volver a intentarlo o regresar al inicio.</p><button className="button" onClick={reset}>Volver a intentar</button><p><a className="text-link" href="/">Volver a Tendy ↗</a></p></section></main>;
}
