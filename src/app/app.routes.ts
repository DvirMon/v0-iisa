import type { Routes } from "@angular/router"

// Simplified routes - mainly for deep linking or external access
export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () => import("./app.component").then((m) => m.AppComponent),
    title: "IISA Dashboard",
  },
  // Keep candidate detail route for direct access
  {
    path: "candidates/:id",
    loadComponent: () =>
      import("./pages/candidate-detail/candidate-detail-page.component").then((m) => m.CandidateDetailPageComponent),
    title: "Candidate Details - IISA Dashboard",
  },
  {
    path: "**",
    loadComponent: () => import("./pages/not-found/not-found.component").then((m) => m.NotFoundComponent),
    title: "Page Not Found - IISA Dashboard",
  },
]
