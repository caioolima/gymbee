export enum WorkoutType {
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  MIXED = 'MIXED',
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest?: number;
}

export interface CreateWorkoutRequest {
  type: WorkoutType;
  name: string;
  description?: string;
  duration: number;
  calories?: number;
  exercises?: Exercise[];
  notes?: string;
  scheduledDate?: Date;
  source?: string;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  name: string;
  description?: string;
  duration: number;
  calories?: number;
  exercises?: Exercise[];
  notes?: string;
  scheduledDate?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageDuration: number;
  averageCalories: number;
  currentStreak: number;
  bestStreak: number;
  favoriteType: WorkoutType;
}

export interface WorkoutFilters {
  type?: WorkoutType;
  startDate?: Date;
  endDate?: Date;
  minDuration?: number;
  maxDuration?: number;
}
