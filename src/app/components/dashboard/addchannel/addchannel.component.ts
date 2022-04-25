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
  channel: Channel = { name: '', samples: [{}] }
  categories: string[] = ['Argentina', 'Interior Argentino', 'Deportes', 'Infatiles', 'Canales Premium', 'Cine', 'Culturales', 'Variedades', 'Musica', 'TV Internacional']
  cat: string
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
        this.channels = channels
      }
    )



    // const {cat, uri, name, drmLicense, drmSch, icon} = this.channelForm.value

    // console.log(this.channel);


    // this.cat = cat
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



  createChannel() {
    this.channel = {
      name: this.cat.toUpperCase(),
      samples: [
        {
          uri: this.uri,
          name: this.name.toUpperCase(),
          drm_license_url: this.drm_license_url,
          drm_scheme: this.drm_scheme,
          icon: this.icon

        }

      ]
    }
    this.channels.map((channel, index) => {
      if (channel.name === this.name.toUpperCase()) {
        this.db.object(`channels/${index}/samples`).update(this.channel.samples!).then(
          channel => {
            this.msgs = [{ severity: 'success', summary: 'Se creo el canal', detail: `${this.channel.name}` }];
          }
        )
      }
      else {
        this.db.object(`channels/${this.channels.length}`).update(this.channel).then(
          channel => {
            this.msgs = [{ severity: 'success', summary: 'Se creo el canal', detail: `${this.channel.name}` }];
          }
        )

      }

    })



  }

}

