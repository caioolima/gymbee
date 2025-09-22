import { Module } from '@nestjs/common';
import { WeightTrackingService } from './weight-tracking.service';
import { WeightTrackingController } from './weight-tracking.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WeightTrackingService],
  controllers: [WeightTrackingController],
  exports: [WeightTrackingService],
})
export class WeightTrackingModule {}
