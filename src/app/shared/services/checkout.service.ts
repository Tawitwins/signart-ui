import { PaiementEtLigneP } from './../modeles/paiementEtLignesP';
import { LigneCommande } from './../modeles/ligneCommande';

import { map } from 'rxjs/operators';
import { getOrderNumber, getOrderId } from '../../checkout/reducers/selectors';
import { CheckoutActions } from '../../checkout/actions/checkout.actions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { HttpService } from './http';
import { LineItem } from '../modeles/line_item';
import { Oeuvre } from '../modeles/oeuvre';
import { environment } from '../../../environments/environment';
import { LignePanier } from '../modeles/ligne_panier';
import { Order } from '../modeles/order';
import { Commande } from '../modeles/commande';
import { Panier } from '../modeles/panier';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { PaymentMode } from '../modeles/payment_mode';
import { ModeLivraison } from '../modeles/mode_livraison';
import { Address } from '../modeles/address';
import { Livraison } from '../modeles/livraison';
import { ToastrService } from 'ngx-toastr';
import { NullTemplateVisitor } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from './security.service';
import { EtatCommande } from './../modeles/etatCommande';
declare var $: any;

@Injectable()
export class CheckoutService extends HttpService {
  BASE_URL:string = environment.API_ENDPOINT;
  private orderNumber: number;
  private orderId: number;
  private livraison: Livraison = {id:null,dateLivraisonPrevue: null, dateLivraisonEffective: null, dateLivraison: null,idAdresseLivraison:null,idModeLivraison: null,libelleModeLivraison:'', codeEtatLivraison:null, lignesCommande:[], libelleEtatLivraison: null};
  
  /**
   * Creates an instance of CheckoutService.
   * @param {CheckoutActions} actions
   * @param {Store<AppState>} store
   *
   * 
   */
  constructor(
    public http: HttpClient,
    private actions: CheckoutActions,
    private store: Store<AppState>,
    private toastrService:ToastrService,
    private translate: TranslateService,
    private securityService:SecurityService
  ) {
    super(http);
    this.store.select(getOrderNumber)
      .subscribe(number => this.orderNumber = number);
    this.store.select(getOrderId)
      .subscribe(number => this.orderId = number);
  }

  //  Change below methods once angular releases RC4, so that this methods can be called from effects
  //  Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869

