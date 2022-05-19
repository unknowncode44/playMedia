import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// reactive forms 
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule}                from '@angular/forms'

// NgRx
import { StoreModule}                       from '@ngrx/store'
import { appReducers }                      from './app.reducer';
import { StoreDevtoolsModule }              from '@ngrx/store-devtools';

// routing
import { AppRoutingModule }                 from './app-routing.module';

// app components
import { AppComponent }                     from './app.component';
import { LoginComponent }                   from './components/auth/login/login.component';
import { AdduserComponent }                 from './components/dashboard/adduser/adduser.component';
import { SeeusersComponent }                from './components/dashboard/seeusers/seeusers.component';
import { AddchannelComponent }              from './components/dashboard/addchannel/addchannel.component';
import { SeechannelsComponent }             from './components/dashboard/seechannels/seechannels.component';
import { DashboardComponent }               from './components/dashboard/dashboard.component';
import { DrmComponent }                     from './components/dashboard/drm/drm.component';
import { ModifychannelComponent }           from './components/dashboard/seechannels/modifychannel/modifychannel.component';

// enviroment
import { environment }                      from '../environments/environment';

// firebase
import { AngularFireModule }                from '@angular/fire/compat';
import { AngularFireAuthModule }            from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule }        from '@angular/fire/compat/database'
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth }              from '@angular/fire/auth';
import { provideDatabase,getDatabase }      from '@angular/fire/database';


// ngPrime
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import{AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import {ConfirmDialogModule}                from 'primeng/confirmdialog';
import {ConfirmationService, MessageService}                from 'primeng/api';
import { MessagesModule }                   from 'primeng/messages';
import {DynamicDialogModule}                from 'primeng/dynamicdialog';
import {DialogService}                      from 'primeng/dynamicdialog';
import { DialogModule }                     from "primeng/dialog";
import {ToastModule}                        from 'primeng/toast';
import {ProgressSpinnerModule}              from 'primeng/progressspinner';


import {APP_BASE_HREF}                      from '@angular/common';
import { SplashComponent } from './components/dashboard/splash/splash.component';
import { SellersComponent } from './components/dashboard/sellers/sellers.component';


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
    ModifychannelComponent,
    SplashComponent,
    SellersComponent,
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
    TableModule,
    PanelModule,
    ConfirmDialogModule,
    MessagesModule,
    DynamicDialogModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule,
    StoreModule.forRoot( appReducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production,
    })
  ],
  providers: [ConfirmationService, DialogService, {provide: APP_BASE_HREF, useValue : '/' }, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
