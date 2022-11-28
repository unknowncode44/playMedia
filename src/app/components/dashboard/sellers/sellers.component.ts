import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CurrentUser } from 'src/app/models/currente-user.model';




@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit {

  filterValue?: string;
  users: CurrentUser[]
  sellers: CurrentUser[]
  sellersBk: CurrentUser[]
  sellersObs?: Observable<any[]>
  loading: boolean;
  pointsDialogVisible: boolean = false

  sellerEmail?: string
  sellerPoints?: number
  sellerUid?: string

 

  pointsToAdd: number

  msgs: Message[] = [];

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private messageService: MessageService,
    private afAuth: AngularFireAuth
    
    ) {
    this.users = []
    this.loading =  true
    this.sellers = []
    this.sellersBk = []
    this.pointsToAdd = 0
   }

  ngOnInit(): void {
    this.db.list<CurrentUser>('users').valueChanges().pipe(take(1))
    .subscribe(
      _sellers => {
        this.users = _sellers 
        for (let i = 0; i < _sellers.length; i++) {
          let e = _sellers[i]
          if(e.role === 1){
            this.sellers.push(e)
          }
        this.loading = false
        }
      }
    )
  }

  openAddPoints(email: string, uid: string, points: number) {
    this.pointsDialogVisible = true
    this.sellerEmail = email
    this.sellerPoints = points
    this.sellerUid = uid

  }

  increasePoints(){
    this.pointsToAdd++
  }

  addPoints(){
    let points = this.sellerPoints! + this.pointsToAdd
    this.db.object<CurrentUser>(`users/${this.sellerUid}`).update({points: points})
    this.msgs = [{severity:'success', summary:'Puntos Agregados', detail:`Se agregaron ${this.pointsToAdd.toString()} al usuario ${this.sellerEmail}`}];
    
    this.pointsDialogVisible = false
    setTimeout(() => {
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['sellers']);
        
      });
    }, 1500)
    this.messageService.add(this.msgs[0])
  }


  filter(value: string){
    this.loading = true
    this.sellers = this.sellersBk
    let filteredArray = [];
    console.log(`valor: ${value}`);
    
    for (let i = 0; i < this.sellers.length; i++) {
      if(this.sellers[i].email.valueOf().startsWith(value)){
        filteredArray.unshift(this.sellers[i])
      }

    }
      this.sellers = filteredArray
      this.loading = false

    return this.sellers
  }

  deleteUser(user: string){
    console.log(user);
    this.db.object<CurrentUser>(`users/${user}`).remove().then( () => {
      this.loading = true
      this.msgs = [{severity:'success', summary:'Vendedor Eliminado', detail:`Se elimino al usuario ${this.sellerEmail}`}];
      setTimeout(() => {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['sellers']);
          
        });
        this.loading = false
      }, 1500)
    }
      
    )
  }

}
