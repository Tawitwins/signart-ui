import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { AuthServiceS } from '../../shared/services/auth.service';
import { Client } from '../../shared/modeles/client';
import { PaysService } from '../../shared/services/pays.service';
//import { CheckoutState } from '../../checkout/reducers/checkout.state';
import { CheckoutService } from '../../shared/services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentMode } from '../../shared/modeles/payment_mode';
import { tap } from 'rxjs/operators';
import { Commande } from '../../shared/modeles/commande';
import { Livraison } from '../../shared/modeles/livraison';
import { LigneCommande } from '../../shared/modeles/ligneCommande';
import { ModeLivraison } from '../../shared/modeles/mode_livraison';
import { Address } from 'cluster';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm:  FormGroup;
  public products: Product[] = [];
  public payPalConfig ? : IPayPalConfig;
  public payment: string="";
  public livraisonStr:string ="";
  public amount:  any;
  client: Client;
  allPays: any;
  allModePaiement: PaymentMode| any;
  allModeLivraison: Object;
  codePaiement: string;
  selectedMode: any;
  order:Commande;
  commande: Commande;
  livraison: Livraison=new Livraison();
  isLivraisonOk:boolean=false;
  listAdresses: any;
  adresseLivraison: any;
  selectedModeLiv: any;

  constructor(private fb: FormBuilder,private toastService:ToastrService,private authService:AuthServiceS,
    public productService: ProductService,private newCheckoutService:CheckoutService,private paysService:PaysService,
    private orderService: OrderService) { 
    this.client = this.authService.getClientConnected();
    this.paysService.getAllPays().subscribe(pays => this.allPays = pays);
    this.newCheckoutService.availablePaymentMethods().subscribe(resp=> {
      console.log(resp);
      this.allModePaiement= resp;} );
    this.newCheckoutService.availableShippingMethods().subscribe(resp=>{ 
      console.log(resp); 
      this.allModeLivraison= resp});
    this.newCheckoutService.getAdresseByClient(this.client.id).subscribe(
        resp => {
          this.listAdresses = resp;
          //c'est pour afficher uniquement les adresses de livraison(pas de facturation)
          for(let i=0;i<this.listAdresses.Length;i++){
          if(this.listAdresses[i].codeTypeAdresse=='LIVRAISON'){
            this.adresseLivraison=this.listAdresses[i];
            console.log('les adresses de livraison',this.adresseLivraison)
          }
        }
      });
    this.checkoutForm = this.fb.group({
      firstname: [this.client.prenom, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: [this.client.nom, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: [this.client.telephone, [Validators.required, Validators.pattern('[0-9]+')]],
      //email: ['', [Validators.required, Validators.email]],
      address: [this.client.adresseLivraison, [Validators.required, Validators.maxLength(50)]],
      country: [this.client.pays, Validators.required],
      //town: [this.client.ville, Validators.required],
      //state: ['', Validators.required],
      //postalcode: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
    //this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });

    this.initConfig();
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Stripe Payment Gateway
  stripeCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripe_token, // publishble key
      locale: 'auto',
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
      }
    });
    handler.open({
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    }) 
  }

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
        currency: this.productService.Currency.currency,
        clientId: environment.paypal_token,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                currency_code: this.productService.Currency.currency,
                value: this.amount,
                breakdown: {
                    item_total: {
                        currency_code: this.productService.Currency.currency,
                        value: this.amount
                    }
                }
              }
          }]
      },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            size:  'small', // small | medium | large | responsive
            shape: 'rect', // pill | rect
        },
        onApprove: (data, actions) => {
            this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }

  showInf()
  {
    console.log(this.livraisonStr);
    console.log(this.payment);
  }
  livraisonCheck(selectedModeLiv){
    //this.isLivraisonOk=true;
    this.selectedModeLiv=selectedModeLiv;

  }
  CheckFormEtPayer(){
    if(this.livraisonStr=="")
    {
      this.toastService.info("Veuillez choisir un mode de livraison SVP.","Attention");
    }
    else if(this.checkoutForm.value['address']==undefined || this.checkoutForm.value['address']==null)
    {
      this.toastService.info("Veuillez choisir une adresse de livraison SVP.","Attention");
    }
    /* if(this.payment=="")
    {
      this.toastService.info("Veuillez choisir un mode de paiement SVP.","Attention");
    } */
    else
    {
      let modeLivraison= <ModeLivraison> this.setCODAsSelectedModeLivraison(this.allModeLivraison,this.livraisonStr)
      //this.commande.id = commande.id;
      let order =<Commande>JSON.parse(localStorage.getItem('order'));
      this.livraison.id=order.id;
      this.livraison.codeEtatLivraison = 'INITIE';
      this.livraison.idModeLivraison = modeLivraison.id;
      this.livraison.idAdresseLivraison = this.listAdresses[this.checkoutForm.value['address']].id;
      this.livraison.lignesCommande = order.lignesCommande;
      this.livraison.lignesCommande.forEach(lc=>{
        lc.oeuvre.image=null;
      });
     /*  this.products.forEach(prod=>{ 
        let ligneCommande = new LigneCommande();
        ligneCommande.id= prod.id;
        ligneCommande.oeuvre=prod;
        ligneCommande.prix= prod.price
        ligneCommande.quantite= prod.quantity;
        ligneCommande.oeuvre.image=null;
        this.livraison.lignesCommande.push(ligneCommande);
      }); */
    // Ajouter au localstorage
    console.log('la livraison :', this.livraison);
    localStorage.setItem('livraison', JSON.stringify(this.livraison));
    this.newCheckoutService.postLivraisonCommande(this.livraison).subscribe(resp=> {
      this.isLivraisonOk=true;
      this.toastService.success("Le mode de livraison a bien été prise en compte. Vous pouvez poursuivre.");
    });
    /* console.log('la livraison :', this.livraison);
      localStorage['livraison'] = JSON.stringify(this.livraison); */
    }
  }
  resetPayment(){
    this.payment='';
  }
  setCODAsSelectedModeLivraison(modes,code) {
    let selectedMode = new ModeLivraison();;
    modes.forEach((mode) => {
      if (mode.LCode === code) {
        selectedMode = mode;
      }
    });
    return selectedMode;
  }
  setCODAsSelectedModePayment(modes,code) {
    let selectedMode;
    modes.forEach((mode) => {
      if (mode.code === code) {
        selectedMode = mode;
      }
    });
    return selectedMode;
  }

  makePayment() {
    this.selectedMode=this.setCODAsSelectedModePayment(this.allModePaiement,this.payment);
    const paymentModeId = this.selectedMode.id;
    this.codePaiement = 'INITIE';
    console.log(this.getTotal);
    this.newCheckoutService.createNewPayment(paymentModeId, this.getTotal,this.codePaiement).pipe(
      tap(() => {
        //this.store.dispatch(this.checkoutActions.orderCompleteSuccess());
        //this.redirectToNewPage();
        this.newCheckoutService.createEmptyOrder()
          .subscribe();
      }))
      .subscribe();
  }
}
