'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Detectar se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Detectar preferência do usuário por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setShouldReduceMotion(isMobile || prefersReducedMotion);
  }, []);

  return shouldReduceMotion;
}
