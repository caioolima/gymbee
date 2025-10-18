'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Detectar preferência do usuário por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Reduzir animações apenas se o usuário preferir ou for mobile
    const isMobile = window.innerWidth < 768;
    setShouldReduceMotion(prefersReducedMotion || isMobile);
  }, []);

  return shouldReduceMotion;
}
