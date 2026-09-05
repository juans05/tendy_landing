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
  primary: 'bg-brand-yellow text-brand-blue hover:bg-yellow-400',
  secondary: 'bg-brand-blue text-white hover:bg-blue-900',
  outline: 'border-2 border-brand-blue text-brand-blue bg-transparent hover:bg-brand-blue hover:text-white',
  outlineLight: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-blue',
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
