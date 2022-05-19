import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { deleteUser, User } from '@firebase/auth';
import { Router } from '@angular/router';
import {CurrentUser} from '../../../models/currente-user.model'

//ngrx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as authActions from '../auth.actions';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user?: User
  currentUser?: string
  

  constructor(
    private auth: AngularFireAuth, 
    private router: Router,
    private store: Store<AppState>,
    private db: AngularFireDatabase
  ){}
  
   
  initFirebaseUser(path: string) {
    let uid
    this.auth.authState.subscribe(fuser => {
      
      if (fuser) {
        
        uid = fuser!.uid
        this.db.object<CurrentUser>(`users/${uid}`).valueChanges()
        .subscribe(
          dbUser => {
            let _user: CurrentUser
            _user = dbUser!
            this.store.dispatch( authActions.setUser({user: _user}) )
          }
        )

      }

      else {
        this.store.dispatch( authActions.unSetUser() )
        this.router.navigateByUrl(`/${path}`)
      }
     
      // this.store.dispatch( authActions.setUser() )
    })

    return uid
  }

  getUserUid(): string{
    let uid = ''
    this.auth.currentUser.then((credentials) => {
      uid = credentials!.uid
    })
    return uid
  }

  logIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  logOut() {
    this.auth.signOut();
  }

  deleteUser(uid: string){
    
  }

  catchRole(role: string): number {
    var code: number;
    switch (role) {
      case 'Cliente':
        code = 2;
        break;
      case 'Vendedor':
        code = 1;
        break;
      default:
        code = 0;
    }

    return code;

  }

  catchPlan(plan: string): number {
    var code: number;
    switch (plan) {
      case 'Demo 3 horas':
        code = 0;
        break;
      case 'Pack Estandar Mensual':
        code = 1;
        break;
      case 'Pack Futbol Mensual':
        code = 2;
        break;
      case 'Pack Adultos Mensual':
        code = 2;
        break;
      default:
        code = 0;
    }

    return code;

  }





}
