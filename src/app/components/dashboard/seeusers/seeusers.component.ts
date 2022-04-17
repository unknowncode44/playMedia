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

  filterValue: string;

  first: number =  0;
  rows: number  = 10;
  loading: boolean = true




  constructor(private db: AngularFireDatabase) {
    this.items = db.list('users').valueChanges();
    this.usrs = []
    this.filterValue = '';

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
      this.loading = false
      
    })
    this.usrs = array
    
  }



  next() {
    this.first = this.first + this.rows
  }

  prev() {
    this.first = this.first - this.rows
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

  filter(value: string) {
    let filteredArray = [];
    console.log(`valor: ${value}`);
    
    for (let i = 0; i < this.usrs.length; i++) {
      if(this.usrs[i].email.valueOf().startsWith(value)){
        filteredArray.unshift(this.users[i])
      }

    }
    console.log(` usuarios: ${filteredArray.length}`);
      this.usrs = filteredArray

    return this.usrs
  }

  detTypeUsr(code: number): string {
    switch (code) {
      case 1:
        return 'Vendedor'
      case 2:
        return 'Cliente'
      default:
        return 'Administrador'
    }
  }
  detSuscrB(date: string): boolean {
    let today = new Date()
    let expDate = new Date(date)

    if (today >= expDate) {
      return true
    }
    else {
      return false
    }
  }

  detSuscr(date: string): string {
    let today = new Date()
    let expDate = new Date(date)

    if (today >= expDate) {
      return 'Suscripcion OK'
    }
    else {
      return 'Suscripcion Vencida'
    }
  }



  

}
