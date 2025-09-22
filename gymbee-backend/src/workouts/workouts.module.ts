import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [PrismaModule, AchievementsModule],
  providers: [WorkoutsService],
  controllers: [WorkoutsController],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
