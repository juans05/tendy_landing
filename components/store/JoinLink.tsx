'use client';
import { club } from '@/lib/club';
import { ContactLink } from './ContactLink';
export function JoinLink({ location, children = 'Quiero ser fundador', className = 'button' }: { location: string; children?: React.ReactNode; className?: string }) {
  return <ContactLink location={location} message={club.message} className={className} membership>{children}</ContactLink>;
}
