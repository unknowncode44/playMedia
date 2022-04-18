import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { CurrentUser } from '../models/currente-user.model';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';
import { Sample } from '../models/sample.model';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  

  usrList: AngularFireList<CurrentUser>;
  channelList: Channel[];

  constructor(private db: AngularFireDatabase) {
    this.channelList = []
    this.usrList = db.list<CurrentUser>('users');
    
   }

  saveUser(user: CurrentUser, uid: string){
    return this.db.list('users').set(uid, user);
  };

  updateDRM(samplesArr: Sample[], index: number, category: string) {
    this.db.list(`channel_test/${index.toString()}`).set('name', category).then(() => {
      return this.db.list(`channels/${index.toString()}`).set('samples', samplesArr)
    })
  }

  addChannel(index: number, channel: Sample  ) {
   this.db.object(`channels/${index.toString()}/samples`).set(channel)
  }

  getChannels(): Observable<any[]>{

    return this.db.list('/channels').valueChanges()
  }

 


}
