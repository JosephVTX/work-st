import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">
          {{ isEditing ? 'Editar Receta' : 'Crear Nueva Receta' }}
        </h1>

        <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <!-- Step Indicator -->
          <div class="flex justify-center mb-8">
            <div class="flex space-x-4">
              <div
                *ngFor="let step of steps; let i = index"
                [class]="currentStep === i ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'"
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              >
                {{ i + 1 }}
              </div>
            </div>
          </div>

          <!-- Step 1: Basic Info -->
          <div *ngIf="currentStep === 0" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-6">Información Básica</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Receta *</label>
                <input
                  type="text"
                  formControlName="nombre"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Paella Valenciana"
                >
                <div *ngIf="recipeForm.get('nombre')?.invalid && recipeForm.get('nombre')?.touched" class="text-red-500 text-sm mt-1">
                  El nombre es requerido
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo de Preparación (minutos) *</label>
                <input
                  type="number"
                  formControlName="tiempoPreparacion"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                >
                <div *ngIf="recipeForm.get('tiempoPreparacion')?.invalid && recipeForm.get('tiempoPreparacion')?.touched" class="text-red-500 text-sm mt-1">
                  El tiempo de preparación es requerido
                </div>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Dificultad *</label>
              <select
                formControlName="dificultad"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona la dificultad</option>
                <option value="Fácil">Fácil</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Difícil">Difícil</option>
              </select>
              <div *ngIf="recipeForm.get('dificultad')?.invalid && recipeForm.get('dificultad')?.touched" class="text-red-500 text-sm mt-1">
                La dificultad es requerida
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                formControlName="descripcion"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe brevemente tu receta..."
              ></textarea>
              <div *ngIf="recipeForm.get('descripcion')?.invalid && recipeForm.get('descripcion')?.touched" class="text-red-500 text-sm mt-1">
                La descripción es requerida
              </div>
            </div>
          </div>

          <!-- Step 2: Image Upload -->
          <div *ngIf="currentStep === 1" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-6">Imagen de la Receta</h2>
            
            <div class="text-center">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                <div *ngIf="!imagePreview" class="text-gray-500">
                  <div class="text-6xl mb-4 text-gray-400">
                    <i class="fas fa-camera"></i>
                  </div>
                  <p class="text-lg mb-2">Sube una imagen de tu receta</p>
                  <p class="text-sm">Opcional - puedes continuar sin imagen</p>
                </div>
                
                <div *ngIf="imagePreview" class="relative">
                  <img [src]="imagePreview" alt="Preview" class="max-w-full max-h-64 mx-auto rounded-lg">
                  <button
                    type="button"
                    (click)="removeImage()"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <input
                type="file"
                #fileInput
                (change)="onImageSelected($event)"
                accept="image/*"
                class="hidden"
              >
              
              <button
                type="button"
                (click)="fileInput.click()"
                class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200"
              >
                {{ imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen' }}
              </button>
            </div>
          </div>

          <!-- Step 3: Ingredients -->
          <div *ngIf="currentStep === 2" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-6">Ingredientes</h2>
            
            <div formArrayName="ingredientes" class="space-y-3">
              <div
                *ngFor="let ingrediente of ingredientes.controls; let i = index"
                class="flex space-x-2"
              >
                <input
                  type="text"
                  [formControlName]="i"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [placeholder]="'Ingrediente ' + (i + 1)"
                >
                <button
                  type="button"
                  (click)="removeIngrediente(i)"
                  class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <button
              type="button"
              (click)="addIngrediente()"
              class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              + Agregar Ingrediente
            </button>
            
            <div *ngIf="ingredientes.length === 0" class="text-red-500 text-sm mt-2">
              Debes agregar al menos un ingrediente
            </div>
          </div>

          <!-- Step 4: Instructions -->
          <div *ngIf="currentStep === 3" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-6">Instrucciones</h2>
            
            <div formArrayName="instrucciones" class="space-y-3">
              <div
                *ngFor="let instruccion of instrucciones.controls; let i = index"
                class="flex space-x-2"
              >
                <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  {{ i + 1 }}
                </span>
                <textarea
                  [formControlName]="i"
                  rows="2"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [placeholder]="'Paso ' + (i + 1)"
                ></textarea>
                <button
                  type="button"
                  (click)="removeInstruccion(i)"
                  class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-200 self-start"
                >
                  ×
                </button>
              </div>
            </div>
            
            <button
              type="button"
              (click)="addInstruccion()"
              class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              + Agregar Paso
            </button>
            
            <div *ngIf="instrucciones.length === 0" class="text-red-500 text-sm mt-2">
              Debes agregar al menos una instrucción
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between">
            <button
              type="button"
              *ngIf="currentStep > 0"
              (click)="previousStep()"
              class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Anterior
            </button>
            
            <div class="flex space-x-2 ml-auto">
              <button
                type="button"
                (click)="cancel()"
                class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                *ngIf="currentStep < steps.length - 1"
                (click)="nextStep()"
                [disabled]="!isCurrentStepValid()"
                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
              
              <button
                type="submit"
                *ngIf="currentStep === steps.length - 1"
                [disabled]="!recipeForm.valid || !isFormComplete()"
                class="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {{ isEditing ? 'Guardar Cambios' : 'Crear Receta' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CrearRecetaComponent implements OnInit {
  recipeForm: FormGroup;
  currentStep = 0;
  steps = ['Básico', 'Imagen', 'Ingredientes', 'Instrucciones'];
  imagePreview: string | null = null;
  isEditing = false;
  editingRecipeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit() {
    // Check if we're editing an existing recipe
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      const recipe = this.recipeService.getRecipeById(recipeId);
      if (recipe) {
        this.isEditing = true;
        this.editingRecipeId = recipeId;
        this.loadRecipeData(recipe);
      }
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempoPreparacion: ['', [Validators.required, Validators.min(1)]],
      dificultad: ['', Validators.required],
      ingredientes: this.fb.array([]),
      instrucciones: this.fb.array([])
    });
  }

  private loadRecipeData(recipe: Recipe) {
    this.recipeForm.patchValue({
      nombre: recipe.nombre,
      descripcion: recipe.descripcion,
      tiempoPreparacion: recipe.tiempoPreparacion,
      dificultad: recipe.dificultad
    });

    // Load ingredients
    const ingredientesArray = this.ingredientes;
    recipe.ingredientes.forEach(ingrediente => {
      ingredientesArray.push(this.fb.control(ingrediente, Validators.required));
    });

    // Load instructions
    const instruccionesArray = this.instrucciones;
    recipe.instrucciones.forEach(instruccion => {
      instruccionesArray.push(this.fb.control(instruccion, Validators.required));
    });

    // Load image
    if (recipe.imagen) {
      this.imagePreview = recipe.imagen;
    }
  }

  get ingredientes() {
    return this.recipeForm.get('ingredientes') as FormArray;
  }

  get instrucciones() {
    return this.recipeForm.get('instrucciones') as FormArray;
  }

  addIngrediente() {
    this.ingredientes.push(this.fb.control('', Validators.required));
  }

  removeIngrediente(index: number) {
    this.ingredientes.removeAt(index);
  }

  addInstruccion() {
    this.instrucciones.push(this.fb.control('', Validators.required));
  }

  removeInstruccion(index: number) {
    this.instrucciones.removeAt(index);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
  }

  nextStep() {
    if (this.isCurrentStepValid() && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 0:
        return !!(this.recipeForm.get('nombre')?.valid &&
               this.recipeForm.get('descripcion')?.valid &&
               this.recipeForm.get('tiempoPreparacion')?.valid &&
               this.recipeForm.get('dificultad')?.valid);
      case 1:
        return true; // Image is optional
      case 2:
        return this.ingredientes.length > 0 && this.ingredientes.valid;
      case 3:
        return this.instrucciones.length > 0 && this.instrucciones.valid;
      default:
        return false;
    }
  }

  isFormComplete(): boolean {
    return this.ingredientes.length > 0 && this.instrucciones.length > 0;
  }

  onSubmit() {
    if (this.recipeForm.valid && this.isFormComplete()) {
      const formValue = this.recipeForm.value;
      
      const recipeData = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        ingredientes: formValue.ingredientes.filter((ing: string) => ing.trim()),
        instrucciones: formValue.instrucciones.filter((inst: string) => inst.trim()),
        dificultad: formValue.dificultad,
        tiempoPreparacion: formValue.tiempoPreparacion,
        imagen: this.imagePreview || undefined
      };

      if (this.isEditing && this.editingRecipeId) {
        this.recipeService.updateRecipe(this.editingRecipeId, recipeData);
        this.router.navigate(['/detalle', this.editingRecipeId]);
      } else {
        const newRecipe = this.recipeService.addRecipe(recipeData);
        this.router.navigate(['/detalle', newRecipe.id]);
      }
    }
  }

  cancel() {
    this.router.navigate(['/buscar']);
  }
}