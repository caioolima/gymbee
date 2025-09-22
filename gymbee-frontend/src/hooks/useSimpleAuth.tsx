'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    logout,
  };
}
