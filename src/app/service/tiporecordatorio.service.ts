import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoRecordatorio } from '../model/tiporecordatorio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiporecordatorioService {
  private apiURL = 'http://localhost:8080/api/user'

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

  // Obtener todos los tipos de recordatorio
  findAll(): Observable<TipoRecordatorio[]> {
    return this.http.get<TipoRecordatorio[]>(`${this.apiURL}/findall-tipo-recordatorio`, {headers: this.getHeaders()});
  }

  // Obtener un tipo de recordatorio por ID
  findById(id: number): Observable<TipoRecordatorio> {
    return this.http.get<TipoRecordatorio>(`${this.apiURL}/tipo-recordatorio/${id}`, {headers: this.getHeaders()});
  }
  // Registrar 
  create(tipoRecordatorio: TipoRecordatorio): Observable<TipoRecordatorio> {
    return this.http.post<TipoRecordatorio>(`${this.apiURL}/registrar-tipo-recordatorio`, tipoRecordatorio, {headers: this.getHeaders()});
  }
  // Actualizar 
  update(id: number, tipoRecordatorio: TipoRecordatorio): Observable<TipoRecordatorio> {
    return this.http.put<TipoRecordatorio>(`${this.apiURL}/actualizar-tipo-recordatorio/${id}`, tipoRecordatorio, {headers: this.getHeaders()});
  }
  // Eliminar 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/eliminar-tipo-recordatorio/${id}`, {headers: this.getHeaders()});
  }
}
