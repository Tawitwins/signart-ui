
import { map } from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
//  import { HttpResponse } from '@angular/common/http';
import { HttpService } from './http';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../auth/actions/auth.actions';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { User, AccountInfo } from '../modeles/user';
import { Client } from '../modeles/client';
//  import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Artiste } from '../modeles/artiste';
import { Router } from '@angular/router';

declare var $: any;
@Injectable()
export class AuthServiceS {
  public loading = new Subject<{ loading: boolean, hasError: boolean, hasMsg: string }>();
  /**
   * Creates an instance of AuthService.
   * @param {HttpService} http
   * @param {AuthActions} actions
   * @param {Store<AppState>} store
   *
   * @memberof AuthServiceS
   */
  constructor(
    public http: HttpClient,
    private actions: AuthActions,
    private store: Store<AppState>,
    public jwtHelper: JwtHelperService,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private router: Router
  ) {
     this.getAuth();
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthServiceS
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(environment.API_ENDPOINT + `login`,
      { userName: email, password: password }, { responseType: 'text' }
    )
      .pipe(map(res => {
        // Setting token after login
        console.log('merci pour cela ' + JSON.stringify(res));
        let token = JSON.parse(JSON.stringify(res));
        console.log("Token from APi :" + token);

        let obj: any = JSON.parse((this.jwtHelper.decodeToken(token)).sub);
        let utilisateur: User;
        if (obj !== undefined) {
          utilisateur = new User('', '', '', '', '', '', '', '', '', '', '');
          utilisateur.id = obj.id;
          utilisateur.prenom = obj.firstName;
          utilisateur.nom = obj.lastName;
          utilisateur.login = obj.userName;
          utilisateur.token = token;
          utilisateur.email = obj.email;
          utilisateur.roles = obj.roles;
          utilisateur.userType = obj.userType;
          utilisateur.oldAccount = obj.oldAccount;
          utilisateur.imgSignature = obj.imgSignature;
          utilisateur.certificat = obj.certificat;
          
          // console.log('utilisateur.token' + utilisateur.token);
          // console.log('utilisateur.email' + utilisateur.email);
          this.setTokenInLocalStorage(utilisateur);
          this.store.dispatch(this.actions.loginSuccess());
        } else {
          utilisateur = null;
          token = null;
          console.log("token invalide !");
          return false;
        }

        return res;
      },
        error => {
          $.notify({
            icon: "notifications",
            message: "Please enter valid Credentials"
          }, {
              type: 'danger',
              timer: 2000,
              placement: {
                from: 'top',
                align: 'center'
              }
            });
          // this.loading.next({
          //   loading: false,
          //   hasError: true,
          //   hasMsg: 'Please enter valid Credentials'
          // });
        }));
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }
  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthServiceS
   */
  register(data): Observable<any> {
    return this.http.post(environment.API_ENDPOINT + 'account', data)
    /*.pipe(
      map(res => {
        data = res;
        if (data != null || data != undefined || data.status != 500) {
          // Setting token after login
          this.setTokenInLocalStorage(res);
          this.store.dispatch(this.actions.loginSuccess());
          $.notify({
            icon: "notifications",
            message: "Compte créé avec succès!"
          }, {
              type: 'success',
              timer: 2000,
              placement: {
                from: 'top',
                align: 'center'
              }
            });
        } else {
          $.notify({
            icon: "notifications",
            message: "Une erreur est survenue lors de la création du compte!"
          }, {
              type: 'danger',
              timer: 2000,
              placement: {
                from: 'top', 
                align: 'center'
              }
            });
          // this.http.loading.next({
          //   loading: false,
          //   hasError: true,
          //   hasMsg: 'Please enter valid Credentials'
          // });
        }
        return res;
      }));*/
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }
  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AuthServiceS
   */
  authorized(): Observable<any> {
    return this.http
      .get('token').pipe(
        map(res => res));
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }
  /**
   *
   *
   * @returns
   *
   * @memberof AuthServiceS
   */
 
