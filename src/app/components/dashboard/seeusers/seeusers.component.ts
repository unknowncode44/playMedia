import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/db/dbservice.service';
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
  usrsBk: CurrentUser[];

  filterValue: string;

  msgs: Message[] = [];

  first: number =  0;
  rows: number  = 10;
  loading: boolean = true
  renewUserVisible: boolean = false

  email?       : string
  expireDate?  : string
  type?        : string
  newDate?     : string






  constructor(
    private db: AngularFireDatabase, 
    private dbService: DbService, 
    private confirmation: ConfirmationService, 
    private router: Router, 
    private messages: MessageService) {
    this.items = db.list('users').valueChanges();
    this.usrs = [];
    this.usrsBk = []
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

  ifTest(type: number): string {
    if(type === 0){
      return 'Si'
    }
    else {
      return 'No'
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

  timeToMinutes(type: number, epochTime: number): string{
    if(type === 0) {
      let time = new Date(epochTime)
      let minutes: string
      let seconds: string

      if(time.getMinutes() < 10){
        minutes = `0${time.getMinutes()}`
      }
      else{
        minutes = time.getMinutes().toString()
      }

      if(time.getSeconds() < 10){
        seconds = `0${time.getSeconds()}`
      }
      else{
        seconds = time.getSeconds().toString()
      }
      
      if(epochTime === 10800000){
        return `03:00:00`
      }
      else{
        return `0${(time.getHours()-21).toString()}:${minutes}:${seconds}`
      }
    }
    else {
      return ''
    }
    
  }

  confirmRenew(date: string, type: number, userEmail: string){
    let typeStr: string
    if(!this.renewUserVisible){
      this.renewUserVisible = true
    }
    if(type === 0){
      typeStr = 'Si, si activas la renovacion se desactivara el demo, y el usuario pasara a plan mensual'
    }
    else {
      typeStr = 'No'
    }

    this.email      = userEmail
    this.expireDate = date
    this.type       = typeStr
    this.newDate    = this.renewSuscription(date)

    
  }



  renewSuscription(date: string): string{  // MSO: formato requerido DD/MM/YYYY
    var now = new Date()
    var dateParts = date.split("/");
    var expireDate = new Date(+dateParts[2], +dateParts[1], +dateParts[0])

    var dateObject = now.getTime() > expireDate.getTime() ? now : expireDate

    console.log(`NOW:   ${now.getTime()}`);
    console.log(`EXPIRE:   ${expireDate.getTime()}`);
    


    let _date: number = dateObject.getDate()
    let _month: number = dateObject.getMonth()
    let _dateStr:  string = dateObject.getDate().toString()
    var _monthStr: string = (dateObject.getMonth() +1).toString() 
    let _yearStr:  string = dateObject.getFullYear().toString()
    

    if (_date < 10) {
      _dateStr = `0${_dateStr}`
    }
    if (_month < 10) {
      _monthStr = `0${_monthStr}`
    }

    let newDate: string = `${_dateStr}/${_monthStr}/${_yearStr}`
    
    return newDate
    
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
        
    },
    reject: () => {
      this.msgs = [{severity:'warn', summary:'No se realizaron cambios', detail:'No se borro ningun usuario'}];
    }

    })
  }

  

}
