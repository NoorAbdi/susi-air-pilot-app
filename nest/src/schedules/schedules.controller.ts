import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { GetSchedulesDto } from './dto/get-schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  getSchedules(@Query() query: GetSchedulesDto) {
    const { year, month } = query;
    
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    const allSchedules = this.dataService.schedulesData.schedules;
    const filteredSchedules = allSchedules.filter((schedule: any) =>
      schedule.duty_date.startsWith(prefix)
    );

    return {
      legend: this.dataService.schedulesData.legend,
      schedules: filteredSchedules,
    };
  }
}