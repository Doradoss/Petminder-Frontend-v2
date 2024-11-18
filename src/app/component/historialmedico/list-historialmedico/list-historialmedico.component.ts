import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { UpdtMascotasComponent } from '../../mascotas/updt-mascotas/updt-mascotas.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialMedico } from '../../../model/historialmedico';
import { HistorialMedicoService } from '../../../service/historialmedico.service';
import { Mascota } from '../../../model/mascota';
import { UpdtHistorialMedicoComponent } from '../updt-historialmedico/updt-historialmedico.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-list-historialmedico',
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
    UpdtHistorialMedicoComponent,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
    
  ],
  templateUrl: './list-historialmedico.component.html',
  styleUrl: './list-historialmedico.component.css'
})
export class ListHistorialMedicoComponent implements OnInit, OnChanges {
  @Input() mascota!: Mascota;
  @Output() onCancel = new EventEmitter<void>(); // Evento para notificar al padre

  historiales: HistorialMedico[] = [];
  selectedHistorial: HistorialMedico | null = null;
  isFormOpen: boolean = false;

  filterForm: FormGroup;
    // Variables para el filtro
    filterStartDate: Date | null = null;
    filterEndDate: Date | null = null;

  constructor(
    private historialMedicoService: HistorialMedicoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadHistoriales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascota'] && changes['mascota'].currentValue) {
      this.loadHistoriales(); // Recargar historiales de la nueva mascota
    }
  }
  

  // Cargar historiales de la mascota actual
  loadHistoriales(): void {
    if (this.mascota?.id) {
      this.historialMedicoService
        .getHistorialesPorMascota(this.mascota.id)
        .subscribe({
          next: (data) => {
            this.historiales = data.sort(
              (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            console.log('Datos cargados desde el servicio:', this.historiales);
          },
          error: () =>
            this.snackBar.open(
              'Error al cargar los historiales médicos.',
              'Cerrar',
              { duration: 3000 }
            ),
        });
    }
  }
  
    // Aplicar filtro por rango de fechas
    applyFilter(): void {
      // Validar que se hayan seleccionado fechas y que sean válidas
      if (!this.filterStartDate || !this.filterEndDate) {
        this.showSnackbar('Por favor selecciona un rango de fechas válido.');
        return;
      }
    
      // Formatear las fechas a 'YYYY-MM-DD'
      const from = new Date(this.filterStartDate).toISOString().split('T')[0];
      const to = new Date(this.filterEndDate).toISOString().split('T')[0];
    
      // Validar que las fechas tengan un orden lógico (desde <= hasta)
      if (new Date(from) > new Date(to)) {
        this.showSnackbar('La fecha inicial no puede ser mayor que la fecha final.');
        return;
      }
    
      console.log('Aplicando filtro con mascotaId:', this.mascota.id, 'Desde:', from, 'Hasta:', to);
    
      this.historialMedicoService
        .getHistorialesPorMascotaYFecha(this.mascota.id, from, to)
        .subscribe({
          next: (data) => {
            this.historiales = data.sort(
              (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            console.log('Historiales filtrados:', this.historiales);
            this.showSnackbar('Filtro aplicado correctamente.');
          },
          error: (err) => {
            console.error('Error al aplicar filtro:', err);
            this.showSnackbar('Error al aplicar filtro.');
          },
        });
    }
    
    
    
    // Limpiar filtro y recargar todos los historiales
    clearFilter(): void {
      this.filterStartDate = null;
      this.filterEndDate = null;
      this.loadHistoriales(); // Cargar todos los historiales
      this.showSnackbar('Filtro eliminado. Mostrando todos los registros.');
    }
    
  // Abrir formulario para registrar/editar
  openForm(historial: HistorialMedico | null = null): void {
    this.selectedHistorial = historial; // Asigna el historial seleccionado
    this.isFormOpen = true; // Abre el formulario
  }  

  // Cerrar formulario y refrescar lista
  closeForm(): void {
    this.selectedHistorial = null;
    this.isFormOpen = false;
    this.loadHistoriales(); // Recargar registros
  }

  // Eliminar un historial
  deleteHistorial(id: number): void {
    if (id === undefined || id === null || isNaN(id)) {
      console.error('El ID del historial es indefinido, nulo o inválido:', id);
      this.showSnackbar('Error: No se pudo eliminar el registro. ID inválido.');
      return;
    }
  
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.historialMedicoService.deleteHistorial(id).subscribe({
        next: () => {
          this.historiales = this.historiales.filter((h) => h.id !== id); // Actualiza la lista
          this.showSnackbar('Registro eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar historial:', err);
          this.showSnackbar('Error al eliminar el registro');
        },
      });
    }
  }
  
  
  
  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
  
  

  // Cancelar y notificar al componente padre
  cancel(): void {
    this.selectedHistorial = null; // Limpia el historial seleccionado
    this.isFormOpen = false;       // Cierra cualquier formulario abierto
    this.historiales = [];         // Limpia la lista de historiales
    this.onCancel.emit();          // Notifica al padre
  }
  
}