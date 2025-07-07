import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, RouterModule } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <!-- Header -->
    <mat-toolbar color="primary" class="app-header">
      <div class="header-content">
        <div class="header-left">
          <mat-icon class="header-icon">rocket_launch</mat-icon>
          <div class="header-text">
            <h1 routerLink="/" class="app-title">IISA Dashboard</h1>
            <span class="subtitle">Israeli Imaginary Space Agency</span>
          </div>
        </div>
        <div class="header-right">
          <mat-chip-set>
            <mat-chip color="primary" selected>
              <mat-icon matChipAvatar>public</mat-icon>
              Mission Control
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>
    </mat-toolbar>

    <!-- Navigation -->
    <nav class="main-nav">
      <div class="nav-content">
        <button mat-button routerLink="/overview" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          Overview
        </button>
        <button mat-button routerLink="/candidates" routerLinkActive="active">
          <mat-icon>people</mat-icon>
          Candidates
        </button>
        <button mat-button routerLink="/analytics" routerLinkActive="active">
          <mat-icon>analytics</mat-icon>
          Analytics
        </button>
        <button mat-button routerLink="/settings" routerLinkActive="active">
          <mat-icon>settings</mat-icon>
          Settings
        </button>
      </div>
    </nav>

    <!-- Router Outlet -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "iisa-dashboard"
}
