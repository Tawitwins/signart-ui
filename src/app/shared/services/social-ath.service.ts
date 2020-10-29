import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
//import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AuthServiceS } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocialAthService {
  prenom: string;
  nom: string;
  profile: any;
  userinfo:any;
  addinfo:any;
  credentials:any;
  opt:any;
  providerUser: any;
  user : any; 
  constructor(
    private afa: AngularFireAuth,
    private authService: AuthServiceS
    ) { }

  doFacebookLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('profile')
      console.log('Facebook provider: ', provider)
      this.afa.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }
  
  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      console.log('Google provider: ', provider)
      provider.addScope('profile');
      provider.addScope('email');
      this.afa.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      },err => {
        console.log(err);
        reject(err);
      }
      )
    })
  }
/**
 * 
 * @param value 
 */

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      //firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }
    
}
