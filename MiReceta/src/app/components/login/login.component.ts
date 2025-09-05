import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4 text-blue-600">
            <i class="fas fa-utensils"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-800">MiReceta</h1>
          <p class="text-gray-600 mt-2">Tu catálogo virtual de recetas</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario *
            </label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              required
              minlength="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu nombre de usuario"
              #usernameField="ngModel"
            >
            <div *ngIf="usernameField.invalid && usernameField.touched" class="text-red-500 text-sm mt-1">
              <div *ngIf="usernameField.errors?.['required']">El nombre de usuario es requerido</div>
              <div *ngIf="usernameField.errors?.['minlength']">Debe tener al menos 3 caracteres</div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              email
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ejemplo@correo.com"
              #emailField="ngModel"
            >
            <div *ngIf="emailField.invalid && emailField.touched" class="text-red-500 text-sm mt-1">
              <div *ngIf="emailField.errors?.['required']">El correo electrónico es requerido</div>
              <div *ngIf="emailField.errors?.['email']">Ingresa un correo electrónico válido</div>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isLoading">Ingresar</span>
            <span *ngIf="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ingresando...
            </span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Esta es una demostración. Solo necesitas un nombre de usuario y email válido.
          </p>
        </div>

        <div class="mt-6 text-center">
          <div class="text-sm text-gray-500">
            <p class="mb-2"><i class="fas fa-lock"></i> Demo de autenticación básica</p>
            <p><i class="fas fa-mobile-alt"></i> Diseño móvil responsive</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .bg-white {
      animation: fadeIn 0.5s ease-out;
    }
  `]
})
export class LoginComponent {
  username = '';
  email = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (this.username && this.email) {
      this.isLoading = true;
      
      // Simulate API call delay
      setTimeout(() => {
        this.authService.login(this.username, this.email).subscribe({
          next: (user) => {
            this.isLoading = false;
            this.router.navigate(['/buscar']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Login error:', error);
          }
        });
      }, 1000);
    }
  }
}