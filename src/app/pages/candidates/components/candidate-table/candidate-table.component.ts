import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { signal } from "@angular/core";

import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import type { Candidate } from "../../../../models/candidate.model";
import type { ViewMode } from "../../candidates.component";
import { DaysAgoPipe } from "../../../../shared/pipes/days-ago.pipe";

@Component({
  selector: "app-candidate-table",
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    NgOptimizedImage,
    DaysAgoPipe,
  ],
  templateUrl: "./candidate-table.component.html",
  styleUrls: ["./candidate-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class CandidateTable {
  candidates = input.required<Candidate[]>();
  loading = input(false);
  showExpandedDetails = input(true);
  stickyHeader = input(true);
  viewMode = input<ViewMode>("table");
  candidateView = output<Candidate>();
  candidateEdit = output<Candidate>();
  rowClick = output<Candidate>();
  clearFilters = output<void>();

  displayedColumns: string[] = [
    "candidate",
    "contact",
    "location",
    "applied",
    "actions",
  ];
  expandedCandidate = signal<Candidate | null>(null);

  onViewClick(candidate: Candidate): void {
    this.candidateView.emit(candidate);
  }

  onEditClick(candidate: Candidate): void {
    this.candidateEdit.emit(candidate);
  }

  onRowClick(candidate: Candidate): void {
    if (this.showExpandedDetails()) {
      this.toggle(candidate);
    }
    this.rowClick.emit(candidate);
  }

  /** Toggles the expanded state of an element. */
  toggle(element: Candidate) {
    this.expandedCandidate.set(this.compare(element) ? null : element);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  // TrackBy function for performance
  trackByCandidate(index: number, candidate: Candidate): number {
    return candidate.id;
  }

  /** Checks whether an element is expanded. */
  compare(element: Candidate) {
    const expanded = this.expandedCandidate();
    if (!expanded) return false;
    return expanded.id === element.id;
  }
}
