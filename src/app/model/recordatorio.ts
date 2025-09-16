import { Mascota } from "./mascota";
import { TipoRecordatorio } from "./tiporecordatorio";

export interface Recordatorio {  
    id: number;      
    titulo: string;
    descripcion: string;
    fecha: Date;
    hora: string;
}

export interface RecordatorioDTO{
    id: number;
    titulo: string;
    descripcion: string;
    fecha: Date;
    hora: string;
    mascota: Mascota;
    completado:boolean;  //añadido
    tipoRecordatorio: TipoRecordatorio;
}

