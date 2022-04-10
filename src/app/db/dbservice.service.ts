import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { CurrentUser } from '../models/currente-user.model';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  path: string = ''

  constructor(private db: AngularFireDatabase) {
    
   }

  saveUser(user: CurrentUser, uid: string){
    return this.db.list('users').set(uid, user);
  };

}
