import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
} from "@angular/core";

import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

export interface StatCardData {
  title: string;
  icon: string;
  value: string | number;
  subtitle: string;
  gradient: "blue" | "green" | "purple" | "orange";
}

@Component({
  selector: "app-stat-card",
  imports: [MatCardModule, MatIconModule],
  templateUrl: "./stat-card.component.html",
  styleUrls: ["./stat-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  data = input.required<StatCardData>();
}
