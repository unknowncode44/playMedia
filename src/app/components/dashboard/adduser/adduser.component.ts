import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../../auth/auth-service.service';
import Swal from 'sweetalert2';
import { FirebaseError } from '@angular/fire/app';
import { DbService } from '../../../db/dbservice.service'

interface PlanDesc {
  name: string,
  code: number,
}

interface Role {
  name: string,
  code: number,
}


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  newUser: CurrentUser;
  text: string;
  results: string[];
  plan: PlanDesc[];
  roles: Role[];
  rolesStr: string[];
  registerForm: FormGroup;

  role: string;
  planStr: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dbService: DbService,
  ) {
    this.registerForm = this.fb.group({})

    this.text = ''
    this.results = [];

    this.plan = [
      { name: 'Demo 3 horas', code: 1 },
      { name: 'Pack Estandar Mensual', code: 2 },
      { name: 'Pack Futbol Mensual', code: 3 },
      { name: 'Pack Adultos Mensual', code: 4 },
    ];

    this.roles = [
      { name: 'Cliente', code: 2 },
      { name: 'Vendedor', code: 1 },
      { name: 'Administrador', code: 0 }];

    this.rolesStr = [
      this.roles[0].name,
      this.roles[1].name,
      this.roles[2].name,
    ]


    this.newUser = { 
      pass: '', 
      email: '', 
      type: 1,
      role: 2, 
      uid: '', 
      canales: [],
      expire: '',  
    };

    this.planStr = '';
    this.role = '';

  }

  ngOnInit(): void {
    this.search()
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      plan: [''],
      role: ['']
    })

  }

  search() {
    for (let i = 0; i < this.plan.length; i++) {
      this.results.push(this.plan[i].name)
    }
  }

  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password, plan, role } = this.registerForm.value;




    Swal.fire({
      title: 'Creando Usuario',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });



    this.authService
      .register(email, password)
      .then((credentials) => {
        this.newUser.email = email;
        this.newUser.pass = password;
        this.newUser.uid = credentials.user!.uid;

        this.planStr = plan;
        this.role = role;
        this.newUser.role = this.authService.catchRole(role);
        var suscrCode: number = this.authService.catchPlan(plan);

        if (suscrCode !== 0) {

          var epochExpirationDate: Date = new Date();
          epochExpirationDate.setDate(epochExpirationDate.getDate() + 30)
          var expireDate: Date = new Date(epochExpirationDate);
          

          let date = expireDate.getDate()
          let month = expireDate.getMonth()
          let year = expireDate.getFullYear()
          let dateString = date.toString()

          month++
          
          if(date < 10) {
            dateString =`0${date}`
          }
          
          var fmtdDateStr = `${dateString}/${month}/${year}`


          if(month < 10) {
            fmtdDateStr = `${dateString}/0${month}/${year}`
          }

          this.newUser.expire = fmtdDateStr;

          
        }

        this.newUser.time = 10800000
        this.newUser.active = true

        this.dbService.saveUser(this.newUser, this.newUser.uid)
          .then((done) => { console.log('exito') })
          .catch((err: FirebaseError) => console.log(err));

        Swal.fire({
          icon: 'success',
          title: 'Usuario Creado!',
          text: `Usuario ${this.newUser.email} creado satisfactoriamente`,
        });

      })

      .catch((err: FirebaseError) => {
        Swal.close();
        if (err.code === 'auth/email-already-in-use') {
          Swal.fire({
            icon: 'error',
            title: 'Ups!',
            text: 'Ya existe un usuario con ese email!!',
          });

        }



      })


  }

}
