import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/db/dbservice.service';
import { Channel } from 'src/app/models/channel.model';
import { Sample } from 'src/app/models/sample.model';
import {Message} from 'primeng/api';

interface SChannels {
  channelIndx?: string,
  sampleIndx?: string,
  category?: string,
  uri?: string,
  drmLicense?: string,
  drmScheme?: string,
  name?: string,
  icon?: string,
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

  oldSample: Sample;
  pathToModify: string;
  categoryToModify: string;
  newSample: Sample;
  drmToModify: string
  drmLicenseToModify: string

  isVisibleForm: boolean = false
  isVisibleDelete: boolean = false



  totalRecords: number;

  first: number = 0;
  cols: any[]
  rows: number;
  loading: boolean;
  msgs: Message[] = []



  constructor(
    private db: AngularFireDatabase, 
    private dbservice: DbService,
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig) {
    this.obsItemsList = db.list<Channel>('/channels')
    this.filterValue = '';
    this.channels = [];
    this.scChannels = [];
    this.bkScChannels = [];
    this.totalRecords = 0;
    this.cols = [];
    this.rows = 14;
    this.loading = true
    this.oldSample = {}
    this.pathToModify = ''
    this.categoryToModify = ''
    this.drmToModify = ''
    this.drmLicenseToModify = ''
    this.newSample = {}
    
    
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
        channels.map((channel, index) => {
          const sampleList: Sample[] = channel.samples!
          sampleList.map((sample, sindex) => {
            var sampleObj: SChannels = {
              name: sample.name,
              channelIndx: index.toString(),
              sampleIndx: sindex.toString(),
              category: channel.name,
              uri: sample.uri,
              drmLicense: sample.drm_license_url,
              icon: sample.icon,
              drmScheme: sample.drm_scheme
            }
            this.scChannels.push(sampleObj)
          })
        })
        this.loading = false
        this.bkScChannels = this.scChannels


      }
    )

  }

  modifyChannel(drmLicense: string, drmScheme: string, channelIndex: string, sampleIndex: string, sample: Sample, category: string, filterValue?: string) {
    this.pathToModify = `channels/${channelIndex}/samples/${sampleIndex}`
    this.oldSample = sample
    this.categoryToModify = category
    this.drmLicenseToModify = drmLicense
    this.drmToModify = drmScheme
    this.visibleForm(filterValue)
    
    
  }

  confirmDelete(channelIndex: string, sampleIndex: string, channelName: string){
    this.confirmationService.confirm({
      message: `Estas Seguro que quieres borrar ${channelName}?`,
      header: 'Borrar Canal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.deleteChannel(channelIndex, sampleIndex)
          this.msgs = [{severity:'info', summary:'Canal Borrado', detail:`Borraste el canal: ${channelName}`}];

      },
      reject: () => {
          this.msgs = [{severity:'info', summary:'Cancelado', detail:'Cancelaste la eliminacion del canal'}];
      }
  });
  }

  deleteChannel(channelIndex: string, sampleIndex: string){
    return this.db.object(`channels/${channelIndex}/samples/${sampleIndex}`)
    .remove()
    
  }

  visibleDelete(value?: string){
    if(this.isVisibleDelete){
      this.filter('')
    }
    else {
      this.filter(value!)
      this.isVisibleForm = true
    }
  }

  visibleForm(value?: string) {
    
    if(this.isVisibleForm) {
      this.filter('')
      this.isVisibleForm = false
    }
    else {
      this.filter(value!)
      this.isVisibleForm = true
    }
    
  }

  

  checkClosed(event: string) {
    console.log(event);
    
    if(event === 'true'){
      this.isVisibleForm = false
    }
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
    return this.scChannels = filteredArray.reverse()
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
