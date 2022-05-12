import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { DbService } from 'src/app/db/dbservice.service';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-seeusers',
  templateUrl: './seeusers.component.html',
  styleUrls: ['./seeusers.component.css']
})
export class SeeusersComponent implements OnInit {

  users: Observable<CurrentUser[]> | Observable<any> | any;

  items: Observable<any[]>;

  usrs: CurrentUser[];
  usrsBk: CurrentUser[];

  filterValue: string;

  msgs: Message[] = [];

  first: number =  0;
  rows: number  = 10;
  loading: boolean = true

  suscription?: Subscription




  constructor(private db: AngularFireDatabase, private dbService: DbService, private confirmation: ConfirmationService, private router: Router, private messages: MessageService) {
    this.items = db.list('users').valueChanges();
    this.usrs = [];
    this.usrsBk = []
    this.filterValue = '';

   }

  ngOnInit(): void {
    var array: CurrentUser[] = []
    this.suscription = this.users = this.db.list<CurrentUser>('users').valueChanges().pipe(take(1))
    .subscribe(users => {
      console.log(users)
      this.users = users
      for (let i = 0; i < users.length; i++) {
        array.push(users[i])
      }
      this.loading = false
    })

    
    
    this.usrs = array
    this.usrsBk = this.usrs
    
  }

  blockUser(uid: string) {
    if(uid === undefined) {this.messages.add({severity:'error', summary:'Usuario Ya Bloqueado', detail:`El usuario elegido ya fue bloqueado antes`})}
    else {
      this.db.object(`users/${uid}`).set({active: false}).then(() => {
        this.messages.add({severity:'success', summary:'Usuario Bloqueado', detail:`El usuario con ID: ${uid} fue bloqueado`})
        setTimeout(() => {
          this.messages.clear();
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['users']);
          });
        }, 1500);
      })
    }
    
  }


  ifBlocked(status: boolean): string {
    if(!status){
      return 'Bloqueado'
    }
    else {
      return 'Ok'
    }
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
    this.usrs = this.usrsBk
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

  async deleteUser(uid: string, email: string) {
    this.dbService.deleteUser(uid)
    this.msgs = [{severity:'success', summary:'Usuario Eliminado', detail:`El usuario ${email} fue eliminado correctamente`}];
    setTimeout(() => {
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['users']);
      });
    }, 1500)

  }


  confirm(uid: string, email: string) {
    this.confirmation.confirm({
      message: `Estas seguro que queres borrar al usuario ${email}??`,
      header: 'Borrar Usuario',
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Si, estoy seguro',
      rejectLabel: 'No, mejor no',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      accept: () => {
        this.deleteUser(uid, email);
        // 
    },
    reject: () => {
      this.msgs = [{severity:'warn', summary:'No se realizaron cambios', detail:'No se borro ningun usuario'}];
    }

    })
  }

  

}
