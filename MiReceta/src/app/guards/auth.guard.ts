import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que la autenticación esté inicializada
  return authService.isInitialized$.pipe(
    filter(initialized => initialized), // Solo continuar cuando esté inicializado
    take(1), // Tomar solo el primer valor verdadero
    map(() => {
      if (authService.isLoggedIn()) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};