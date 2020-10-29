import { getLineItems } from '../../../reducers/selectors';
import { CheckoutActions } from '../../../actions/checkout.actions';
import { AppState } from '../../../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { LignePanier } from '../../../../shared/modeles/ligne_panier';
import { CheckoutState } from '../../../reducers/checkout.state';
import { CheckoutService } from 'app/shared/services/checkout.service';
import { AuthServiceS } from 'app/shared/services/auth.service';
import { Panier } from 'app/shared/modeles/panier';
import { Oeuvre } from 'app/shared/modeles/oeuvre';

@Component({
  selector: 'app-line-item-list',
  templateUrl: './line-item-list.component.html',
  styleUrls: ['./line-item-list.component.scss']
})
export class LineItemListComponent implements OnInit {

  lignePaniers$: Observable<any>;
  // panier: Panier;
  //lignesPanier: LignePanier[];

  // @Input() lignePaniers: LignePanier[];
  // check: number = 0;
  // checkoutState: CheckoutState;

  constructor(private store: Store<AppState>, private actions: CheckoutActions,
    private checkoutService: CheckoutService, private authService: AuthServiceS) {
    //this.store.dispatch(this.actions.getAllLineItems());
    this.lignePaniers$ = this.store.select(getLineItems) as unknown as Observable<LignePanier[]>;
    /*this.lignePaniers$.subscribe(resp => {
      resp.forEach(element => {
        console.log(this.lzs.decompress(localStorage.getItem('panier')));
        if (JSON.parse(this.lzs.decompress(localStorage.getItem('panier')))) {
          console.log("updating panier in local storage");
          localStorage.setItem('panier', this.lzs.compress(JSON.stringify(this.updateCart(element.oeuvre))));
        } else {
          console.log("creating panier in local storage");
          localStorage.setItem('panier', this.lzs.compress(JSON.stringify(this.createCart(element.oeuvre))));
        }
      });
    })*/
    

  }

  ngOnInit() {
    /*if (this.authService.getUserConnected() == null) {
      console.log('user non connecté');
      this.store.dispatch(this.actions.getAllLineItemsLocal());
      this.lignePaniers$ = this.store.select(getLineItems) as Observable<any>;
      
    } else {
      console.log('user connecté')
      this.store.dispatch(this.actions.getAllLineItems());
      this.lignePaniers$ = this.store.select(getLineItems) as Observable<any>;
      //this.panier=JSON.parse(localStorage.getItem('panier'));
      //this.lignesPanier= this.panier.lignesPanier;

    }*/


  }
  private createCart(oeuvre: Oeuvre) {
    let lignesPanier: LignePanier[] = [];

    let panier: Panier = {};

    //création ligne panier
    let lignePanier: LignePanier = { id: null, oeuvre: null, prix: null, quantite: null, total: null ,lithographie: false };

    lignePanier.id = 1;
    lignePanier.oeuvre = oeuvre;
    lignePanier.prix = oeuvre.prix;
    lignePanier.quantite = 1;
    lignePanier.total = oeuvre.prix;
    lignesPanier.push(lignePanier);

    //création du panier
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

  private updateCart(oeuvre: Oeuvre) {

    let panierStockee = JSON.parse(localStorage.getItem('panier'));
    let nb = panierStockee.lignesPanier.length;
    panierStockee.lignesPanier.forEach(element => { 
      if(element.oeuvre === oeuvre)
        return panierStockee;
    });

    //création d'une nouvelle ligne panier
    let lignePanier: LignePanier = { id: null, oeuvre: null, prix: null, quantite: null, total: null, lithographie: false };

    lignePanier.id = (nb + 1);
    lignePanier.oeuvre = oeuvre;
    lignePanier.prix = oeuvre.prix;
    lignePanier.quantite = 1;
    lignePanier.total = oeuvre.prix;
    panierStockee.lignesPanier.push(lignePanier);

    //Mise à jour du panier
    panierStockee.total = (panierStockee.total + lignePanier.total);
    panierStockee.nbTotal = (panierStockee.nbTotal + lignePanier.quantite);
    panierStockee.totalLivraison = (panierStockee.totalLivraison + oeuvre.fraisLivraison);
    panierStockee.totalTaxes = (panierStockee.totalTaxes + oeuvre.taxes);

    return panierStockee;
  }

}
