import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/db/dbservice.service';
import { Channel } from 'src/app/models/channel.model';
import { Sample } from 'src/app/models/sample.model';

interface SChannels {
  channelIndx?: string,
  sampleIndx?: string,
  category?: string,
  uri?: string,
  drmLicense?: string,
  name?: string,
}



@Component({
  selector: 'app-seechannels',
  templateUrl: './seechannels.component.html',
  styleUrls: ['./seechannels.component.css']
})
export class SeechannelsComponent implements OnInit {

  obsItemsList: AngularFireList<Channel>
  obs?: Observable<any[]>;
  filterValue: string;
  channels: Channel[];
  samples: Sample[] = [];
  scChannels: SChannels[];
  bkScChannels: SChannels[];



  totalRecords: number;

  first: number = 0;
  cols: any[]
  rows: number;
  loading: boolean;



  constructor(private db: AngularFireDatabase, private dbservice: DbService) {
    this.obsItemsList = db.list<Channel>('/channels')
    this.filterValue = '';
    this.channels = [];
    this.scChannels = [];
    this.bkScChannels = [];
    this.totalRecords = 0;
    this.cols = [];
    this.rows = 14;
    this.loading = true
    
  }

  ngOnInit(): void {
    this.loading = true
    this.obs = this.dbservice.getChannels()
    this.obs.subscribe(
      channels => {
        this.totalRecords = channels.length
      }
    )
    this.obsItemsList.valueChanges().subscribe(
      channels => {
        this.channels = channels
        for (let i = 0; i < channels.length; i++) {
          let arr = this.getSCObject(channels[i], i)
          for (let e = 0; e < arr.length; e++) {
            this.scChannels.push(arr[e])

          }

        }
        this.loading = false
        this.bkScChannels = this.scChannels


      }
    )

  }

  getSCObject(obj: Channel, index: number) {
    var arr: SChannels[] = [];
    let _sc: SChannels = {}
    obj.samples?.forEach((sample) => {
      _sc = {
        channelIndx: index.toString(),
        category: obj.name,
        uri: sample.uri,
        drmLicense: sample.drm_license_url,
        name: sample.name,
      }
      arr.push(_sc)
    }
    )
    return arr


  }


  getSamples(channels: Channel[]): Sample[] {
    let arr = []
    for (let i = 0; i < channels.length; i++) {
      const element = channels[i];
      arr.push(element);

    }
    return arr
  }

  next() {
    this.first + this.rows
  }

  prev() {
    this.first - this.rows
  }

  reset() {
    this.first = 0
    // return this.channels = this.users
  }

  isLastPage(): boolean {
    return this.scChannels ? this.first === (this.scChannels.length - this.rows) : true
  }

  isFirstPage(): boolean {
    return this.scChannels ? this.first === 0 : true
  }

  filter(value: string) {
    this.scChannels = this.bkScChannels
    let filteredArray = [];

    for (let i = 0; i < this.scChannels.length; i++) {
      if (this.scChannels[i].name!.includes(value.toUpperCase())) {
        filteredArray.unshift(this.scChannels[i])
        
      }

    }
    return this.scChannels = filteredArray
  }

  filterbyDRM() {
    this.scChannels = this.bkScChannels
    let filteredArray: SChannels[] = [];

    for (let i = 0; i < this.scChannels.length; i++) {
      if (this.scChannels[i].drmLicense != null) {
        filteredArray.unshift(this.scChannels[i])
        
      }

    }
    const newScChannels = Array.from(
      new Set(filteredArray.map(a => a.drmLicense)))
      .map(drm => {return filteredArray.find(a => a.drmLicense === drm)
      })
      
    return newScChannels
  }
}
