import { useAuth } from '@/hooks/useAuth';

// Interceptor global para lidar com erros de autenticação
export class AuthInterceptor {
  private static instance: AuthInterceptor;
  private authContext: any = null;

  private constructor() {}

  static getInstance(): AuthInterceptor {
    if (!AuthInterceptor.instance) {
      AuthInterceptor.instance = new AuthInterceptor();
    }
    return AuthInterceptor.instance;
  }

  setAuthContext(authContext: any) {
    this.authContext = authContext;
  }

  async handleUnauthorized() {
    if (this.authContext) {
      console.log('Erro 401 detectado, fazendo logout...');
      this.authContext.logout();
      
      // Redirecionar para login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Se for erro 401, fazer logout e redirecionar
        if (response.status === 401) {
          await this.handleUnauthorized();
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        const errorData = await response.json().catch(() => ({
          message: 'Erro interno do servidor',
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }
}

export const authInterceptor = AuthInterceptor.getInstance();
