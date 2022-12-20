import { getLineItems } from '../../../reducers/selectors';
import { CheckoutActions } from '../../../actions/checkout.actions';
import { AppState } from '../../../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { LignePanier } from '../../../../shared/modeles/ligne_panier';
import { CheckoutState } from '../../../reducers/checkout.state';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { AuthServiceS } from 'src/app/shared/services/auth.service';
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { Panier } from 'src/app/shared/modeles/panier';


@Component({
  selector: 'app-line-item-list',
  templateUrl: './line-item-list.component.html',
  styleUrls: ['./line-item-list.component.scss']
})
export class LineItemListComponent implements OnInit {

  lignePaniers$: Observable<any>;

  constructor(private store: Store<AppState>, private actions: CheckoutActions,
    private checkoutService: CheckoutService, private authService: AuthServiceS) {
    this.lignePaniers$ = this.store.select(getLineItems) as unknown as Observable<LignePanier[]>;
   
  }

  ngOnInit() {

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
