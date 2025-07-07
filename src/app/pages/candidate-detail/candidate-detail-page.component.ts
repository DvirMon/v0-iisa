import { Component, signal, computed, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { ActivatedRoute, Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import type { DashboardService } from "../../services/dashboard.service"
import type { Candidate } from "../../models/candidate.model"

@Component({
  selector: "app-candidate-detail-page",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: "./candidate-detail-page.component.html",
  styleUrls: ["./candidate-detail-page.component.scss"],
})
export class CandidateDetailPageComponent implements OnInit {
  candidateSignal = signal<Candidate | null>(null)

  // Computed signal for days since application
  daysSinceApplication = computed(() => {
    const candidate = this.candidateSignal()
    if (!candidate) return 0
    const date = new Date(candidate.applicationDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    const candidateId = Number(this.route.snapshot.paramMap.get("id"))
    const candidate = this.dashboardService.candidates().find((c) => c.id === candidateId)

    if (candidate) {
      this.candidateSignal.set(candidate)
    } else {
      // Redirect to candidates page if candidate not found
      this.router.navigate(["/candidates"])
    }
  }

  goBack(): void {
    this.router.navigate(["/candidates"])
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "Approved":
        return "primary"
      case "Rejected":
        return "warn"
      case "Under Review":
        return "accent"
      default:
        return ""
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "Approved":
        return "check_circle"
      case "Rejected":
        return "cancel"
      case "Under Review":
        return "schedule"
      case "Pending":
        return "hourglass_empty"
      default:
        return "help"
    }
  }

  updateCandidateStatus(newStatus: Candidate["status"]): void {
    const candidate = this.candidateSignal()
    if (candidate) {
      this.dashboardService.updateCandidateStatus(candidate.id, newStatus)
      this.candidateSignal.update((c) => (c ? { ...c, status: newStatus } : null))
    }
  }
}
