import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Route, RouterModule } from '@angular/router';
import { ListMascotasComponent } from './app/component/mascotas/list-mascotas/list-mascotas.component';
import { UpdtMascotasComponent } from './app/component/mascotas/updt-mascotas/updt-mascotas.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './app/component/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authGuard } from './app/guard/auth.guard';
import { ListDietasComponent } from './app/component/dietas/list-dietas/list-dietas.component';
import { UpdtDietasComponent } from './app/component/dietas/updt-dietas/updt-dietas.component';
import { HomeComponent } from './app/component/home/home.component';
import { Home2Component } from './app/component/home-2/home-2.component';
import { ListHistorialMedicoComponent } from './app/component/historialmedico/list-historialmedico/list-historialmedico.component';
import { UpdtHistorialMedicoComponent } from './app/component/historialmedico/updt-historialmedico/updt-historialmedico.component';
import { ListRecomendacionDietaComponent } from './app/component/recomendaciondieta/list-recomendaciondieta/list-recomendaciondieta.component';
import { UpdtRecomendacionDietaComponent } from './app/component/recomendaciondieta/updt-recomendaciondieta/updt-recomendaciondieta.component';
import { TiporecordatorioComponent } from './app/component/tiporecordatorio/tiporecordatorio.component';
import { RecordatorioComponent } from './app/component/recordatorio/recordatorio.component';
import { AddRecordatorioComponent } from './app/component/recordatorio/add-recordatorio/add-recordatorio.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const routes: Route[] = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mascota-list', canActivate: [authGuard], component: ListMascotasComponent },
  { path: 'mascota-add', canActivate: [authGuard], component: UpdtMascotasComponent },
  { path: 'mascota-edit/:id', canActivate: [authGuard], component: UpdtMascotasComponent },
  { path: 'dieta-list', canActivate: [authGuard], component: ListDietasComponent },
  { path: 'dieta-add', canActivate: [authGuard], component: UpdtDietasComponent },
  { path: 'dieta-edit/:id', canActivate: [authGuard], component: UpdtDietasComponent},

  { path: 'historialmedico-list', canActivate: [authGuard], component: ListHistorialMedicoComponent },
  { path: 'historialmedico-add', canActivate: [authGuard], component: UpdtHistorialMedicoComponent },
  { path: 'historialmedico-edit/:id', canActivate: [authGuard], component: UpdtHistorialMedicoComponent },

  { path: 'recomendaciondieta-list', canActivate: [authGuard], component: ListRecomendacionDietaComponent },
  { path: 'recomendaciondieta-add', canActivate: [authGuard], component: UpdtRecomendacionDietaComponent },
  { path: 'recomendaciondieta-edit/:id', canActivate: [authGuard], component: UpdtRecomendacionDietaComponent },

  {path: 'tiporecordatorio',canActivate: [authGuard],component: TiporecordatorioComponent},

  {path: 'recordatorio',canActivate: [authGuard],component: RecordatorioComponent},
  {path: 'recordatorio/recordatorio-add',canActivate: [authGuard], component: AddRecordatorioComponent},  

  { path: 'home', component: HomeComponent},
  { path: 'home-secundario', canActivate: [authGuard], component: Home2Component}
]



bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule, RouterModule, MatToolbarModule, BrowserAnimationsModule), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"petminder-4ab03","appId":"1:356606839891:web:235d40609e3b3c12744aa6","storageBucket":"petminder-4ab03.firebasestorage.app","apiKey":"AIzaSyA3byDSq-rf62QFTtBkH6-WwvOPVRn12GE","authDomain":"petminder-4ab03.firebaseapp.com","messagingSenderId":"356606839891"})), provideFirestore(() => getFirestore())]
}).catch((err) => console.error(err));

