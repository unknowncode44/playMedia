import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CurrentUser } from 'src/app/models/currente-user.model';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  userObs?: Observable<CurrentUser>
  inheritedUser?: CurrentUser 
  uid?: string


  constructor(private db: AngularFireDatabase) { 
    this.inheritedUser = JSON.parse(localStorage.getItem('currentUser')!)
    this.uid = this.inheritedUser!.uid
    this.db.object<CurrentUser>(`users/${this.uid}`).valueChanges()
    .subscribe(user => {
      this.inheritedUser!.role = user!.role
    })
    
    

  }

  ngOnInit(): void {
  }

}
