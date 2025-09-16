import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserIdDto } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'http://localhost:8080/api/user'; // URL base correcta

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getIdByUsername(username: string | null): Observable<UserIdDto> {
    if (!username) {
      throw new Error('El username no puede ser null o undefined');
    }
    const url = `${this.apiURL}/${username}`;
    console.log('Calling URL:', url); // Depura la URL generada
    return this.http.get<UserIdDto>(url, { headers: this.getHeaders() });
  }
}