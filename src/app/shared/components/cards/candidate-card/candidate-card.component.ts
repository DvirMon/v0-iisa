import { NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import type { Candidate } from "../../../../models/candidate.model";

@Component({
  selector: "app-candidate-card",
  standalone: true,
  imports: [NgOptimizedImage, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: "./candidate-card.component.html",
  styleUrls: ["./candidate-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateCard {
  // Signal-based inputs
  candidate = input.required<Candidate>();
  loading = input(false);
  showActions = input(false);

  // Signal-based outputs
  cardClick = output<Candidate>();
  actionClick = output<{ candidate: Candidate; action: string }>();

  onCardClick(): void {
    if (!this.loading()) {
      this.cardClick.emit(this.candidate());
    }
  }

  onActionClick(action: string, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ candidate: this.candidate(), action });
  }


}
