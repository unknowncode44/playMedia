import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { CurrentUser } from '../models/currente-user.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  

  usrList: AngularFireList<CurrentUser>;

  constructor(private db: AngularFireDatabase) {
    this.usrList = db.list<CurrentUser>('users');
   }

  saveUser(user: CurrentUser, uid: string){
    return this.db.list('users').set(uid, user);
  };


}
