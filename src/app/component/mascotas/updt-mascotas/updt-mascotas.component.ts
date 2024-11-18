import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MascotaService } from '../../../service/mascota.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { Mascota } from '../../../model/mascota';

@Component({
  selector: 'app-updt-mascotas',
  templateUrl: './updt-mascotas.component.html',
  styleUrls: ['./updt-mascotas.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NavbarHomeComponent
  ]
})

export class UpdtMascotasComponent implements OnInit {
  @Input() mascota: Mascota | null = null; // Mascota a editar
  @Output() formClosed: EventEmitter<void> = new EventEmitter<void>(); // Evento para cerrar el formulario
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>(); // Evento al completar registro/edición

  mascotaForm: FormGroup;
  especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hamster'];
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private snackBar: MatSnackBar
  ) {
    this.mascotaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      especie: ['', Validators.required],
      raza: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.mascota) {
      // Si se pasa una mascota como Input, se está editando
      this.isEditing = true;
      this.mascotaForm.patchValue(this.mascota);
    }
  }

  onSubmit(): void {
    if (this.mascotaForm.valid) {
      const mascotaData: Mascota = {
        ...this.mascota,
        ...this.mascotaForm.value, // Combina los valores del formulario con los existentes
      };

      if (this.isEditing) {
        this.mascotaService.updateMascota(mascotaData).subscribe({
          next: () => {
            this.showSnackbar('Mascota actualizada exitosamente');
            this.formSubmitted.emit(); // Notifica al componente padre
          },
          error: (err) => {
            console.error('Error al actualizar:', err);
            this.showSnackbar('Error al actualizar la mascota');
          },
        });
      } else {
        this.mascotaService.addMascota(mascotaData).subscribe({
          next: () => {
            this.showSnackbar('Mascota registrada exitosamente');
            this.formSubmitted.emit(); // Notifica al componente padre
          },
          error: (err) => {
            console.error('Error al registrar:', err);
            this.showSnackbar('Error al registrar la mascota');
          },
        });
      }
    }
  }

  onCancel(): void {
    this.formClosed.emit(); // Notifica al componente padre para cerrar el formulario
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}