import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DietaService } from '../../../service/dieta.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';

@Component({
  selector: 'app-updt-dietas',
  templateUrl: './updt-dietas.component.html',
  styleUrls: ['./updt-dietas.component.css'],
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
    NavbarHomeComponent
  ]
})
export class UpdtDietasComponent implements OnInit {
  dietaForm: FormGroup;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dietaService: DietaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.dietaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      indicaciones: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Asegúrate de convertirlo a número
    console.log('ID obtenido de la ruta:', this.id); // Verifica si el ID está llegando correctamente
  
    if (this.id) {
      // Si el ID existe, carga los datos de la dieta
      this.dietaService.getDieta(this.id).subscribe(dieta => {
        this.dietaForm.patchValue(dieta);
      });
    } else {
      console.error('ID no encontrado en la ruta');
    }
  }

  onSubmit(): void {
    if (this.dietaForm.valid) {
      const dieta = this.dietaForm.value;
      if (this.id) {
        // Solo para actualizar
        dieta.id = this.id; // Agrega explícitamente el ID si es una edición
        this.dietaService.updateDieta(this.id, dieta).subscribe(() => {
          this.showSnackbar('Dieta actualizada exitosamente');
          this.router.navigate(['/dieta-list']);
        });
      } else {
        // Para crear
        delete dieta.id; // Asegúrate de que no se envíe un ID
        this.dietaService.addDieta(dieta).subscribe(() => {
          this.showSnackbar('Dieta registrada exitosamente');
          this.router.navigate(['/dieta-list']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/dieta-list']);
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
