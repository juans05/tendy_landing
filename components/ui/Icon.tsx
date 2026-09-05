type IconName = 'tag' | 'star' | 'rocket' | 'gift' | 'truck' | 'trophy';

const PATHS: Record<IconName, string> = {
  tag: 'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .58 1.41l9.59 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  star: 'M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z',
  rocket: 'M12 2c2.5 2 4 5.5 4 9 0 2-1 4-2 5l-2 3-2-3c-1-1-2-3-2-5 0-3.5 1.5-7 4-9Zm-3 14-2 5 4-2 4 2-2-5',
  gift: 'M20 12v9H4v-9M2 7h20v5H2V7Zm10-5c-1.5 0-3 1.5-3 3v2h3V2Zm0 0c1.5 0 3 1.5 3 3v2h-3V2Z',
  truck: 'M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  trophy: 'M8 4h8v4a4 4 0 0 1-8 0V4Zm-4 1h4v2a4 4 0 0 1-4-4Zm16 0h-4v2a4 4 0 0 0 4-4ZM10 14h4v3h-4v-3Zm-2 5h8v2H8v-2Z',
};

export function Icon({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
  const path = PATHS[name as IconName];
  if (!path) return null;

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
