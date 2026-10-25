import { Module } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service';
import { FlightHoursController } from './flight-hours.controller';

@Module({
  providers: [FlightHoursService],
  controllers: [FlightHoursController]
})
export class FlightHoursModule {}
