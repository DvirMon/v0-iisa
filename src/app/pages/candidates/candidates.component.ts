import { Component, computed, signal } from "@angular/core";

import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

import { Candidate } from "../../models/candidate.model";
import { DashboardService } from "../../services/dashboard.service";
import {
  matchesAgeFilter,
  matchesDateFilter,
  sortCandidates,
} from "./candidates.utils";
import { CandidateDetailDialog } from "./components/candidate-detail/candidate-detail-page.component";
import {
  CandidateFilters,
  FilterState,
} from "./components/candidate-filters/candidate-filters.component";
import { CandidateTable } from "./components/candidate-table/candidate-table.component";

@Component({
  selector: "app-candidates",
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CandidateFilters,
    CandidateTable,
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
  readonly viewMode = signal<"grid" | "table">("table");
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

      const matchesCity =
        city === "all" ||
        candidate.city.toLowerCase().replace(" ", "-") === city;

      const matchesAge = matchesAgeFilter(candidate.age, age);
      const matchesDate = matchesDateFilter(candidate.applicationDate, date);

      return matchesSearch && matchesCity && matchesAge && matchesDate;
    });

    // Apply sorting
    return sortCandidates(filtered, sort);
  });

  private readonly filterResetMap: Record<keyof FilterState, () => void> = {
    searchTerm: () => this.searchTerm.set(""),
    statusFilter: () => this.statusFilter.set("all"),
    cityFilter: () => this.cityFilter.set("all"),
    ageFilter: () => this.ageFilter.set("all"),
    dateFilter: () => this.dateFilter.set("all"),
    sortBy: () => this.sortBy.set("name"),
  };

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
    this.filterResetMap[key]?.();
  }

  clearFilters(): void {
    (Object.keys(this.filterResetMap) as (keyof FilterState)[]).forEach(
      (key) => {
        this.filterResetMap[key]();
      }
    );
  }

  toggleViewMode(mode: "grid" | "table"): void {
    this.viewMode.set(mode);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters.update((show) => !show);
  }

  viewCandidateDetail(candidate: Candidate): void {
    this.dialog.open(CandidateDetailDialog, {
      data: { id: candidate.id },
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
}
