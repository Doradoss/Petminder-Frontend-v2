import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Mascota } from '../../../model/mascota';
import { RecomendacionDieta } from '../../../model/recomendaciondieta';
import { EventEmitter } from '@angular/core';
import { RecomendacionDietaService } from '../../../service/recomendaciondieta.service';

@Component({
  selector: 'app-updt-recomendaciondieta',
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
  templateUrl: './updt-recomendaciondieta.component.html',
  styleUrl: './updt-recomendaciondieta.component.css'
})
export class UpdtRecomendacionDietaComponent implements OnInit {
  @Input() mascota!: Mascota;
  @Input() recomendacion: RecomendacionDieta | null = null;
  @Output() formClosed = new EventEmitter<void>();

  form!: FormGroup;
  dietas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private recomendacionDietaService: RecomendacionDietaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fecha: [this.recomendacion?.fecha || '', Validators.required],
      dieta_id: [this.recomendacion?.dieta_id || '', Validators.required],
    });

    this.recomendacionDietaService.getDietas().subscribe((data) => (this.dietas = data));
  }

  onSubmit(): void {
    const recomendacionData: RecomendacionDieta = {
      ...this.recomendacion,
      ...this.form.value,
      mascota_id: this.mascota.id,
    };

    if (this.recomendacion?.id) {
      this.recomendacionDietaService
        .updateRecomendacionDieta(this.recomendacion.id, recomendacionData)
        .subscribe(() => this.formClosed.emit());
    } else {
      this.recomendacionDietaService
        .addRecomendacionDieta(recomendacionData)
        .subscribe(() => this.formClosed.emit());
    }
  }

  cancel(): void {
    this.formClosed.emit();
  }
}