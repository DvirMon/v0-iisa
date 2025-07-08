import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { trigger, transition, style, animate } from "@angular/animations"
import { StatCardComponent, StatCardData } from "src/app/shared/components/cards/stat-card/stat-card.component"

@Component({
  selector: "app-stats-grid",
  standalone: true,
  imports: [CommonModule, MatIconModule, StatCardComponent],
  templateUrl: "./stats-grid.component.html",
  styleUrls: ["./stats-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
})
export class StatsGridComponent {
  @Input({ required: true }) statCards: StatCardData[] = []
  @Input() loading = false
  @Input() columns: number | "auto" = "auto"
  @Input() gap: "small" | "medium" | "large" = "medium"

  @Output() cardClick = new EventEmitter<StatCardData>()
  @Output() cardHover = new EventEmitter<StatCardData>()

  // TrackBy function for performance optimization
  trackByStatCard(index: number, card: StatCardData): string {
    return `${card.title}-${card.value}`
  }

  // Handle card interactions
  onCardClick(card: StatCardData): void {
    this.cardClick.emit(card)
  }

  onCardHover(card: StatCardData): void {
    this.cardHover.emit(card)
  }

  // Get grid CSS classes based on inputs
  getGridClasses(): string {
    const classes = ["stats-container"]

    if (this.gap === "small") classes.push("gap-small")
    if (this.gap === "large") classes.push("gap-large")

    if (typeof this.columns === "number") {
      classes.push(`columns-${this.columns}`)
    }

    return classes.join(" ")
  }

  // Get grid style for custom columns
  getGridStyle(): { [key: string]: string } | null {
    if (typeof this.columns === "number") {
      return {
        "grid-template-columns": `repeat(${this.columns}, 1fr)`,
      }
    }
    return null
  }

  // Utility method to check if stats are available
  get hasStats(): boolean {
    return this.statCards.length > 0
  }

  // Get stats summary for accessibility
  get statsAriaLabel(): string {
    if (this.loading) return "Loading statistics"
    if (!this.hasStats) return "No statistics available"
    return `${this.statCards.length} statistics available`
  }
}
