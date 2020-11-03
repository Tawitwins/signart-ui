import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getOrderState } from 'src/app/checkout/reducers/selectors';
import { AppState } from 'src/app/interfaces';
import { Pays } from 'src/app/shared/modeles/pays';
import { User } from 'src/app/shared/modeles/user';
import { AuthServiceS } from 'src/app/shared/services/auth.service';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';
import { PaysService } from 'src/app/shared/services/pays.service';
import { environment } from 'src/environments/environment';
import { getAuthStatus } from '../../../auth/reducers/selectors';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [PaysService]
})
export class RegisterComponent implements OnInit, OnDestroy {

  etape:number;
  signUpForm: FormGroup;
  formSubmit = false;
  title = environment.AppName;
  registerSubs: Subscription;
  stateSub$: Subscription;
  orderState: string;
  allPays: Pays[] = [];
  User:User;
   
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private oeuvreS:OeuvreService,
    private authService: AuthServiceS,
    private paysService: PaysService
  ) {
    this.etape=1;
    this.stateSub$ = this.store.select(getOrderState)
    .subscribe(state => this.orderState = state);
    this.redirectIfUserLoggedIn();

  }

  ngOnInit() {
    this.initForm();
    this.paysService.getAllPays().subscribe(
      pays => { this.allPays = pays});
  }

  onSubmit() {
    const values = this.signUpForm.value;
    console.log('values: ', values)
    const keys = Object.keys(values);
    this.formSubmit = true;
if (this.signUpForm.valid) {
      this.registerSubs = this.authService.register(values).subscribe(
        data => {     console.log('datas: ', data)

          this.authService.login(values.email, values.password).subscribe(
            resp => console.log('resp: ', data)
          );
        }
        );
    } else {
      keys.forEach(val => {
        const ctrl = this.signUpForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signUpForm.controls[ctrl_name].setErrors({ 'msg': msg });
  }

  initForm() {
    const prenom = '';
    const nom = '';
    const email = '';
    const password = '';
    const password_confirmation = '';
    const mobile = '';
    const gender = '';
    const codePays = '';
    const codeProfil = 'CLIENT';

    this.signUpForm = this.fb.group({
      'prenom': [prenom, Validators.compose([Validators.required])],
      'nom': [nom, Validators.compose([Validators.required])],
      'email': [email, Validators.compose([Validators.required, Validators.email])],
      'password': [password, Validators.compose([Validators.required, Validators.minLength(6)])],
      'password_confirmation': [password_confirmation, Validators.compose([Validators.required, Validators.minLength(6)])],
      'mobile': [mobile, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')])],
      'gender': [gender, Validators.required],
      'codePays': [codePays, Validators.required],
      'codeProfil': [codeProfil],

    }, { validator: this.matchingPasswords('password', 'password_confirmation') }
    );
  }

  redirectIfUserLoggedIn() {
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) {
          this.User=this.authService.getUserConnected();
          this.oeuvreS.getClientByUser(parseInt(this.User.id))
          .subscribe(
            response => { 
              localStorage.setItem('client',JSON.stringify(response))
          });  
          if (this.orderState === 'adresse') {
            this.router.navigate(['/checkout', 'address']);
          }else {
            this.router.navigateByUrl('/'); 
          }
          
        }
      }
    );
  }
 goetape(val){
   this.etape=val;
 }
  ngOnDestroy() {
    if (this.registerSubs) { this.registerSubs.unsubscribe(); }
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

}
