import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Login } from "./pages/login/login";
import { AuthService } from "./services/auth";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    Login,
  ],

  template: `
    @if (auth.loading()) {
      <div class="min-h-screen flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
        ></div>
      </div>
    } @else {
      @if (auth.user()) {
        <div class="min-h-screen flex flex-col md:flex-row bg-slate-50">
          <!-- Sidebar -->
          <aside class="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
            <div class="p-6 flex items-center gap-3">
              <mat-icon class="text-emerald-600">inventory_2</mat-icon>
              <span class="text-xl font-bold text-slate-900 tracking-tight">EstoquePro</span>
            </div>

            <nav class="flex-1 px-4 space-y-1">
              <a
                routerLink="/"
                routerLinkActive="bg-emerald-50 text-emerald-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <mat-icon>dashboard</mat-icon>
                <span class="font-medium">Dashboard</span>
              </a>
              <a
                routerLink="/products"
                routerLinkActive="bg-emerald-50 text-emerald-700"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <mat-icon>inventory</mat-icon>
                <span class="font-medium">Produtos</span>
              </a>
              <a
                routerLink="/movements"
                routerLinkActive="bg-emerald-50 text-emerald-700"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <mat-icon>swap_horiz</mat-icon>
                <span class="font-medium">Movimentações</span>
              </a>
            </nav>

            <div class="p-4 border-t border-slate-100">
              <div class="flex items-center gap-3 px-4 py-3">
                <img
                  [src]="auth.user()?.photoURL"
                  alt="User profile"
                  class="w-10 h-10 rounded-full border border-slate-200"
                  referrerpolicy="no-referrer"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 truncate">
                    {{ auth.user()?.displayName }}
                  </p>
                  <p class="text-xs text-slate-500 truncate">{{ auth.user()?.email }}</p>
                </div>
                <button
                  mat-icon-button
                  (click)="auth.logout()"
                  class="text-slate-400 hover:text-red-500"
                >
                  <mat-icon>logout</mat-icon>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Content -->
          <main class="flex-1 overflow-auto">
            <div class="max-w-7xl mx-auto p-6 md:p-10">
              <router-outlet></router-outlet>
            </div>
          </main>
        </div>
      } @else {
        <app-login></app-login>
      }
    }
  `,
  styles: [],
})
export class App {
  auth = inject(AuthService);
}
