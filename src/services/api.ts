import { RegisterUserRequest, RegisterTrainerRequest, AuthResponse, ApiError } from '@/types/auth';
import { authInterceptor } from './authInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Se for erro 401, verificar se é endpoint de login/registro
        if (response.status === 401) {
          const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
          
          if (isAuthEndpoint) {
            // Para endpoints de autenticação, não fazer logout automático
            console.log('Erro 401 em endpoint de autenticação - credenciais inválidas');
          } else {
            // Para outros endpoints, fazer logout e redirecionar
            console.log('Erro 401 detectado, redirecionando para login...');
            // Limpar dados de autenticação
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            // Redirecionar para login imediatamente
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw new Error('Sessão expirada. Faça login novamente.');
          }
        }

        const errorData: ApiError = await response.json().catch(() => ({
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

  async registerUser(userData: RegisterUserRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registerTrainer(trainerData: RegisterTrainerRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register-trainer', {
      method: 'POST',
      body: JSON.stringify(trainerData),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(token: string): Promise<any> {
    return this.request('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createGoal(goalData: any, token: string): Promise<any> {
    console.log('=== API SERVICE DEBUG ===');
    console.log('Endpoint: /users/goals/test');
    console.log('GoalData:', goalData);
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('Body stringified:', JSON.stringify(goalData));
    console.log('Headers que serão enviados:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    console.log('========================');
    
    return this.request('/users/goals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    });
  }

  async getActiveGoal(token: string): Promise<any> {
    return this.request('/users/goals/active', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAllGoals(token: string): Promise<any[]> {
    return this.request('/users/goals', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Workouts endpoints
  async createWorkout(workoutData: any, token: string): Promise<any> {
    return this.request('/users/workouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workoutData),
    });
  }

  async getUserWorkouts(token: string, limit?: number): Promise<any[]> {
    const endpoint = limit ? `/users/workouts?limit=${limit}` : '/users/workouts';
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWeeklyWorkouts(token: string): Promise<any[]> {
    return this.request('/users/workouts/weekly', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWeeklyWorkoutCount(token: string): Promise<{ count: number }> {
    return this.request('/users/workouts/weekly/count', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markWorkoutAsCompleted(workoutId: string, token: string): Promise<any> {
    return this.request(`/users/workouts/${workoutId}/complete`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateWorkout(workoutId: string, workoutData: any, token: string): Promise<any> {
    return this.request(`/users/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workoutData),
    });
  }

  async deleteWorkout(workoutId: string, token: string): Promise<any> {
    return this.request(`/users/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Achievements endpoints
  async getUserAchievements(token: string): Promise<any[]> {
    return this.request('/users/achievements', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAchievementCount(token: string): Promise<{ count: number }> {
    return this.request('/users/achievements/count', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markAchievementAsRead(achievementId: string, token: string): Promise<any> {
    return this.request(`/users/achievements/${achievementId}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async checkAchievements(token: string): Promise<any> {
    return this.request('/users/achievements/check', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Achievements API (duplicate methods for compatibility)
  async getAchievements(token: string): Promise<any> {
    return this.request('/users/achievements', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Weight tracking endpoints
  async createWeightEntry(weightData: any, token: string): Promise<any> {
    return this.request('/users/weight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(weightData),
    });
  }

  async updateGoal(goalId: string, goalData: any, token: string): Promise<any> {
    return this.request(`/users/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(goalId: string, token: string): Promise<any> {
    return this.request(`/users/goals/${goalId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateGoalWeight(goalId: string, weight: number, token: string): Promise<any> {
    return this.request(`/users/goals/${goalId}/weight`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ weight }),
    });
  }

  async getWeightHistory(token: string, limit?: number): Promise<any[]> {
    const endpoint = limit ? `/users/weight/history?limit=${limit}` : '/users/weight/history';
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getLatestWeight(token: string): Promise<any> {
    return this.request('/users/weight/latest', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async calculateWeightProgress(goalId: string, token: string): Promise<any> {
    return this.request(`/users/weight/progress/${goalId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


  // Challenges API
  async getDailyChallenges(token: string): Promise<any> {
    return this.request('/home/challenges', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async participateInChallenge(challengeId: string, token: string): Promise<any> {
    return this.request(`/home/challenges/${challengeId}/participate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserChallengeHistory(token: string): Promise<any> {
    return this.request('/home/challenges/history', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


  // Home data API
  async getHomeData(token: string, lat?: number, lon?: number): Promise<any> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/home?${queryString}` : '/home';
    
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Workout ranking API
  async getWorkoutRanking(token: string): Promise<any> {
    return this.request('/home/ranking', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Trending articles API
  async getTrendingArticles(token: string, limit?: number): Promise<any> {
    const endpoint = limit ? `/home/articles?limit=${limit}` : '/home/articles';
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Gym check-in API
  async checkInGym(checkInData: any, token: string): Promise<any> {
    return this.request('/home/check-in', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(checkInData),
    });
  }

  async getGymCheckIns(token: string): Promise<any> {
    return this.request('/home/check-ins', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Challenges API
  async getChallengesByGoalType(goalType: string, token: string): Promise<any[]> {
    return this.request(`/users/challenges/goal-type/${goalType}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async acceptChallenge(challengeId: string, token: string): Promise<any> {
    return this.request(`/users/challenges/${challengeId}/accept`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async completeChallenge(challengeId: string, token: string): Promise<any> {
    return this.request(`/users/challenges/${challengeId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getChallengeStats(token: string): Promise<any> {
    return this.request('/users/challenges/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Daily Challenges API
  async getTodaysDailyChallenge(token: string): Promise<any> {
    return this.request('/users/daily-challenges/today', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async acceptDailyChallenge(challengeId: string, token: string): Promise<any> {
    return this.request(`/users/daily-challenges/${challengeId}/accept`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async completeDailyChallenge(challengeId: string, token: string): Promise<any> {
    return this.request(`/users/daily-challenges/${challengeId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Activities API
  async getRecentActivities(token: string, limit?: number): Promise<any[]> {
    const url = limit ? `/users/activities/recent?limit=${limit}` : '/users/activities/recent';
    return this.request(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Dashboard API
  async getDashboardStats(token: string): Promise<any> {
    return this.request('/users/dashboard/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Goals API - Toggle Active
  async toggleGoalActive(goalId: string, token: string): Promise<any> {
    return this.request(`/users/goals/${goalId}/toggle-active`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

}

export const apiService = new ApiService();
