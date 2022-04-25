import { Component, Input, OnInit, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DbService } from 'src/app/db/dbservice.service';
import { Channel } from 'src/app/models/channel.model';
import { Sample } from 'src/app/models/sample.model';

@Component({
  selector: 'app-modifychannel',
  templateUrl: './modifychannel.component.html',
  styleUrls: ['./modifychannel.component.css']
})
export class ModifychannelComponent implements OnInit {

  @Input() sample?: Sample;

  @Input() category?: string;

  @Input() path?: string;

  @Input() drmScheme?: string;

  @Input() drmLicense?: string;

  @Output() sampleReady?: Sample
  @Output() closed?: boolean


  newSample: Sample
  uri     : string         = ''
  name    : string         = ''
  license : string         = ''
  scheme  : string         = ''
  



  enableUri: boolean        = true
  enableName: boolean       = true
  enableDrmLicense: boolean = true
  enableDrmScheme: boolean  = true
  enableCategory: boolean   = true

  constructor(private dbService: DbService, private db: AngularFireDatabase) { 
    this.newSample = {
      name: this.sample?.name,
      icon: this.sample?.icon,
      uri: this.sample?.uri,
      drm_license_url: this.drmLicense,
      drm_scheme: this.drmScheme
      
    }

    console.log(this.drmLicense)
  }


  ngOnInit(): void {
    
    
  }



  edit(boolean: string) {
    console.log(this.drmLicense)
    switch (boolean) {
      case 'uri': {
        this.enableUri        = false;
        break
      }
      case 'name': {
        this.enableName       = false;
        break
      }
      case 'license': {
        this.enableDrmLicense = false;
        break
      }
      case 'sch': {
        this.enableDrmScheme  = false;
        break
      }
      case 'cat': {
        this.enableCategory   = false;
        break
      }
        
      
    }
   
  }

  updateChannel() {
    this.newSample = {
      name: this.sample?.name,
      icon: this.sample?.icon,
      uri: this.sample?.uri,
      drm_license_url: this.drmLicense,
      drm_scheme: this.drmScheme
      
    }

    if(this.license != "") {
      this.newSample.drm_license_url = this.license
    }

    if(this.uri != "") {
      this.newSample.uri = this.uri
    }

    if(this.scheme != "") {
      this.newSample.drm_scheme = this.scheme
    }

    if(this.name != "") {
      this.newSample.name = this.name
    }
    
    var index: string = this.path!

    this.sampleReady = this.newSample
    this.closed = true

    this.db.object(index).update(this.newSample)
    
  }
  

}
