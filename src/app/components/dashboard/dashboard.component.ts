import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  _opened: boolean = true;
  _animate: boolean = true;


  constructor() {
  }

  ngOnInit(): void {
  }

  _toggleSideBar(){
    this._opened = !this._opened;
  }

  // sidebarOpen() {
  //   this._sidebar.open()
  // }

  // sidebarClose() {
  //   this._sidebar.close()
  // }
}
