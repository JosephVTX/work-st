import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.interface';

@Pipe({
  name: 'recipeFilter',
  standalone: true
})
export class RecipeFilterPipe implements PipeTransform {
  transform(recipes: Recipe[], searchTerm: string, difficulty: string): Recipe[] {
    if (!recipes) return [];
    
    let filtered = [...recipes];
    
    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.nombre.toLowerCase().includes(term) ||
        recipe.descripcion.toLowerCase().includes(term) ||
        recipe.ingredientes.some(ing => ing.toLowerCase().includes(term))
      );
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'Todas') {
      filtered = filtered.filter(recipe => recipe.dificultad === difficulty);
    }
    
    return filtered;
  }
}