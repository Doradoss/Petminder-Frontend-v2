import { Component} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DietaService } from '../../../service/dieta.service';
import { Dieta } from '../../../model/dieta';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-list-dietas',
  templateUrl: './list-dietas.component.html',
  styleUrl: './list-dietas.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    RouterModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavbarHomeComponent,
    MatExpansionModule,
  ]
})
export class ListDietasComponent {
  dietas: Dieta[] = [];
  formFecha: FormGroup;
  displayedColumns: string[] = ['nombre', 'indicaciones', 'fecha_creacion'];
  filteredDietas = new MatTableDataSource<Dieta>(this.dietas);
  mostrarBotonListadoGeneral: boolean = false;

  constructor(
    private dietaService: DietaService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formFecha = this.fb.group({
      fecha: [null, Validators.required], // Campo para ingresar la fecha
    });
  }

  ngOnInit(): void {
    this.dietaService.getDietas().subscribe(data => {
      this.dietas = data;
      this.filteredDietas.data = this.dietas;
      this.filteredDietas._updateChangeSubscription();
      this.cargarDietasPorFecha();
    });
  }

  deleteDieta(id: number): void {
    this.dietaService.deleteDieta(id).subscribe(() => {
      this.dietas = this.dietas.filter(dieta => dieta.id !== id);
      this.filteredDietas.data = this.dietas;
      this.snackBar.open('Dieta eliminada con éxito', 'Cerrar', {
        duration: 3000,
      });
    }, error => {
      this.snackBar.open('Error al eliminar la dieta', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  editDieta(id: number): void {
    this.router.navigate(['/dieta-edit', id]);
  }
  cargarDietasPorFecha(): void {
    const fechaSeleccionada = this.formFecha.get('fecha')?.value;
    if (fechaSeleccionada) {
      const fechaFormateada = new Date(fechaSeleccionada).toISOString().split('T')[0];
      this.dietaService.getDietasPorFecha(fechaFormateada).subscribe((dietas) => {
        this.dietas = dietas.map((dieta) => ({
          ...dieta,
          expanded: false, // Inicializamos el estado de expansión
        }));
        this.mostrarBotonListadoGeneral = true; // Mostrar el botón después de buscar
      });
    }
  }
  
  listarTodas() {
    this.dietaService.getDietas().subscribe((dietas) => {
      this.dietas = dietas;
      this.mostrarBotonListadoGeneral = false; // Ocultar el botón al volver al listado general
    });
  }
}