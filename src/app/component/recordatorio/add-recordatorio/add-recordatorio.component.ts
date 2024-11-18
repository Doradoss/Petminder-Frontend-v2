import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordatorioService } from '../../../service/recordatorio.service';
import { TiporecordatorioService } from '../../../service/tiporecordatorio.service';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-add-recordatorio',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarHomeComponent,
    MatRadioModule
  ],
  templateUrl: './add-recordatorio.component.html',
  styleUrl: './add-recordatorio.component.css'
})
export class AddRecordatorioComponent implements OnInit {
  //title = 'Firulais';
  day: string;
  tiposRecordatorio: { id: number; nombre: string }[] = [];
  recordatorioForm: FormGroup;  
  minFecha: string;  


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recordatorioService: RecordatorioService,
    private tipoRecordatorioService: TiporecordatorioService
  ) {
    const date = new Date();
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    this.day = date.toLocaleDateString('es-ES', formatOptions);   
    this.minFecha = date.toISOString().split('T')[0];

    // Inicializa el formulario 
    this.recordatorioForm = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl(''),
      fecha: new FormControl('', [Validators.required,this.fechaValida.bind(this)]),  //probando
      hora: new FormControl('', [Validators.required]),
      tipoRecordatorioId: new FormControl(null, [Validators.required]),
      completado: new FormControl(false, [Validators.required]),
      mascotaId: new FormControl(null, [Validators.required]),
      userId: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Obtener parámetros 
    this.route.queryParams.subscribe((params) => {
      const idMascota = params['idMascota'];
      const userId = params['userId'];

      if (idMascota) {
        this.recordatorioForm.patchValue({ mascotaId: +idMascota });
        console.log('ID de la mascota seleccionada:', idMascota);
      } else {
        console.warn('No se ha recibido un ID de mascota.');
      }

      if (userId) {
        this.recordatorioForm.patchValue({ userId: +userId });
        console.log('ID del usuario:', userId);
      } else {
        console.warn('No se ha recibido un ID de usuario.');
      }
    });

    // Tipos de recordatorio
    this.tipoRecordatorioService.findAll().subscribe({
      next: (tipos) => {
        this.tiposRecordatorio = tipos;
      },
      error: (error) => {
        console.error('Error al cargar los tipos de recordatorio:', error);
      },
    });
  }

   // Validador fecha
   fechaValida(control: AbstractControl): ValidationErrors | null {
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
  
    // Validar si la fecha es anterior a hoy
    return fechaSeleccionada >= hoy ? null : { fechaInvalida: true };
  }   

  registrarRecordatorio(): void {
    if (this.recordatorioForm.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;      
    }

   // Crear el objeto de datos con formato 
   const recordatorioData = {
    id: 0,  
    titulo: this.recordatorioForm.value.titulo,
    descripcion: this.recordatorioForm.value.descripcion,
    fecha: this.recordatorioForm.value.fecha.toISOString().split('T')[0],  // Formato 'YYYY-MM-DD'
    hora: this.recordatorioForm.value.hora + ':00',  // Formato 'HH:mm:ss'
    completado: this.recordatorioForm.value.completado,
    tipo_recordatorio_id: this.recordatorioForm.value.tipoRecordatorioId,  
    usuario_id: this.recordatorioForm.value.userId,  
    mascota_id: this.recordatorioForm.value.mascotaId,  
    time: new Date(`1970-01-01T${this.recordatorioForm.value.hora}:00Z`),  // Convertir la hora a Date
  };

    console.log('Recordatorio a registrar:', recordatorioData);

    this.recordatorioService.registrarRecordatorio(recordatorioData).subscribe({
      next: (response) => {
        console.log('Recordatorio registrado exitosamente:', response);
        this.router.navigate(['/recordatorio']);
      },
      error: (error) => {
        console.error('Error al registrar recordatorio:', error);
        alert('Hubo un error al registrar el recordatorio. Por favor, inténtalo de nuevo.');
      },
    });
  }
}
