import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../auth-service.service';
import Swal from 'sweetalert2';
import { DbService } from 'src/app/db/dbservice.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',],

})
export class LoginComponent implements OnInit {
  user: CurrentUser;
  loginForm: FormGroup;
  fbuser?: Observable<CurrentUser>| Observable<any> | any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {
    this.loginForm = this.fb.group({});
    this.user = { pass: '', email: '', uid:'', type: 0, role: 0 };
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  async loginUser() {
    if(this.loginForm.invalid) {
      return;
    }

    const {email, password} = this.loginForm.value;

    this.user.email = email;
    this.user.pass  = password;
    this.user.type  = 0;

    Swal.fire({
      title: 'Ingresando',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    var usrsArray: CurrentUser[] = []
    this.authService
    .logIn(email, password)
    .then( async (credentials) => {
      this.user.uid = credentials.user!.uid;

      await setTimeout(() => {
        this.getRole(this.user.uid)  
      }, 5000)


      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this.router.navigate(['/dashboard']);
      Swal.close()
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Ups!',
        text: 'La contraseña o el email no son correctos!',
      });
    })


  }
  
  getRole(uid: string) {

    this.db.object<CurrentUser>(`users/${uid}`).valueChanges()
        .subscribe(
          user => {
            this.user.role = user!.role
          }
        )  
  }
}
