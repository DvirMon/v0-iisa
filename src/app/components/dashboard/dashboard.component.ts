import {
  Component,
  signal,
  computed,
  effect,
  type OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule, type MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { DashboardService } from "../../services/dashboard.service";
import {
  Candidate,
  ChartData,
  LocationData,
  VisitData,
} from "../../models/candidate.model";
import { CandidateDetailComponent } from "../candidate-detail/candidate-detail.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatFormFieldModule,
    NgxChartsModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  // Filter signals
  searchTerm = signal("");
  statusFilter = signal("all");
  cityFilter = signal("all");

  // View mode signal
  viewMode = signal<"grid" | "table">("grid");

  // Chart data signals
  ageData = signal<ChartData[]>([]);
  statusData = signal<ChartData[]>([]);
  locationData = signal<LocationData[]>([]);
  visitsData = signal<VisitData[]>([]);
  hobbiesData = signal<ChartData[]>([]);

  // Computed signals for filtered candidates
  filteredCandidates = computed(() => {
    const candidates = this.dashboardService.candidates();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const city = this.cityFilter();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !search ||
        candidate.name.toLowerCase().includes(search) ||
        candidate.email.toLowerCase().includes(search) ||
        candidate.city.toLowerCase().includes(search);

      const matchesStatus =
        status === "all" ||
        candidate.status.toLowerCase().replace(" ", "-") === status;

      const matchesCity =
        city === "all" ||
        candidate.city.toLowerCase().replace(" ", "-") === city;

      return matchesSearch && matchesStatus && matchesCity;
    });
  });

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

  // Table columns
  displayedColumns: string[] = [
    "candidate",
    "contact",
    "location",
    "status",
    "applied",
    "actions",
  ];

  // Chart options
  chartColorScheme = {
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  };

  constructor(
    public dashboardService: DashboardService,
    private dialog: MatDialog
  ) {
    // Effect to log when filtered candidates change
    effect(() => {
      console.log(
        `Filtered candidates count: ${this.filteredCandidates().length}`
      );
    });

    // Effect to update chart data when candidates change
    effect(() => {
      const candidates = this.dashboardService.candidates();
      console.log(`Total candidates updated: ${candidates.length}`);
    });
  }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    // Load static chart data into signals
    this.ageData.set(this.dashboardService.getAgeData());
    this.statusData.set(this.dashboardService.getStatusData());
    this.locationData.set(this.dashboardService.getLocationData());
    this.visitsData.set(this.dashboardService.getVisitsData());
    this.hobbiesData.set(this.dashboardService.getHobbiesData());
  }

  // Filter methods
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value);
  }

  onCityFilterChange(value: string): void {
    this.cityFilter.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set("");
    this.statusFilter.set("all");
    this.cityFilter.set("all");
  }

  toggleViewMode(): void {
    this.viewMode.update((mode) => (mode === "grid" ? "table" : "grid"));
  }

  openCandidateDetail(candidate: Candidate): void {
    this.dialog.open(CandidateDetailComponent, {
      data: { candidate },
      width: "800px",
      maxHeight: "90vh",
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "Approved":
        return "primary";
      case "Rejected":
        return "warn";
      case "Under Review":
        return "accent";
      default:
        return "";
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "Approved":
        return "check_circle";
      case "Rejected":
        return "cancel";
      case "Under Review":
        return "schedule";
      case "Pending":
        return "hourglass_empty";
      default:
        return "help";
    }
  }

  getDaysAgo(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Chart event handlers
  onChartSelect(event: any): void {
    console.log("Chart selection:", event);
  }

  onChartActivate(event: any): void {
    console.log("Chart activate:", event);
  }

  onChartDeactivate(event: any): void {
    console.log("Chart deactivate:", event);
  }

  // Candidate management methods
  updateCandidateStatus(
    candidateId: number,
    status: Candidate["status"]
  ): void {
    this.dashboardService.updateCandidateStatus(candidateId, status);
  }

  removeCandidateFromList(candidateId: number): void {
    this.dashboardService.removeCandidate(candidateId);
  }
}