  /**
   * @param {any} user_data
   *
   * @memberof AuthServiceS
   */
  setTokenInLocalStorage(user_data): void {
    const jsonData = JSON.stringify(user_data);
    // console.log('herhrr' + jsonData)
    localStorage.setItem('user', jsonData);
  }
signOut() {
    localStorage.removeItem('user'); 
    localStorage.removeItem('client');
    localStorage.clear();
    //localStorage.setItem('Authstatus',JSON.stringify(false));
    this.store.dispatch(this.actions.logoutSuccess());
  }
  getTaoken(): string {
    return localStorage.getItem('token');
  }

  resetPassword(email: string) {
    /* var auth = firebase.auth();
     return auth.sendPasswordResetEmail(email)
       .then(() => console.log('email sent'))
       .catch((error) => console.log(error));*/
  }

  getUserConnected(): any {
    if (JSON.parse(localStorage.getItem('user'))) {
      let utilisateur: User = <User>JSON.parse(localStorage.getItem('user'));
      return utilisateur;
    }
    return null;
  }
  getClientConnected():any{
    if (JSON.parse(localStorage.getItem('client'))) {
      let client: Client = <Client>JSON.parse(localStorage.getItem('client'));
      return client;
    }
    return null;
  }
  getArtisteConnected():any{
    if (JSON.parse(localStorage.getItem('artiste'))) {
      let artiste: Artiste = <Artiste>JSON.parse(localStorage.getItem('artiste'));
      return artiste;
    }
    return null;
  }
  /**
   * @param id
   * 
   * 
   */
  getAdresseOfUserConnected(id:number):Observable<any>{
      return this.http.get(environment.API_ENDPOINT+`adresse/client/${id}`);
  }
  /**
   * 
   * @param id 
   */
  deleteAdresseOfUser(id:number):Observable<any>{
    return this.http.delete(environment.API_ENDPOINT+`adresse/${id}`);
  }
  /**
   * 
   * @param id 
   * @param value
   */
  
  editClient(client:Client):Observable<any>{
    return this.http.put(environment.API_ENDPOINT + `client/${client.id}`,client);
  }

  testPassword(userDetails: User):Observable<any>{
    return this.http.post(environment.API_ENDPOINT + `login/passwordFind`,userDetails);

  }

  changeUserPassword(newPassword: string, accountDetails: AccountInfo){
    return this.http.put(environment.API_ENDPOINT + `user/editPassword/${newPassword}`,accountDetails);
  }



  //========================== Firebase Link Authentication =================//

  getAuth() { 
    let auth = this.afAuth.auth;
    console.log('afauth Auth is ', auth);
    return auth
  }
// Sign in se connecter avec email/password firebase
doSignIn(email, password) {
  return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((result) => {
      console.log('result is ', result);
      if (result.user.emailVerified !== true) {
        this.SendVerificationMail();
        window.alert('Please validate your email address. Kindly check your inbox.');
      } else {
        this.ngZone.run(() => {
          this.router.navigate(['/register']);
        });
      }
      //this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error.message)
    })
}

// Sign up s'inscrire avec email/password firebase
doSignUp(email, password) {
  return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      console.log('result is ', result);
      this.SendVerificationMail(); 
    }).catch((error) => {
      window.alert(error.message)
    })
}

// Sending email verification notification, when new user registers
SendVerificationMail() {
  return this.afAuth.auth.currentUser.sendEmailVerification()
  .then((res) => {
    console.log('send email res ', res)
    this.router.navigate(['/auth/login']);
  })
}

forgotPassword(mail: string){
  // configurer actioncode Setting pour la redirection apres confirmation
  const actionCodeSettings = {
    url: 'http://localhost:4200/auth/login',
    handleCodeInApp: false
  }
  // envoyer le mail de mis a jour d mot de passe 
return this.afAuth.auth.sendPasswordResetEmail(mail, actionCodeSettings)
.then( res => {
  $.notify({
    icon: "notifications",
    message: "Un mail vous a été envoyé . Merci de consulter votre compte !"
  }, {
      type: 'success',
      timer: 2000,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
    console.log('send reset  res ', res)
  //window.alert('Un mail vous a été envoyé merci de consulter votre compte !');
}).catch(
err => {
  $.notify({
    icon: "notifications",
    message: err
  }, {
      type: 'danger',
      timer: 2000,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  //window.alert(err)
})
}

//================================== ! Firebase Link Authentication ===============//
}
