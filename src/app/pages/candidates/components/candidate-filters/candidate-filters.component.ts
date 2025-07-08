import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

import { animate, style, transition, trigger } from "@angular/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  cityFilter: string;
  ageFilter: string;
  dateFilter: string;
  sortBy: string;
}

export interface ActiveFilter {
  key: keyof FilterState;
  label: string;
  icon: string;
}

@Component({
  selector: "app-candidate-filters",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonToggleModule,
  ],
  templateUrl: "./candidate-filters.component.html",
  styleUrls: ["./candidate-filters.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slideDown", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate(
          "200ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px)" })
        ),
      ]),
    ]),
  ],
})
export class CandidateFilters {
  // Signal-based inputs
  filters = input.required<FilterState>();
  viewMode = input.required<"grid" | "table">();
  resultCount = input.required<number>();
  totalCount = input.required<number>();
  loading = input(false);
  showAdvancedFilters = model(true);

  // Signal-based outputs
  searchChange = output<string>();
  statusFilterChange = output<string>();
  cityFilterChange = output<string>();
  ageFilterChange = output<string>();
  dateFilterChange = output<string>();
  sortChange = output<string>();
  clearFilters = output<void>();
  toggleView = output<"grid" | "table">();
  exportFiltered = output<void>();
  removeFilter = output<keyof FilterState>();

  // Computed active filters
  activeFilters = computed(() => {
    const filters = this.filters();
    const active: ActiveFilter[] = [];

    if (filters.searchTerm) {
      active.push({
        key: "searchTerm",
        label: `Search: "${filters.searchTerm}"`,
        icon: "search",
      });
    }

    if (filters.cityFilter !== "all") {
      active.push({
        key: "cityFilter",
        label: `City: ${this.getCityLabel(filters.cityFilter)}`,
        icon: "place",
      });
    }

    if (filters.ageFilter !== "all") {
      active.push({
        key: "ageFilter",
        label: `Age: ${filters.ageFilter}`,
        icon: "cake",
      });
    }

    if (filters.dateFilter !== "all") {
      active.push({
        key: "dateFilter",
        label: `Date: ${this.getDateLabel(filters.dateFilter)}`,
        icon: "schedule",
      });
    }

    if (filters.sortBy !== "name") {
      active.push({
        key: "sortBy",
        label: `Sort: ${this.getSortLabel(filters.sortBy)}`,
        icon: "sort",
      });
    }

    return active;
  });

  // Computed has active filters
  hasActiveFilters = computed((): boolean => {
    const filters = this.filters();
    return (
      filters.searchTerm !== "" ||
      filters.statusFilter !== "all" ||
      filters.cityFilter !== "all" ||
      filters.ageFilter !== "all" ||
      filters.dateFilter !== "all" ||
      filters.sortBy !== "name"
    );
  });

  onSearchChange(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const value = eventTarget.value.trim();
    this.searchChange.emit(value);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilterChange.emit(value);
  }

  onCityFilterChange(value: string): void {
    this.cityFilterChange.emit(value);
  }

  onAgeFilterChange(value: string): void {
    this.ageFilterChange.emit(value);
  }

  onDateFilterChange(value: string): void {
    this.dateFilterChange.emit(value);
  }

  onSortChange(value: string): void {
    this.sortChange.emit(value);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  onToggleView(mode: "grid" | "table"): void {
    this.toggleView.emit(mode);
  }

  onExportFiltered(): void {
    this.exportFiltered.emit();
  }

  onRemoveFilter(key: keyof FilterState): void {
    this.removeFilter.emit(key);
  }

  toggleAdvancedFilters(): void {
    // This would need to be handled by parent component
    // since showAdvancedFilters is now an input signal
    this.showAdvancedFilters.update((show) => !show);
  }

  // Helper methods for labels

  private getCityLabel(city: string): string {
    const labels: { [key: string]: string } = {
      "tel-aviv": "Tel Aviv",
      jerusalem: "Jerusalem",
      haifa: "Haifa",
      "beer-sheva": "Beer Sheva",
      eilat: "Eilat",
      netanya: "Netanya",
    };
    return labels[city] || city;
  }

  private getDateLabel(date: string): string {
    const labels: { [key: string]: string } = {
      "last-week": "Last Week",
      "last-month": "Last Month",
      "last-3-months": "Last 3 Months",
      older: "Older than 3 months",
    };
    return labels[date] || date;
  }

  private getSortLabel(sort: string): string {
    const labels: { [key: string]: string } = {
      name: "Name (A-Z)",
      "name-desc": "Name (Z-A)",
      date: "Date (Newest)",
      "date-desc": "Date (Oldest)",
      age: "Age (Youngest)",
      "age-desc": "Age (Oldest)",
    };
    return labels[sort] || sort;
  }

  // TrackBy function for performance
  trackByFilter(index: number, filter: ActiveFilter): string {
    return `${filter.key}-${filter.label}`;
  }
}
