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

  editChannelFeature(chnlIndex: string, sampleIndx: string, sample: Sample) {
    return this.db.object(`channels/${chnlIndex}/samples/${sampleIndx}`).update(sample)
  }

  deleteChannel(chnlIndex: string, sampleIndx: string) {
    return this.db.object(`channels/${chnlIndex}/samples/${sampleIndx}`).remove()
  }

  getChannels(): Observable<any[]>{
    return this.db.list('/channels').valueChanges()
  }

  deleteUser(uid: string) {
    return this.db.object(`/users/${uid}`).remove()
  }



 


}
