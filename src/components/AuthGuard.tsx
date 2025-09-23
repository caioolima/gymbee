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
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (isLoading) {
      return;
    }

    // Se não tem token ou usuário, redirecionar imediatamente
    if (!token || !user || !isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login...');
      router.replace(redirectTo);
      return;
    }

    // Se tem tudo, permitir renderização
    setShouldRender(true);
  }, [isAuthenticated, isLoading, user, token, router, redirectTo]);

  // Se ainda está carregando, mostrar nada (ou um loading mínimo)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (já redirecionou)
  if (!shouldRender) {
    return null;
  }

  // Se chegou até aqui, está autenticado
  return <>{children}</>;
}
