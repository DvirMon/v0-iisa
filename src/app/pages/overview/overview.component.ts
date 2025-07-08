import { Component, computed, signal, type OnInit } from "@angular/core";
import { StatCardData } from "src/app/shared/components/cards/stat-card/stat-card.component";
import { AgeDistributionChartComponent } from "src/app/shared/components/charts/age-distribution-chart/age-distribution-chart.component";
import {
  ChartData,
  LocationData,
  VisitData,
} from "../../models/candidate.model";
import { DashboardService } from "../../services/dashboard.service";
import { ChartCardComponent } from "../../shared/components/cards/chart-card/chart-card.component";
import { LocationCardComponent } from "./components/location-card/location-card.component";
import { StatsGridComponent } from "./components/stats-grid/stats-grid.component";

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [
    StatsGridComponent,
    ChartCardComponent,
    AgeDistributionChartComponent,
    LocationCardComponent,
  ],
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  ageData = signal<ChartData[]>([]);
  statusData = signal<ChartData[]>([]);
  locationData = signal<LocationData[]>([]);
  visitsData = signal<VisitData[]>([]);

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

  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.ageData.set(this.dashboardService.getAgeData());
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

  onStatCardClick(card: StatCardData): void {
    console.log("Stat card clicked:", card);
    // Implement navigation or detailed view
  }

  onStatCardHover(card: StatCardData): void {
    console.log("Stat card hovered:", card);
    // Implement hover effects or tooltips
  }
}
