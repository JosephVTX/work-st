import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8" *ngIf="recipe">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <button
          (click)="goBack()"
          class="flex items-center text-purple-600 hover:text-purple-700 transition duration-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>Volver
        </button>
        
        <button
          (click)="toggleFavorite()"
          [class]="isFavorite() ? 'text-red-500' : 'text-gray-400'"
          class="flex items-center space-x-2 hover:text-red-600 transition duration-200"
        >
          <span class="text-2xl"><i class="fas fa-heart"></i></span>
          <span>{{ isFavorite() ? 'Quitar de Favoritos' : 'Agregar a Favoritos' }}</span>
        </button>
      </div>

      <!-- Recipe Header -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div class="h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
          <img
            *ngIf="recipe.imagen"
            [src]="recipe.imagen"
            [alt]="recipe.nombre"
            class="w-full h-full object-cover"
          >
          <div *ngIf="!recipe.imagen" class="text-white text-8xl">
            <i class="fas fa-utensils"></i>
          </div>
          
          <!-- Overlay with recipe info -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 class="text-4xl font-bold text-white mb-2">{{ recipe.nombre }}</h1>
            <p class="text-gray-200 text-lg">{{ recipe.descripcion }}</p>
          </div>
        </div>
      </div>

      <!-- Recipe Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-2 text-purple-600">
            <i class="fas fa-clock"></i>
          </div>
          <h3 class="font-semibold text-gray-800">Tiempo</h3>
          <p class="text-purple-600 font-bold">{{ recipe.tiempoPreparacion }} minutos</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-2 text-purple-600">
            <i class="fas fa-chart-bar"></i>
          </div>
          <h3 class="font-semibold text-gray-800">Dificultad</h3>
          <p class="text-purple-600 font-bold">{{ recipe.dificultad }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-3xl mb-2 text-purple-600">
            <i class="fas fa-calendar"></i>
          </div>
          <h3 class="font-semibold text-gray-800">Creada</h3>
          <p class="text-purple-600 font-bold">{{ formatDate(recipe.fechaCreacion) }}</p>
        </div>
      </div>

      <!-- Ingredients and Instructions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Ingredients -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-2 text-green-600"><i class="fas fa-leaf"></i></span>
            Ingredientes
          </h2>
          <ul class="space-y-2">
            <li
              *ngFor="let ingrediente of recipe.ingredientes"
              class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
            >
              <span class="text-green-500"><i class="fas fa-check"></i></span>
              <span>{{ ingrediente }}</span>
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="text-3xl mr-2 text-blue-600"><i class="fas fa-utensils"></i></span>
            Instrucciones
          </h2>
          <ol class="space-y-3">
            <li
              *ngFor="let instruccion of recipe.instrucciones; let i = index"
              class="flex space-x-3 p-3 hover:bg-gray-50 rounded"
            >
              <span class="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {{ i + 1 }}
              </span>
              <span class="flex-1">{{ instruccion }}</span>
            </li>
          </ol>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-center space-x-4">
        <button
          (click)="editRecipe()"
          class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center space-x-2"
        >
          <span><i class="fas fa-edit"></i></span>
          <span>Editar Receta</span>
        </button>
        
        <button
          (click)="deleteRecipe()"
          class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
        >
          <span><i class="fas fa-trash"></i></span>
          <span>Eliminar Receta</span>
        </button>
      </div>
    </div>

    <!-- Recipe not found -->
    <div *ngIf="!recipe" class="container mx-auto px-4 py-8 text-center">
      <div class="text-6xl mb-4 text-gray-400">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Receta no encontrada</h2>
      <p class="text-gray-600 mb-8">La receta que buscas no existe o ha sido eliminada.</p>
      <a
        routerLink="/buscar"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200"
      >
        Volver a Buscar
      </a>
    </div>
  `
})
export class DetalleRecetaComponent implements OnInit {
  recipe: Recipe | undefined;
  favoriteIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.recipe = this.recipeService.getRecipeById(recipeId);
    }

    this.recipeService.favorites$.subscribe(favorites => {
      this.favoriteIds = favorites;
    });
  }

  goBack() {
    this.router.navigate(['/buscar']);
  }

  toggleFavorite() {
    if (!this.recipe) return;
    
    if (this.isFavorite()) {
      this.recipeService.removeFavorite(this.recipe.id);
    } else {
      this.recipeService.addFavorite(this.recipe.id);
    }
  }

  isFavorite(): boolean {
    return this.recipe ? this.favoriteIds.includes(this.recipe.id) : false;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  editRecipe() {
    if (this.recipe) {
      this.router.navigate(['/crear', this.recipe.id]);
    }
  }

  deleteRecipe() {
    if (!this.recipe) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      this.recipeService.deleteRecipe(this.recipe.id);
      this.router.navigate(['/buscar']);
    }
  }
}