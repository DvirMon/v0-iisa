import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/overview",
    pathMatch: "full",
  },
  {
    path: "overview",
    loadComponent: () => import("./pages/overview/overview.component").then((m) => m.OverviewComponent),
    title: "Overview - IISA Dashboard",
  },
  {
    path: "candidates",
    loadComponent: () => import("./pages/candidates/candidates.component").then((m) => m.CandidatesComponent),
    title: "Candidates - IISA Dashboard",
  },
  {
    path: "candidates/:id",
    loadComponent: () =>
      import("./pages/candidate-detail/candidate-detail-page.component").then((m) => m.CandidateDetailPageComponent),
    title: "Candidate Details - IISA Dashboard",
  },
  {
    path: "analytics",
    loadComponent: () => import("./pages/analytics/analytics.component").then((m) => m.AnalyticsComponent),
    title: "Analytics - IISA Dashboard",
  },
  {
    path: "settings",
    loadComponent: () => import("./pages/settings/settings.component").then((m) => m.SettingsComponent),
    title: "Settings - IISA Dashboard",
  },
  {
    path: "**",
    loadComponent: () => import("./pages/not-found/not-found.component").then((m) => m.NotFoundComponent),
    title: "Page Not Found - IISA Dashboard",
  },
]
