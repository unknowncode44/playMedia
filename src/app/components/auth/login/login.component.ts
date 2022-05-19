import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../auth_services/auth-service.service';
import Swal from 'sweetalert2';
import { DbService } from 'src/app/db/dbservice.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',],

})
export class LoginComponent implements OnInit, OnDestroy {
  user: CurrentUser;
  loginForm: FormGroup;
  fbuser?: Observable<CurrentUser>| Observable<any> | any;
  loading: boolean = false
  success: boolean = false
  uiSubscription?: Subscription




  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private db: AngularFireDatabase,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({});
    this.user = { pass: '', email: '', uid:'', type: 0, role: 0 };
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.uiSubscription = this.store.select('ui')
            .subscribe( ui => {
              this.loading = ui.isLoading
              console.log('cargando subs');
            })
  }

  ngOnDestroy(): void {
    this.uiSubscription?.unsubscribe()
  }


  async loginUser() {
    if(this.loginForm.invalid) {
      return;
    }

    this.store.dispatch( isLoading() )

    const {email, password} = this.loginForm.value;

    this.user.email = email;
    this.user.pass  = password;
    this.user.type  = 0;

    var usrsArray: CurrentUser[] = []
    this.authService
    .logIn(email, password)
    .then((credentials) => {
      this.user.uid = credentials.user!.uid;
    })
    .catch((err) => {
      this.store.dispatch( stopLoading() )
      Swal.fire({
        icon: 'error',
        title: 'Ups!',
        text: 'La contraseña o el email no son correctos!',
      });
    })
    .then(
      async()  => {
        await this.getRole(this.user.uid)
      }
    )

   


  }

  checkSuccess() {
    if(!this.success){
      window.setTimeout(this.checkSuccess,100);
    }
    else {
      
      
    }
  }
  
  async getRole(uid: string) {
    this.db.object<CurrentUser>(`users/${uid}`).valueChanges()
        .subscribe(
          (user) => {
            this.user.role = user!.role
            if(user!.role === 0){this.router.navigate(['/dashboard']); }// aca va!
            if(user!.role === 1){
              this.user.points = user!.points
              this.router.navigate(['/dashboard']); // aca va!
            }
            if(user!.role === 2){
              this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate(['login']);
              });
            }
            localStorage.setItem('currentUser', JSON.stringify(this.user));
            console.log(`getRole: ${JSON.stringify(this.user)}`);
            // this.router.navigate(['/dashboard']); // aca va!
            this.success = true
          }
        )  
  }
}
