export interface HistorialMedico {
    id: number;
    descripcion: string;
    diagnostico: string;
    tratamiento: string;
    fecha: string; // Fecha en formato ISO
    mascota_id: number; // Foreign key para asociar con una mascota
  }
  