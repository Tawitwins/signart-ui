import { AppState } from '../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartValue, getTotalCartItems, getAmontShipping, getShippingOption } from '../../reducers/selectors';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { ModeLivraison } from '../../../shared/modeles/mode_livraison';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {

  @Input() orderNumber;
  order;
  i: number;
  checked: any;
  selectedShippingRate;
  shippingRates = [];
  shippingMethods: ModeLivraison[] = [];
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  ShippingOpt: ModeLivraison;
  ShippingOption$:Observable<ModeLivraison>;
  amontShipping$: Observable<number>;
  maClass: string = 'btn btn-danger btn-round btn-just-ico btn-sm'; //'btn btn-default waves-effect';
  contentEditable: boolean = false;

//==============================
  resultText=[];
  values:string;  
 count:number=0;  
 errorMsg:string;  
//===============================
  @ViewChild('bouton', { read:true, static:true} ) el:ElementRef;

  constructor(
    private checkoutService: CheckoutService, 
    private store: Store<AppState>,
    private translate: TranslateService,
    private toastrService: ToastrService,
    ) {

    this.totalCartValue$ = this.store.select(getTotalCartValue);
    this.totalCartItems$ = this.store.select(getTotalCartItems);
    this.ShippingOption$ = this.store.select(getShippingOption);
    
  }

  ngOnInit() {
    // this.setOrder();
    this.checkoutService.availableShippingMethods()
      .subscribe((shippingMethods) => {
        this.shippingMethods = <ModeLivraison[]> shippingMethods;
      });
      this.store.select(getShippingOption).subscribe(
        res => {
          this.ShippingOpt = res;
          console.log('Shipping option :', this.ShippingOpt)
        }
      );
      
  }

  setAmontShipping() {
    this.amontShipping$ = this.store.select(getAmontShipping);
  }
  private setOrder() {
    this.checkoutService.getOrder(this.orderNumber)
      .subscribe((order) => {
        this.order = order;
        this.setShippingRates();
      });
  }

  /*private checkedShippingMode(){
    var element: HTMLInputElement;
    if (element.type.toLowerCase() == "checkbox") {
      element.checked = true;
      }
      else{
        element.checked = false;
      }
    for (let i=0; i< this.shippingMethods.length; i++) {
        if (this.shippingMethods[i].checked) {
          // cochée
          alert(i + 'coche');
        }
       else{
          // pas cochée
        }
    }
  }*/

  toggleEditable(event, val) {
    if ( event.target.checked ) {
        this.contentEditable = val;
   }
   console.log('La reponse : ',this.contentEditable);
}
    onCheck(event, val) {
      let montant: number;
      let optlivraison:ModeLivraison;
      if ( event.target.checked ) {
        this.contentEditable = val;
        for(let i = 0; i < this.shippingMethods.length; i++){
          if(i == val) {
            let optlivraison = this.shippingMethods[i];
            console.log('Mode livraison : ', optlivraison);
            this.translate.get('PopupAvertissement').subscribe(popupAv => {
              this.translate.get('PopupOptlivraison',{optlivraisonLibelle: optlivraison.libelle}).subscribe(popupOptlivraison => {
                this.translate.get('PopupCancelBtn').subscribe(cancel => {
                  this.translate.get('PopupConfirmBtn').subscribe(confirm => {
                    Swal.fire({
                      title: popupAv,
                      text: popupOptlivraison,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: ' #376809',
                      cancelButtonColor: 'red',
                      cancelButtonText: cancel,
                      confirmButtonText: confirm,
                    }).then((result) => {
                      if (result.value) {
                        if(optlivraison.code == 'DOM') {
                          this.store.select(getAmontShipping).subscribe(
                            (resp) => {
                              montant = resp;
                            }
                          );
                          console.log('Frais Livrasons :', montant);
                        }else{
                          montant = 0;
                          console.log('Frais Livrasons :', montant);
                        }
                        this.checkoutService.addShippingMethode(optlivraison, montant);
                        this.translate.get("PopupOptionLivraisonPriseC", {montant: montant}).subscribe(optLv=>{
                          this.translate.get("SUCCESS").subscribe(alertType=>{
                            this.toastrService.success(optLv,alertType);
                          })
                        })
                        // Swal.fire(
                        //   'Option de livraison prise en compte!',
                        //   'Frais de Livraison : '+ montant + ' FCFA',
                        //   'success'
                        // )
                      }
                    })
                  })
                })
              })
            })
            // Swal.fire({
            //   title: 'Êtes-vous sûr?',
            //   text: "Vous avez choisi: " + optlivraison.libelle,
            //   icon: 'warning',
            //   showCancelButton: true,
            //   confirmButtonColor: '#376809',
            //   cancelButtonColor: 'red',
            //   confirmButtonText: 'Confirmer',
            //   cancelButtonText: 'Annuler',
            //   reverseButtons: true,
            // }).then((result) => {
            //   if (result.value) {
            //     if(optlivraison.code == 'DOM') {
            //       this.store.select(getAmontShipping).subscribe(
            //         (resp) => {
            //           montant = resp;
            //         }
            //       );
            //       console.log('Frais Livrasons :', montant);
            //     }else{
            //       montant = 0;
            //       console.log('Frais Livrasons :', montant);
            //     }
            //     this.checkoutService.addShippingMethode(optlivraison, montant);
            //     Swal.fire(
            //       'Option de livraison prise en compte!',
            //       'Frais de Livraison : '+ montant + ' FCFA',
            //       'success'
            //     )
            //   }
            // })
            break;
          }
        }
   }



      
      //var option = document.getElementsByName('Livraison');
     /* if (option. == true){
        text.style.display = "block";
      } else {
        text.style.display = "none";
      }*/
      // console.log(form.value);
        //const option = form.value['Livraison'];
        //console.log('La reponse : ', option);
        /*for(let i = 0; i < this.shippingMethods.length; i++){
          if(i == option-1) {
            
            //this.setAmontShipping();
            
            if(optlivraison.code == 'DOM') {
              this.store.select(getAmontShipping).subscribe(
                (resp) => {
                   montant = resp;
                }
              );
              console.log('Frais Livrasons :', montant);
            }else{
              montant = 0;
              console.log('Frais Livrasons :', montant);
            }
            break;
          }
        }*/
        //
    }

  private setShippingRates() {
    this.shippingRates = this.order.shipments[0].shipping_rates;
    this.selectedShippingRate = this.order.shipments[0].selected_shipping_rate;
  }

  close(modal: string) {
    $(modal).modal('toggle');
  }
}
