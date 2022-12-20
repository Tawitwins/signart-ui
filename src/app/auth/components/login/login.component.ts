import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuthStatus } from '../../reducers/selectors';
import { Subscription, from } from 'rxjs';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { environment } from 'src/environments/environment.prod';
import { User } from 'src/app/shared/modeles/user';
import { AuthActions } from '../../actions/auth.actions';
import { OeuvreService } from 'src/app/shared/services/oeuvre.service';
import { SecurityService } from 'src/app/shared/services/security.service';
//import { AuthService } from 'angularx-social-login';
//import { SocialUser } from 'angularx-social-login';
//import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

//import firebase from 'firebase';
//import * as firebase from 'firebase';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  title = environment.AppName;
  loginSubs: Subscription;
  returnUrl: string;
  //user: SocialUser;
  User:User;
  val: any;
  

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceS,
    //private authS: AuthService,
    private actions: AuthActions,
    private oeuvreS:OeuvreService,
    private securityService: SecurityService
  ) {
    this.redirectIfUserLoggedIn();
    /*const config = {
      apiKey: 'AIzaSyDxt2TX8TznLurwotZypNMjOCvrYvWC2Ws',
      authDomain: 'myfirst-21bc4.firebaseapp.com',
      databaseURL: 'https://myfirst-21bc4.firebaseio.com',
      projectId: 'myfirst-21bc4',
      storageBucket: 'myfirst-21bc4.appspot.com',
      messagingSenderId: '658608042384'
    };*/
    // firebase.initializeApp(config);

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries -->
  
  // Initialize Firebase
  ///firebase.initializeApp(environment.firebaseConfig);
  }
  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }

  ngOnInit() {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // this.authS.authState.subscribe((user) => {
    //   this.user = user;
    // });  
  }
  /**
      *
      *
      * @param {any} data
      * @returns {Observable<any>}
      *
      *
      */
  onSubmit() {
    const values = this.signInForm.value;
    const keys = Object.keys(values);

    if (this.signInForm.valid) {
      let email = this.signInForm.value.email;
      let pwd = this.signInForm.value.password;
      this.loginSubs = this.authService.login(email, pwd).subscribe(
        data => {
        const error = data.error;
        if (error) {
          keys.forEach(val => {
            this.pushErrorFor(val, error);
          });
          }
        },
        err =>{
          $.notify({
            icon: "notifications",
            message: "Identifiant ou mot de passe non valide !"
          }, {
              type: 'danger',
              timer: 2000,
              placement: {
                from: 'top',
                align: 'center'
              }
            });
          //window.alert(err.status+' '+err.statusText)
        });
    } else {
      keys.forEach(val => {

        const ctrl = this.signInForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.signInForm.controls[ctrl_name].setErrors({ 'msg': msg });
  }

  initForm() {
    const email = '';
    const password = '';

    this.signInForm = this.fb.group({
      'email': [email, Validators.required],
      'password': [password, Validators.required]
    });
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
        this.router.navigate([this.returnUrl]);
       }
      }
    ); 
  }

  ngOnDestroy() {
    if (this.loginSubs) { this.loginSubs.unsubscribe(); }
  }

  signInWithGoogle(){
    //return this.authS.signIn(GoogleLoginProvider.PROVIDER_ID);
    //this.onSubmit()
  }

  signInWithFB(){
    //return this.authS.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
/*
  signOut(): void {
    this.authS.signOut();
  }
*/


}
