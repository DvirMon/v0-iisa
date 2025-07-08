import { animate, style, transition, trigger } from "@angular/animations";

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import {
  StatCardComponent,
  StatCardData,
} from "src/app/shared/components/cards/stat-card/stat-card.component";

@Component({
  selector: "app-stats-grid",
  imports: [MatIconModule, StatCardComponent],
  templateUrl: "./stats-grid.component.html",
  styleUrls: ["./stats-grid.component.scss"],
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
export class StatsGridComponent {
  // Signal-based inputs
  statCards = input.required<StatCardData[]>();
  loading = computed(() => this.statCards().length === 0);
  columns = input<number | "auto">("auto");
  gap = input<"small" | "medium" | "large">("medium");

  // Signal-based outputs
  cardClick = output<StatCardData>();
  cardHover = output<StatCardData>();

  // TrackBy function for performance optimization
  trackByStatCard(index: number, card: StatCardData): string {
    return `${card.title}-${card.value}`;
  }

  // Handle card interactions
  onCardClick(card: StatCardData): void {
    this.cardClick.emit(card);
  }

  onCardHover(card: StatCardData): void {
    this.cardHover.emit(card);
  }
}
