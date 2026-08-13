import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MaterieComponent } from './pages/materie/materie.component';
import { CompetenzeComponent } from './pages/competenze/competenze.component';
import { RichiesteComponent } from './pages/richieste/richieste.component';
import { NuovaRichiestaComponent } from './pages/nuova-richiesta/nuova-richiesta.component';
import { AppuntamentiComponent } from './pages/appuntamenti/appuntamenti.component';
import { AdminComponent } from './pages/admin/admin.component';

import { authGuard } from './guards/auth.guard';
import { studentGuard } from './guards/student.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'registrazione',
    component: RegisterComponent
  },

  {
    path: 'materie',
    component: MaterieComponent,
    canActivate: [authGuard]
  },

  {
    path: 'competenze',
    component: CompetenzeComponent,
    canActivate: [studentGuard]
  },

  {
    path: 'richieste',
    component: RichiesteComponent,
    canActivate: [studentGuard]
  },

  {
    path: 'nuova-richiesta',
    component: NuovaRichiestaComponent,
    canActivate: [studentGuard]
  },

  {
    path: 'appuntamenti',
    component: AppuntamentiComponent,
    canActivate: [studentGuard]
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];