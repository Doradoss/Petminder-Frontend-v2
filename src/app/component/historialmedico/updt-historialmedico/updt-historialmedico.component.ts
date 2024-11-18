import { CommonModule } from '@angular/common';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { HistorialMedico } from '../../../model/historialmedico';
import { HistorialMedicoService } from '../../../service/historialmedico.service';
import { Mascota } from '../../../model/mascota';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-updt-historialmedico',
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
    NavbarHomeComponent,
    MatSnackBarModule
  ],
  templateUrl: './updt-historialmedico.component.html',
  styleUrl: './updt-historialmedico.component.css'
})
export class UpdtHistorialMedicoComponent implements OnInit {
  @Input() mascota!: Mascota;
  @Input() historial: HistorialMedico | null = null;
  @Output() formClosed = new EventEmitter<void>();

  historialForm!: FormGroup;

  constructor(private fb: FormBuilder, private historialService: HistorialMedicoService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.historialForm = this.fb.group({
      descripcion: [this.historial?.descripcion || '', [Validators.required]],
      diagnostico: [this.historial?.diagnostico || '', [Validators.required]],
      tratamiento: [this.historial?.tratamiento || '', [Validators.required]],
      fecha: [this.historial?.fecha || '', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.historialForm.valid) {
      const historialData: HistorialMedico = {
        id: this.historial?.id || undefined, // Incluye el ID si existe
        ...this.historialForm.value,
        mascota_id: this.mascota.id,
      };
  
      if (this.historial?.id) {
        // Modificar
        this.historialService.updateHistorial(this.historial.id, historialData).subscribe({
          next: () => {
            this.showSnackbar('Historial modificado correctamente');
            this.closeForm();
          },
          error: (err) => {
            console.error('Error al modificar historial:', err);
            this.showSnackbar('Error al modificar el historial');
          },
        });
      } else {
        // Registrar nuevo
        this.historialService.addHistorial(historialData).subscribe({
          next: () => {
            this.showSnackbar('Historial registrado correctamente');
            this.closeForm();
          },
          error: (err) => {
            console.error('Error al registrar historial:', err);
            this.showSnackbar('Error al registrar el historial');
          },
        });
      }
    }
  }
  
  
  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
  

  closeForm(): void {
    this.formClosed.emit();
  }
}