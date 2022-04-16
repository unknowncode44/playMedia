import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog/dialogservice';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';

interface SChannels {
  channelIndx?: string,
  sampleIndx?: string,
  category?: string,
  uri?: string,
  drmLicense?: string,
  name?: string,
}
@Component({
  selector: 'app-drm',
  templateUrl: './drm.component.html',
  styleUrls: ['./drm.component.css']
})
export class DrmComponent implements OnInit {

  oldLink: string;
  disabled: boolean = true
  newLink: string;
  obs?: Observable<any[]>;
  scChannels: SChannels[];
  bkScChannels: SChannels[];
  loading: boolean;
  channels: Channel[];
  obsItemsList: AngularFireList<Channel>

  array_Tabla: any[] = []

  msgs: Message[] = [];
  postion: string = '';

  constructor(private db: AngularFireDatabase, private confirmation: ConfirmationService, private primengCpnfig: PrimeNGConfig,public dialogService: DialogService) { 
    this.oldLink = '';
    this.newLink = '';
    this.channels = [];
    this.obsItemsList = db.list<Channel>('/channels')
    this.scChannels = [];
    this.bkScChannels = [];
    this.loading = true
    this.primengCpnfig.ripple = true;

    
    
  }

  confirm() {

    this.confirmation.confirm({
      message: 'Estas seguro que queres cambiar la DRM?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.msgs = [{severity:'info', summary:'Confirmado', detail:'Aceptaste cambiar las drm'}];
    },
    reject: () => {
        this.msgs = [{severity:'info', summary:'Rechazado', detail:'Rechazaste cambiar las drm'}];
    }

    })
  }

  editClick() {
    this.disabled = !this.disabled
  }

  delete() {

  }

  ngOnInit(): void {
    this.obsItemsList.valueChanges().subscribe(
      channels => {
        this.channels = channels
        for (let i = 0; i < channels.length; i++) {
          let arr = this.getSCObject(channels[i], i)
          for (let e = 0; e < arr.length; e++) {
            console.log(arr[e])
            this.scChannels.push(arr[e])

          }

        }
        this.loading = false
        this.bkScChannels = this.scChannels

        this.array_Tabla = this.filterbyDRM();


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
