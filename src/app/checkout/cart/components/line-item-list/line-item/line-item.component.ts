import { CheckoutActions } from '../../../../actions/checkout.actions';
import { AppState } from '../../../../../interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { CheckoutService } from '../../../../../shared/services/checkout.service';
import { LignePanier } from '../../../../../shared/modeles/ligne_panier';
import { FavoriteActions } from '../../../../../wishlist/actions/favorite.actions';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
  providers: [FavoriteActions]
})
export class LineItemComponent implements OnInit {

  image: string;
  prixUnitaire: number;
  name: string;
  quantity: number;
  exemplaireBool: boolean;
  amount: number;
  artiste: string;
  dimensions: string;
  id:number;
  wishlistLibelle: string = 'Ajouter à mes favoris';
  maClass: string = 'move-item';
  newamount:number;
  taxes: number;
  fraisLivraison: number;
  tauxRemise: number;
  lithographie: boolean;
  @Input() lignePanier: LignePanier;

  constructor(
    private store: Store<AppState>, 
    private checkoutService: CheckoutService, 
    private favoriteActions: FavoriteActions,
    private translate: TranslateService,
    ) { }

  ngOnInit() {
    this.image = environment.API_ENDPOINT + 'image/oeuvre/' + this.lignePanier.oeuvre.id;
    this.name = this.lignePanier.oeuvre.nom;
    this.prixUnitaire = this.lignePanier.prix;
    this.quantity = this.lignePanier.quantite;
    this.amount = this.lignePanier.total;
    this.artiste = this.lignePanier.oeuvre.artiste;
    this.dimensions = this.lignePanier.oeuvre.dimensions;
    this.id = this.lignePanier.oeuvre.id;
    this.isMobileMenu();
    this.lithographie= this.lignePanier.lithographie;
    /*if(this.lithographie==true)
    {
      this.exemplaireBool=true;
    }*/
  }

  // Change this method once angular releases RC4
  // Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869
  removeLineItem() {
    //console.log('oeuvre à supprimer', this.lignePanier);
    // this.store.dispatch(this.actions.removeLineItem(this.lineItem.id));
    this.translate.get('PopupAvertissement').subscribe(popupAv => {
      this.translate.get('PopupIrreversible').subscribe(irreversible => {
        this.translate.get('PopupCancelBtn').subscribe(cancel => {
          this.translate.get('PopupConfirmBtn').subscribe(confirm => {
            Swal.fire({
              title: popupAv,
              text: irreversible,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: ' #376809',
              cancelButtonColor: 'red',
              cancelButtonText: cancel,
              confirmButtonText: confirm,
            }).then((result) => {
              if (result.value) {
                this.checkoutService.deleteLineItemInLocalStorage(this.lignePanier.id);
              }
            })
          })
        })
      })
    })
    // Swal.fire({
    //   title: 'Êtes-vous sûr?',
    //   text: "Ceci sera irreversible!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#376809',
    //   cancelButtonColor: 'red',
    //   cancelButtonText: 'Annuler',
    //   confirmButtonText: 'Oui, je supprime!',
    //   reverseButtons: true,
    // }).then((result) => {
    //   if (result.value) {
    //     this.checkoutService.deleteLineItemInLocalStorage(this.lignePanier.id);
    //     /*Swal.fire(
    //       'Supprimé!',
    //       'Cette oeuvre est supprimée.',
    //       'success'
    //     )*/
    //   }
    // })
  }

  addToWishlist(id:number){
    this.store.dispatch(this.favoriteActions.addToWishlist(id));
    this.wishlistLibelle = 'Déjà ajouté';
    this.maClass = 'add-item';
  }

  setQuantite(increment:string, lignePanier: LignePanier){
    let panier = JSON.parse(localStorage.getItem('panier'));
    //console.log('lignePanier : '+lignePanier);
    let val: boolean;
    
    if(increment === 'plus') {
      this.quantity = this.quantity + 1;
      this.amount = this.prixUnitaire * this.quantity;
      this.checkoutService.updateQuantity(this.quantity, this.amount, lignePanier.id, increment);
      // this.store.dispatch(this.checkoutActions.changeLineItemQuantity(this.quantity, this.lignePanier.id));
    } else {
      this.quantity = this.quantity - 1;
      this.amount = this.prixUnitaire * this.quantity;
      this.checkoutService.updateQuantity(this.quantity, this.amount, lignePanier.id, increment);
      // this.store.dispatch(this.checkoutActions.changeLineItemQuantity(this.quantity, this.lignePanier.id));
    }
  }
/*setAmount(increment:string, lignePanier: LignePanier){
    if(this.setQuantite(increment, lignePanier)===true) {
      this.amount = this.checkoutService.updateQuantity(this.quantity, lignePanier.id, this.amount).prix;
      return this.newamount;

  }
}*/
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
  }

}
