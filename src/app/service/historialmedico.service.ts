import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialMedico } from '../model/historialmedico';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class HistorialMedicoService {
  private apiURL = 'http://localhost:8080/api/user'; // URL base de tu API

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  // Obtener historiales médicos por mascota_id
  getHistorialesPorMascota(mascotaId: number): Observable<HistorialMedico[]> {
    return this.http.get<HistorialMedico[]>(
      `${this.apiURL}/historiales/mascota/${mascotaId}`,
      { headers: this.getHeaders() }
    );
  }

  // Registrar historial médico
  addHistorial(historial: HistorialMedico): Observable<HistorialMedico> {
    return this.http.post<HistorialMedico>(
      `${this.apiURL}/registrar-historial-medico`,
      historial,
      { headers: this.getHeaders() }
    );
  }
  updateHistorial(id: number, historial: HistorialMedico): Observable<void> {
    return this.http.put<void>(
      `${this.apiURL}/actualizar-historialmedico/${id}`,
      historial,
      { headers: this.getHeaders() }
    );
  }
  
  deleteHistorial(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiURL}/historial-delete/${id}`,
      { headers: this.getHeaders() }
    );
  }
  getHistorialesPorMascotaYFecha(mascotaId: number, from: string, to: string): Observable<HistorialMedico[]> {
    const url = `${this.apiURL}/historial-medico-mascota-fecha?mascotaId=${mascotaId}&from=${from}&to=${to}`;
    console.log('Llamando a:', url);
    return this.http.get<HistorialMedico[]>(url, { headers: this.getHeaders() });
  }
  
}