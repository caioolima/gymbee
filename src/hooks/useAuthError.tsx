'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useAuthError() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleAuthError = (error: any) => {
    // Verificar se é erro 401
    if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
      console.log('Erro de autenticação detectado, fazendo logout...');
      logout();
      router.push('/login');
      return true;
    }
    return false;
  };

  return { handleAuthError };
}
