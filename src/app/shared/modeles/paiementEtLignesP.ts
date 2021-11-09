import { LignePaiement } from "./lignePaiement";

export class PaiementEtLigneP {
  name?: string;
  id?:number;
  idCommande?:number;
  idModePaiement?:number;
  idEtatPaiement?:number;
  montant?:number;
  codeModePaiement?: string;
  codeEtatPaiement?: string;
  libelleModePaiement?: string;
  libelleEtatPaiement?: string;
  datePaiement?: Date;
  dateCreation?: Date;
  dateModification?: Date;
  lignePaiements?:LignePaiement[];
  constructor(){
  }
}
