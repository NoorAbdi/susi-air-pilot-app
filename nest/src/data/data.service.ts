import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataService implements OnModuleInit {
  public schedulesData: any;
  public documentsData: any;
  public flightHoursData: any;
  public readonly today = '2026-05-15';

  onModuleInit() {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    this.schedulesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-schedules.json'), 'utf8'));
    this.documentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-documents.json'), 'utf8'));
    this.flightHoursData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-flight-hours.json'), 'utf8'));
  }
}