import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { deleteUser, User } from '@firebase/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user?: User

  constructor(public auth: AngularFireAuth, public router: Router) {
   }

  initFirebaseUser(path: string) {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
      if(fuser === null) {
        this.router.navigateByUrl(`/${path}`)
      }
    })
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
        code = 1;
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
