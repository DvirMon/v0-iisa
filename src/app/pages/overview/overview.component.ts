import { Component, signal, type OnInit, inject } from "@angular/core";
import { AgeDistributionChartComponent } from "src/app/shared/components/charts/age-distribution-chart/age-distribution-chart.component";
import { HobbiesChart } from "src/app/shared/components/charts/hobbies-chart/hobbies-chart.component";
import { ChartData, LocationData } from "../../models/candidate.model";
import { DashboardService } from "../../services/dashboard.service";
import { ChartCardComponent } from "../../shared/components/cards/chart-card/chart-card.component";
import { LocationCardComponent } from "./components/location-card/location-card.component";

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [
    ChartCardComponent,
    AgeDistributionChartComponent,
    LocationCardComponent,
    HobbiesChart,
  ],
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
  dashboardService = inject(DashboardService);

  ageData = signal<ChartData[]>(this.dashboardService.getAgeData());
  hobbiesData = signal<ChartData[]>(this.dashboardService.getHobbiesData());
  locationData = signal<LocationData[]>(
    this.dashboardService.getLocationData()
  );
}
