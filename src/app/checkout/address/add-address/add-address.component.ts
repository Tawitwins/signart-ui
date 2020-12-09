import { getAuthStatus } from '../../../auth/reducers/selectors';

import { AppState } from '../../../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../auth/actions/auth.actions';
import { AddressService } from '../services/address.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { PaysService } from '../../../shared/services/pays.service';
import { Pays } from '../../../shared/modeles/pays';

import { Router } from '@angular/router';
import { CheckoutActions } from '../../actions/checkout.actions';
import { Client } from '../../../shared/modeles/client';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { ToastrService } from 'ngx-toastr';
declare var $:any;
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  providers: [PaysService]
})
export class AddAddressComponent implements OnInit, OnDestroy {
  user:any;
  public client: Client;
  idUser:number;
  addressForm: FormGroup;
  emailForm: FormGroup;
  isAuthenticated: boolean;
  allPays: Pays[] = [];
  selected:string = '';
  prenom: string;
  nom: string;
  pays: string;
  tel: string;
  listAdresses: any;
  nombreAdresses: number;
  listAdressesLength: number;
  public infopage: number=7;
  indicatifpays: string;
  libellePays: string;
  
  constructor(
    private fb: FormBuilder, private authActions: AuthActions,
    private checkoutService: CheckoutService,
    private authS:AuthServiceS,
    private oeuvreS:OeuvreService,
    private addrService: AddressService,
    private store: Store<AppState>,
    private paysService: PaysService,
    private actions: CheckoutActions,
    private router: Router,
    private toastrService:ToastrService,
    ) {
      this.indicatifpays = "+221";
    this.libellePays = "Sénégal";
      this.addressForm = addrService.initAddressForm();
      this.emailForm = addrService.initEmailForm();
      this.store.select(getAuthStatus).subscribe((auth) => {
        this.isAuthenticated = auth;
      });
      this.user=this.authS.getUserConnected();
      this.client={id:0,nom: '',prenom: '',sexe: '',adresseFacturation:'',adresseLivraison:'',ville:'',telephone: '',dateNaissance:new Date(),etatClient:'',idEtatClient: 0,idPays:1,pays: '',idUser:0}  
      
  }

  ngOnInit() {
    this.paysService.getAllPays().subscribe(pays => this.allPays = pays);
    this.oeuvreS.getClientByUser(parseInt(this.user.id)).subscribe(
      response=>{
        this.client=response
        localStorage.setItem('client',JSON.stringify(response));
      }
    );
    
  } 

  choisirPays(event) {
   // console.log('evennnnt valueeee',event.target.value)
    for (let i = 0; i < this.allPays.length; i++) {
       if(this.allPays[i].id == event.target.value){
         //console.log('indicatiiiiiiiiiif valuuuuuuuue',this.allPays[i].indicatif)
         this.indicatifpays = this.allPays[i].indicatif;
       }
      
    }
  }

  onSubmit() {
    let address = this.addressForm.value;
    address.idClient = this.client.id;
    let addressAttributes;
    addressAttributes = this.addrService.createAddresAttributes(address);
    console.log('adresses : ', addressAttributes);
    this.checkoutService.addAdressesLivEtFact(addressAttributes).subscribe(
      resp=>{
        console.log(resp);
        this.toastrService.success("Adresse ajouté","Succés");
      }
    );
    this.listAdressesLength = 1;
    //this.store.dispatch(this.actions.updateOrderAdressNumberSuccess(this.listAdressesLength));
    
    //this.router.navigate(['/checkout', 'address']);
    //location.reload();
  }

  ngOnDestroy() {
  }

}
