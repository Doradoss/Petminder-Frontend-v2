import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { UpdtMascotasComponent } from '../../mascotas/updt-mascotas/updt-mascotas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdtHistorialMedicoComponent } from '../../historialmedico/updt-historialmedico/updt-historialmedico.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Mascota } from '../../../model/mascota';
import { RecomendacionDieta } from '../../../model/recomendaciondieta';
import { RecomendacionDietaService } from '../../../service/recomendaciondieta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdtRecomendacionDietaComponent } from '../updt-recomendaciondieta/updt-recomendaciondieta.component';

@Component({
  selector: 'app-list-recomendaciondieta',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    
    RouterModule,
    NavbarHomeComponent,
    UpdtMascotasComponent,
    FormsModule,
    UpdtRecomendacionDietaComponent,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './list-recomendaciondieta.component.html',
  styleUrl: './list-recomendaciondieta.component.css'
})
export class ListRecomendacionDietaComponent implements OnInit {
  @Input() mascota!: Mascota;
  @Output() onCancel = new EventEmitter<void>();
  recomendaciones: RecomendacionDieta[] = [];
  isFormOpen = false;
  selectedRecomendacion: RecomendacionDieta | null = null;

  constructor(
    private recomendacionDietaService: RecomendacionDietaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRecomendaciones();
  }

  loadRecomendaciones(): void {
    if (this.mascota?.id) {
      this.recomendacionDietaService
        .getRecomendacionesPorMascota(this.mascota.id)
        .subscribe({
          next: (data) => {
            this.recomendaciones = data.map((recomendacion) => ({
              id: recomendacion.id,
              nombreDieta: recomendacion.nombreDieta,
              indicaciones: recomendacion.indicaciones,
              fecha: recomendacion.fecha || null, // Asigna null si no hay fecha
            }));
            console.log('Recomendaciones cargadas:', this.recomendaciones);
          },
          error: (err) => {
            console.error('Error al cargar recomendaciones:', err);
            this.showSnackbar('Error al cargar las recomendaciones.');
          },
        });
    }
  }
  
  

  openForm(recomendacion: RecomendacionDieta | null): void {
    this.selectedRecomendacion = recomendacion;
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.selectedRecomendacion = null;
    this.isFormOpen = false;
    this.loadRecomendaciones(); // Recargar recomendaciones al cerrar el formulario
  }
  

  deleteRecomendacion(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta recomendación?')) {
      this.recomendacionDietaService.deleteRecomendacionDieta(id).subscribe({
        next: () => {
          this.recomendaciones = this.recomendaciones.filter((r) => r.id !== id);
          this.showSnackbar('Recomendación eliminada.');
        },
        error: () => this.showSnackbar('Error al eliminar recomendación.'),
      });
    }
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
  cancelAndEmit(): void {
    this.cancel();
    this.onCancel.emit();
  }
  cancel(): void {
    this.isFormOpen = false;
    this.selectedRecomendacion = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascota'] && changes['mascota'].currentValue) {
      this.loadRecomendaciones(); // Recargar recomendaciones para la nueva mascota
    }
  }

  
  
}