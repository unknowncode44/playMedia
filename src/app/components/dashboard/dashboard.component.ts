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
    
  }

  ngOnInit(): void {
    if(this.authService.auth.currentUser === null) {
      this.router.navigate(['login'])
    }
    this.primengConfig.ripple = true;
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

  // sidebarOpen() {
  //   this._sidebar.open()
  // }

  // sidebarClose() {
  //   this._sidebar.close()
  // }
}
