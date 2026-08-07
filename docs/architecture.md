# Arquitectura del Proyecto

## Stack tecnológico

- **Framework:** Ionic 7 + Angular
- **Lenguaje:** TypeScript
- **Almacenamiento local:** @ionic/storage
- **Servicios en la nube:** Firebase Remote Config
- **Compilación nativa:** Cordova (Android e iOS)

---

## Organización del código

Decidí estructurar el proyecto en tres capas bien diferenciadas dentro de `src/app/`:

```
src/app/
├── core/          # Servicios singleton y modelos de datos
├── shared/        # Componentes y pipes reutilizables
└── features/      # Páginas de la aplicación (lazy-loaded)
```

### core/
Contiene los servicios que se instancian una sola vez en toda la aplicación. Aquí vive toda la lógica de negocio: gestión del estado de tareas y categorías, acceso al storage local y la integración con Firebase Remote Config. Los componentes nunca acceden directamente al storage — siempre pasan por un servicio.

### shared/
Componentes reutilizables que pueden aparecer en más de una feature (por ejemplo, el componente de ítem de tarea o el badge de categoría). También contiene los pipes de filtrado.

### features/
Cada pantalla de la aplicación es un módulo independiente con carga lazy. Esto mejora el tiempo de carga inicial porque Angular solo carga el código de una pantalla cuando el usuario navega a ella.

---

## Gestión del estado

Opté por servicios con `BehaviorSubject` (RxJS) en lugar de una librería de estado como NgRx. Para el alcance de esta aplicación, NgRx añadiría una cantidad considerable de código adicional (actions, reducers, effects, selectors) sin aportar un beneficio proporcional. Cada servicio expone el estado como `Observable` y los componentes se suscriben.

---

## Modelos de datos

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;  // timestamp Unix
  updatedAt: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}
```

Los timestamps son números (Unix) en lugar de objetos `Date` porque `@ionic/storage` serializa a JSON, y `Date` no sobrevive ese ciclo de serialización correctamente.

---

## Diagrama de capas

```
┌──────────────────────────────────────────────────┐
│             Capa de Presentación                 │
│   Pages: Tasks · Categories · Settings           │
│   Components: TaskItem · CategoryChip            │
├──────────────────────────────────────────────────┤
│           Capa de Lógica de Negocio              │
│   TaskService · CategoryService                  │
│   FeatureFlagService                             │
├──────────────────────────────────────────────────┤
│           Capa de Infraestructura                │
│   StorageService → @ionic/storage (local)        │
│   FirebaseService → Remote Config (nube)         │
└──────────────────────────────────────────────────┘
```

---

## Optimizaciones de rendimiento aplicadas

- **`ChangeDetectionStrategy.OnPush`** en componentes presentacionales: Angular solo re-evalúa el componente cuando sus `@Input()` reciben una nueva referencia, reduciendo el trabajo del motor de detección de cambios.
- **Lazy loading** de feature modules: cada pantalla se carga solo cuando el usuario navega a ella.
- **Pipe puro** para el filtrado por categoría: solo recalcula cuando cambian los datos de entrada.
- **`trackBy`** en listas dinámicas: evita que Angular re-renderice la lista completa cuando solo un elemento cambia.
