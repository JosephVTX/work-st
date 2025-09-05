import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-buscar-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Buscar Recetas</h1>
      
      <!-- Search Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre o ingrediente</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Ej: pollo, arroz, ensalada..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
            <select
              [(ngModel)]="selectedDifficulty"
              (change)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button
              (click)="clearFilters()"
              class="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let recipe of filteredRecipes"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
        >
          <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <img
              *ngIf="recipe.imagen"
              [src]="recipe.imagen"
              [alt]="recipe.nombre"
              class="w-full h-full object-cover"
            >
            <div *ngIf="!recipe.imagen" class="text-white text-4xl">
              <i class="fas fa-utensils"></i>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ recipe.nombre }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ recipe.descripcion }}</p>
            
            <div class="flex justify-between items-center mb-4">
              <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {{ recipe.dificultad }}
              </span>
              <span class="text-gray-500 text-sm">{{ recipe.tiempoPreparacion }} min</span>
            </div>
            
            <div class="flex justify-between items-center">
              <button
                (click)="toggleFavorite(recipe.id)"
                [class]="isFavorite(recipe.id) ? 'text-red-500' : 'text-gray-400'"
                class="hover:text-red-600 transition duration-200"
              >
                <i class="fas fa-heart"></i> {{ isFavorite(recipe.id) ? 'Favorito' : 'Favorito' }}
              </button>
              
              <a
                [routerLink]="['/detalle', recipe.id]"
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
              >
                Ver Receta
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="filteredRecipes.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4 text-gray-400">
          <i class="fas fa-search"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No se encontraron recetas</h3>
        <p class="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class BuscarRecetasComponent implements OnInit {
  searchQuery = '';
  selectedDifficulty = '';
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  favoriteIds: string[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.applyFilters();
    });

    this.recipeService.favorites$.subscribe(favorites => {
      this.favoriteIds = favorites;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedDifficulty = '';
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.recipes];

    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = this.recipeService.searchRecipes(this.searchQuery);
    }

    // Apply difficulty filter
    if (this.selectedDifficulty) {
      filtered = filtered.filter(recipe => recipe.dificultad === this.selectedDifficulty);
    }

    this.filteredRecipes = filtered;
  }

  toggleFavorite(recipeId: string) {
    if (this.isFavorite(recipeId)) {
      this.recipeService.removeFavorite(recipeId);
    } else {
      this.recipeService.addFavorite(recipeId);
    }
  }

  isFavorite(recipeId: string): boolean {
    return this.favoriteIds.includes(recipeId);
  }
}