  /**
   *
   *
   * @param {Oeuvre} oeuvre
   * @returns
   *
   * 
   */
  createNewLineItem(oeuvre: Oeuvre) {
    return this.post(environment.API_ENDPOINT +
      `lignepanier`,
      {
        oeuvre: {
          id: oeuvre.id
        },
        quantite: 1,
        prix: oeuvre.prix,
        total: oeuvre.prix,
        idClient: 3
      }
    ).pipe(map(res => {
      if (res) {
          this.translate.get('PopupOeuvAddedAtCart').subscribe(popup => {
            $.notify({
              icon: "notifications",
              message: popup
            }, {
              type: 'success',
              timer: 2000,
              placement: {
                from: 'top',
                align: 'center'
              }
            });
        })
       
        // const panier: Panier = res.json();
        return <any>res;
      } else {
        this.translate.get('PopupOeuvAddedError').subscribe(popup => {
          $.notify({
            icon: "notifications",
            message: popup
          }, {
            type: 'danger',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        })
       
        return null;
      }

    },
      error => {
        this.translate.get('PopupOeuvAddedError').subscribe(popup => {
          $.notify({
            icon: "notifications",
            message: popup
          }, {
            type: 'danger',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        })
      }));
  }
  getLineItemsInLocalStorage(){
    if (JSON.parse(localStorage.getItem('panier'))) {
      return JSON.parse(localStorage.getItem('panier')).lignesPanier;
    }
  }

  createNewLineItemInLocalStorage(oeuvre: any,idClient:number): Panier {
    oeuvre.image=null;
    let panier;
    if (localStorage.getItem('panier')) {
      //console.log("updating panier in local storage");
      panier = this.updateCart(oeuvre,idClient);
      localStorage.setItem('panier', JSON.stringify(panier));
    } else {
      panier = this.createCart(oeuvre,idClient);
      //console.log("creating panier in local storage");
      localStorage.setItem('panier',JSON.stringify(panier));
    }


    return panier;
  }

  private createCart(oeuvre: Oeuvre,idClient:number) {
    let lignesPanier: LignePanier[] = [];

    let panier: Panier = {};

    //cr??ation ligne panier
    let lignePanier: LignePanier = { id: null, oeuvre: null, prix: null, quantite: null, total: null ,lithographie: false, idClient:null };

    lignePanier.id = 1;
    lignePanier.oeuvre = oeuvre;
    lignePanier.prix = oeuvre.prix;
    lignePanier.quantite = 1;
    lignePanier.total = oeuvre.prix;
    lignePanier.idClient= idClient;
    lignesPanier.push(lignePanier);

    //cr??ation du panier
    panier.idEtatPanier = null;
    panier.libelleEtatPanier = null;
    panier.codeDevise = null;
    panier.idDevise = null;
    panier.id = null;
    panier.idClient = null;
    panier.risque = false;
    panier.lignesPanier = lignesPanier;
    panier.total = lignePanier.total;
    panier.nbTotal = lignePanier.quantite;
    panier.totalLivraison = oeuvre.fraisLivraison;
    panier.totalTaxes = oeuvre.taxes;

    return panier;
  }

  private updateCart(oeuvre: Oeuvre,idClient:number) {
    let isUptodate=false;
    let panierStockee = JSON.parse(localStorage.getItem('panier'));
    panierStockee.lignesPanier.forEach(element => { 
      if(element.oeuvre.id === oeuvre.id)
      {
        //console.log("l'oeuvre est d??ja ajout?? au panier.");
        isUptodate=true;
        return panierStockee;
      }
    });
    if(isUptodate==false)
    {
      let nb = panierStockee.lignesPanier.length;
      //console.log("l'oeuvre est d??ja ajout?? au panier mais je sais pa pk je continu.");
      //cr??ation d'une nouvelle ligne panier
      let lignePanier: LignePanier = { id: null, oeuvre: null, prix: null, quantite: null, total: null, lithographie: false,idClient:null };

      lignePanier.id = (nb + 1);
      lignePanier.oeuvre = oeuvre;
      lignePanier.prix = oeuvre.prix;
      lignePanier.quantite = 1;
      lignePanier.total = oeuvre.prix;
      lignePanier.idClient= idClient;
      panierStockee.lignesPanier.push(lignePanier);

      //Mise ?? jour du panier
      panierStockee.total = (panierStockee.total + lignePanier.total);
      panierStockee.nbTotal = (panierStockee.nbTotal + lignePanier.quantite);
      panierStockee.totalLivraison = (panierStockee.totalLivraison + oeuvre.fraisLivraison);
      panierStockee.totalTaxes = (panierStockee.totalTaxes + oeuvre.taxes);

      return panierStockee;
    }
    else 
      return panierStockee;
  }

  getLineItems() {
    return this.get<LignePanier[]>(environment.API_ENDPOINT + `lignepanier`);
  }

  getPanierItems(idClient: number): any {
    return this.get(environment.API_ENDPOINT + `panier/client/${idClient}`);
  }

  createPanierItems(panier: Panier): any {
    return this.post(environment.API_ENDPOINT + `panier`,panier);
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  // fetchCurrentOrder() {
  //   return this.http.get(
  //     'spree/api/v1/orders/current'
  //   ).map(res => {
  //     const order = res.json();
  //     if (order) {
  //       const token = order.token;
  //       this.setOrderTokenInLocalStorage({ order_token: token });
  //       return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
  //     } else {
  //       this.createEmptyOrder()
  //         .subscribe();
  //     }
  //   });
  // }

  /**
   *
   *
   * @param {any} orderNumber
   * @returns
   *
   * @memberof CheckoutService
   */
  getOrder(orderNumber) {
    return this.get(
      `spree/api/v1/orders/${orderNumber}.json`
    );
  }


  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  createEmptyOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'X-Spree-Token': user && user.spree_api_key
    });

    return this.post(
      'spree/api/v1/orders.json', {}, { headers: headers }).pipe(map(res => {
        const order: any = res;
        const token = order.token;
        this.setOrderTokenInLocalStorage({ order_token: token });
        return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
      }));
  }

  /**
   *
   *
   * @param {LignePanier} lignePanier
   * @returns
   *
   * @memberof CheckoutService
   */
  deleteLineItem(lignePanier: LignePanier) {
    //console.log("item retire : " + lignePanier);
    return this.delete(environment.API_ENDPOINT + `lignepanier/${lignePanier.id}`).pipe(
      map(() => {
        this.store.dispatch(this.actions.removeLineItemSuccess(lignePanier));
        this.translate.get('PopupOeuvRemovedFCart').subscribe(popup => {
          $.notify({
            icon: "notifications",
            message: popup
          }, {
            type: 'success',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        })
      }));
  }
  getPanierInLocalStorage(){
    if (JSON.parse(localStorage.getItem('panier'))) {
      return JSON.parse(localStorage.getItem('panier'));
    }
  }

  createOrder(idClient: number,value:any) {
    let livraison: Livraison;
    let commande: any;
    return this.post(environment.API_ENDPOINT +
      `commande/passer/${idClient}`,value)
      .pipe(map(res => {
      //console.log('order response : ' + res);
      const order: Commande = <Commande>res;
      if (order != null && order != undefined) {
        // Ajouter au localstorage
        //localStorage.setItem('order', JSON.stringify(order));
        localStorage.setItem('order',JSON.stringify(order)); 
        //this.securityService.encrypt('order', JSON.stringify(order))
        //this.createLivraison();
       
        return order;
      } else {
        this.translate.get('PopupOrdercreatedError').subscribe(popup => {
          this.translate.get('ERROR').subscribe(alertType => {
            this.toastrService.error(popup,alertType);
          })
        })
      }

    }))
    // ,
    //   error => {
    //     $.notify({
    //       icon: "notifications",
    //       message: "Erreur lors de la proc??dure, veuillez reprendre SVP!"
    //     }, {
    //         type: 'danger',
    //         timer: 2000,
    //         placement: {
    //           from: 'top',
    //           align: 'center'
    //         }
    //       });
    //   });
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  changeOrderState() {
    return this.put(environment.API_ENDPOINT +
      `commande/next/${this.orderId}`,
      {}
    ).pipe(map((res) => {
      const order = <any>res;
      this.store.dispatch(this.actions.changeOrderStateSuccess(order));
    }));
  }

  /**
   *
   *
   * @param {any} params
   * @returns
   *
   * @memberof CheckoutService
   */
  addAdressesLivEtFact(params) {
    return this.post(environment.API_ENDPOINT +
      `adresse/adresses`,
      params
    ).pipe(map((res) => {
      const adresse = res;
      this.translate.get('PopupAddressAddedtoList').subscribe(popup => {
        this.translate.get('SUCCESS').subscribe(alertType => {
          this.toastrService.success(popup,alertType);
        })
      })
      // this.toastrService.success("Succ??s","L'adresse a ??t?? ajout?? ?? votre liste.")
      //this.store.dispatch(this.actions.updateOrderSuccess(adresse));
    }));
   
  }
/*
*
*
*/
ajoutAdresse(params:any){
    return this.post(environment.API_ENDPOINT +
      `adresse/adresses`,params)
  }

/**
 * @param {number} idClient
 */
getAdresseByClient(idClient){
    return this.http.get(environment.API_ENDPOINT +
      `adresse/client/${idClient}`)
      //.pipe(map((resp) => {
      //  let addresses = resp;
        //this.store.dispatch(this.actions.updateOrderSuccess(address));
      //  //console.log('les adress : ', addresses);
      //}));
  }
  

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  availablePaymentMethods() {
    return this.http.get(environment.API_ENDPOINT +
      `modepaiement`
    ).pipe(map((res) => {
      const payments = <PaymentMode[]>res;
      return payments;
    }));
  }

  availableShippingMethods() {
    return this.http.get(environment.API_ENDPOINT +
      `modelivraison/allMode`
    ).pipe(map((res) => {
      const modesLivraison = res;
      return modesLivraison;
    }));
  }

  /**
   *
   *
   * @param {number} paymentModeId
   * @param {number} orderId
   * @param {string} codePaiement
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewPayment(paymentModeId, orderId, codePaiement) {
    return this.http.post(environment.API_ENDPOINT + `paiement`, {idModePaiement: paymentModeId, idCommade: orderId,codeEtatPaiement: codePaiement/* , lignePaiements: order.lignesCommande. */});
  }

  deleteLineItemInLocalStorage(Id: number) {
    let lignesPanier: any;
    let panier = <Panier>JSON.parse(localStorage.getItem('panier'));
    let lignePanier = panier.lignesPanier.find(lp=>lp.id=Id);
    ////console.log("lignes panier ?? modifier : ", panier.lignesPanier);
    let Removed = panier.lignesPanier.splice(panier.lignesPanier.indexOf(lignePanier),1);
    panier.nbTotal = panier.nbTotal - lignePanier.quantite;
    panier.total = panier.total - lignePanier.prix;
    panier.totalTaxes = panier.totalTaxes -lignePanier.oeuvre.taxes;
    panier.totalLivraison = panier.totalLivraison - lignePanier.oeuvre.fraisLivraison;
    if(this.setPanier(panier))
    {
      this.store.dispatch(this.actions.removeLineItemSuccess(lignePanier));
      this.translate.get('PopupOeuvRemovedFCart').subscribe(popup => {
        $.notify({
          icon: "notifications",
          message: popup
        }, {
          type: 'success',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        });
      })
      return lignePanier;
    }
    /* else 
      //console.log("la suppression a ??chou??"); */
  }
  setPanier(panier)
  {
    localStorage.setItem('panier', JSON.stringify(panier));
    return true;
  }
  updateQuantity(quantity: number,total:number, lineItemId: number, increment: string) {
    let i: number;
    // return this.http.post(environment.API_ENDPOINT +
    //   `lignepanier`,
    //   {
    //     quantite:quantity,
    //     lignePanierId:lineItemId
    //   }
    // ).map(res => {
    //   //console.log('res : ' + res);
    //   const lignePanier: LignePanier = res.json();
    let panier = JSON.parse(localStorage.getItem('panier'));

    //let lignePanier: LignePanier = { id: 0, oeuvre: null, quantite: 0, prix: 0, total: 0 };
    let lignePanier = panier.lignesPanier[lineItemId-1];

    //lignePanier.id = lineItemId;
    //lignePanier.quantite = quantity;
    //lignePanier.total = total;
    //let nbTotal = 0;
    //let Total = 0;

    /*for( let i = 0; i < panier.lignesPanier.length; i++) {
      nbTotal +=  panier.lignesPanier[i].quantite;
      Total += panier.lignesPanier[i].total;
    }*/
    /*panier.nbTotal = nbTotal;
    panier.total = Total;
    panier.totalLivraison = fraisLivraison;
    panier.totalTaxes = taxes;*/
    panier.lignesPanier[lineItemId-1] = lignePanier;
    //localStorage.setItem('panier', JSON.stringify(panier));
    // if (lignePanier != null && lignePanier != undefined) {
      if(increment === 'plus'){
        lignePanier.quantite = quantity;
        lignePanier.total = total;
        panier.nbTotal = panier.nbTotal + 1;
        panier.total = panier.total + lignePanier.prix;
        panier.totalLivraison = panier.totalLivraison + lignePanier.oeuvre.fraisLivraison;
        panier.totalTaxes = panier.totalTaxes + lignePanier.oeuvre.taxes;
        localStorage.setItem('panier', JSON.stringify(panier));
        this.store.dispatch(this.actions.changeLineItemQuantityUpSuccess(lignePanier));
        this.translate.get('PopupQtyUpdated').subscribe(popup => {
          $.notify({
            icon: "notifications",
            message: popup
          }, {
            type: 'success',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        })
       
      }else {
        lignePanier.quantite = quantity;
        lignePanier.total = total;
        panier.nbTotal = panier.nbTotal - 1;
        panier.total = panier.total - lignePanier.prix;
        panier.totalLivraison = panier.totalLivraison - lignePanier.oeuvre.fraisLivraison;
        panier.totalTaxes = panier.totalTaxes - lignePanier.oeuvre.taxes;
        localStorage.setItem('panier', JSON.stringify(panier));
        this.store.dispatch(this.actions.changeLineItemQuantityDownSuccess(lignePanier));
        this.translate.get('PopupQtyUpdated').subscribe(popup => {
          $.notify({
            icon: "notifications",
            message: popup
          }, {
            type: 'success',
            timer: 2000,
            placement: {
              from: 'top',
              align: 'center'
            }
          });
        })
      }
    
    //console.log('ligne panier ', lignePanier);
    return lignePanier;
  }

  /**
   *
   *
   * @private
   * @returns
   *
   * @memberof CheckoutService
   */
  private getOrderToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    return token;
  }

  /**
   *
   *
   * @private
   * @param {any} token
   *
   * @memberof CheckoutService
   */
  private setOrderTokenInLocalStorage(token): void {
    const jsonData = JSON.stringify(token);
    localStorage.setItem('order', jsonData);
    //this.securityService.encrypt('order', jsonData)
  }
  /**
   * 
   * @param idClient 
   * 
   * 
   */
  getCommandeOfClient(idClient: number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `commande/client/${idClient}`);
  }
     /**
   * 
   * @param id 
   */
  getCommandeById(id:number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `commande/${id}`);
  }

  updateCommande(id:number,commande:Commande): Observable<any> {
    let montant = 0;
    commande.lignesCommande.forEach(lc=>{
      montant += lc.prix;
    })
    commande.total = montant;
    return this.http.put(environment.API_ENDPOINT + `commande/${id}`,commande);
  }
  getLigneCommandeById(id:number): Observable<any>{
    return this.http.get(environment.API_ENDPOINT + `lignecommande/${id}`);
  }
  updateLigneCommande(id:number,ligneCommande:LigneCommande):Observable<any>{
    return this.http.put(environment.API_ENDPOINT + `lignecommande/${id}`,ligneCommande);
  }
  postPaiement(paiement:PaiementEtLigneP) :Observable<any>{
    return this.http.post(environment.API_ENDPOINT + `paiement/`,paiement);
  }
  putPaiement(paiement:PaiementEtLigneP) :Observable<any>{
    return this.http.put(environment.API_ENDPOINT + `paiement/${paiement.id}`,paiement);
  }
  getPaiementById(id:number) :Observable<any>{
    return this.http.get(environment.API_ENDPOINT + `paiement/${id}`);
  }
  /**
   * 
   * @param id 
   */
  getLivraisonBycommande(id:number): Observable<any> {
    return this.http.get(environment.API_ENDPOINT + `livraison/${id}`);
  }
  addShippingMethode(shipping: ModeLivraison, amoutshipping: number) {
    this.store.dispatch(this.actions.addShippingMethodeSuccess(shipping, amoutshipping));
        /*$.notify({
          icon: "notifications",
          message: "Option de livrason valid?? !"
        }, {
          type: 'success',
          timer: 2000,
          placement: {
            from: 'top',
            align: 'center'
          }
        });*/

  }

  

    createLivraison(commande: Commande) {
    this.livraison.id = commande.id;
    this.livraison.codeEtatLivraison = 'NOLIVREE';
    this.livraison.idModeLivraison = commande.shippingOption.id;
    this.livraison.idAdresseLivraison = parseInt(commande.adresseLivraison.id);
    this.livraison.lignesCommande = commande.lignesCommande;
    // Ajouter au localstorage
    localStorage.setItem('livraison', JSON.stringify(this.livraison));
    //console.log('la livraison :', this.livraison);

    return this.http.post(environment.API_ENDPOINT + `livraison/commande`, this.livraison)
    }
    postLivraisonCommande(livraison){
      return this.http.post(environment.API_ENDPOINT + `livraison/commande`, livraison)

    }
    
  updateLivraison(ShippingMethod: ModeLivraison) {
    let livraison: Livraison;
    livraison = JSON.parse(localStorage.getItem('livraison'));
    //livraison.ModeLivraison = ShippingMethod;
    localStorage.setItem('livraison/', JSON.stringify(livraison));
    /*return this.post(
      `spree/api/v1/orders/${this.orderNumber}/payments?order_token=${this.getOrderToken()}`,
      {
        payment: {
          payment_method_id: paymentModeId,
          amount: paymentAmount
        }
      }
    ).pipe(map((res) => {
      this.changeOrderState()
        .subscribe();
    }));*/
  }
  getQrCodeWithAmount(total: number){
  
    return this.http.post(environment.api_orange_url+`/orange-money/qrcode`, { 
      orangeMoneyQrCodeInput:{
      code:environment.code_marchand_orange_money,
      name:environment.service_name_orange_money,
      amount:{
        value: total,
        unit: "XOF"
      }
    }})
  }
  getQrCodeWithoutAmount(api_url: string, getTotal: any){
  
    return this.http.post(api_url, {
      code:environment.code_marchand_orange_money,
      name:environment.service_name_orange_money,
    })
  }

  getMontantSeuil(): Observable<any>{
    return this.http.get(environment.API_ENDPOINT +`parametrage/SeuilLivraison`)
  }

  sendMessage(data: any){
    return this.post(`/api/notification/v1/messages/sms`, data);
  }

  getClientByID(idClient: number){
    return this.http.get(`${environment.API_ENDPOINT}/client/${idClient}`)
  }

  deleteCommandeById(idCommande: number){
    return this.delete(`${this.BASE_URL}/commande/delete/${idCommande}`)
  }

  findEtatCommandeByCode(code: string){
    return this.get(`${this.BASE_URL}/etatcommande/code/${code}`)
  }

  updateCommandeDto(commande: Commande){
    return this.http.put(environment.API_ENDPOINT + `commande/${commande.id}`,commande);
  }

  // updateCommandeByCodeEtat(commande: Commande, code:string){
  //   this.findEtatCommandeByCode(code)
  //     .subscribe(res => {
  //       let etatcommande = <EtatCommande>res;
  //       commande.idEtatCommande = etatcommande.id;
  //       this.updateCommandeDto(commande)
  //         .subscribe(() => {
  //           this.translate.get("PopupSuppressionSuccess").subscribe(suppr=>{
  //             this.translate.get("SUCCESS").subscribe(alertType=>{
  //               this.toastrService.success(suppr,alertType);
  //             })
  //           })
  //         })
  //     },
  //     error => {
  //       this.translate.get("PopupSuppressionError").subscribe(suppr=>{
  //         this.translate.get("ERROR").subscribe(alertType=>{
  //           this.toastrService.error(suppr,alertType);
  //         })
  //       })
  //     }
  //     )
  // }
}
