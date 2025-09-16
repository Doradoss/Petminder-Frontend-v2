import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { JwtRequest } from '../../model/jwRequest';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatInputModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  login(): void {
    let request: JwtRequest = {
      username: this.username,
      password: this.password,
    };

    this.loginService.login(request).subscribe({
      next: (data: any) => {
        if (data && data.jwttoken) {
          sessionStorage.setItem('token', data.jwttoken); // Guarda el token
          sessionStorage.setItem('username', this.username); // Guarda el username
          console.log('Token guardado:', data.jwttoken); // Depuración
          console.log('Username guardado:', this.loginService.getUsername()); // Depuración
          this.router.navigate(['/home-secundario']); // Navega al home 2
          this.snackBar.open('Login exitoso', 'Cerrar', { duration: 3000 });
        } else {
          console.error('El token no está presente en la respuesta.');
          this.snackBar.open('Error: No se recibió token', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error en el login:', err); // Muestra el error
        this.snackBar.open('Credenciales inválidas o error en el servidor', 'Cerrar', { duration: 3000 });
      },
    });
  }
  
}