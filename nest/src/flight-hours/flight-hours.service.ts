import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';

@Injectable()
export class FlightHoursService {
  constructor(private readonly dataService: DataService) {}

  getDailyHours(from: string, to: string) {
    const data = this.dataService.flightHoursData.flightHours;
    return data.filter((entry: any) => entry.date >= from && entry.date <= to);
  }

  getSummary(range: string) {
    const todayStr = this.dataService.today;
    const bounds = this.dataService.flightHoursData.chartBounds[range];
    const limits = this.dataService.flightHoursData.limits;
    const allHours = this.dataService.flightHoursData.flightHours;

    // Lookup Map
    const hoursMap = new Map<string, number>();
    for (const item of allHours) {
      hoursMap.set(item.date, item.hours);
    }

    // Chart X-Axis
    const displayDates: string[] = [];
    for (let i = -bounds.displayRangeDays; i <= bounds.displayRangeDays; i++) {
      displayDates.push(this.addDays(todayStr, i));
    }

    // Rolling sums
    const chartData = displayDates.map(targetDate => {
      let rollingSum = 0;
      for (let i = 0; i < bounds.windowDays; i++) {
        const dateInWindow = this.addDays(targetDate, -i);
        rollingSum += hoursMap.get(dateInWindow) || 0;
      }
      return {
        date: targetDate,
        rollingSum: Math.round(rollingSum * 10) / 10 
      };
    });

    // Current Accumulation (4 Cards)
    const currentLimits = {
      daily: {
        hours: hoursMap.get(todayStr) || 0,
        limit: limits.daily
      },
      weekly: {
        hours: this.sumWindow(todayStr, 7, hoursMap),
        limit: limits.weekly
      },
      monthly: {
        hours: this.sumWindow(todayStr, 30, hoursMap),
        limit: limits.monthly
      },
      annual: {
        hours: this.sumWindow(todayStr, 365, hoursMap),
        limit: limits.annual
      }
    };

    return {
      config: bounds,
      currentLimits,
      chartData
    };
  }

  private sumWindow(endDate: string, windowDays: number, hoursMap: Map<string, number>): number {
    let sum = 0;
    for (let i = 0; i < windowDays; i++) {
      const d = this.addDays(endDate, -i);
      sum += hoursMap.get(d) || 0;
    }
    return Math.round(sum * 10) / 10;
  }

  private addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  }
}