import { Test, TestingModule } from '@nestjs/testing';
import { WeightTrackingService } from './weight-tracking.service';

describe('WeightTrackingService', () => {
  let service: WeightTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeightTrackingService],
    }).compile();

    service = module.get<WeightTrackingService>(WeightTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
