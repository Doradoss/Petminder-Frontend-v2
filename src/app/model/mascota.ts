export interface Mascota {
    id: number;
    nombre: string;
    edad: number;
    especie: string;
    raza: string;
    usuario_id: number;  // Foreign key
  }
  