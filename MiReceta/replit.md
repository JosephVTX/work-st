# MiReceta - Catálogo Virtual de Recetas

## Overview
MiReceta es una aplicación web SPA (Single Page Application) desarrollada en Angular que permite visualizar, crear, guardar y compartir recetas culinarias. La aplicación incluye funcionalidades completas de CRUD, autenticación básica, manejo de favoritos y una interfaz moderna y responsive.

## Funcionalidades Principales

### ✅ Componentes Implementados
- **Login Component**: Autenticación básica con validación de formularios
- **Buscar Recetas Component**: Búsqueda y filtrado por nombre, ingredientes y dificultad
- **Detalle Receta Component**: Vista detallada de recetas individuales
- **Crear Receta Component**: Formulario multi-paso para crear/editar recetas con carga de imágenes
- **Favoritos Component**: Gestión de recetas favoritas con estadísticas
- **Navbar Component**: Navegación responsive con menú móvil

### 🔧 Servicios y Modelos
- **RecipeService**: Gestión completa de recetas con localStorage
- **AuthService**: Autenticación y gestión de sesiones
- **Recipe Interface**: Modelo de datos para recetas
- **Auth Guard**: Protección de rutas

### 🎨 Características Técnicas
- **Framework**: Angular 17 con componentes standalone
- **Styling**: TailwindCSS para diseño moderno y responsive
- **Forms**: Reactive Forms con validación
- **Routing**: Lazy loading de componentes
- **Storage**: LocalStorage para persistencia de datos
- **Guards**: Protección de rutas autenticadas
- **Mobile-First**: Diseño completamente responsive

### 🍽️ Funcionalidades de Recetas
- Crear, editar, eliminar recetas
- Búsqueda por nombre e ingredientes
- Filtros por dificultad (Fácil, Intermedio, Difícil)
- Sistema de favoritos
- Carga de imágenes (base64)
- Formulario multi-paso dinámico
- Validaciones completas

### 📱 Experiencia de Usuario
- Interfaz intuitiva y moderna
- Diseño mobile-first
- Navegación fluida entre secciones
- Feedback visual y validaciones
- Emojis para mejor UX
- Animaciones y transiciones

## Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── buscar-recetas/
│   │   ├── crear-receta/
│   │   ├── detalle-receta/
│   │   ├── favoritos/
│   │   ├── login/
│   │   └── navbar/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── recipe.service.ts
│   ├── models/
│   │   └── recipe.interface.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── pipes/
│   │   └── filter.pipe.ts
│   └── app.routes.ts
```

## Estado Actual
✅ **Completado**: Todas las funcionalidades principales están implementadas y funcionando
✅ **Testing**: Servidor Angular configurado y ejecutándose en puerto 5000
✅ **Responsive**: Diseño mobile-first con TailwindCSS
✅ **Demo Ready**: Aplicación lista para demostración

## Datos de Ejemplo
La aplicación incluye 3 recetas de ejemplo pre-cargadas:
1. Paella Valenciana (Intermedio)
2. Ensalada César (Fácil)  
3. Ratatouille (Difícil)

## Tecnologías Utilizadas
- Angular 17 (Standalone Components)
- TailwindCSS
- TypeScript
- RxJS
- Angular Router
- Reactive Forms
- LocalStorage API

## Configuración de Desarrollo
- Puerto: 5000
- Host: 0.0.0.0 (configurado para Replit)
- Hot Reload: Habilitado
- Source Maps: Habilitado

## Notas Técnicas
- Todos los datos se almacenan en localStorage
- Autenticación simulada (demo)
- Imágenes convertidas a base64
- Guards protegen rutas autenticadas
- Lazy loading para optimización
- Componentes standalone para mejor tree-shaking

La aplicación está completamente funcional y lista para uso.