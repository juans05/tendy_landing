import { content } from '@/lib/content';

export function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-10 text-gray-300">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-lg font-bold text-white">{content.marca.nombre}</p>
        <nav className="mb-4 flex flex-wrap gap-4 text-sm">
          {content.footer.links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mb-4 flex gap-4 text-sm">
          {content.footer.redes.map((red) => (
            <a key={red.label} href={red.href} className="hover:text-white">
              {red.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500">{content.footer.copyright(content.marca.anioCopyright, content.marca.nombre)}</p>
      </div>
    </footer>
  );
}
