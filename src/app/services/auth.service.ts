import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUser();
  }

  private loadUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Pequeño delay para simular verificación de autenticación
      setTimeout(() => {
        const savedUser = localStorage.getItem('mireceta_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.isLoggedIn) {
            this.currentUserSubject.next(user);
          }
        }
        this.isInitializedSubject.next(true);
      }, 100);
    } else {
      // En servidor, marcar como inicializado inmediatamente
      this.isInitializedSubject.next(true);
    }
  }

  private saveUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mireceta_user', JSON.stringify(user));
    }
  }

  login(username: string, email: string): Observable<User> {
    const user: User = {
      id: Date.now().toString(),
      username,
      email,
      isLoggedIn: true
    };
    
    this.saveUser(user);
    this.currentUserSubject.next(user);
    
    return new BehaviorSubject(user).asObservable();
  }

  logout(): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const loggedOutUser = { ...currentUser, isLoggedIn: false };
      this.saveUser(loggedOutUser);
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.isLoggedIn;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isInitialized(): boolean {
    return this.isInitializedSubject.value;
  }
}