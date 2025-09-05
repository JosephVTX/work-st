import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'buscar', 
    loadComponent: () => import('./components/buscar-recetas/buscar-recetas.component').then(m => m.BuscarRecetasComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'detalle/:id', 
    loadComponent: () => import('./components/detalle-receta/detalle-receta.component').then(m => m.DetalleRecetaComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'crear', 
    loadComponent: () => import('./components/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'crear/:id', 
    loadComponent: () => import('./components/crear-receta/crear-receta.component').then(m => m.CrearRecetaComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'favoritos', 
    loadComponent: () => import('./components/favoritos/favoritos.component').then(m => m.FavoritosComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
