'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true); // Sempre true por enquanto

  useEffect(() => {
    // Detectar preferência do usuário por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Por enquanto, sempre reduzir animações para melhor performance
    setShouldReduceMotion(true);
  }, []);

  return shouldReduceMotion;
}
