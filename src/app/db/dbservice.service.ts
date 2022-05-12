import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { CurrentUser } from '../models/currente-user.model';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';
import { Sample } from '../models/sample.model';
import { User } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  

  usrList: AngularFireList<CurrentUser>;
  users: CurrentUser[] = []
  channelList: Channel[];

  constructor(private db: AngularFireDatabase) {
    this.channelList = []
    this.usrList = db.list<CurrentUser>('users');
    this.usrList.valueChanges().subscribe(users => {
      this.users = users
    })
    
   }
  
  checkUserRole(uid: string): number {
    let number  = 0
    let usrsList: CurrentUser[] = this.users
    for (let i = 0; i < usrsList.length; i++) {
      const e = this.users[i];
      
      console.log(e.uid);
      console.log(uid);
      
      if(e.uid === uid){
        number = e.role
        break
      }
      
    }
    return number
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

  editChannelFeature(chnlIndex: string, sampleIndx: string, sample: Sample) {
    return this.db.object(`channels/${chnlIndex}/samples/${sampleIndx}`).update(sample)
  }

  deleteChannel(chnlIndex: string, sampleIndx: string) {
    return this.db.object(`channels/${chnlIndex}/samples/${sampleIndx}`).remove()
  }

  getChannels(): Observable<any[]>{
    return this.db.list('/channels').valueChanges()
  }

  getUserType(uid: string) {
    let type: number
    let user = this.db.object<User>(`/users/${uid}`).valueChanges()
    if(user === null) {
      return user
    }
    else {
      return
    }
  }

  deleteUser(uid: string) {
    this.db.object(`/users/${uid}/sessions`).remove()
    return this.db.object(`/users/${uid}`).remove()
  }



 


}
