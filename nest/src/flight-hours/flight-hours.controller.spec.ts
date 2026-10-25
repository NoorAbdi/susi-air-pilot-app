import { Test, TestingModule } from '@nestjs/testing';
import { FlightHoursController } from './flight-hours.controller';

describe('FlightHoursController', () => {
  let controller: FlightHoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightHoursController],
    }).compile();

    controller = module.get<FlightHoursController>(FlightHoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
