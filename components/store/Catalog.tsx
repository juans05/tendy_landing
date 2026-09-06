'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ContactLink } from './ContactLink';
import { trackEvent } from '@/lib/analytics';
const toys = [
 { name: 'Pequeñas grandes carreras', category: 'Vehículos', image: 'toy-car', label: 'A toda imaginación', color: 'peach', alt: 'Carrito de juguete' },
 { name: 'Aventuras por el cielo', category: 'Vehículos', image: 'toy-plane', label: 'Historias sin límites', color: 'lavender', alt: 'Avión de juguete' },
 { name: 'Diversión en movimiento', category: 'Al aire libre', image: 'toy-ball', label: 'A jugar juntos', color: 'mint', alt: 'Pelota de colores' },
 { name: 'Un mundo de colores', category: 'Al aire libre', image: 'toy-pinwheel', label: 'Pequeños descubrimientos', color: 'butter', alt: 'Molino de viento de colores' },
];
export function Catalog() {
 const [category, setCategory] = useState('Todos');
 const filtered = toys.filter(toy => category === 'Todos' || toy.category === category);
 return <section id="juguetes" className="catalog-section section-wrap"><div className="catalog-heading"><div><div className="eyebrow">UN MUNDO POR DESCUBRIR</div><h2>¿A qué jugamos <em>hoy?</em></h2></div><p>Para sus grandes ideas,<br />un pequeño comienzo.</p></div><div className="filters" aria-label="Filtrar ideas de juguetes">{['Todos','Vehículos','Al aire libre'].map(item=><button key={item} aria-pressed={category===item} onClick={()=>{setCategory(item);trackEvent('select_category',{category:item});}}>{item==='Todos'?'✳ Todos los juguetes':item}</button>)}</div><div className="toy-grid">{filtered.map(toy=><article key={toy.image} className="toy-card"><div className={`toy-picture ${toy.color}`}><span className="toy-tag">{toy.category}</span><Image src={`/images/${toy.image}.webp`} alt={`Ilustración: ${toy.alt}`} width={420} height={420} sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 23vw" /></div><div className="toy-info"><small>{toy.label}</small><h3>{toy.name}</h3><ContactLink location={`catalog_${toy.image}`} message={`Hola, me interesa ${toy.category} (${toy.name}). ¿Qué modelos y precios tienen disponibles?`} className="product-link">Consultar modelos <span>↗</span></ContactLink></div></article>)}</div><p className="catalog-note" aria-live="polite">{filtered.length} ideas para explorar · Imágenes referenciales. Consulta modelos, edades, precios y disponibilidad.</p></section>;
}
