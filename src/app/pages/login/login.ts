import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../services/auth";

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <mat-card class="max-w-md w-full p-8 text-center shadow-xl rounded-2xl">
        <div class="mb-6">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="scale-150">inventory_2</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">EstoquePro</h1>
          <p class="text-slate-500 mt-2">Controle seu estoque de forma profissional e simples.</p>
        </div>
        
        <button mat-flat-button color="primary" class="w-full py-6 rounded-xl text-lg font-medium" (click)="auth.login()">
          <mat-icon class="mr-2">login</mat-icon>
          Entrar com Google
        </button>
        
        <p class="mt-6 text-xs text-slate-400">
          Ao entrar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </mat-card>
    </div>
  `
})
export class Login {
  auth = inject(AuthService);
}
