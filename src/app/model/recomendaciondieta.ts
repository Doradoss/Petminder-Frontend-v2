export interface RecomendacionDieta {
    id: number;
    nombreDieta: string;
    indicaciones: string;
    fecha?: string | null; // Acepta undefined o null
    dieta_id?: number; // Opcional
    mascota_id?: number; // Opcional
  }
  