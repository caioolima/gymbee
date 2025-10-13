'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (userData: any) => Promise<void>;
  registerTrainer: (trainerData: any) => Promise<void>;
  logout: () => void;
  error: string | null;
  hasActiveGoal: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      return { user: null, token: null, isLoading: true };
    }

    const savedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const savedUser = localStorage.getItem('auth_user') || getCookie('auth_user');

    if (savedToken && savedUser) {
      try {
        return {
          user: JSON.parse(savedUser),
          token: savedToken,
          isLoading: false
        };
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }

    return { user: null, token: null, isLoading: false };
  };

  const initialAuth = getInitialAuth();
  const [user, setUser] = useState<AuthResponse['user'] | null>(initialAuth.user);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [isLoading, setIsLoading] = useState(initialAuth.isLoading);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    // Se já temos dados iniciais, não precisa fazer nada
    if (initialAuth.user && initialAuth.token) {
      return;
    }

    // Só faz a verificação se não tem dados iniciais
    const savedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const savedUser = localStorage.getItem('auth_user') || getCookie('auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.login(email, password);
      
      setToken(response.accessToken);
      setUser(response.user);
      
      // Salvar no localStorage e cookies
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      // Salvar também em cookies para persistência entre sessões
      document.cookie = `auth_token=${response.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 dias
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.registerUser(userData);
      
      setToken(response.accessToken);
      setUser(response.user);
      
      // Salvar no localStorage e cookies
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      // Salvar também em cookies para persistência entre sessões
      document.cookie = `auth_token=${response.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 dias
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerTrainer = async (trainerData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.registerTrainer(trainerData);
      
      setToken(response.accessToken);
      setUser(response.user);
      
      // Salvar no localStorage e cookies
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      // Salvar também em cookies para persistência entre sessões
      document.cookie = `auth_token=${response.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 dias
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Limpar cookies também
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const hasActiveGoal = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      await apiService.getActiveGoal(token);
      return true; // Se não deu erro, tem objetivo ativo
    } catch (error) {
      return false; // Se deu erro (404), não tem objetivo ativo
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        registerUser,
        registerTrainer,
        logout,
        error,
        hasActiveGoal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
