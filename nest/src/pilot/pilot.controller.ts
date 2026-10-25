import { Controller, Get } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Controller()
export class PilotController {
  constructor(private readonly dataService: DataService) {}

  @Get('pilot/me')
  getPilotProfile() {
    const pilotData = this.dataService.flightHoursData.pilot;
    return {
      name: 'John Doe',
      totalFlightHours: pilotData.totalFlightHours,
      avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=0E2138&color=fff',
    };
  }

  @Get('documents')
  getDocuments() {
    return this.dataService.documentsData.documents;
  }
}