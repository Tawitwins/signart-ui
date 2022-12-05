import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { AuthRoutes as routes } from './auth.routes';
import { SharedModule } from '../shared/shared.module';
import { CompteComponent } from './components/compte/compte.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

//import { SocialLoginModule } from 'angularx-social-login';
//import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login';
import { from } from 'rxjs';
import { ApplyComponent } from './components/apply/apply.component';
import { SocialAuthComponent } from './components/login/social-auth/social-auth.component';
import { SocialAthService } from '../shared/services/social-ath.service';

//import {FirebaseModule, FirebaseProvider} from 'angular-firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



/*const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('891728944359977')
  }
]);

export function provideConfig() {
  return config;
}
*/
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatRadioModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthServiceS } from '../shared/services/auth.service';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  imports: [
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    //AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    //CommonModule,
    //SocialLoginModule,
    RouterModule.forChild(routes),
    // SharedModule,
    MDBBootstrapModule.forRoot(),
    //FirebaseModule
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule, 
    ReactiveFormsModule,
    MatListModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  ],
  declarations: [
    LoginComponent,
    SignUpComponent,
    CompteComponent,
    ApplyComponent,
    SocialAuthComponent,
    ResetPasswordComponent,
    UserManagementComponent

  ],
  providers: [
    SocialAthService
    //FirebaseProvider,
    /*{
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }*/
  
  ],
    exports: [
        LoginComponent,
        SignUpComponent,
        CompteComponent,
        ApplyComponent,
        SocialAuthComponent,
        ResetPasswordComponent
    ]
})
export class AuthModule { }
