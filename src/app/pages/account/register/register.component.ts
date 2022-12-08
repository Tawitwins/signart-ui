import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { getAuthStatus } from '../../../auth/reducers/selectors';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../interfaces';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { getOrderState } from '../../../checkout/reducers/selectors';
import { PaysService } from '../../../shared/services/pays.service';
import { Pays } from '../../../shared/modeles/pays';
import { User } from '../../../shared/modeles/user';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
  indicatifpays: string;
  libellePays: string;
   
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private oeuvreS:OeuvreService,
    private authService: AuthServiceS,
    private paysService: PaysService,
    private toastrService:ToastrService,
  ) {
    this.indicatifpays = "+221";
    this.libellePays = "Sénégal";
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

  choisirPays(event) {
    //console.log(event.target.value)
    for (let i = 0; i < this.allPays.length; i++) {
       if(this.allPays[i].code === event.target.value){
         //console.log(this.allPays[i].indicatif)
         this.indicatifpays = this.allPays[i].indicatif;
       }
      
    }
  }


  onSubmit() {
    //console.log('valueszzzzzzzzzzzzzzzzzzz: ', this.signUpForm.value)
    Swal.fire({ 
      title: 'Confirmer l\'envoi du formulaire d\'inscription?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #376809',
      cancelButtonColor: 'red',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        //console.log('im innnnnnnnnnnnnnnnnnnnnn')
        //console.log('valueszzzzzzzzzzzzzzzzzzz22222: ', this.signUpForm.value)
        let values = this.signUpForm.value;
        values.mobile = this.indicatifpays+''+this.signUpForm.get('mobile').value;
        //console.log('values: ', values)
        const keys = Object.keys(values);
        this.formSubmit = true;
        if (this.signUpForm.valid) {
            this.registerSubs = this.authService.register(values).subscribe(
              data => {     //console.log('datas: ', data)
              this.toastrService.success("Vous avez réussi l'enregistrement.","Bienvenu à SignArt.")
                this.authService.login(values.email, values.password).subscribe(
                  resp => //console.log('resp: ', data)
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

    });
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
    const indicatif = '+221';
    const gender = '';
    const codePays = '';
    const codeProfil = 'CLIENT';

    this.signUpForm = this.fb.group({
      'prenom': [prenom, Validators.compose([Validators.required])],
      'nom': [nom, Validators.compose([Validators.required])],
      'email': [email, Validators.compose([Validators.required, Validators.email])],
      'password': [password, Validators.compose([Validators.required, Validators.minLength(6)])],
      'password_confirmation': [password_confirmation, Validators.compose([Validators.required, Validators.minLength(6)])],
      //'mobile': [mobile, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')])],
      'mobile': [mobile, Validators.required],
      'indicatif': [indicatif],
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
          this.oeuvreS.getClientByUser(this.User.id)
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
