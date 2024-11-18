import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoRecordatorio } from '../../model/tiporecordatorio';
import { TiporecordatorioService } from '../../service/tiporecordatorio.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';

@Component({
  selector: 'app-tiporecordatorio',
  standalone: true,
  imports: [CommonModule,FormsModule,MatPaginatorModule,MatIconModule,NavbarHomeComponent],
  templateUrl: './tiporecordatorio.component.html',
  styleUrl: './tiporecordatorio.component.css'
})
export class TiporecordatorioComponent {
  tiposRecordatorio: TipoRecordatorio[] = [];
  tipoRecordatorio: TipoRecordatorio = { id: 0, nombre: '', descripcion: '' };
  isEdit: boolean = false;
  

  constructor(private tipoRecordatorioService: TiporecordatorioService) {}  

  ngOnInit(): void {
    this.loadTiposRecordatorio();
  }

  loadTiposRecordatorio(): void {
    this.tipoRecordatorioService.findAll().subscribe(data => {
      this.tiposRecordatorio = data;
    });
  }

   createTipoRecordatorio(): void {
    if (this.isEdit) {
      this.tipoRecordatorioService.update(this.tipoRecordatorio.id, this.tipoRecordatorio)
        .subscribe(() => {
          this.isEdit = false;
          this.tipoRecordatorio = { id: 0, nombre: '', descripcion: '' };
          this.loadTiposRecordatorio();
        });
    } else {
      this.tipoRecordatorioService.create(this.tipoRecordatorio)
        .subscribe(() => {
          this.tipoRecordatorio = { id: 0, nombre: '', descripcion: '' };
          this.loadTiposRecordatorio();
        });
    }
  }

  editTipoRecordatorio(tipo: TipoRecordatorio): void {
    this.tipoRecordatorio = { ...tipo };
    this.isEdit = true;
  }

  deleteTipoRecordatorio(id: number): void {
    this.tipoRecordatorioService.delete(id).subscribe(() => {
      this.loadTiposRecordatorio();
    });
  }
}
