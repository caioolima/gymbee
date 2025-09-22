'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
}

export function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');

      if (!token || !user) {
        console.log('Não autenticado, redirecionando para login...');
        router.replace('/login');
        return;
      }

      try {
        // Verificar se o JSON do usuário é válido
        JSON.parse(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Dados de usuário inválidos, redirecionando para login...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.replace('/login');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Se ainda está carregando, mostrar loading mínimo
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
  if (!isAuthenticated) {
    return null;
  }

  // Se chegou até aqui, está autenticado
  return <>{children}</>;
}
