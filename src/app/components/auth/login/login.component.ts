import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',],

})
export class LoginComponent implements OnInit {
  user: CurrentUser;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
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


  loginUser() {
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

    this.authService
    .logIn(email, password)
    .then((credentials) => {
      this.user.uid = credentials.user!.uid;
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
    });


  }

}
