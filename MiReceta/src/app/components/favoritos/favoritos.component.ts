import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <span class="text-red-500 mr-3"><i class="fas fa-heart"></i></span>
        Mis Recetas Favoritas
      </h1>

      <!-- Favorite Recipes Grid -->
      <div *ngIf="favoriteRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let recipe of favoriteRecipes"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
        >
          <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
            <img
              *ngIf="recipe.imagen"
              [src]="recipe.imagen"
              [alt]="recipe.nombre"
              class="w-full h-full object-cover"
            >
            <div *ngIf="!recipe.imagen" class="text-white text-4xl">
              <i class="fas fa-utensils"></i>
            </div>
            
            <!-- Favorite Badge -->
            <div class="absolute top-3 right-3">
              <span class="bg-red-500 text-white rounded-full p-2 text-lg"><i class="fas fa-heart"></i></span>
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
                (click)="removeFavorite(recipe.id)"
                class="text-red-500 hover:text-red-600 transition duration-200 flex items-center space-x-1"
              >
                <span><i class="fas fa-heart-broken"></i></span>
                <span>Quitar</span>
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

      <!-- Empty State -->
      <div *ngIf="favoriteRecipes.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4 text-gray-400">
          <i class="fas fa-heart-broken"></i>
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-4">No tienes recetas favoritas</h3>
        <p class="text-gray-500 mb-8">Explora nuestras recetas y marca las que más te gusten</p>
        
        <div class="space-y-4">
          <a
            routerLink="/buscar"
            class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Buscar Recetas
          </a>
          
          <div>
            <a
              routerLink="/crear"
              class="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Crear Mi Primera Receta
            </a>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div *ngIf="favoriteRecipes.length > 0" class="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Estadísticas de Favoritos</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">{{ favoriteRecipes.length }}</div>
            <div class="text-gray-600">Recetas Favoritas</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ getAverageTime() }}</div>
            <div class="text-gray-600">Tiempo Promedio (min)</div>
          </div>
          
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">{{ getMostCommonDifficulty() }}</div>
            <div class="text-gray-600">Dificultad Preferida</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div *ngIf="favoriteRecipes.length > 0" class="mt-8 text-center">
        <div class="space-x-4">
          <a
            routerLink="/buscar"
            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Buscar Más Recetas
          </a>
          
          <a
            routerLink="/crear"
            class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Crear Nueva Receta
          </a>
        </div>
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
export class FavoritosComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadFavoriteRecipes();
    
    // Subscribe to favorites changes
    this.recipeService.favorites$.subscribe(() => {
      this.loadFavoriteRecipes();
    });
  }

  private loadFavoriteRecipes() {
    this.favoriteRecipes = this.recipeService.getFavoriteRecipes();
  }

  removeFavorite(recipeId: string) {
    if (confirm('¿Quieres quitar esta receta de favoritos?')) {
      this.recipeService.removeFavorite(recipeId);
    }
  }

  getAverageTime(): number {
    if (this.favoriteRecipes.length === 0) return 0;
    
    const total = this.favoriteRecipes.reduce((sum, recipe) => sum + recipe.tiempoPreparacion, 0);
    return Math.round(total / this.favoriteRecipes.length);
  }

  getMostCommonDifficulty(): string {
    if (this.favoriteRecipes.length === 0) return 'N/A';
    
    const difficulties = this.favoriteRecipes.map(recipe => recipe.dificultad);
    const counts = difficulties.reduce((acc: any, difficulty) => {
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return mostCommon;
  }
}