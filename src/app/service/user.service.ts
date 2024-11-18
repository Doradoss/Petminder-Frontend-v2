import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';
import {  UserIdDto } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getIdByUsername(username: string | null): Observable<UserIdDto> {
    return this.http.get<UserIdDto>(`${this.apiURL}/${username}`, {
      headers: this.getHeaders(),
    });
  }

}
