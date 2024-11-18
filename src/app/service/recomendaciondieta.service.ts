import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecomendacionDieta } from '../model/recomendaciondieta';

@Injectable({
  providedIn: 'root',
})
export class RecomendacionDietaService {
  private apiURL = 'http://localhost:8080/api/user'; // URL base de tu API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getRecomendacionesPorMascota(mascotaId: number): Observable<RecomendacionDieta[]> {
    return this.http.get<RecomendacionDieta[]>(
      `${this.apiURL}/listar-dieta-mascota?mascotaId=${mascotaId}`,
      { headers: this.getHeaders() }
    );
  }

  addRecomendacionDieta(recomendacion: RecomendacionDieta): Observable<RecomendacionDieta> {
    return this.http.post<RecomendacionDieta>(
      `${this.apiURL}/registrar-recomendacion-dieta`,
      recomendacion,
      { headers: this.getHeaders() }
    );
  }

  updateRecomendacionDieta(id: number, recomendacion: RecomendacionDieta): Observable<void> {
    return this.http.put<void>(
      `${this.apiURL}/actualizar-recomendacion-dieta/${id}`,
      recomendacion,
      { headers: this.getHeaders() }
    );
  }

  deleteRecomendacionDieta(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiURL}/eliminar-recomendacion-dieta/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getDietas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/findall-dieta`, { headers: this.getHeaders() });
  }


}
