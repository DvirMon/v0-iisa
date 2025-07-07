import { Component, signal, computed } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogModule, type MatDialogRef } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatCardModule } from "@angular/material/card"
import type { Candidate } from "../../models/candidate.model"

@Component({
  selector: "app-candidate-detail",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  templateUrl: "./candidate-detail.component.html",
  styleUrls: ["./candidate-detail.component.scss"],
})
export class CandidateDetailComponent {
  // Signal for the candidate data
  candidateSignal = signal<Candidate>({
    id: 0,
    name: "",
    email: "",
    age: 0,
    city: "",
    image: "",
    hobbies: "",
    summary: "",
    status: "Pending",
    applicationDate: "",
  })

  // Computed signal for candidate display name
  displayName = computed(() => {
    const candidate = this.candidateSignal()
    return `${candidate.name} (${candidate.age})`
  })

  // Computed signal for days since application
  daysSinceApplication = computed(() => {
    const candidate = this.candidateSignal()
    const date = new Date(candidate.applicationDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  dialogRef: MatDialogRef<CandidateDetailComponent>
  data: { candidate: Candidate }

  constructor(dialogRef: MatDialogRef<CandidateDetailComponent>, data: { candidate: Candidate }) {
    this.dialogRef = dialogRef
    this.data = data
    this.candidateSignal.set(this.data.candidate)
  }

  onClose(): void {
    this.dialogRef.close()
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

  // Method to update candidate data (demonstrates signal updates)
  updateCandidateStatus(newStatus: Candidate["status"]): void {
    this.candidateSignal.update((candidate) => ({
      ...candidate,
      status: newStatus,
    }))
  }
}
