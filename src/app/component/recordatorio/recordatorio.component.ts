import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MascotaService } from '../../service/mascota.service';
import { RecordatorioService } from '../../service/recordatorio.service';
import { map, Observable } from 'rxjs';
import { Mascota } from '../../model/mascota';
import { Recordatorio, RecordatorioDTO } from '../../model/recordatorio';
import { UserService } from '../../service/user.service';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TipoRecordatorio } from '../../model/tiporecordatorio';
import { TiporecordatorioService } from '../../service/tiporecordatorio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-recordatorio',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    MatSidenavModule,
    NavbarHomeComponent,     
    MatSelectModule,
    MatExpansionModule,      
  ],
  templateUrl: './recordatorio.component.html',
  styleUrl: './recordatorio.component.css'
})
export class RecordatorioComponent implements OnInit {
  day: string;
  //tiposRecordatorio: { id: number; nombre: string }[] = [];
  tiposRecordatorio: TipoRecordatorio[] = [];
  selectedMascota: string='Seleccione su mascota';
  recordatoriosActuales: Recordatorio[] = []; 
  recordatorioUsuario: RecordatorioDTO[]=[];  
  data: Observable<Mascota[]> = new Observable<Mascota[]>();
  mascotas: Mascota[] = [];
  mascotaSeleccionada: Mascota | null = null;    
  username = sessionStorage.getItem('username');  // Tener en cuenta esto para recibir el id
  userId: any; 
  recordatoriosPendientes: number = 0;  
  recordatoriosCompletados: number = 0; 
  trs: TipoRecordatorio | null = null;  
  formGroup: FormGroup;

  constructor(
    private router: Router,
    private mascotaService: MascotaService,
    private recordatorioService: RecordatorioService,
    private userService: UserService,
    private tipoRecordatorioService: TiporecordatorioService,
    private fb: FormBuilder,
    
  ) {
    const date = new Date();
    const formatOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    this.day = date.toLocaleDateString('es-ES', formatOptions);
    this.formGroup = this.fb.group({ tipoRecordatorioId: [''] });
    
  }

  ngOnInit(): void {
    // Carga el username desde sessionStorage
    this.username = sessionStorage.getItem('username');
    console.log('Username cargado desde sessionStorage:', this.username); // Depuración
  
    if (!this.username) {
      console.error('El username no está definido. Redirigiendo al login...');
      // Redirige al login si no hay un username
      this.router.navigate(['/login']);
      return;
    }
  
    // Carga los datos del usuario
    this.cargarData();
  
    // Carga los tipos de recordatorio
    this.tipoRecordatorioService.findAll().subscribe({
      next: (tipos) => {
        this.tiposRecordatorio = tipos;
        console.log('Tipos de recordatorio cargados:', tipos);
      },
      error: (error) => {
        console.error('Error al cargar los tipos de recordatorio:', error);
      },
    });
  }


  getID() {
    if (!this.username) {
      console.error('El username es null o undefined');
      return;
    }
  
    this.userService.getIdByUsername(this.username).subscribe({
      next: (data) => {
        this.userId = data.id;
        console.log('User ID obtenido:', this.userId);
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      },
    });
  }
  calcularTotales(): void {
    this.recordatoriosPendientes = this.recordatorioUsuario.filter(r => !r.completado).length;
    this.recordatoriosCompletados = this.recordatorioUsuario.filter(r => r.completado).length;
    console.log('completado',this.recordatoriosCompletados);
    console.log('pendientes',this.recordatoriosPendientes);
    
  }

  listarCompletados(): void {
    this.recordatoriosActuales = this.recordatorioUsuario.filter(r => r.completado);
  }

  cargarData(): void {
    console.log('Cargando datos para el username:', this.username); // Depuración
  
    this.userService.getIdByUsername(this.username).subscribe({
      next: (data) => {
        this.userId = data.id; // Asigna el ID obtenido
        console.log('User ID obtenido:', this.userId);
  
        // Carga las mascotas usando el userId
        this.mascotaService.getMascotabyduenio(this.userId).subscribe({
          next: (mascotas) => {
            this.mascotas = mascotas; // Asigna las mascotas obtenidas
            console.log('Mascotas cargadas:', this.mascotas);
          },
          error: (err) => {
            console.error('Error al cargar mascotas:', err);
          },
        });
  
        // Carga los recordatorios del usuario
        this.recordatorioService.recordatorioUsuario(this.userId).subscribe({
          next: (data) => {
            this.recordatorioUsuario = data;
            this.calcularTotales(); // Calcula totales pendientes y completados
            console.log('Recordatorios cargados:', data);
          },
          error: (err) => {
            console.error('Error al cargar recordatorios:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      },
    });
  }

  
  listarRecordatorios(idMascota: number): void {
    console.log('ID de la mascota seleccionada:', idMascota); // Depuración
    const mascota = this.mascotas.find((mascota) => mascota.id === idMascota);
    this.selectedMascota = mascota ? mascota.nombre : 'Desconocida';
    console.log('Mascota seleccionada:', this.selectedMascota); // Depuración
  
    this.recordatorioService.listarRecordatorioPorMascota(idMascota).subscribe({
      next: (recordatorios) => {
        this.recordatoriosActuales = recordatorios;
        console.log('Recordatorios cargados:', this.recordatoriosActuales); // Depuración
      },
      error: (err) => {
        console.error('Error al cargar recordatorios:', err);
      },
    });
  }

  seleccionarMascotaPorId(id: number): void {
    this.mascotaSeleccionada = this.mascotas.find((mascota) => mascota.id === id) || null;
    if (this.mascotaSeleccionada) {
      console.log('Mascota seleccionada:', this.mascotaSeleccionada);
    } else {
      console.log('No se encontró la mascota con el ID especificado');
    }
  }
  
  
    eliminarRecordatorio(recordatorio: Recordatorio): void {
      // Elimina el recordatorio del frontend
      this.recordatorioService.eliminarRecordatorio(recordatorio.id).subscribe({
        next: () => {
          // Filtra el recordatorio eliminado de la lista actual
          this.recordatoriosActuales = this.recordatoriosActuales.filter(r => r.id !== recordatorio.id);
          console.log('Recordatorio eliminado con éxito');
        },
        error: (err) => {
          console.error('Error al eliminar el recordatorio:', err);
          alert('No se pudo eliminar el recordatorio. Intenta nuevamente.');
        }
      });
    }
  
    navegarAgregarRecordatorio(): void {
      if (!this.mascotaSeleccionada) {
        alert('Por favor selecciona una mascota antes de agregar un recordatorio.');
        return;
      }
      
      this.router.navigate(['/recordatorio/recordatorio-add'], {
        queryParams: { idMascota: this.mascotaSeleccionada.id, userId: this.userId }
      });
    }
    formatHora(hora: string): string {
      const [hours, minutes] = hora.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

}
