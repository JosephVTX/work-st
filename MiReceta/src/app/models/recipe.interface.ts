export interface Recipe {
  id: string;
  nombre: string;
  descripcion: string;
  ingredientes: string[];
  instrucciones: string[];
  dificultad: 'Fácil' | 'Intermedio' | 'Difícil';
  tiempoPreparacion: number; // en minutos
  imagen?: string; // base64 o URL
  fechaCreacion: Date;
  creadorId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isLoggedIn: boolean;
}