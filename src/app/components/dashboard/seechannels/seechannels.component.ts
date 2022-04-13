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



  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
