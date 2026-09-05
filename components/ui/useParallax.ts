'use client';
import { useEffect, useState } from 'react';

export function useParallax(factor = 0.15): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setOffset(window.scrollY * factor);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [factor]);

  return offset;
}
