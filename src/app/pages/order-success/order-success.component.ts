import { PanierEtMarquageService } from './../../shared/services/panierEtMarquage.service';
import { Panier } from './../../shared/modeles/panier';
import { LignePaiement } from './../../shared/modeles/lignePaiement';
import { PaiementEtLigneP } from './../../shared/modeles/paiementEtLignesP';
import { CheckoutService } from 'src/app/shared/services/checkout.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Commande } from '../../shared/modeles/commande';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentMode } from 'src/app/shared/modeles/payment_mode';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LignePanier } from 'src/app/shared/modeles/ligne_panier';
import { Client } from 'src/app/shared/modeles/client';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {
  order: Commande;
  token: string;
  httpOptions: { headers: HttpHeaders; };
  private host : String='https://app.paydunya.com';
  StatusResponse:string;
  paymentmode: PaymentMode ={id:null, code:'', libelle:''};

  constructor(private route:ActivatedRoute,private http: HttpClient,private checkoutService:CheckoutService,private ngxService: NgxUiLoaderService,
    private panierEtMarquateService: PanierEtMarquageService) { 
    this.order =<Commande>JSON.parse(localStorage.getItem('order'));
    console.log(this.order);
    this.token = this.route.snapshot.paramMap.get('token');
    console.log(this.token);
    console.log(window.location.href);
    let splitted = window.location.href.split("?token=", 3);
    this.token=splitted[1];
    console.log(this.token);
    this.checkPaiementStatus();
  }

  ngOnInit(): void {
  }
  checkPaiementStatus(){  
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY':'uAegjohM-djoH-sVyS-icoI-BxeBH4NYsbzX',
        'PAYDUNYA-PRIVATE-KEY':'test_private_qwYm7y1sP2A1l4L2zZ7yhmbwQTr',
        'PAYDUNYA-TOKEN':'U2r9MJIwslXnaff8ZpfH',
      })
    }; 
    this.paymentmode.id=8;
    this.paymentmode.code = 'PAYDUNYA';
    this.paymentmode.libelle='Paydunya';
    this.order.modePaiement=this.paymentmode;
    localStorage.setItem('order', JSON.stringify(this.order));
    return this.http.get(this.host+`/sandbox-api/v1/checkout-invoice/confirm/`+this.token,this.httpOptions).subscribe(resp => {
      console.log(resp);
      let response = <any> resp; 
      this.StatusResponse =  response.status;
      console.log(this.StatusResponse);
      if(this.StatusResponse=="completed")
      { 
        this.updateDB();
      }
      else if(this.StatusResponse=="cancelled")
      {
        this.updateCommande("ANNULEE","Annulée");
        this.ngxService.stopLoader("loader-01");
      }
    });
  }
  updateDB(){
    this.updateLigneCommande();
    this.updateCommande("PAYMENT","Détails paiement");
    this.postPaiement();
  }
  updateLigneCommande(){
    this.order.lignesCommande.forEach(elet => {
      this.ngxService.startLoader("loader-01");
      this.checkoutService.getLigneCommandeById(elet.id).subscribe(resp => {
        resp.etatLigneCommande="PAYEETNONLIVREE";
        console.log(resp);
        this.checkoutService.updateLigneCommande(elet.id,resp).subscribe(response => {
          console.log(response)
        });
      });
    });
    
    return this.http.put(this.host+`/sandbox-api/v1/checkout-invoice/confirm/`+this.token,this.httpOptions);
  }
  updateCommande(code, libelle){
    this.ngxService.startLoader("loader-01");
    this.checkoutService.getCommandeById(this.order.id).subscribe(resp => {
      resp.state = code;
      resp.libelleEtatCommande=libelle;
      console.log(resp);
      this.checkoutService.updateCommande(this.order.id,resp).subscribe(response => {
        console.log(response);
      });
    });
  }
  postPaiement(){
    this.ngxService.startLoader("loader-01");
    this.checkoutService.getPaiementById(this.order.id).subscribe(response => {
      console.log(response);
      let respPaiement = <PaiementEtLigneP> response;
      if(respPaiement!=null)
      {
        respPaiement.codeEtatPaiement="PAYE";
        respPaiement.datePaiement=new Date();
        this.order.lignesCommande.forEach(elet => {
          let lignePaiement = new LignePaiement();
          //lignePaiement.id = 
          lignePaiement.codeModePaiement=this.order.modePaiement.code;
          lignePaiement.datePaiement=new Date();
          lignePaiement.montant = elet.prix*elet.quantite;
          lignePaiement.idPaiement= respPaiement.id;
          respPaiement.lignePaiements.push(lignePaiement);      
        });
        console.log(respPaiement);
        this.checkoutService.putPaiement(respPaiement).subscribe(resp => {
          console.log(resp);
          this.cleanPanierAndLocalStorage();
        });
      }
      else{
        let paiement= new PaiementEtLigneP();
        paiement.lignePaiements = [];
        paiement.codeEtatPaiement="PAYE";
        paiement.codeModePaiement=this.order.modePaiement.code;
        paiement.datePaiement=new Date();
        paiement.idCommande=this.order.id;
        paiement.id = this.order.id;
        //paiement.id=this.order.id;
        this.order.lignesCommande.forEach(elet => {
          let lignePaiement = new LignePaiement();
          //lignePaiement.id = 
          lignePaiement.codeModePaiement=this.order.modePaiement.code;
          lignePaiement.datePaiement=new Date();
          lignePaiement.montant = elet.prix*elet.quantite;
          lignePaiement.idPaiement= paiement.id;
          paiement.lignePaiements.push(lignePaiement);      
        });
        console.log(paiement);
          this.checkoutService.postPaiement(paiement).subscribe(resp => {
            console.log(resp);
            this.cleanPanierAndLocalStorage();
          });
      }
    });;
    
  }
  cleanPanierAndLocalStorage(){
    //let panier = <Panier>JSON.parse(localStorage.getItem('panier'));
    let client = <Client>JSON.parse(localStorage.getItem('client'));
    this.panierEtMarquateService.getLineItemsByClient(client.id).subscribe(resp=>{
      let lignePaniers = <LignePanier[]> resp;
      console.log(lignePaniers);
      lignePaniers.forEach(elet => {
      this.panierEtMarquateService.deleteLineItem(elet).subscribe(resp=> console.log(resp));
    });
      this.ngxService.stopLoader("loader-01");
    })
    localStorage.removeItem('order'); 
    localStorage.removeItem('panier');
    localStorage.removeItem('livraison');
    localStorage.setItem("cartItems", JSON.stringify([]));
    this.ngxService.stopLoader("loader-01");
    
  }
/*   postLignePaiement(){
    return this.http.post(this.host+`/sandbox-api/v1/checkout-invoice/confirm/`+this.token,this.httpOptions);
  } */
}
