import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  public recipes$ = this.recipesSubject.asObservable();

  private favoriteRecipeIds: string[] = [];
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadRecipes();
    this.loadFavorites();
    this.initializeSampleData();
  }

  private loadRecipes(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedRecipes = localStorage.getItem('mireceta_recipes');
      if (savedRecipes) {
        this.recipes = JSON.parse(savedRecipes);
        this.recipesSubject.next(this.recipes);
      }
    }
  }

  private loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem('mireceta_favorites');
      if (savedFavorites) {
        this.favoriteRecipeIds = JSON.parse(savedFavorites);
        this.favoritesSubject.next(this.favoriteRecipeIds);
      }
    }
  }

  private saveRecipes(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mireceta_recipes', JSON.stringify(this.recipes));
    }
  }

  private saveFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mireceta_favorites', JSON.stringify(this.favoriteRecipeIds));
    }
  }

  private initializeSampleData(): void {
    if (this.recipes.length === 0) {
      const sampleRecipes: Recipe[] = [
        {
          id: '1',
          nombre: 'Paella Valenciana',
          descripcion: 'Plato tradicional español con arroz, pollo y verduras',
          ingredientes: ['Arroz', 'Pollo', 'Pimientos', 'Tomate', 'Azafrán', 'Aceite de oliva'],
          instrucciones: [
            'Calentar aceite en paellera',
            'Dorar el pollo',
            'Añadir verduras',
            'Incorporar arroz y azafrán',
            'Cocinar 20 minutos'
          ],
          dificultad: 'Intermedio',
          tiempoPreparacion: 45,
          fechaCreacion: new Date()
        },
        {
          id: '2',
          nombre: 'Ensalada César',
          descripcion: 'Ensalada fresca con lechuga, pollo y aderezo césar',
          ingredientes: ['Lechuga romana', 'Pollo a la plancha', 'Parmesano', 'Crutones', 'Aderezo césar'],
          instrucciones: [
            'Lavar y cortar la lechuga',
            'Cocinar el pollo',
            'Mezclar ingredientes',
            'Añadir aderezo'
          ],
          dificultad: 'Fácil',
          tiempoPreparacion: 15,
          fechaCreacion: new Date()
        },
        {
          id: '3',
          nombre: 'Ratatouille',
          descripcion: 'Guiso francés de verduras mediterráneas',
          ingredientes: ['Berenjena', 'Calabacín', 'Pimientos', 'Tomate', 'Cebolla', 'Hierbas provenzales'],
          instrucciones: [
            'Cortar verduras en cubos',
            'Sofreír cebolla',
            'Añadir resto de verduras',
            'Cocinar a fuego lento 30 min'
          ],
          dificultad: 'Difícil',
          tiempoPreparacion: 60,
          fechaCreacion: new Date()
        }
      ];
      
      this.recipes = sampleRecipes;
      this.saveRecipes();
      this.recipesSubject.next(this.recipes);
    }
  }

  getAllRecipes(): Observable<Recipe[]> {
    return this.recipes$;
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipes.find(recipe => recipe.id === id);
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'fechaCreacion'>): Recipe {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      fechaCreacion: new Date()
    };
    
    this.recipes.push(newRecipe);
    this.saveRecipes();
    this.recipesSubject.next(this.recipes);
    
    return newRecipe;
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): boolean {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recipes[index] = { ...this.recipes[index], ...recipe };
      this.saveRecipes();
      this.recipesSubject.next(this.recipes);
      return true;
    }
    return false;
  }

  deleteRecipe(id: string): boolean {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recipes.splice(index, 1);
      this.saveRecipes();
      this.recipesSubject.next(this.recipes);
      
      // Remove from favorites if exists
      this.removeFavorite(id);
      return true;
    }
    return false;
  }

  searchRecipes(query: string): Recipe[] {
    if (!query.trim()) {
      return this.recipes;
    }
    
    const searchTerm = query.toLowerCase();
    return this.recipes.filter(recipe => 
      recipe.nombre.toLowerCase().includes(searchTerm) ||
      recipe.descripcion.toLowerCase().includes(searchTerm) ||
      recipe.ingredientes.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  }

  filterRecipesByDifficulty(difficulty: string): Recipe[] {
    if (!difficulty || difficulty === 'Todas') {
      return this.recipes;
    }
    return this.recipes.filter(recipe => recipe.dificultad === difficulty);
  }

  addFavorite(recipeId: string): void {
    if (!this.favoriteRecipeIds.includes(recipeId)) {
      this.favoriteRecipeIds.push(recipeId);
      this.saveFavorites();
      this.favoritesSubject.next(this.favoriteRecipeIds);
    }
  }

  removeFavorite(recipeId: string): void {
    const index = this.favoriteRecipeIds.indexOf(recipeId);
    if (index !== -1) {
      this.favoriteRecipeIds.splice(index, 1);
      this.saveFavorites();
      this.favoritesSubject.next(this.favoriteRecipeIds);
    }
  }

  isFavorite(recipeId: string): boolean {
    return this.favoriteRecipeIds.includes(recipeId);
  }

  getFavoriteRecipes(): Recipe[] {
    return this.recipes.filter(recipe => this.favoriteRecipeIds.includes(recipe.id));
  }
}