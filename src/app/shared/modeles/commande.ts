import { Oeuvre } from "./oeuvre";
import { Address } from "./address";
import { LigneCommande } from './ligneCommande';
import { ModeLivraison } from './mode_livraison';
import { PaymentMode } from "./payment_mode";

export class Commande {
  [x: string]: any;
   public id: number;
   public numero: string;
   public nbTotal: number;
   public total: number;
   public totalLivraison: number;
   public totalTaxes: number;
   public lignesCommande: LigneCommande[];
   public state: string;
   public codeDevise: string;
   public dateCreation: Date;
   public idClient?: number;
   public  idDevise?: number;
   public idEtatCommande?: number;
   public risque?:boolean;
   public adresseLivraison?:Address;
   public adresseFacturation?:Address;
   public shippingOption?: ModeLivraison;
   public shippingOptionPrice?: number;
   public modePaiement?:PaymentMode;
   public idMagasin?:number;
   public idServiceLivraison?:number;
   public idTarification?:number;
}