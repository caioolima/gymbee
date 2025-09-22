import { Module } from '@nestjs/common';
import { DailyChallengesController } from './daily-challenges.controller';
import { DailyChallengesService } from './daily-challenges.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DailyChallengesController],
  providers: [DailyChallengesService],
  exports: [DailyChallengesService],
})
export class DailyChallengesModule {}
