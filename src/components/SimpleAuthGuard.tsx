'use client';

import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useEffect, useState } from 'react';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function SimpleAuthGuard({ 
  children, 
  redirectTo = '/login' 
}: SimpleAuthGuardProps) {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Se não está carregando e não está autenticado, redirecionar
    if (mounted && !isLoading && isAuthenticated === false) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo, mounted]);

  // Evitar hidratação mismatch - renderizar sempre o mesmo no servidor
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se está carregando, mostrar loading mínimo
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (já redirecionou)
  if (!isAuthenticated) {
    return null;
  }

  // Se chegou até aqui, está autenticado
  return <>{children}</>;
}