export interface Category {
  id: string;         // UUID generado localmente
  name: string;       // Nombre de la categoría (ej. "Trabajo", "Hogar")
  color: string;      // Código hexadecimal (ej. "#FF5733") para la UI
  createdAt: number;  // Timestamp (Date.now())
}
