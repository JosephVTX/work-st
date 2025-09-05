import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/recipe.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <a routerLink="/buscar" class="flex items-center space-x-2">
            <span class="text-3xl text-blue-600"><i class="fas fa-utensils"></i></span>
            <span class="text-2xl font-bold text-blue-600">MiReceta</span>
          </a>

          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-6" *ngIf="currentUser">
            <a 
              routerLink="/buscar" 
              routerLinkActive="text-blue-600"
              class="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center space-x-1"
            >
              <span><i class="fas fa-search"></i></span>
              <span>Buscar</span>
            </a>
            <a 
              routerLink="/crear" 
              routerLinkActive="text-blue-600"
              class="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center space-x-1"
            >
              <span><i class="fas fa-plus"></i></span>
              <span>Crear</span>
            </a>
            <a 
              routerLink="/favoritos" 
              routerLinkActive="text-blue-600"
              class="text-gray-700 hover:text-blue-600 transition duration-200 flex items-center space-x-1"
            >
              <span><i class="fas fa-heart"></i></span>
              <span>Favoritos</span>
            </a>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser" class="hidden md:flex items-center space-x-2">
              <span class="text-gray-600">Hola, {{ currentUser.username }}!</span>
              <button
                (click)="logout()"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Salir
              </button>
            </div>

            <!-- Mobile Menu Button -->
            <button
              *ngIf="currentUser"
              (click)="toggleMobileMenu()"
              class="md:hidden text-gray-700 hover:text-blue-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="showMobileMenu && currentUser" class="md:hidden border-t border-gray-200 py-4">
          <div class="space-y-3">
            <a 
              routerLink="/buscar" 
              (click)="closeMobileMenu()"
              class="block text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <i class="fas fa-search"></i> Buscar Recetas
            </a>
            <a 
              routerLink="/crear" 
              (click)="closeMobileMenu()"
              class="block text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <i class="fas fa-plus"></i> Crear Receta
            </a>
            <a 
              routerLink="/favoritos" 
              (click)="closeMobileMenu()"
              class="block text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <i class="fas fa-heart"></i> Favoritos
            </a>
            <div class="border-t border-gray-200 pt-3">
              <p class="text-gray-600 mb-2">{{ currentUser.username }}</p>
              <button
                (click)="logout()"
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showMobileMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }
}