import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CurrentUser } from 'src/app/models/currente-user.model';

@Component({
  selector: 'app-seeusers',
  templateUrl: './seeusers.component.html',
  styleUrls: ['./seeusers.component.css']
})
export class SeeusersComponent implements OnInit {

  users: Observable<CurrentUser[]> | Observable<any> | any;

  items: Observable<any[]>;

  usrs: CurrentUser[];

  first: number =  0;
  rows: number  = 10;




  constructor(private db: AngularFireDatabase) {
    this.items = db.list('users').valueChanges();
    this.usrs = []

   }

  ngOnInit(): void {
    var array: CurrentUser[] = []
    this.users = this.db.list<CurrentUser>('users').valueChanges()
    .subscribe(users => {
      console.log(users)
      this.users = users
      for (let i = 0; i < users.length; i++) {
        array.push(users[i])
      }
      
    })
    this.usrs = array
  }

  next() {
    this.first + this.rows
  }

  prev() {
    this.first - this.rows
  }

  reset() {
    this.first = 0
  }

  isLastPage(): boolean {
    return this.usrs ? this.first === (this.usrs.length - this.rows) : true
  }

  isFirstPage(): boolean {
    return this.usrs ? this.first === 0 : true
  }



  

}
