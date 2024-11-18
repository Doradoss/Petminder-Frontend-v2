import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dieta } from '../model/dieta';

@Injectable({
  providedIn: 'root'
})
export class DietaService {
    private apiURL = 'http://localhost:8080/api/user';
  
    constructor(private http: HttpClient) {}
    private getHeaders(): HttpHeaders {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado en sessionStorage');
        }
        return new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json');
      }
    getDietas(): Observable<Dieta[]> {
      return this.http.get<Dieta[]>(`${this.apiURL}/findall-dieta`, {
        headers: this.getHeaders(),
      });
    }
    
    getDieta(id: number): Observable<Dieta> {
      return this.http.get<Dieta>(`${this.apiURL}/dieta/${id}`, {
        headers: this.getHeaders(),
      });
    }
  
    addDieta(dieta: Dieta): Observable<Dieta> {
      return this.http.post<Dieta>(`${this.apiURL}/registrar-dieta`, dieta, {
        headers: this.getHeaders(),
      });
    }
  
    updateDieta(id: number, dieta: Dieta): Observable<Dieta> {
    return this.http.put<Dieta>(`${this.apiURL}/actualizar-dieta/${id}`, dieta, {
    headers: this.getHeaders(),
      });
    }
  
    deleteDieta(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiURL}/eliminar-dieta/${id}`, {
        headers: this.getHeaders(),
      });
    }
    
    getDietasPorFecha(fecha: string): Observable<Dieta[]> {
      return this.http.get<Dieta[]>(`${this.apiURL}/listar-dieta-fecha`, {
        params: { fecha }, // Envía la fecha como parámetro
        headers: this.getHeaders(),
      });
    }
}