import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';

// reactive forms 
import {ReactiveFormsModule}                from '@angular/forms'

// routing
import { AppRoutingModule }                 from './app-routing.module';

// app modules
import { AppComponent }                     from './app.component';
import { LoginComponent }                   from './components/auth/login/login.component';

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
import { Sidebar, SidebarModule }                    from 'ng-sidebar';

// font-awesome




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    SidebarModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
