import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { AuthActions } from '../../../auth/actions/auth.actions';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { User } from '../../../shared/modeles/user';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { ToastrService } from 'ngx-toastr';
import { PanierEtMarquageService } from '../../../shared/services/panierEtMarquage.service';
import { Client } from '../../../shared/modeles/client';
import { Panier } from '../../../shared/modeles/panier';
import { Oeuvre } from '../../../shared/modeles/oeuvre';
import { ProductService } from '../../../shared/services/product.service';

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
  newOeuvres: any[] = [];
  oeuvresClient: any;
  public connexionStatut: boolean = true;
  

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceS,
    //private authS: AuthService,
    private actions: AuthActions,
    private oeuvreS:OeuvreService,
    private artisteService:ArtisteService,
    private toastrService: ToastrService,
    private panierEtMarquageService:PanierEtMarquageService,
    private productService:ProductService,
  ) {
    this.oeuvresClient = null;
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
          console.log("ici");
        const error = data.error;
        if (error) {
          keys.forEach(val => {
            this.pushErrorFor(val, error);
          });
          }
        },
        err =>{
          /*$.notify({
            icon: "notifications",
            message: "Identifiant ou mot de passe non valide !"
          }, {
              type: 'danger',
              timer: 2000,
              placement: {
                from: 'top',
                align: 'center'
              }
            });*/
            this.connexionStatut = false;
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

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  initForm() {
    const email = '';
    const password = '';

    this.signInForm = this.fb.group({
      'email': [email, Validators.required/*Validators.pattern(this.emailPattern)*/],
      'password': [password, Validators.required]
    });
  }

  redirectIfUserLoggedIn() {
    console.log("redirect me");
    this.newOeuvres = this.productService.getNewCartItem();
    this.store.select(getAuthStatus).subscribe(
      data => {
        if (data === true) {
        this.User=this.authService.getUserConnected();
        if(this.User.userType=="CLIENT"){
          this.oeuvreS.getClientByUser(this.User.id)
          .subscribe(
            response => { 
              let client= <Client> response;
              console.log("ici redi");
             
              
              this.panierEtMarquageService.getWishList(client.id).subscribe(resp=>{
                localStorage.setItem('wishlistItems',JSON.stringify(resp));
                this.productService.initState();
              });
              this.panierEtMarquageService.getPanierByIdClient(client.id).subscribe(resp=>{
                console.log(resp);
                this.oeuvresClient = resp;
                console.log("les oeuvreee du clientssss", this.oeuvresClient);
                console.log("les oeuvreee du visiteurrrrrr", this.newOeuvres);
                let panier= <Panier>resp;
                  let listProduct:Oeuvre[]=[];
                  panier.lignesPanier.forEach(ele=> {
                    ele.oeuvre.image=null; 
                    ele.oeuvre.quantity=ele.quantite;
                    ele.idClient=client.id;
                    let test=<Oeuvre>listProduct.find(o=>o.id === ele.oeuvre.id);
                    if(test!=null || test!= undefined)
                    {
                      let index = listProduct.indexOf(test);
                      listProduct[index].quantity+= ele.oeuvre.quantity;
                      //ele.oeuvre.quantity=test.quantity;
                    }
                    else
                      listProduct.push(ele.oeuvre);
                  });
                  //localStorage.setItem('products',JSON.stringify(listProduct));
                  if( this.setToLocalStorage(resp,listProduct)==true)
                  {
                    this.productService.initState();
                    console.log("hello init here get local")
                  }      
                for (let j = 0; j < this.newOeuvres.length; j++) {
                  console.log(this.oeuvresClient.lignesPanier.find(elp=>elp.oeuvre.id === this.newOeuvres[j].id));
                  let nbr= this.oeuvresClient.lignesPanier.find(elp=>elp.oeuvre.id === this.newOeuvres[j].id);
                  console.log(nbr);
                  if(nbr != undefined)
                  {
                    let quantity= this.newOeuvres[j].quantity;
                    //this.newOeuvres[j].quantity = 0;
                    nbr.quantity=this.newOeuvres[j].quantity;
                    this.productService.updateCartQuantity(this.newOeuvres[j],quantity);
                    console.log("1- I added");
                    console.log(this.newOeuvres[j]);
                    console.log("with quantity"+ quantity);
                  }
                  else
                  {
                    let quantity= this.newOeuvres[j].quantity;
                    this.newOeuvres[j].quantity = 0;
                    this.productService.addToCart(this.newOeuvres[j]);
                    quantity--;
                    if(quantity>=1)
                      this.productService.updateCartQuantity(this.newOeuvres[j],quantity);
                    console.log("2- I added");
                    console.log(this.newOeuvres[j]);
                    console.log("with quantity"+ quantity);
                  }
                    
                 /* if(this.newOeuvres[j].id != this.oeuvresClient.lignesPanier[i].oeuvre.id){
                    console.log("same id");
                   
                    console.log("new oeuvre matchesss",this.newOeuvres[j]);
                    console.log("new oeuvre added",this.oeuvresClient.lignesPanier[i].oeuvre);
                  } */                 
                }   
              /*for (let i = 0; i < this.oeuvresClient.lignesPanier.length; i++) {
                               
              }*/

              //setTimeout(() => {
              //this.panierEtMarquageService.getPanierByIdClient(client.id).subscribe(resp=>{
                     
              //});
                     
            //}, 1500);
              })
              localStorage.setItem('client',JSON.stringify(response))
              
          });   
        }
        else{ 
          this.artisteService.getArtisteByUser(this.User.id)
          .subscribe(
            response => { 
              localStorage.setItem('artiste',JSON.stringify(response))
              localStorage.removeItem('panier');
              localStorage.removeItem('cartItems');
          });   
        }          
        this.router.navigate([this.returnUrl]);
       }
      }
    ); 
  }

  setToLocalStorage(resp,listProduct){
    localStorage.setItem('panier',JSON.stringify(resp))
    localStorage.setItem('cartItems',JSON.stringify(listProduct))
    return true;
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
