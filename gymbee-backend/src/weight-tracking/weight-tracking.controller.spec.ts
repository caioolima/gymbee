import { Test, TestingModule } from '@nestjs/testing';
import { WeightTrackingController } from './weight-tracking.controller';

describe('WeightTrackingController', () => {
  let controller: WeightTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeightTrackingController],
    }).compile();

    controller = module.get<WeightTrackingController>(WeightTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
