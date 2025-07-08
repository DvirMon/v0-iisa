import { Component, input, ChangeDetectionStrategy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-chart-card",
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: "./chart-card.component.html",
  styleUrls: ["./chart-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent {
  // Signal-based inputs
  title = input.required<string>()
  subtitle = input<string>()
  icon = input<string>()
}
