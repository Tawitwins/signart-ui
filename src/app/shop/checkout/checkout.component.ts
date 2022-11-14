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
import { Store } from '@ngrx/store';
import { AddressService } from '../../checkout/address/services/address.service';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { MagasinService } from 'src/app/shared/services/magasin.service';
import { TarificationService } from 'src/app/shared/services/tarification.service';
import { ServiceLivraisonService } from 'src/app/shared/services/service-livraison.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { ImageService } from 'src/app/shared/services/image.service';
import { Utilisateur } from 'src/app/shared/modeles/utilisateur';
import { TranslateService } from '@ngx-translate/core';

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
  addAdresse: number;
  indicatifpays: string;
  libellePays: string;
  addressForm: FormGroup;
  listAdressesLength: number;
  emailForm: FormGroup;
  isAuthenticated: boolean;
  user:any;
  magasinList: any;
  selectedMagasin: any;
  selectedTarification: any;
  tarificationList:any;
  selectedServiceLivraison: any;
  serviceLivraisonList:any;
  base64Image:string
  qrcodeOM:any=[]
  pop_up_confirmation: boolean
  qrCodeUrlImg: any;
  totalAmount: number;
  MONTANT_SEUIL: number;
  SeuilLivraison: any;
  fraisLivraison: number = 0;
  montantTotalAPayer: number = 0;

  constructor(private fb: FormBuilder,private toastService:ToastrService,private authService:AuthServiceS,
    public productService: ProductService,private newCheckoutService:CheckoutService,private paysService:PaysService,
    private orderService: OrderService, private checkoutService: CheckoutService,
    private addrService: AddressService, 
    private store: Store<AppState>,private authS:AuthServiceS, private magasinService:MagasinService, private tarificationService:TarificationService,
    private serviceLivraisonService: ServiceLivraisonService, private sanitizer: DomSanitizer,
    private router: Router,
    private imageService: ImageService,
    private translate: TranslateService
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

    this.addAdresse = 0;
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
    this.magasinService.getAllMagasins().subscribe(resp =>{
        this.magasinList = resp;
      });
    this.tarificationService.getAllTarifications().subscribe(resp =>{
        this.tarificationList = resp;
      })
    this.serviceLivraisonService.getAllServiceLivraisons().subscribe(resp => {
        this.serviceLivraisonList = resp;
        this.getTotal.subscribe( resp => this.totalAmount = resp);
        console.log("this.serviceLivraisonList: ",this.serviceLivraisonList)
        this.checkoutService.getMontantSeuil().subscribe(resp => {
          this.SeuilLivraison = resp;
          this.MONTANT_SEUIL = this.SeuilLivraison.value;
          this.montantSeuil(); 
        })
        

      })
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

 montantSeuil(){
  this.commande = <Commande>JSON.parse(localStorage.getItem('order'));
  //this.getFraisLivraison(this.commande.id, this.totalAmount)
  if ( this.totalAmount >= this.MONTANT_SEUIL) {
      this.serviceLivraisonList = this.serviceLivraisonList.filter(serviceLivraison =>serviceLivraison.nom.replace(/\s+/g, '') != "Signartexpress")
  }
 }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
    localStorage.removeItem('livraison');
    //this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });

    this.initConfig();
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  addNewAdresse(){
    this.addAdresse = 1;
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
     console.log('adresses : ', address);
     address.idClient = this.client.id;
     let addressAttributes;
     addressAttributes = this.addrService.createAddresAttributes(address);
     console.log('adresses : ', addressAttributes);
     this.checkoutService.addAdressesLivEtFact(addressAttributes).subscribe(
       resp=>{
         console.log(resp);
         this.translate.get('PopupAddressAdded').subscribe(popup => {
          this.toastService.success(popup ,"Succès");
        })
         this.addAdresse = 0;
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

       }
     );
     this.listAdressesLength = 1;
     //this.store.dispatch(this.actions.updateOrderAdressNumberSuccess(this.listAdressesLength));
     
     //this.router.navigate(['/checkout', 'address']);
     //location.reload();
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
    this.selectedModeLiv = selectedModeLiv;
    this.selectedMagasin = null;
    this.selectedServiceLivraison = null;
    this.selectedTarification = null;

  }
  CheckFormEtPayer(){
    this.getTotal.subscribe(resp=> this.totalAmount= resp);
    let livraison =JSON.parse(localStorage.getItem('livraison'));
    console.log(livraison);
    if(this.livraisonStr=="")
    {
      this.translate.get('PopupChoisirModeLiv').subscribe(popup => {
        this.toastService.info(popup ,"Attention");
      })
    }
    else if(this.checkoutForm.value['address']==undefined || this.checkoutForm.value['address']==null)
    {
      this.translate.get('PopupChoisirAdLiv').subscribe(popup => {
        this.toastService.info(popup ,"Attention");
      })
    }
    else if(this.selectedModeLiv?.LCode=="MAG" && this.selectedMagasin == null){
      this.translate.get('PopupChoixGalerie').subscribe(popup => {
      this.toastService.warning(popup);
      })
    }
    else if(this.selectedModeLiv?.LCode=="DOM" && (this.selectedTarification == null || this.selectedServiceLivraison == null)){
      this.translate.get('PopupChoixDomicile').subscribe(popup => {
        this.toastService.warning(popup);
        })
    }
    /* if(this.payment=="")
    {
      this.toastService.info("Veuillez choisir un mode de paiement SVP.","Attention");
    } */
    else if(livraison!=null){
      this.isLivraisonOk=true;
      console.log(this.isLivraisonOk=true)
      this.translate.get('PopupModeLivPriseEnCompte').subscribe(popup => {
        this.toastService.success(popup);
        })
      this.updateCommandePourLivraison();
      
    }
    else
    {
      let modeLivraison= <ModeLivraison> this.setCODAsSelectedModeLivraison(this.allModeLivraison,this.livraisonStr)
      //this.commande.id = commande.id;
      let order =<Commande>JSON.parse(localStorage.getItem('order'));
      this.livraison.id=order.id;
      this.livraison.codeEtatLivraison = 'NOLIVREE';
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
      this.translate.get('PopupModeLivPriseEnCompte').subscribe(popup => {
        this.toastService.success(popup);
        })
    });
    this.updateCommandePourLivraison();
    /* console.log('la livraison :', this.livraison);
      localStorage['livraison'] = JSON.stringify(this.livraison); */
    }
  }

  sendSms(){
    let user = JSON.parse(localStorage.getItem('user'));
    let client = JSON.parse(localStorage.getItem('client'));
    if(this.selectedMagasin != null){
      if(this.magasinList.length != 0 &&  this.selectedMagasin != 0){
        this.magasinList.forEach(m => {
          if(m.id == this.selectedMagasin){
            let data = {
              phoneNumber:`${client.telephone.trim()}`,
              message: `Bonjour ${client.prenom.trim()} ${client.nom.trim()},\nMerci de trouver ci-joint les coordonnees de notre galerie\nNom: ${m.nom.trim()},\nAdresse: ${m.adresse.trim()},\nNom du responsable: ${m.nomResp.trim()},\nTel: ${m.telephoneResp.trim()}\nMerci.`
            }
  
            this.translate.get('smsCoordGalerie',
             {
              prenom: client.prenom.trim(), 
              nom: client.nom.trim(),
              nomG: m.nom.trim(),
              addressG: m.adresse.trim(),
              nomResp: m.nomResp.trim(),
              telResp: m.telephoneResp.trim()
            }).subscribe(sms => {
                let data = {
                  phoneNumber:`${client.telephone.trim()}`,
                  message: sms
                }
                this.newCheckoutService.sendMessage(data).subscribe(res => {
                  console.log(res);
                })
              })
           //`Bonjour ${client.prenom.trim()} ${client.nom.trim()},\nMerci de trouver ci-joint les coordonnees de notre galerie\nNom: ${m.nom.trim()},\nAdresse: ${m.adresse.trim()},\nNom du responsable: ${m.nomResp.trim()},\nTel: ${m.telephoneResp.trim()}\nMerci.`
          }
        })
      }
    }

  }

  updateCommandePourLivraison() {
      this.order = <Commande>JSON.parse(localStorage.getItem('order'));
      this.order.idMagasin = this.selectedMagasin;
      this.order.idTarification = this.selectedTarification;
      this.order.idServiceLivraison = this.selectedServiceLivraison;
      this.order.totalLivraison = 0;
      console.log("this.order")
      console.log(this.order)
      // if(this.selectedMagasin != null)
      //   this.sendSms();
      this.newCheckoutService.updateCommande(this.order.id,this.order).subscribe(resp=>{
        console.log(resp);
        if(this.order.idTarification != null && this.order.idServiceLivraison != null){
          console.log(this.order.idTarification)
          this.getFraisLivraison(this.order.id, this.totalAmount );
        }
      })
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
    this.codePaiement = 'NOPAYE';
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
  apicall(modePaiement){
    if(modePaiement.code == 'OM'){
      this.getQrCodeWithAmount();
    }
  }
  getQrCodeWithAmount(){
    this.checkoutService.getQrCodeWithAmount(this.totalAmount)
    .subscribe(res=>{
      this.qrcodeOM = res;
       this.qrCodeUrlImg = this.transform();
    })
  }
  transform() {
    console.log(this.qrcodeOM);
    this.base64Image = `data:image/png;base64, ${this.qrcodeOM.qrCode}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Image);
  }
  orderConfirmed(){
    /* setTimeout(()=>{
      console.log("la transaction a été complétée avec succès ")
      this.pop_up_confirmation = true
    }, 5000); */
    //window.location.href=this.answer.response_text;
    this.router.navigate(['/pages/order/success']);
  }

  
  getFraisLivraison(idCommande:number, totalAmount: number){
      this.imageService.getFraisLivraison(idCommande).subscribe(resp => {
      this.fraisLivraison = <number>resp;
      this.montantTotalAPayer = totalAmount + this.fraisLivraison;
      this.order.totalLivraison = this.fraisLivraison;
      this.newCheckoutService.updateCommande(this.order.id,this.order).subscribe(resp=>{
        console.log(resp)
      })
    })
  }
}
