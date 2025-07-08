import { Component, computed, inject, signal } from "@angular/core";

import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

import { Candidate } from "../../models/candidate.model";
import { DashboardService } from "../../services/dashboard.service";
import {
  matchesAgeFilter,
  matchesCity,
  matchesDateFilter,
  matchesSearch,
} from "./candidates.utils";
import { CandidateDetailDialog } from "./components/candidate-detail/candidate-detail-page.component";
import {
  CandidateFilters,
  FilterState,
} from "./components/candidate-filters/candidate-filters.component";
import { CandidateList } from "./components/candidate-list/candidate-list.component";
import { CandidateTable } from "./components/candidate-table/candidate-table.component";

export type ViewMode = "list" | "table";

@Component({
  selector: "app-candidates",
  imports: [
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CandidateFilters,
    CandidateTable,
    CandidateList,
  ],
  templateUrl: "./candidates.component.html",
  styleUrls: ["./candidates.component.scss"],
})
export class CandidatesComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly dialog = inject(MatDialog);

  // Filter signals
  private readonly searchTerm = signal("");
  private readonly statusFilter = signal("all");
  private readonly cityFilter = signal("all");
  private readonly ageFilter = signal("all");
  private readonly dateFilter = signal("all");
  private readonly sortBy = signal("name");

  // View mode and loading signals
  readonly viewMode = signal<ViewMode>("list");
  readonly loading = signal(false);
  readonly filtersLoading = signal(false);
  readonly showAdvancedFilters = signal(false);

  readonly totalCandidates = this.dashboardService.totalCandidates;

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
  readonly filteredCandidates = computed(() => {
    const candidates = this.dashboardService.candidates();
    const filters = {
      search: this.searchTerm().toLowerCase(),
      status: this.statusFilter(),
      city: this.cityFilter(),
      age: this.ageFilter(),
      date: this.dateFilter(),
    };

    return candidates.filter((candidate) => {
      const conditions = [
        matchesSearch(candidate, filters.search),
        matchesCity(candidate, filters.city),
        matchesAgeFilter(candidate.age, filters.age),
        matchesDateFilter(candidate.applicationDate, filters.date),
      ];

      return conditions.every(Boolean);
    });
  });

  private readonly filterResetMap: Record<keyof FilterState, () => void> = {
    searchTerm: () => this.searchTerm.set(""),
    statusFilter: () => this.statusFilter.set("all"),
    cityFilter: () => this.cityFilter.set("all"),
    ageFilter: () => this.ageFilter.set("all"),
    dateFilter: () => this.dateFilter.set("all"),
    sortBy: () => this.sortBy.set("name"),
  };

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

  toggleViewMode(mode: ViewMode): void {
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
