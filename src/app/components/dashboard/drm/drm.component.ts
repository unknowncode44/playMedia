import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.model';
import { Sample } from 'src/app/models/sample.model';
import { DbService } from 'src/app/db/dbservice.service';
import { Router } from '@angular/router';

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

  counter: number;
  oldLink: string;
  disabled: boolean = true
  newLink: string;
  category?: string;
  obs?: Observable<any[]>;
  scChannels: SChannels[];
  bkScChannels: SChannels[];
  loading: boolean;
  displayModal: boolean = false;
  channels: Channel[];
  channelsBU: Channel[];
  obsItemsList: AngularFireList<Channel>
  drmForm: FormGroup;

  array_Tabla: any[] = []

  msgs: Message[] = [];
  postion: string = '';

  constructor(
    private db: AngularFireDatabase,
    private dbService: DbService, 
    private confirmation: ConfirmationService, 
    private primengCpnfig: PrimeNGConfig,
    public dialogService: DialogService,
    public fb: FormBuilder,
    private router: Router) { 

    this.oldLink = '';
    this.newLink = '';
    this.channels = [];
    this.channelsBU = [];
    this.obsItemsList = db.list<Channel>('/channel_test')
    this.scChannels = [];
    this.bkScChannels = [];
    this.loading = true
    this.primengCpnfig.ripple = true;

    this.counter = 0

    this.drmForm  = fb.group({})
    
  }

  ngOnInit(): void {
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

        this.array_Tabla = this.filterbyDRM();


      }
    )

    this.drmForm = this.fb.group({
      drm: ['',[Validators.required]]
    })
  }
  
  confirm(drm: string, cat: string) {
    this.oldLink = drm;
    this.category = cat;
    this.confirmation.confirm({
      message: `Estas seguro que queres cambiar la DRM??!!: <br> DRM actual: ${this.oldLink} `,
      header: 'Cambiar DRM',
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Si, estoy seguro',
      rejectLabel: 'No, mejor no',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      accept: () => {
        this.displayForm();
        // 
    },
    reject: () => {
      this.msgs = [{severity:'warn', summary:'No se realizaron cambios', detail:'Cancelanste la modificacion del DRM'}];
    }

    })
  }


  displayForm() {
    this.displayModal = true
  }

  hide() {
    this.displayModal = false
    this.msgs = [{severity:'warn', summary:'No se realizaron cambios', detail:'Cancelanste la modificacion del DRM'}];
  }

  modifyDRM() {
    this.channelsBU = this.channels
    if(this.drmForm.invalid) {
      return
    }

    const drm = this.drmForm.value
    console.log(drm.drm)
    this.newLink = drm
    
    for (let i = 0; i < this.channelsBU.length; i++) {
      const e = this.channelsBU[i];
      this.loopInSamples(this.oldLink, e.samples!, drm.drm)
      
      
    }
    this.loading = true
    for (let e = 0; e < this.channelsBU.length; e++) {
      const el = this.channelsBU[e];

      this.dbService.updateDRM(el.samples!, e, el.name!)
      
    }
    let cambios = localStorage.getItem('counter')
    this.msgs = [{severity:'success', summary:'DRM Modificada Exitosamente', detail:`Se realizaron ${cambios} cambios`}];
    this.displayModal = false
    this.counter = 0
    

  }


  editClick() {
    this.disabled = !this.disabled
  }

  delete() {

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

  loopInSamples(drmURL: string, sample: Sample[], newDrm: string) {
    
    for (let i = 0; i < sample.length; i++) {
      const e = sample[i];
      if (e.drm_license_url === drmURL) {
        e.drm_license_url = newDrm
        this.counter++
        // update DB Value
      }
      
    }
    localStorage.setItem('counter', this.counter.toString());
  }

  

}
