import { Component, signal, computed, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { DashboardService } from "../../services/dashboard.service";
import {
  ChartData,
  LocationData,
  VisitData,
} from "../../models/candidate.model";

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  // Chart data signals
  ageData = signal<ChartData[]>([]);
  statusData = signal<ChartData[]>([]);
  locationData = signal<LocationData[]>([]);
  visitsData = signal<VisitData[]>([]);

  // Computed statistics
  totalVisits = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.visits, 0)
  );
  totalRegistrations = computed(() =>
    this.visitsData().reduce((sum, day) => sum + day.registrations, 0)
  );
  conversionRate = computed(() => {
    const visits = this.totalVisits();
    const registrations = this.totalRegistrations();
    return visits > 0 ? Number(((registrations / visits) * 100).toFixed(1)) : 0;
  });

  chartColorScheme: Color = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  };

  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.ageData.set(this.dashboardService.getAgeData());
    this.statusData.set(this.dashboardService.getStatusData());
    this.locationData.set(this.dashboardService.getLocationData());
    this.visitsData.set(this.dashboardService.getVisitsData());
  }

  onChartSelect(event: any): void {
    console.log("Chart selection:", event);
  }

  onChartActivate(event: any): void {
    console.log("Chart activate:", event);
  }

  onChartDeactivate(event: any): void {
    console.log("Chart deactivate:", event);
  }
}
