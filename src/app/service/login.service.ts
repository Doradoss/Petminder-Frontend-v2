import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtRequest } from '../model/jwRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiURL = 'http://localhost:8080/authenticate';

  constructor(private http: HttpClient) {}

  login(request: JwtRequest): Observable<any> {
    return this.http.post(this.apiURL, request); // Retorna la respuesta del backend
  }
  setUsername(username: string) { sessionStorage.setItem('username', username); }
  getUsername() { return sessionStorage.getItem('username'); }
  removeUsername() { sessionStorage.removeItem('username'); }

  verificar(): boolean {
    const token = sessionStorage.getItem('token');
    return token !== null; // Verifica si el token existe en el almacenamiento
  }

  showRole(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub || null; // Devuelve el subject o null
  }

  getUsuarioId(): Observable<number> {
    const username = this.showRole(); // Obtiene el username del token
    if (!username) {
      console.error('No se pudo obtener el username del token.');
      throw new Error('Usuario no autenticado');
    }
  
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado en sessionStorage');
      throw new Error('Usuario no autenticado');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:8080/api/user/id-by-username/${username}`;
    return this.http.get<number>(url, { headers });
  }
  getUsernameFromToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        // Decodifica el payload del JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null; // Retorna el campo `sub` como el username
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        return null;
      }
    }
    return null;
  }

  showId(){
    let token = sessionStorage.getItem("token");
    if (!token) {
      // Manejar el caso en el que el token es nulo.
      return null; 
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.id;
  }

}
