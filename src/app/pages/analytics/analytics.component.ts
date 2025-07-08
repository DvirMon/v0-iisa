import {
  Component,
  computed,
  signal,
  type OnInit,
  inject,
} from "@angular/core";

import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DashboardService } from "../../services/dashboard.service";
import { ChartData, VisitData } from "../../models/candidate.model";
import { StatsGridComponent } from "../overview/components/stats-grid/stats-grid.component";
import { StatCardData } from "src/app/shared/components/cards/stat-card/stat-card.component";

@Component({
  selector: "app-analytics",
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgxChartsModule, StatsGridComponent],
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Chart data signals
  visitsData = signal<VisitData[]>([]);
  hobbiesData = signal<ChartData[]>([]);
  // Loading state
  statsLoading = signal(false);

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

  // Computed stat cards
  statCards = computed((): StatCardData[] => [
    {
      title: "Total Candidates",
      icon: "people",
      value: this.dashboardService.totalCandidates(),
      subtitle: "+12% from last week",
      gradient: "blue",
    },
    {
      title: "Total Visits",
      icon: "visibility",
      value: this.totalVisits().toLocaleString(),
      subtitle: "Last 7 days",
      gradient: "green",
    },
    {
      title: "Registrations",
      icon: "how_to_reg",
      value: this.totalRegistrations(),
      subtitle: `Conversion: ${this.conversionRate()}%`,
      gradient: "purple",
    },
  ]);

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.visitsData.set(this.dashboardService.getVisitsData());
    this.hobbiesData.set(this.dashboardService.getHobbiesData());
  }
}
