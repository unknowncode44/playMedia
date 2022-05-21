import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/models/currente-user.model';
import { AuthService } from '../../auth/auth_services/auth-service.service';
import Swal from 'sweetalert2';
import { FirebaseError } from '@angular/fire/app';
import { DbService } from '../../../db/dbservice.service'
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { switchMap, take } from 'rxjs/operators';

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

  currentUser: CurrentUser
  points?: number

  enableButton: boolean
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dbService: DbService,
    private store: Store<AppState>, 
    private db: AngularFireDatabase
  ) {
    this.enableButton = false
    this.registerForm = this.fb.group({})

    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!.toString())
    this.points = this.currentUser.points

    

    this.text = ''
    this.results = [];

    this.plan = [
      { name: 'Demo 3 horas', code: 0 },
      { name: 'Pack Estandar Mensual', code: 1 },
      // { name: 'Pack Futbol Mensual', code: 2 },
      // { name: 'Pack Adultos Mensual', code: 3 },
    ];

    this.roles = [
      { name: 'Cliente', code: 2 },
     ];

    this.rolesStr = [
      this.roles[0].name,
    ]

    if(this.currentUser.role === 0){
      this.enableButton = true
      this.roles.push( 
        { name: 'Vendedor',       code: 1 },
        { name: 'Administrador',  code: 0 }
        )
        this.rolesStr = [
          this.roles[0].name,
          this.roles[1].name,
          this.roles[2].name,
        ]
    }
    if(this.currentUser.role === 1){
      if(this.points! >= 1){
        this.enableButton = true
      }
    }

    this.newUser = { 
      pass: '', 
      email: '', 
      type: 0,
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

        if(this.newUser.role === 1){this.newUser.points = 20}

        var suscrCode: number = this.authService.catchPlan(plan);
        console.log(`SUCR. ${plan} SUSCR CODE: ${suscrCode}`);
        

        if (suscrCode !== 10) {
          console.log(suscrCode.toString());
          
          var epochExpirationDate: Date = new Date();
          epochExpirationDate.setDate(epochExpirationDate.getDate() + 30)
          if(suscrCode === 0) {epochExpirationDate.setDate(epochExpirationDate.getDate() - 23)}
          if(suscrCode === 1) {this.newUser.type = 1}
          console.log(`SUSCR CODE>   ${suscrCode}, TYPE>   ${this.newUser.type}`);
          
          this.decreaseOnePoint(suscrCode)
          
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
        this.newUser.createdBy = this.currentUser.uid

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

        else {
          console.log(err)
        }
      })
      
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['dashboard']);
      });


  }

  decreaseOnePoint(srcode: number){
    let disc: number
    if(srcode === 1){
      disc = 1
    }
    else {
      disc = 0
    }

    if(this.currentUser.role === 0){
      this.currentUser.points = 100
    }
    const points: number = this.currentUser.points!-disc
    this.currentUser.points = points
    this.db.object<CurrentUser>(`users/${this.currentUser.uid}`).update({ points: points });
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    console.log(`PUNTOS>    ${this.currentUser.points!}`);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard']);
    });
    
  }

}
