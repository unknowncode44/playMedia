import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth) { }

  initFirebaseUser() {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
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
