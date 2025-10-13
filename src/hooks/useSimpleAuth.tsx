'use client';

import { useState, useEffect } from 'react';

export function useSimpleAuth() {
  // Função para obter cookie
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // Verificar auth IMEDIATAMENTE no server-side
  const getInitialAuth = () => {
    if (typeof window === 'undefined') {
      return { user: null, token: null, isAuthenticated: false, isLoading: true };
    }

    const savedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const savedUser = localStorage.getItem('auth_user') || getCookie('auth_user');

    if (savedToken && savedUser) {
      try {
        return {
          user: JSON.parse(savedUser),
          token: savedToken,
          isAuthenticated: true,
          isLoading: false
        };
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        return { user: null, token: null, isAuthenticated: false, isLoading: false };
      }
    }

    return { user: null, token: null, isAuthenticated: false, isLoading: false };
  };

  const initialAuth = getInitialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth.isAuthenticated);
  const [user, setUser] = useState<any>(initialAuth.user);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [isLoading, setIsLoading] = useState<boolean>(initialAuth.isLoading);

  useEffect(() => {
    // Se já temos dados iniciais válidos, não precisa fazer nada
    if (initialAuth.user && initialAuth.token) {
      setIsLoading(false);
      return;
    }

    // Só faz a verificação se não tem dados iniciais
    const savedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const savedUser = localStorage.getItem('auth_user') || getCookie('auth_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    token
  };
}