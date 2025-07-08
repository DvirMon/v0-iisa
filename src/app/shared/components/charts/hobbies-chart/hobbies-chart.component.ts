import { Component, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { ChartData } from "src/app/models/candidate.model";

@Component({
  selector: "app-hobbies-chart",
  imports: [MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: "./hobbies-chart.component.html",
  styleUrl: "./hobbies-chart.component.scss",
})
export class HobbiesChart {
  data = input<ChartData[]>([]);

  colorScheme = input<Color>({
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  });
}
