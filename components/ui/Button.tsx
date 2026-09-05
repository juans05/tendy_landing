'use client';
import { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlineLight';

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  fullWidthOnMobile?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-orange text-brand-black hover:bg-orange-400',
  secondary: 'bg-brand-black text-white hover:bg-neutral-900',
  outline: 'border-2 border-brand-black text-brand-black bg-transparent hover:bg-brand-black hover:text-white',
  outlineLight: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-black',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  fullWidthOnMobile = true,
  type = 'button',
  className = '',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-base transition-colors duration-200 ${VARIANT_CLASSES[variant]} ${fullWidthOnMobile ? 'w-full sm:w-auto' : ''} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
