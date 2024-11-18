import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';
import { Mascota } from '../model/mascota';



@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  private apiURL = 'http://localhost:8080/api/user';
  constructor(private http: HttpClient, private loginService: LoginService) {}
  

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }
 getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiURL}/findall-mascota`, {
      headers: this.getHeaders(),
    });
  }

  getMascota(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiURL}/mascota/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addMascota(mascota: Mascota): Observable<Mascota> {
    return new Observable<Mascota>((observer) => {
      this.loginService.getUsuarioId().subscribe(
        (usuario_id) => {
          mascota.usuario_id = usuario_id; // Asociamos el usuario_id obtenido
          this.http
            .post<Mascota>(`${this.apiURL}/registrar-mascota`, mascota, {
              headers: this.getHeaders(),
            })
            .subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => observer.error(error)
            );
        },
        (error) => observer.error(error)
      );
    });
  }
  
  updateMascota(mascota: Mascota): Observable<Mascota> {
    return new Observable<Mascota>((observer) => {
      this.loginService.getUsuarioId().subscribe(
        (usuario_id) => {
          mascota.usuario_id = usuario_id; // Asociamos el usuario_id obtenido
          this.http
            .put<Mascota>(`${this.apiURL}/actualizar-mascota/${mascota.id}`, mascota, {
              headers: this.getHeaders(),
            })
            .subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => observer.error(error)
            );
        },
        (error) => observer.error(error)
      );
    });
  }
  

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/eliminar-mascota/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getUserIdByUsername(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/id-by-username/${username}`);
  }
  
  //Trae todas las mascotas de un usuario POR SU ID
  getMascotabyduenio(id: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiURL}/api/user/usuario/${id}`, {
      headers: this.getHeaders(),
    });
  }
  
}