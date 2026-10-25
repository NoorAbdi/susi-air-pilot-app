import { Test, TestingModule } from '@nestjs/testing';
import { FlightHoursService } from './flight-hours.service';

describe('FlightHoursService', () => {
  let service: FlightHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightHoursService],
    }).compile();

    service = module.get<FlightHoursService>(FlightHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
