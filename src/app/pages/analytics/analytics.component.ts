import { Component, computed, signal, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DashboardService } from "../../services/dashboard.service";
import { ChartData, VisitData } from "../../models/candidate.model";

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  // Chart data signals
  visitsData = signal<VisitData[]>([]);
  hobbiesData = signal<ChartData[]>([]);

  results = computed(() => {
    return [
      {
        name: "Visits",
        series: this.visitsData().map((d) => ({
          name: d.date,
          value: d.visits,
        })),
      },
      {
        name: "Registrations",
        series: this.visitsData().map((d) => ({
          name: d.date,
          value: d.registrations,
        })),
      },
    ];
  });
  // Chart options
  chartColorScheme = {
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.visitsData.set(this.dashboardService.getVisitsData());
    this.hobbiesData.set(this.dashboardService.getHobbiesData());
  }
}
