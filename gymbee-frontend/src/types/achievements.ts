export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt: Date;
  isRead: boolean;
  metadata?: any;
}

export interface AchievementCount {
  count: number;
}

export interface AchievementResponse {
  message: string;
}
