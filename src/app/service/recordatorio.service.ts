import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recordatorio, RecordatorioDTO } from '../model/recordatorio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private apiURL = 'http://localhost:8080/api/user';
  constructor(private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado en sessionStorage');
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  //Registrar Recordatorio
  registrarRecordatorio(recordatorio: Recordatorio):Observable<Recordatorio>{
    return this.http.post<Recordatorio>(`${this.apiURL}/registrar-recordatorio`, recordatorio, {headers: this.getHeaders()});
  }

  // Obtener recordatorios por tipo de recordatorio
  obtenerRecordatoriosPorTipo(tipoRecordatorioId: number): Observable<Recordatorio[]> {
    let params = new HttpParams().set('tipoRecordatorioId', tipoRecordatorioId.toString());
    return this.http.get<Recordatorio[]>(`${this.apiURL}/recordatorio-tipo`, { params, headers: this.getHeaders() });
  }

  //ListarRecordatorioPorMascota
  listarRecordatorioPorMascota(mascotaId: number): Observable<Recordatorio[]> {
    let params = new HttpParams().set('mascotaId', mascotaId);    
    return this.http.get<Recordatorio[]>(`${this.apiURL}/listar-recordatorio-por-mascota`, { params, headers: this.getHeaders() });
  }  

  findByTipo(tipoRecordatorioId: number, page: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/recordatorio-tipo?tipoRecordatorioId=${tipoRecordatorioId}&page=${page}`, { headers: this.getHeaders() });
  }

  // Eliminar Recordatorio
  eliminarRecordatorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/eliminar-recordatorio/${id}`, { headers: this.getHeaders() });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiURL}/eliminar-recordatorio/${id}`, { headers: this.getHeaders() });
   }

   //RecordarotioPorUsuario
   recordatorioUsuario(id: number): Observable<RecordatorioDTO[]>{
    let params = new HttpParams().set('userId', id);    
    return this.http.get<RecordatorioDTO[]>(`${this.apiURL}/listar-recordatorios-usuario`, {params, headers: this.getHeaders() });
   }


}
