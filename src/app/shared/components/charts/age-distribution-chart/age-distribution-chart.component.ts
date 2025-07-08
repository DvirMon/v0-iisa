import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";

import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { ChartData } from "src/app/models/candidate.model";

@Component({
  selector: "app-age-distribution-chart",
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: "./age-distribution-chart.component.html",
  styleUrls: ["./age-distribution-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeDistributionChartComponent {
  // Signal-based inputs
  data = input.required<ChartData[]>();
  colorScheme = input<Color>({
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2196F3", "#4CAF50", "#FF9800", "#F44336", "#9C27B0", "#00BCD4"],
  });

  // Signal-based outputs
  select = output<any>();
  activate = output<any>();
  deactivate = output<any>();

  onSelect(event: any): void {
    this.select.emit(event);
  }

  onActivate(event: any): void {
    this.activate.emit(event);
  }

  onDeactivate(event: any): void {
    this.deactivate.emit(event);
  }
}
