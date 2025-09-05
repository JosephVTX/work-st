import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { User } from './models/recipe.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Pantalla de carga inicial -->
      <div *ngIf="!isAuthInitialized" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div class="text-center text-white">
          <div class="text-8xl mb-4 animate-bounce">
            <i class="fas fa-utensils"></i>
          </div>
          <h1 class="text-4xl font-bold mb-2">MiReceta</h1>
          <p class="text-xl opacity-80">Cargando...</p>
          <div class="mt-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
      
      <!-- Contenido principal una vez inicializado -->
      <div *ngIf="isAuthInitialized">
        <app-navbar *ngIf="currentUser"></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MiReceta';
  currentUser: User | null = null;
  isAuthInitialized = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Primero verificar si el servicio de auth está inicializado
    this.authService.isInitialized$.subscribe(initialized => {
      this.isAuthInitialized = initialized;
    });

    // Luego escuchar cambios de usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      // Solo redirigir si la autenticación está inicializada
      if (this.isAuthInitialized) {
        if (user && this.router.url === '/login') {
          this.router.navigate(['/buscar']);
        } else if (!user && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
