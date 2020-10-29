import { Component, OnInit } from '@angular/core';
import { AuthServiceS } from 'app/shared/services/auth.service';
//import { SocialUser, AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialAthService } from 'app/shared/services/social-ath.service';
import { User } from 'app/shared/modeles/user';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss']
})
export class SocialAuthComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
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
    private socialauth: SocialAthService,
    private authService: AuthServiceS
    //private authS: AuthService
    ) {
      this.user = {
        prenom: '',
        nom: '',
        email: '',
        password: '',
        password_confirmation: '',
        mobile: null,
        gender: 'M',
        codePays: "SN",
        codeProfil: "CLIENT"
      };
     }

  ngOnInit() {
    /*this.authS.authState.subscribe((user) => {
      this.user;
    });
    */
   //this.user = {null, '','',''}
   /*this.user = {
    prenom = '',
    nom = '',
    email = '',
    password = '',
    password_confirmation = '',
    mobile = '',
    gender = '',
    codePays = '',
    codeProfil = ''
  }*/
  }

  //=================SocialLogin====================//
tryFacebookLogin(){
  //console.log('la valeur : ', value)
  this.socialauth.doFacebookLogin()
  .then(res => {
    //console.log(res);
    this.errorMessage = "";
    this.successMessage = "Login Facebook succeeded";
  }, err => {
    console.log(err);
    this.errorMessage = err.message;
    this.successMessage = "";
  })
}

tryGoogleLogin(){
  //console.log('la valeur : ', value)
  this.socialauth.doGoogleLogin()
  .then(res => {
    console.log(res);
    this.errorMessage = "";
    this.successMessage = "Login Google succeeded";
    //This gives you a Google Access Token. You can use it to access the Google API.
      //let token = res.credential;
      //console.log('Le token : ', token)
      //The signed-in user info.
      this.providerUser = res.user;
      console.log('user : ', this.providerUser);
      let credentials = res.credential;
      console.log('credential : ', credentials)
     //OTHERS INFORMATINS
      this.addinfo = res.additionalUserInfo;
      this.user.nom = this.addinfo.profile.family_name;
      this.user.prenom = this.addinfo.profile.given_name;
      this.user.email = this.addinfo.profile.email;
      this.user.password = this.providerUser.uid;
      this.user.password_confirmation = this.providerUser.uid;
      // Si le mail est déja utilisé se connecter sinon s'inscrire
      if(this.addinfo.isNewUser === true){
        this.authService.register(this.user).subscribe(
          data => {     console.log('datas: ', data)
  
            this.authService.login(data.email, data.password).subscribe(
              resp => console.log('resp: ', data)
            );
          }
          );
      }
      else{
        this.authService.login(this.user.email, this.user.password).subscribe(
          resp => console.log('resp: ', res)
        );
      }
      
      //this.user.password = this.providerUser.uid;
      console.log('Social user is: ', this.user)
      console.log('additionnal info : ', this.addinfo)
      this.opt= res.operationType;
      console.log('Operation type : ', this.opt)
      //this.profile = res.additionalUserInfo.profile;
      //console.log('profile', this.profile)
      //this.prenom = res.additionalUserInfo.profile.prenom;
    
  }, err => {
    console.log(err);
    this.errorMessage = err.message;
    this.successMessage = "";
  })
}
//!================SocialLogin====================//
}
