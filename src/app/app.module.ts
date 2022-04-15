import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// reactive forms 
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule}                from '@angular/forms'

// routing
import { AppRoutingModule }                 from './app-routing.module';

// app components
import { AppComponent }                     from './app.component';
import { LoginComponent }                   from './components/auth/login/login.component';
import { AdduserComponent } from './components/dashboard/adduser/adduser.component';
import { SeeusersComponent } from './components/dashboard/seeusers/seeusers.component';
import { AddchannelComponent } from './components/dashboard/addchannel/addchannel.component';
import { SeechannelsComponent } from './components/dashboard/seechannels/seechannels.component';

// enviroment
import { environment }                      from '../environments/environment';

// firebase
import { AngularFireModule }                from '@angular/fire/compat';
import { AngularFireAuthModule }            from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule }        from '@angular/fire/compat/database'
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth }              from '@angular/fire/auth';
import { provideDatabase,getDatabase }      from '@angular/fire/database';
import { DashboardComponent }               from './components/dashboard/dashboard.component';

//sidebar
// import { Sidebar, SidebarModule }                    from 'ng-sidebar';

// ngPrime
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import{AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule} from 'primeng/table';
import { DrmComponent } from './components/dashboard/drm/drm.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdduserComponent,
    SeeusersComponent,
    AddchannelComponent,
    SeechannelsComponent,
    DrmComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    SidebarModule,
    ButtonModule,
    MenuModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    TableModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
