import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Channel } from 'src/app/models/channel.model';

@Component({
  selector: 'app-addchannel',
  templateUrl: './addchannel.component.html',
  styleUrls: ['./addchannel.component.css']
})
export class AddchannelComponent implements OnInit {

  channelForm: FormGroup;
  channel: Channel = {name: '', samples: [{}]}
  categories: string[] = ['Argentina', 'Interior Argentino', 'Deportes', 'Infatiles', 'Canales Premium', 'Cine', 'Culturales', 'Variedades', 'Musica', 'TV Internacional']
  cat: string
  uri: string
  name: string
  drm_license_url: string
  drm_scheme: string
  icon: string



  constructor(fb: FormBuilder) { 
    this.channelForm = fb.group({})
    this.cat = ''
    this.uri = ''
    this.name = ''
    this.drm_license_url = ''
    this.drm_scheme = ''
    this.icon = ''
  }

  ngOnInit(): void {
    const {cat, uri, name, drmLicense, drmSch, icon} = this.channelForm.value
    this.channel = {
      name: cat,
      samples: [
        {
          uri: uri,
          name: name,
          drm_license_url: drmLicense,
          drm_scheme: drmSch,
          icon: icon
          
        }

      ]
    }
  }

  createChannel(){}

}
