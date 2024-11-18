import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    RouterModule, 
    MatToolbarModule,
  ],
  templateUrl: './navbar-home.component.html',
  styleUrl: './navbar-home.component.css'
})
export class NavbarHomeComponent {
  mostrarMascotas = false;
  mostrarMenu() {
    this.mostrarMascotas = true;
  }

  ocultarMenu() {
    this.mostrarMascotas = false;
  }

  editarMascota(id: number) {
    console.log('Editar mascota con ID:', id);
    // Agrega aquí la lógica para editar la mascota
  }

  agregarMascota() {
    console.log('Agregar nueva mascota');
    // Agrega aquí la lógica para agregar una nueva mascota
  }

  eliminarMascota(id: number) {
    console.log('Eliminar mascota con ID:', id);
    // Agrega aquí la lógica para eliminar la mascota
  }
  cerrar() {
    sessionStorage.clear();
  }
}

