import { Routes } from '@angular/router';
import { PacienteFormComponent } from './components/paciente-form/paciente-form.component';
import { PacienteListComponent } from './components/paciente-list/paciente-list.component';
import { PacienteEditComponent } from './components/paciente-edit/paciente-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
  { path: 'pacientes', component: PacienteListComponent },
  { path: 'pacientes/novo', component: PacienteFormComponent },
  { path: 'pacientes/editar/:codigo', component: PacienteEditComponent },
];
