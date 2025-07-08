
import { Component, signal } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";

// Import page components
import { CandidatesComponent } from "./pages/candidates/candidates.component";
import { OverviewComponent } from "./pages/overview/overview.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    OverviewComponent,
    CandidatesComponent
],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "iisa-dashboard";
}
