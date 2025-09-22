import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { HomeModule } from './home/home.module';
import { TrainersModule } from './trainers/trainers.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HealthModule } from './health/health.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { AchievementsModule } from './achievements/achievements.module';
import { WeightTrackingModule } from './weight-tracking/weight-tracking.module';
import { DailyChallengesModule } from './daily-challenges/daily-challenges.module';
import { ActivitiesModule } from './activities/activities.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
    AuthModule,
    GoalsModule,
    HomeModule,
    TrainersModule,
    ProfilesModule,
    HealthModule,
    WorkoutsModule,
    AchievementsModule,
    WeightTrackingModule,
    DailyChallengesModule,
    ActivitiesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
