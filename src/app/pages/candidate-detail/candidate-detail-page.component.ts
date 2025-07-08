import {
  Component,
  computed,
  inject,
  linkedSignal
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-candidate-detail-page",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: "./candidate-detail-page.component.html",
  styleUrls: ["./candidate-detail-page.component.scss"],
})
export class CandidateDetailDialog {
  private readonly data = inject<{
    id: number;
  }>(MAT_DIALOG_DATA);

  private readonly dashboardService = inject(DashboardService);

  candidatesList = this.dashboardService.candidates;
  currentIndex = linkedSignal(() =>
    this.candidatesList().findIndex((c) => c.id === this.data.id)
  );

  candidateSignal = computed(() => {
    const candidates = this.candidatesList();
    const idx = this.currentIndex();
    return candidates[idx] ?? null;
  });

  // Computed signal for days since application
  daysSinceApplication = computed(() => {
    const candidate = this.candidateSignal();
    if (!candidate) return 0;
    const date = new Date(candidate.applicationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  goToNextCandidate(): void {
    const idx = this.currentIndex();
    if (idx < this.candidatesList().length - 1) {
      this.currentIndex.set(idx + 1);
    }
  }

  goToPreviousCandidate(): void {
    const idx = this.currentIndex();
    if (idx > 0) {
      this.currentIndex.set(idx - 1);
    }
  }

}
