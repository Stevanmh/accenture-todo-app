export interface Task {
  id: string;                 // UUID generado localmente
  title: string;              // Título de la tarea
  description?: string;       // El signo ? significa que es opcional
  completed: boolean;         // true = completada, false = pendiente
  categoryId: string | null;  // null = no tiene categoría asignada
  createdAt: number;          // Timestamp (Date.now())
  updatedAt: number;          // Timestamp de la última modificación
}
