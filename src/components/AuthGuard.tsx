'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (isLoading) {
      return;
    }

    // Marcar que já verificou
    setHasChecked(true);

    // Se não está autenticado, redirecionar imediatamente
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Se ainda está carregando ou não verificou, mostrar loading mínimo
  if (isLoading || !hasChecked) {
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
