import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import {MenuItem} from 'primeng/api';
import { AuthService } from '../auth/auth-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];



  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService, private router: Router) {
    this.items = [];
    this.primengConfig.ripple = true;
    
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

}
