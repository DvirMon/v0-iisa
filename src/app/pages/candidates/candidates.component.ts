import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";

import { DashboardService } from "../../services/dashboard.service";
import { Candidate } from "../../models/candidate.model";
import { CandidateDetailDialog } from "./components/candidate-detail/candidate-detail-page.component";
import { CandidateFilters, FilterState } from "./components/candidate-filters/candidate-filters.component";

@Component({
  selector: "app-candidates",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CandidateFilters,
    // CandidateGridComponent,
    // CandidateTableComponent,
  ],
  templateUrl: "./candidates.component.html",
  styleUrls: ["./candidates.component.scss"],
})
export class CandidatesComponent {
  // Filter signals
  private readonly searchTerm = signal("");
  private readonly statusFilter = signal("all");
  private readonly cityFilter = signal("all");
  private readonly ageFilter = signal("all");
  private readonly dateFilter = signal("all");
  private readonly sortBy = signal("name");

  // View mode and loading signals
  readonly viewMode = signal<"grid" | "table">("grid");
  readonly loading = signal(false);
  readonly filtersLoading = signal(false);
  readonly showAdvancedFilters = signal(false);

  // Computed filter state
  readonly filters = computed(
    (): FilterState => ({
      searchTerm: this.searchTerm(),
      statusFilter: this.statusFilter(),
      cityFilter: this.cityFilter(),
      ageFilter: this.ageFilter(),
      dateFilter: this.dateFilter(),
      sortBy: this.sortBy(),
    })
  );

  // Computed filtered candidates
  filteredCandidates = computed(() => {
    const candidates = this.dashboardService.candidates();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const city = this.cityFilter();
    const age = this.ageFilter();
    const date = this.dateFilter();
    const sort = this.sortBy();

    const filtered = candidates.filter((candidate) => {
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

      const matchesAge = this.matchesAgeFilter(candidate.age, age);

      const matchesDate = this.matchesDateFilter(
        candidate.applicationDate,
        date
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCity &&
        matchesAge &&
        matchesDate
      );
    });

    // Apply sorting
    return this.sortCandidates(filtered, sort);
  });

  constructor(
    public dashboardService: DashboardService,
    private router: Router,
    private dialog: MatDialog
  ) {}

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

  onAgeFilterChange(value: string): void {
    this.ageFilter.set(value);
  }

  onDateFilterChange(value: string): void {
    this.dateFilter.set(value);
  }

  onSortChange(value: string): void {
    this.sortBy.set(value);
  }

  onRemoveFilter(key: keyof FilterState): void {
    switch (key) {
      case "searchTerm":
        this.searchTerm.set("");
        break;
      case "statusFilter":
        this.statusFilter.set("all");
        break;
      case "cityFilter":
        this.cityFilter.set("all");
        break;
      case "ageFilter":
        this.ageFilter.set("all");
        break;
      case "dateFilter":
        this.dateFilter.set("all");
        break;
      case "sortBy":
        this.sortBy.set("name");
        break;
    }
  }

  clearFilters(): void {
    this.searchTerm.set("");
    this.statusFilter.set("all");
    this.cityFilter.set("all");
    this.ageFilter.set("all");
    this.dateFilter.set("all");
    this.sortBy.set("name");
  }

  toggleViewMode(mode: "grid" | "table"): void {
    this.viewMode.set(mode);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((show) => !show);
  }

  viewCandidateDetail(candidate: Candidate): void {
    this.dialog.open(CandidateDetailDialog, {
      data: { candidate },
      width: "800px",
      maxHeight: "90vh",
    });
  }

  editCandidate(candidate: Candidate): void {
    console.log("Edit candidate:", candidate);
    // Implement edit functionality
  }

  onExportFiltered(): void {
    console.log("Export filtered candidates:", this.filteredCandidates());
    // Implement export functionality
  }

  // Helper methods
  private matchesAgeFilter(age: number, filter: string): boolean {
    if (filter === "all") return true;

    switch (filter) {
      case "20-25":
        return age >= 20 && age <= 25;
      case "26-30":
        return age >= 26 && age <= 30;
      case "31-35":
        return age >= 31 && age <= 35;
      case "36-40":
        return age >= 36 && age <= 40;
      case "40+":
        return age > 40;
      default:
        return true;
    }
  }

  private matchesDateFilter(dateString: string, filter: string): boolean {
    if (filter === "all") return true;

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (filter) {
      case "last-week":
        return diffDays <= 7;
      case "last-month":
        return diffDays <= 30;
      case "last-3-months":
        return diffDays <= 90;
      case "older":
        return diffDays > 90;
      default:
        return true;
    }
  }

  private sortCandidates(candidates: Candidate[], sortBy: string): Candidate[] {
    const sorted = [...candidates];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "date":
        return sorted.sort(
          (a, b) =>
            new Date(b.applicationDate).getTime() -
            new Date(a.applicationDate).getTime()
        );
      case "date-desc":
        return sorted.sort(
          (a, b) =>
            new Date(a.applicationDate).getTime() -
            new Date(b.applicationDate).getTime()
        );
      case "age":
        return sorted.sort((a, b) => a.age - b.age);
      case "age-desc":
        return sorted.sort((a, b) => b.age - a.age);
      default:
        return sorted;
    }
  }
}
