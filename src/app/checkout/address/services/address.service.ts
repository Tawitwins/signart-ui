import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class AddressService {
  constructor(private fb: FormBuilder) {}

  initAddressForm() {
    return this.fb.group({
      'prenom': ['',Validators.required],
      'nom': ['',Validators.required],
      'adresse': ['', Validators.required],
      'ville': ['', Validators.required],
      'region': ['', Validators.required],
      'telephone': ['', Validators.required],
      'indicatif': ['+221', Validators.required],
      'idPays': ['', Validators.required],
      'codeTypeAdresse': ['']
    });
  }

  initEmailForm() {
    return this.fb.group({
      'email': ['', Validators.required]
    });
  }

  createAddresAttributes(address) {
    let adressFact:any = {id: null, prenom:'', nom:'', adresse: '', ville:'', region:'', telephone:'', indicatif:'', idPays:0, codeTypeAdresse:'', idClient:null};
    let adressLivr:any = {id: null, prenom:'', nom:'', adresse: '', ville:'', region:'', telephone:'', indicatif:'', idPays:0, codeTypeAdresse:'', idClient:null}; 
    let order = {
      adresseFacturation:{},
      adresseLivraison: {}
    };
    //Création de l'adresse de facturation
    adressFact.prenom = address.prenom;    
    adressFact.nom = address.nom;    
    adressFact.adresse = address.adresse;    
    adressFact.ville = address.ville;    
    adressFact.region = address.region;    
    adressFact.telephone = address.telephone;    
    adressFact.indicatif = address.indicatif;    
    adressFact.idPays = address.idPays;    
    adressFact.codeTypeAdresse = 'FACTURATION';
    adressFact.idClient = address.idClient;
    order.adresseFacturation = adressFact;

    //Création de l'adresse de livraison
    adressLivr.prenom = address.prenom;    
    adressLivr.nom = address.nom;    
    adressLivr.adresse = address.adresse;    
    adressLivr.ville = address.ville;    
    adressLivr.region = address.region;    
    adressLivr.telephone = address.telephone;    
    adressLivr.indicatif = address.indicatif;    
    adressLivr.idPays = address.idPays;    
    adressLivr.codeTypeAdresse = 'LIVRAISON';
    adressLivr.idClient = address.idClient;
    order.adresseLivraison = adressLivr;
   
    return order;
  }

  createGuestAddressAttributes(address, email) {
    let adressFact:any = {}, adressLivr:any = {};
    adressLivr = address; adressFact = address;

    adressFact.codeTypeAdresse = 'FACTURATION';
    adressLivr.codeTypeAdresse = 'LIVRAISON';

    return {
      'order': {
        'email': email,
        'adresseFacturation': adressFact,
        'adresseLivraison': adressLivr
      }
    };
  }

}
