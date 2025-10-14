import { RegisterUserRequest, RegisterTrainerRequest, AuthResponse, ApiError } from '@/types/auth';
import { authInterceptor } from './authInterceptor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gymbee-backend-v2.onrender.com/api';

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

  // User ranking API
  async getUserRanking(token: string): Promise<any> {
    return this.request('/home/user-ranking', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserLevel(token: string): Promise<any> {
    return this.request('/home/user-level', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // User profile API
  async getCurrentUser(token: string): Promise<any> {
    return this.request('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserGoals(token: string): Promise<any> {
    return this.request('/users/goals', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserAchievements(token: string): Promise<any> {
    return this.request('/users/achievements', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getDashboardStats(token: string): Promise<any> {
    return this.request('/users/dashboard/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserWorkouts(token: string, limit: number = 10): Promise<any> {
    return this.request(`/users/workouts?limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUserProfile(token: string, updateData: any): Promise<any> {
    return this.request('/auth/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  }

  // Trending articles API
  async getTrendingArticles(token: string, limit?: number): Promise<any> {
    const endpoint = limit ? `/home/trends?limit=${limit}` : '/home/trends';
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

  // Trainers API
  async getTrainers(token: string): Promise<any[]> {
    return this.request('/trainers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTrainerById(trainerId: string, token: string): Promise<any> {
    return this.request(`/trainers/${trainerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async swipeTrainer(trainerId: string, action: 'LIKE' | 'SKIP', token: string): Promise<any> {
    return this.request('/trainers/swipe', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ trainerId, action }),
    });
  }

  async getTrainerServices(trainerId: string, token: string): Promise<any[]> {
    return this.request(`/trainers/${trainerId}/services`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTrainerSchedule(trainerId: string, token: string): Promise<any[]> {
    return this.request(`/trainers/${trainerId}/schedule`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createTrainerContract(trainerId: string, contractData: any, token: string): Promise<any> {
    return this.request(`/trainers/${trainerId}/contract`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contractData),
    });
  }

  async getMyTrainerContracts(token: string): Promise<any[]> {
    return this.request('/trainers/contracts/my', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Gyms API
  async getGyms(token: string, lat?: number, lon?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    
    const queryString = params.toString();
    const endpoint = queryString ? `/home/gyms?${queryString}` : '/home/gyms';
    
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async checkInGym(checkInData: any, token: string): Promise<any> {
    return this.request('/home/gyms/checkin', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(checkInData),
    });
  }

  async getGymCheckIns(token: string): Promise<any[]> {
    return this.request('/home/check-ins', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Articles API
  async viewArticle(articleId: string, token: string): Promise<any> {
    return this.request(`/home/articles/${articleId}/view`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Workout Ranking API
  async voteWorkout(workoutId: string, token: string): Promise<any> {
    return this.request(`/home/ranking/${workoutId}/vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // User Matching API - Sistema de matching entre usuários
  async getUsersForMatching(token: string, filters?: any): Promise<any[]> {
    const params = new URLSearchParams();
    
    if (filters?.gender) params.append('gender', filters.gender);
    if (filters?.minAge) params.append('minAge', filters.minAge.toString());
    if (filters?.maxAge) params.append('maxAge', filters.maxAge.toString());
    if (filters?.goalType) params.append('goalType', filters.goalType);
    if (filters?.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users/matching?${queryString}` : '/users/matching';
    
    return this.request(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async swipeUser(swipeData: any, token: string): Promise<any> {
    return this.request('/users/swipe', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(swipeData),
    });
  }

  async getUserMatches(token: string): Promise<any[]> {
    return this.request('/users/matches', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(userId: string, token: string): Promise<any> {
    return this.request(`/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserProfileByUsername(username: string, token: string): Promise<any> {
    return this.request(`/users/profile/username/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Workout Invites API
  async createWorkoutInvite(inviteData: any, token: string): Promise<any> {
    return this.request('/workout-invites', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inviteData),
    });
  }

  async getSentWorkoutInvites(token: string): Promise<any[]> {
    return this.request('/workout-invites/sent', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getReceivedWorkoutInvites(token: string): Promise<any[]> {
    return this.request('/workout-invites/received', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async respondToWorkoutInvite(inviteId: string, response: { status: 'ACCEPTED' | 'DECLINED' }, token: string): Promise<any> {
    return this.request(`/workout-invites/${inviteId}/respond`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
  }

  async editWorkoutInvite(inviteId: string, updateData: any, token: string): Promise<any> {
    return this.request(`/workout-invites/${inviteId}/edit`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  }

  async cancelWorkoutInvite(inviteId: string, token: string): Promise<any> {
    return this.request(`/workout-invites/${inviteId}/cancel`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markWorkoutInviteAsCompleted(inviteId: string, token: string): Promise<any> {
    return this.request(`/workout-invites/${inviteId}/complete`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Personal Trainers API
  async getTrainers(token: string): Promise<any[]> {
    return this.request('/trainers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async swipeTrainer(trainerId: string, action: string, token: string): Promise<any> {
    return this.request('/trainers/swipe', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trainerId,
        action,
      }),
    });
  }

  async getMyTrainerContracts(token: string): Promise<any[]> {
    return this.request('/trainers/contracts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

}

export const apiService = new ApiService();
