'use client';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { buildWhatsAppLink } from '@/lib/whatsapp';
export function ContactLink({ children, location, message = 'Hola, quisiera conocer los juguetes de Tendy Perú. ¿Me ayudan a elegir?', className = '', membershipPlan }: { children: React.ReactNode; location: string; message?: string; className?: string; membershipPlan?: string }) {
 const [notice, setNotice] = useState(false);
 const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
 const ready = Boolean(number && /^\d{10,15}$/.test(number) && number !== '51999999999');
 return <><a href={ready ? buildWhatsAppLink(message) : '#contacto'} className={className} target={ready ? '_blank' : undefined} rel={ready ? 'noopener noreferrer' : undefined} onClick={(event) => { if (!ready) { event.preventDefault(); setNotice(true); return; } trackEvent('ClickWhatsApp', { ubicacion: location }); if (membershipPlan) trackEvent('MembershipInterest', { origen: location, plan: membershipPlan }); }}>{children}</a>{notice && <div className="contact-notice" role="status">Nuestro canal de atención estará disponible pronto.<button aria-label="Cerrar aviso" onClick={() => setNotice(false)}>×</button></div>}</>;
}
