import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import {SearchActions} from './sculptures/reducers/search.actions';
import {OeuvreService} from './shared/services/oeuvre.service';
import { ArtisteService } from "./shared/services/artiste.service";
import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { ElementsComponent } from './elements/elements.component';
import { ExpositionService } from './shared/services/exposition.service';
import { HttpService } from './shared/services/http';
import { CheckoutService } from './shared/services/checkout.service';
import { AuthServiceS } from './shared/services/auth.service';
import { PaysService } from './shared/services/pays.service';
import { AddressService } from './checkout/address/services/address.service';
import { SocialAthService } from './shared/services/social-ath.service';
import { ImageService } from './shared/services/image.service';
import { TchatService } from './shared/services/tchat.service';
import { MagasinService } from './shared/services/magasin.service';
import { TarificationService } from './shared/services/tarification.service';
import { ServiceLivraisonService } from './shared/services/service-livraison.service';
import { FileService } from './shared/services/file.service';
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatOptionModule, MatSlideToggleModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import 'hammerjs';
import 'mousetrap';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { JwtModule } from '@auth0/angular-jwt';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { reducers, logger} from './app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { VisiteurService } from './shared/services/visiteur.service';
import { ArticleService } from './shared/services/article.service';
import { environment } from '../environments/environment';
import { AuthActions } from './auth/actions/auth.actions';
import { CheckoutActions } from './checkout/actions/checkout.actions';
import { PanierEtMarquageService } from './shared/services/panierEtMarquage.service';
import { MyformatcurrencyPipe } from './shared/pipes/myformatcurrency.pipe';
import { EvenementSignartService } from './shared/services/evenement-signart.service';
import { SecurityService } from './shared/services/security.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
  keys: ['articles','auth','checkout','favorite'],
  rehydrate:true
})(reducer);
}
export const metaReducers: Array<MetaReducer<any, any>> =[localStorageSyncReducer];
/*
!environment.production
? [logger]
: [];
*/
export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    PagesComponent,
    ElementsComponent,
    
    
   

  ],
  exports:[
    MatButtonModule,      
    MatMenuModule,      
    MatToolbarModule,      
    MatIconModule,      
    MatCardModule,            
    MatFormFieldModule,      
    MatInputModule,      
    MatDatepickerModule,      
    MatNativeDateModule,      
    MatRadioModule,      
    MatSelectModule,      
    MatOptionModule,      
    MatSlideToggleModule,
    NgbModule,
  ],
  imports: [
    MatButtonModule,      
    MatMenuModule,      
    MatToolbarModule,      
    MatIconModule,      
    MatCardModule,            
    MatFormFieldModule,      
    MatInputModule,      
    MatDatepickerModule,      
    MatNativeDateModule,      
    MatRadioModule,  
    MatSelectModule,      
    MatOptionModule,      
    MatSlideToggleModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
    }),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    SharedModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    StoreModule.forRoot(reducers, { metaReducers }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    MDBBootstrapModule.forRoot(),
    // LocalStorageModule
    //Config pour injecter le token sur le header Authorization de toutes les requêtes qui utilisent le HttpClient
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ["localhost:4200"],
        // blacklistedRoutes: ["localhost:4200/SignArt/login/", "localhost:4200/SignArt/oeuvre", "localhost:4200/SignArt/artiste"],
        throwNoTokenError: false, //Setting throwNoTokenError to true will result in an error being thrown if a token cannot be retrieved with the tokenGetter
        skipWhenExpired: false // By default, the user's JWT will be sent in HttpClient requests even if it is expired. You may choose to not allow the token to be sent if it is expired by setting skipWhenExpired to true
      }
    }),
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    CommonModule,
    
  ],
  providers: [
    SearchActions, 
    OeuvreService, 
    ArtisteService,
    ExpositionService, 
    VisiteurService,
    HttpService, 
    CheckoutService,
    AuthServiceS,
    PaysService,
    AddressService,
    SocialAthService,
    FormsModule,
    ImageService,
    TchatService,
    FileService,
    AngularFirestore,
    ArticleService,
    ArtisteService,
    OeuvreService,
    PaysService,
    AuthActions,
    CheckoutActions,
    PanierEtMarquageService,
    MyformatcurrencyPipe,
    MagasinService,
    TarificationService,
    ServiceLivraisonService,
    EvenementSignartService,
    DatePipe,
    SecurityService,
    
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
