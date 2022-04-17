import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { dashboardRoutes } from './components/dashboard/dashboard.routes';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { 
    path: '', 
    component: DashboardComponent,
    children: dashboardRoutes,
  },
  { path: '**', redirectTo: ''}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
