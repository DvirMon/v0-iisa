import { Component, inject } from "@angular/core";

import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent {
  private router = inject(Router);


  goHome(): void {
    this.router.navigate(["/"]);
  }

  goBack(): void {
    window.history.back();
  }
}
