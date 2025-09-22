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
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
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
      
      // Salvar no localStorage
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
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
      
      // Salvar no localStorage
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
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
      
      // Salvar no localStorage
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
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
