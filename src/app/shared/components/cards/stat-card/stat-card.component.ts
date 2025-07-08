import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"

export interface StatCardData {
  title: string
  icon: string
  value: string | number
  subtitle: string
  gradient: "blue" | "green" | "purple" | "orange"
}

@Component({
  selector: "app-stat-card",
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: "./stat-card.component.html",
  styleUrls: ["./stat-card.component.scss"],
})
export class StatCardComponent {
  @Input({ required: true }) data!: StatCardData
}
