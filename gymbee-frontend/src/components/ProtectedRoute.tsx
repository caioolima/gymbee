'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/app/register/_componentes/LoadingScreen';
import { apiService } from '@/services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Verificar se não está carregando
      if (!isLoading) {
        // Verificar se não tem token ou usuário
        if (!token || !user || !isAuthenticated) {
          console.log('Usuário não autenticado, redirecionando para login...');
          router.replace(redirectTo);
          return;
        }
        
        // Verificar se o token ainda é válido fazendo uma requisição
        try {
          await apiService.getCurrentUser(token);
          setIsCheckingAuth(false);
        } catch (error: any) {
          console.log('Token inválido, redirecionando para login...', error);
          // Limpar dados de autenticação
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Redirecionar imediatamente
          router.replace(redirectTo);
          return;
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, user, token, router, redirectTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || isCheckingAuth) {
    return (
      <LoadingScreen
        message="Verificando autenticação..."
        isSuccess={false}
      />
    );
  }

  // Se chegou até aqui, está autenticado
  return <>{children}</>;
}