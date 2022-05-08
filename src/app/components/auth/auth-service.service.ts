import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { deleteUser, User } from '@firebase/auth';
import { Router } from '@angular/router';
import {CurrentUser} from '../../models/currente-user.model'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user?: User
  currentUser?: string

  constructor(public auth: AngularFireAuth, public router: Router) {
  }

  initFirebaseUser(path: string) {
    let uid
    this.auth.authState.subscribe(fuser => {
      if(fuser === null) {
        this.router.navigateByUrl(`/${path}`)
      }
      uid = fuser!.uid
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
        code = 2;
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
