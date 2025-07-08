import { animate, style, transition, trigger } from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CandidateCard } from "src/app/shared/components/cards/candidate-card/candidate-card.component";
import { Candidate } from "../../../../models/candidate.model";
import type { ViewMode } from "../../candidates.component";

@Component({
  selector: "app-candidate-list",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CandidateCard],
  templateUrl: "./candidate-list.component.html",
  styleUrls: ["./candidate-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "300ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
    ]),
  ],
})
export class CandidateList {
  // Signal-based inputs
  candidates = input.required<Candidate[]>();
  loading = input(false);
  cardLoading = input(false);
  showActions = input(false);
  columns = input<number | "auto">("auto");
  gap = input<"small" | "medium" | "large">("medium");
  viewMode = input<ViewMode>("list");

  // Signal-based outputs
  candidateClick = output<Candidate>();
  actionClick = output<{ candidate: Candidate; action: string }>();
  clearFilters = output<void>();

  // TrackBy function for performance
  trackByCandidate(index: number, candidate: Candidate): number {
    return candidate.id;
  }

  onCandidateClick(candidate: Candidate): void {
    this.candidateClick.emit(candidate);
  }

  onActionClick(event: { candidate: Candidate; action: string }): void {
    this.actionClick.emit(event);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  // Get grid CSS classes
  getGridClasses(): string {
    const classes = ["grid-container"];

    if (this.gap() === "small") classes.push("gap-small");
    if (this.gap() === "large") classes.push("gap-large");

    return classes.join(" ");
  }

  // Get grid style for custom columns
  getGridStyle(): { [key: string]: string } | null {
    if (typeof this.columns() === "number") {
      return {
        "grid-template-columns": `repeat(${this.columns()}, 1fr)`,
      };
    }
    return null;
  }

  // Utility getters
  get hasCandidates(): boolean {
    return this.candidates().length > 0;
  }

  get gridAriaLabel(): string {
    if (this.loading()) return "Loading candidates";
    if (!this.hasCandidates) return "No candidates available";
    return `${this.candidates().length} candidates available`;
  }
}
