import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import {MenuItem} from 'primeng/api';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../auth/auth_services/auth-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];

  user: CurrentUser;

  visible: boolean = true


  constructor(
    private primengConfig: PrimeNGConfig, 
    private authService: AuthService, 
    private router: Router, 
    private db: AngularFireDatabase) {
    this.items = [];
    this.primengConfig.ripple = true;
    this.user  = JSON.parse(localStorage.getItem('currentUser')!.toString())
  }

  ngOnInit(): void {
    this.authService.initFirebaseUser('login');

    this.items = [{
      label: 'Nuevo Usuario',
      icon:'pi pi-plus'
    },
    {
      label: 'Ver Usuarios',
      icon: 'pi pi-plus'
    },]
  }

  logOut() {
    this.authService.logOut()
    this.router.navigate(['login'])
  }

  customNavigate(path: string){
    this.router.navigate([path])
  }

}
