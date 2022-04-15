import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/db/dbservice.service';

@Component({
  selector: 'app-seechannels',
  templateUrl: './seechannels.component.html',
  styleUrls: ['./seechannels.component.css']
})
export class SeechannelsComponent implements OnInit {

  filterValue: string;
  channels: any[] 

  first: number =  0;
  rows: number  = 10;



  constructor() { 
    this.filterValue = '';
    this.channels = [];
  }

  ngOnInit(): void {
  }

  next() {
    this.first + this.rows
  }

  prev() {
    this.first - this.rows
  }

  reset() {
    this.first = 0
    // return this.channels = this.users
  }

  isLastPage(): boolean {
    return this.channels ? this.first === (this.channels.length - this.rows) : true
  }

  isFirstPage(): boolean {
    return this.channels ? this.first === 0 : true
  }

}
