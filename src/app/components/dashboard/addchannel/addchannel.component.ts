import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmationService, Message, PrimeNGConfig } from 'primeng/api';
import { DbService } from 'src/app/db/dbservice.service';
import { Channel } from 'src/app/models/channel.model';
import { Sample } from 'src/app/models/sample.model';

@Component({
  selector: 'app-addchannel',
  templateUrl: './addchannel.component.html',
  styleUrls: ['./addchannel.component.css']
})
export class AddchannelComponent implements OnInit {

  obsItemsList: AngularFireList<Channel>
  channelForm: FormGroup;
  buttonDisable: boolean = true
  channel: Channel = { name: '', samples: [{}] }
  categories: string[] = ['Cargando datos...']
  cat: string
  newCat: string = 'null'
  uri: string
  name: string
  drm_license_url: string
  drm_scheme: string
  icon: string
  channels: Channel[]
  msgs: Message[] = [];



  constructor(fb: FormBuilder, private db: AngularFireDatabase, private dbService: DbService, private primengCpnfig: PrimeNGConfig,) {
    this.obsItemsList = db.list<Channel>('/channels')
    this.channelForm = fb.group({})
    this.cat = ''
    this.uri = ''
    this.name = ''
    this.drm_license_url = ''
    this.drm_scheme = ''
    this.icon = ''
    this.channels = []
    this.primengCpnfig.ripple = true
  }

  ngOnInit(): void {
    this.obsItemsList.valueChanges().subscribe(
      channels => {
        this.categories.length = 0
        this.channels = channels
        channels.map(channel => { 
          this.categories.push(channel.name)
        })
      }
    )
  }



  getIndex(channels: Channel[], cat: string): number {
    return channels.length++
    // for (let i = 0; i < channels.length; i++) {
    //   const e = channels[i];
    //   if(this.getCatMatch(e.samples!, this.cat)) {
    //     index =  i
    //     break
    //   }  

  }

  getCatMatch(sample: Sample[], cat: string): boolean {
    var _bool: boolean = false
    for (let e = 0; e < sample.length; e++) {
      const el = sample[e];
      if (el.name === cat) {
        _bool = true
        break
      }
      else {
        _bool = false
      }
    }
    return _bool
  }

  enableNewCat(){
    this.newCat = ''
    this.buttonDisable = false
  }

  createChannel() {
    let path: string = ''
    this.channel = {
      name: this.cat,
      samples: [
        {
          uri: this.uri,
          name: this.name.toUpperCase(),
          drm_license_url: `\t${this.drm_license_url}`,
          drm_scheme: this.drm_scheme,
          icon: this.icon
        }

      ]
    }
    
    for (let i = 0; i < this.channels.length; i++) {
      const e = this.channels[i];
      var sampleLenght = e.samples?.length
      if(e.name === this.channel.name) {
        path =  `channels/${i}/samples/${sampleLenght!++}`;
        this.db.object(path).set({
          uri: this.uri,
          name: this.name.toUpperCase(),
          drm_license_url: `\t${this.drm_license_url}`,
          drm_scheme: this.drm_scheme,
          icon: this.icon
        }).then(
          channel => {
            this.msgs = [{ severity: 'success', summary: 'Se creo el canal', detail: `${this.channel.name}` }];
          }
        )
        break
      }
      else {
        if(i === this.channels.length) {
          // path = `channel_test/${this.channels.length++}`
          this.msgs = [{ severity: 'warn', summary: 'Hubo une error', detail: `${this.channel.name}` }];
        }
      }
    }

    



  }

}

