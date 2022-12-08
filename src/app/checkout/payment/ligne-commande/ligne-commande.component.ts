import { Component, OnInit, Input } from '@angular/core';
import { LigneCommande } from 'app/shared/modeles/ligneCommande';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ligne-commande',
  templateUrl: './ligne-commande.component.html',
  styleUrls: ['./ligne-commande.component.scss']
})

export class LigneCommandeComponent implements OnInit {

image: string;
@Input() lignecommande: LigneCommande;

  constructor() {}

  ngOnInit() {
    //console.log('ligne commande : ', this.lignecommande);
    this.image = environment.API_ENDPOINT + 'image/oeuvre/' + this.lignecommande.oeuvre.id;
  }

}
