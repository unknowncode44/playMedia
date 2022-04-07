import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];



  constructor(private primengConfig: PrimeNGConfig) {
    this.items = [];
    
  }

  ngOnInit(): void {
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

  

  // sidebarOpen() {
  //   this._sidebar.open()
  // }

  // sidebarClose() {
  //   this._sidebar.close()
  // }
}
