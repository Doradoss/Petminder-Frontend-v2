import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MascotaService } from '../../../service/mascota.service';
import { Mascota } from '../../../model/mascota';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { NavbarHomeComponent } from '../../navbar-home/navbar-home.component';
import { UpdtMascotasComponent } from '../updt-mascotas/updt-mascotas.component';
import { FormsModule } from '@angular/forms';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { HistorialMedicoService } from '../../../service/historialmedico.service';
import { UpdtHistorialMedicoComponent } from '../../historialmedico/updt-historialmedico/updt-historialmedico.component';
import { ListHistorialMedicoComponent } from '../../historialmedico/list-historialmedico/list-historialmedico.component';
import { MatAccordion } from '@angular/material/expansion';
import { UpdtRecomendacionDietaComponent } from '../../recomendaciondieta/updt-recomendaciondieta/updt-recomendaciondieta.component';
import { ListRecomendacionDietaComponent } from '../../recomendaciondieta/list-recomendaciondieta/list-recomendaciondieta.component';


@Component({
  selector: 'app-list-mascotas',
  templateUrl: './list-mascotas.component.html',
  styleUrls: ['./list-mascotas.component.css'],
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
    NavbarHomeComponent,
    UpdtMascotasComponent,
    FormsModule,
    NgApexchartsModule,
    UpdtHistorialMedicoComponent,
    ListHistorialMedicoComponent,
    UpdtRecomendacionDietaComponent,
    ListRecomendacionDietaComponent
  ]
})
export class ListMascotasComponent implements OnInit {
  mascotas: Mascota[] = [];
  filteredMascotas: Mascota[] = []; // Para la búsqueda
  selectedMascota: Mascota | null = null;
  expandedMascotaId: number | null = null;
  editingMascota: Mascota | null = null;
  isFormOpen: boolean = false;
  username: string = 'Usuario';
  searchQuery: string = ''; // Para la barra de búsqueda
  chartOptions!: Partial<ApexOptions>; //para el chart

  showHistorial: boolean = false; // Controla la vista del historial médico
  showDietas: boolean = false; // Controla la vista de las dietas personalizadas
  

  constructor(
    private mascotaService: MascotaService,
    private loginService: LoginService,
    private router: Router,
    private historialMedicoService: HistorialMedicoService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetToDefaultView();
      }
    });
  }

  ngOnInit(): void {
    this.loginService.getUsuarioId().subscribe(usuario_id => {
      this.mascotaService.getMascotas().subscribe(data => {
        this.mascotas = data.filter(mascota => mascota.usuario_id === usuario_id);
        this.filteredMascotas = [...this.mascotas]; // Inicializa la lista filtrada
      });
    });
  
    // Obtener el nombre del usuario
    const usernameFromToken = this.loginService.getUsernameFromToken();
    if (usernameFromToken) {
      this.username = usernameFromToken;
    }

    // Configurar el gráfico inicial
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 300,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 1500 // Duración de la animación
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 10 // Barras redondeadas
        }
      },
      dataLabels: {
        enabled: false // Sin etiquetas dentro de las barras
      },
      xaxis: {
        categories: ['🐶', '🐱', '🐦', '🐇', '🐹'], // Iconos de perro, gato, ave y reptil
        labels: {
          style: {
            fontSize: '18px' // Tamaño de los íconos
          }
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Mascotas'
        }
      },
      colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#4BC0C0'], // Colores para cada barra
      series: [
        {
          name: 'Cantidad de Mascotas',
          data: [0, 0, 0, 0, 0] // Datos iniciales
        }
      ]
    };

    // Obtener las mascotas del usuario
    this.loginService.getUsuarioId().subscribe((usuario_id) => {
      this.mascotaService.getMascotas().subscribe((data) => {
        const userMascotas = data.filter(
          (mascota: any) => mascota.usuario_id === usuario_id
        );

        // Contar las especies
        const speciesCount = { Perro: 0, Gato: 0, Ave: 0, Conejo: 0 ,Hamster: 0 };
        userMascotas.forEach((mascota) => {
          if (speciesCount[mascota.especie as keyof typeof speciesCount] !== undefined) {
            speciesCount[mascota.especie as keyof typeof speciesCount]++;
          }
        });

        // Actualizar el gráfico con los datos reales
        this.chartOptions.series = [
          {
            name: 'Cantidad de Mascotas',
            data: Object.values(speciesCount)
          }
        ];
      });
    });
  }
  

  showMascotaDetails(mascota: Mascota): void {
    this.selectedMascota = mascota;
    this.isFormOpen = false;
    this.showHistorial = false; // Cierra la vista de historial médico
    this.showDietas = false; // Cierra la vista de dietas personalizadas
  }
  

  toggleOptions(id: number): void {
    this.expandedMascotaId = this.expandedMascotaId === id ? null : id;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openEditForm(mascota: Mascota): void {
    this.editingMascota = { ...mascota }; // Clonar la mascota para evitar cambios no deseados
    this.isFormOpen = true;
    this.showHistorial = false; // Asegurarse de cerrar la vista de historial
  }

  toggleForm(): void {
    this.editingMascota = null;
    this.isFormOpen = !this.isFormOpen;
    this.showHistorial = false; // Asegurarse de cerrar la vista de historial
    this.selectedMascota = null;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingMascota = null;
    this.showHistorial = false; // Cerrar también la vista de historial, si es necesario
  }

  refreshMascotas(): void {
    this.loginService.getUsuarioId().subscribe(usuario_id => {
      this.mascotaService.getMascotas().subscribe(data => {
        this.mascotas = data.filter(mascota => mascota.usuario_id === usuario_id);
        this.filteredMascotas = [...this.mascotas];
        this.closeForm();
      });
    });
  }

  deleteMascota(id: number): void {
    this.mascotaService.deleteMascota(id).subscribe(() => {
      this.mascotas = this.mascotas.filter(mascota => mascota.id !== id);
      this.filteredMascotas = [...this.mascotas];
      if (this.selectedMascota?.id === id) {
        this.selectedMascota = null;
      }
    });
  }

  filterMascotas(): void {
    this.filteredMascotas = this.mascotas.filter(mascota =>
      mascota.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

// Abrir historial médico
viewHistorial(mascota: Mascota): void {
  this.selectedMascota = mascota; // Selecciona la mascota
  this.isFormOpen = false; // Asegúrate de cerrar el formulario
  this.showHistorial = true; // Muestra historial médico
  this.showDietas = false; // Asegúrate de cerrar la vista de recomendaciones
}

// Cerrar historial médico+
closeHistorialView(): void {
  this.showHistorial = false;
  this.selectedMascota = null; // Limpia la mascota seleccionada
}
  
//DIETAS RECOMENDADAS
viewDietas(mascota: Mascota): void {
  this.selectedMascota = mascota;
  this.isFormOpen = false;
  this.showHistorial = false; // Asegurarnos de cerrar la vista de historial
  this.showDietas = true; // Activar la vista de dietas
}

closeDietasView(): void {
  this.showDietas = false;
  this.selectedMascota = null;
}

  //RESET DEFAULT VIEW
  resetToDefaultView(): void {
    this.selectedMascota = null; // Limpia la mascota seleccionada
    this.isFormOpen = false;    // Cierra cualquier formulario abierto
    this.showHistorial = false; // Cierra la vista de historial médico
    this.editingMascota = null; // Limpia el formulario de edición, si estaba abierto
  }
  
  

}