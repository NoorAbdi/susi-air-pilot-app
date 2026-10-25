import { Controller, Get, Query } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service';
import { GetFlightHoursDto } from './dto/get-flight-hours.dto';
import { GetSummaryDto } from './dto/get-summary.dto';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  getDailyHours(@Query() query: GetFlightHoursDto) {
    return this.flightHoursService.getDailyHours(query.from, query.to);
  }

  @Get('summary')
  getSummary(@Query() query: GetSummaryDto) {
    const range = query.range || '1w';
    return this.flightHoursService.getSummary(range);
  }
}