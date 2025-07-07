import { Component, signal, computed } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatTableModule } from "@angular/material/table"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatFormFieldModule } from "@angular/material/form-field"
import type { DashboardService } from "../../services/dashboard.service"
import type { Candidate } from "../../models/candidate.model"

@Component({
  selector: "app-candidates",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
  ],
  templateUrl: "./candidates.component.html",
  styleUrls: ["./candidates.component.scss"],
})
export class CandidatesComponent {
  // Filter signals
  searchTerm = signal("")
  statusFilter = signal("all")
  cityFilter = signal("all")

  // View mode signal
  viewMode = signal<"grid" | "table">("grid")

  // Computed signals for filtered candidates
  filteredCandidates = computed(() => {
    const candidates = this.dashboardService.candidates()
    const search = this.searchTerm().toLowerCase()
    const status = this.statusFilter()
    const city = this.cityFilter()

    return candidates.filter((candidate) => {
      const matchesSearch =
        !search ||
        candidate.name.toLowerCase().includes(search) ||
        candidate.email.toLowerCase().includes(search) ||
        candidate.city.toLowerCase().includes(search)

      const matchesStatus = status === "all" || candidate.status.toLowerCase().replace(" ", "-") === status

      const matchesCity = city === "all" || candidate.city.toLowerCase().replace(" ", "-") === city

      return matchesSearch && matchesStatus && matchesCity
    })
  })

  // Table columns
  displayedColumns: string[] = ["candidate", "contact", "location", "status", "applied", "actions"]

  constructor(
    public dashboardService: DashboardService,
    private router: Router,
  ) {}

  // Filter methods
  onSearchChange(value: string): void {
    this.searchTerm.set(value)
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value)
  }

  onCityFilterChange(value: string): void {
    this.cityFilter.set(value)
  }

  clearFilters(): void {
    this.searchTerm.set("")
    this.statusFilter.set("all")
    this.cityFilter.set("all")
  }

  toggleViewMode(): void {
    this.viewMode.update((mode) => (mode === "grid" ? "table" : "grid"))
  }

  viewCandidateDetail(candidate: Candidate): void {
    this.router.navigate(["/candidates", candidate.id])
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

  getDaysAgo(dateString: string): number {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
