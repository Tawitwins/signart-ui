import { PaiementEtLigneP } from './../../../shared/modeles/paiementEtLignesP';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { AppState } from '../../../interfaces';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { Artiste } from '../../../shared/modeles/artiste';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { Client } from '../../../shared/modeles/client';
import { OeuvreService } from '../../../shared/services/oeuvre.service';

// import { CheckoutService } from 'src/app/shared/services/checkout.service';
import Swal from 'sweetalert2';
import { MustMatchValidators } from './must-Match';
import { User, AccountInfo } from '../../../shared/modeles/user';
import { Commande } from '../../../shared/modeles/commande';
import { Abonnement, Abonne, EtatAbonnement, Terminal, HistoriqueAbonnement, DelaieAbonnement, ListeSelection_Oeuvres, TerminalDelai } from '../../../shared/modeles/utilisateur';
import { ImageService } from '../../../shared/services/image.service';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../../../shared/services/product.service';

import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { OeuvreNumerique } from '../../../shared/modeles/imageNumerique';
import { Product } from '../../../shared/classes/product';
import { LigneCommande } from '../../../shared/modeles/ligneCommande';
import { Livraison } from '../../../shared/modeles/livraison';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { Address } from '../../../shared/modeles/address';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User;
  token: string;
  @Input() tk: any;
  form: FormGroup;
 // idClient=localStzorage.getItem('id');
 idUser: number;
 commandes: Commande[];
 adresses: any[];
 public artistes: any[];
 oeuvres: any = [];
 oeuvresImg: any;
 client: any;
 artiste: Artiste | any;
 idCustomer: number;
 // --pagination
 pageSize = 4;
 page = 1;
 pg = 1;
 size: number;
 myGroup: FormGroup;
 public abonnements: Abonnement[];
 public abonnementAffiche: Abonnement;
 public allAbonnement: Abonnement[];
 abonnementget: Abonnement;
 abonne: Abonne;
 etatAbonnements: EtatAbonnement[];
 terminals: Terminal[];
 abonnementExiste: boolean;
 allAbonne: Abonne[];
 historiqueExiste: boolean;
 historiques: HistoriqueAbonnement[];
 returnUrl: string;
 mdpForm: FormGroup;
 etats: EtatAbonnement[];
 reabonnement: Abonnement;
 terminalId: number;
 chooseTerminal: Terminal;
 terminalDelai: TerminalDelai;
 delais: DelaieAbonnement[];
 chooseDelais: DelaieAbonnement;
 delaiId : number;
 option_TSIGNART: boolean = false;
 option_TBOX: boolean = false;
 option_JDT: boolean = false;
 option_LOUE: boolean = false;
 shownTerminal: boolean = false;
 terminalResponse: boolean = false;
 public oeuvreNumeriqueAfficher: OeuvreNumerique;
 public abonneAffich: Abonne;

  public openDashboard = false;
  public infopage: number;
  public listeArtiste: number;
  public listAdress = true;
  oeuvresFav: Product[];

  delaiAffiche: DelaieAbonnement;
  oeuvresAffiche: OeuvreNumerique[];
  listeOeuvreAffiche: ListeSelection_Oeuvres[];
  affichediv: number;
  traitementForm: FormGroup;
  traitementAbonnement: number;
  isValid: number;
  public activePaiement: boolean;
  abonneAffiche: Abonne;
  terminalAffiche: Terminal;
  public montantOeuvres: number;

  actionsSubscription: Subscription;
  ligneCommande: LigneCommande[];
  commande: Commande;
  idLigneCMD: number;
  adressLivraison: Address;
  livraison: Livraison;
  image: string;
  images: any[];
  Sum: number;

  pageSizeAdress = 4;
  pagAdress = 0;

  pageSizeComand = 4;
  pagComand = 0;

  pageSizeOF = 4;
  pagOF = 0;

  pageSizeAbmt = 4;
  pagAbmt = 0;
  paiement: PaiementEtLigneP;


  terminalDelaiForm = new FormGroup({
    terminalId: new FormControl(null,Validators.required),
    delaiId: new FormControl(null,Validators.required),
    precisions: new FormControl(''),
  });

  constructor(private authService: AuthServiceS, private toastrService: ToastrService, public productService: ProductService,  private store: Store<AppState>, private router: Router,
              private authS: AuthServiceS,
              private oeuvreS: OeuvreService, private fb: FormBuilder,
              private artisteService: ArtisteService,
              private imageService: ImageService,
              public jwtHelper: JwtHelperService, private ngxService: NgxUiLoaderService,
              private route: ActivatedRoute, public domSanitizer: DomSanitizer, private checkoutService: CheckoutService) {
    this.infopage = 0;
    this.initmdpForm();
    this.listeArtiste = 0;
    this.abonnementExiste = false;
    this.historiqueExiste = false;
    this.abonnements = [];
    this.activePaiement = false;
    this.historiques = [];
    this.terminalAffiche = new Terminal('', '', null);
    this.terminalDelai = new TerminalDelai('','',null,null,'');
    this.chooseTerminal = new Terminal('', '', null);
    this.delaiAffiche = new DelaieAbonnement('', '', null, null);
    this.abonnementget = new Abonnement(null, null, null, null, null, '', null);
    this.abonne = new Abonne(null, null, '', '', '', '', '', '', '', '');
    this.abonneAffiche = new Abonne(null, null, '', '', '', '', '', '', '', '');
    this.allAbonne = [];
    this.allAbonnement = [];
    this.oeuvresAffiche = [];
    this.montantOeuvres = 0;
    this.commande = new Commande(); // pour éviter les erreurs undefined sur le HTML
    this.livraison = new Livraison(); // pour éviter les erreurs undefined sur le HTML
    this.ligneCommande = []; // pour éviter les erreurs undefined sur le HTML
    this.paiement = new PaiementEtLigneP(); // pour éviter les erreurs undefined sur le HTML
    this.adressLivraison = new Address('', '', '', '', '', '', '', '', '', '');
    this.user = this.authS.getUserConnected();
    this.productService.wishlistItems.subscribe(resp => this.oeuvresFav = resp);
    console.log(this.oeuvresFav);


    this.imageService.getAllEtat().subscribe(
      response => {
        this.etats = response;
        console.log('etats', this.etats);

      });

    if (this.user.userType == 'ARTISTE'){
    this.artisteService.getArtisteByUser(this.user.id).subscribe(
      res => {
        this.artiste = res;
        console.log('Artiste connected ', res);
        this.oeuvreS.getOeuvreByArtiste(parseInt(res.id)).subscribe(
          resp => {
            this.oeuvres = resp;
            console.log('ouevres de l\'auteur', resp);
          }
        );

      }
    );
    console.log('User connected ', this.user);
  }else{
    this.infoClient();
    this.imageService.getAllEtat().subscribe( res => {
      this.etatAbonnements = res;
    });
    this.imageService.getAllTerminal().subscribe( res => {
      this.terminals = res;
    });

    this.imageService.getAllDelai().subscribe(response => {
      this.delais = response;
    });

    this.imageService.getAllHistoriqueAbonnement(this.user.id).subscribe(
      res => {
        this.historiques = res;
        if (this.historiques.length > 0){
          console.log('historiques', this.historiques);
          for (let i = 0; i < this.historiques.length; i++) {
            this.historiques[i].dateDebut = this.myDateParser(this.historiques[i].dateDebut);
            this.historiques[i].dateFin = this.myDateParser(this.historiques[i].dateFin);

          }
          this.historiqueExiste = true;
        }else{
          this.historiqueExiste = false;
        }
      });

    this.imageService.getAllAbonne(this.user.id).subscribe(
      res => {
        this.allAbonne = res;
        console.log('allAbonne', this.allAbonne);
        if (this.allAbonne.length > 0){
          for (let i = 0; i < this.allAbonne.length; i++) {
            this.imageService.getAbonnement(this.allAbonne[i].id).subscribe(
              resp => {
                this.abonnementget = resp;
                console.log('abonnementget', this.abonnementget);
                this.allAbonnement.push(this.abonnementget);
                 // console.log("abonnements",this.abonnements)
              });
          }
          this.abonnementExiste = true;
          console.log('abonnements', this.allAbonnement);
          this.allAbonnement.reverse();
          this.abonnements = this.allAbonnement;
          this.abonnements.reverse();
        }else{
          this.abonnementExiste = false;
        }
      });


    /*this.imageService.getAbonne(parseInt(this.user.id)).subscribe(
      res => {
        this.abonne = res;
        console.log("abonne",this.abonne)
        this.imageService.getAbonnement(this.abonne.id).subscribe(
          resp => {
            this.abonnements = resp;
            if(this.abonnements.length > 0){
              this.abonnementExiste = false;
              console.log("abonnements",this.abonnements)
              this.abonnements=this.abonnements.reverse();
            }else{
              this.abonnementExiste = true;
            }

          });
      });*/
    this.client = [];
    this.commandes = [];
    this.artiste = [];
    this.onGetArtisteSuiviByClient();
    }
  }

  initmdpForm(){
    this.mdpForm = new FormGroup({
      mdpActu: new FormControl('', Validators.required),
      mdpNouv: new FormControl('',
        [Validators.required,
       // Validators.pattern('*[a-z]*[A-Z]*'),
        Validators.minLength(8)]
      ),
      mdpConf: new FormControl('', Validators.required)
    }, MustMatchValidators.checkPasswords);
  }


   showHideListe(val: number){
        this.listeArtiste = val;
  }
  showHideListAdress(bool)
  {
    this.listAdress = bool;
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout() {

    this.authService.signOut();
    this.removeList();
    // this.redirectIfUserLoggedOut();
    location.replace('home/signart');
    // location.reload();

 }

 public removeList() {
  this.productService.removeList();
}
 redirectIfUserLoggedOut(){
  this.store.select(getAuthStatus).subscribe(
    data => {
      if (data === false) {
      // this.router.navigate(['home']);
      this.router.navigate(['home/signart']);
      // this.router.navigate([this.returnUrl]);
     }
    }
  );
 }

 editInfo(){
  this.infopage = 1;
 }

 onChangePwd(){

  const passwordForm = this.mdpForm.value;
  console.log('passworForm', passwordForm);
  const userDetails = new AccountInfo('', '');
  userDetails.userName = this.user.email;
  userDetails.password = passwordForm.mdpActu;
  this.authS.testPassword(userDetails).subscribe(
    resp => {
      const testUser = resp;
      console.log('test1', testUser);
      if (testUser === null){
        Swal.fire({
          title: 'votre ancien mot de passe est incorrect!',
          icon: 'error',
          cancelButtonColor: '#d33',
        });
      }
      else{
        console.log('test2', testUser);
        this.authS.changeUserPassword(passwordForm.mdpNouv, userDetails).subscribe(
              resp => {
                console.log(resp);
                Swal.fire({
                  title: 'Votre mot de passe a été modifié avec avec succès!',
                  icon: 'success',
                  cancelButtonColor: '#d33',
                });

              }
            );
            // $("#modifPWD").modal("hide");
            // this.onStart();
       // this.isclicked=1;
        this.mdpForm.reset();
        this.infopage = 0;
      // location.reload();


          }

        });



}

 onSubmit(){
  this.client = {
   id: this.client.id,
   nom: this.form.get('nom').value,
   prenom: this.form.get('prenom').value,
   sexe: this.client.sexe,
   adresseFacturation: 'Dakar',
   adresseLivraison: 'Dakar',
   ville: 'Dakar',
   telephone: this.form.get('mobile').value,
  // dateNaissance:this.client.date,
   etatClient: this.client.etatClient,
   idEtatClient: this.client.idEtatClient,
   idPays: 1,
   pays: this.client.pays,
   idUser: this.client.idUser,
 };
  console.log('client à mettre à jour', this.client);
  this.authS.editClient(this.client).subscribe(
 data => {
 this.client = data;
 this.toastrService.success('Modification terminée', 'Succès');
 console.log('mise à jour', data);
 },
 error => {
   alert(error);
 });
}

initForm(){
  const prenom = '';
  const nom = '';
  const mobile = '';
  const dateNaissance = '';

  this.form = this.fb.group(
   {
     prenom: [prenom, Validators.compose([Validators.required])],
     nom: [nom, Validators.compose([Validators.required])],
     mobile: [mobile, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')])],
     dateNaissance: [dateNaissance]

   });
}
 ngOnInit() {
   this.infoUser();
   this.initForm();
   this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
 }
 infoUser(){
   this.user = this.authS.getUserConnected();
   console.log('MonUser', this.user);
 }
infoClient(){
  this.oeuvreS.getClientByUser(this.user.id)
  .subscribe(
    response => {
      this.client = response;
      console.log('MonClient', this.client);
     },
     (error) => {
       console.log(error);
     });
}


commandesClient(){
  this.ngxService.startLoader('loader-01');
  this.infopage = 3;
  this.idUser = this.user.id;
  this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => {
     this.client = response;
     this.oeuvreS.getCommandeOfClient(this.client.id).subscribe(
       data => {
         console.log(data);
         this.commandes = data;
         // this.size=this.commandes.length;
         this.commandes = this.commandes.reverse();
         console.log('les commandes:' , this.commandes);
         this.ngxService.stopLoader('loader-01');
         /*setTimeout(() => {
          // stop foreground spinner of the loader "loader-01" with 'default' taskId
        }, 500);*/
       },
       error => {
         console.log(error);
       });
   });
}

favorisClient(){
  this.infopage = 4;
}


getAdresse(){
  this.ngxService.startLoader('loader-01');
  this.infopage = 2;
  this.idUser = this.user.id;
  this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => {
     this.client = response;
     this.authS.getAdresseOfUserConnected(this.client.id).subscribe(
    (adr: any) => {
      this.adresses = adr;
      console.log('adresses:', this.adresses);
      this.ngxService.stopLoader('loader-01');
      /*setTimeout(() => {
         // stop foreground spinner of the loader "loader-01" with 'default' taskId
      }, 500);*/
    },
    error => {
      console.log(error);
    }
  ); });
}
onDeleteAdresseOfUser(id: number){
  this.authS.deleteAdresseOfUser(id).subscribe(
    (data: any) => {
      console.log(data);
      this.ngOnInit();
    },
    error => {
      console.log(error);
    }
  );

}
onGetArtisteSuiviByClient(){

 this.idUser = this.user.id;
 this.oeuvreS.getClientByUser(this.idUser)
 .subscribe(
   response => {
   this.client = response;
   this.oeuvreS.getArtisteByClient(this.client.id).subscribe(
   (response: any) => {
     this.artistes = response;
     this.size = this.artistes.length;
     console.log('artistes suivis', this.artistes);
     },
    (error) => {
     console.log(error);
     });
   });
}

matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
 return (group: FormGroup): { [key: string]: any } => {
   const password = group.controls[passwordKey];
   const confirmPassword = group.controls[confirmPasswordKey];
   if (password.value !== confirmPassword.value) {
     return {
       mismatchedPasswords: true
     };
   }
 };
}

myDateParser(dateStr: string): string {
 // 2018-01-01T12:12:12.123456; - converting valid date format like this

 const date = dateStr.substring(0, 10);
 const annee = dateStr.substring(0, 4);
 const moi = dateStr.substring(5, 7);
 const jour = dateStr.substring(8, 10);
 const time = dateStr.substring(11, 16);
// let millisecond = dateStr.substring(20)

// let validDate = date + ' à ' + time;
 const validDate = jour + '/' + moi + '/' + annee + ' à ' + time;
 // + '.' + millisecond;
 console.log(validDate);
 return validDate;
}
addOeuvreToCart(element){
  console.log(element);
  this.productService.addToCartOeuvre(element);
}
removeOeuvre(element){
  console.log(element);
  this.productService.removeWishlistItem(element);
}
getOeuvreImageUrl(id: number) {
  return environment.API_ENDPOINT + 'image/oeuvre/' + id;

}
getLibelleEtatAbonnement(idEtat: number){
  for (let i = 0; i < this.etats.length; i++) {
    if (this.etats[i].id == idEtat){
      return this.etats[i].libelle;
    }

  }
}
getCodeEtatAbonnement(idEtat: number){
  for (let i = 0; i < this.etats.length; i++) {
    if (this.etats[i].id == idEtat){
      return this.etats[i].code;
    }

  }
}

showDetailsAbonnement(id: number){
  this.activePaiement = false;
  this.oeuvresAffiche = [];
  this.montantOeuvres = 0;

  for (let i = 0; i < this.abonnements.length; i++) {
    if (this.abonnements[i].id == id){
      this.abonnementAffiche = this.abonnements[i];
      console.log('abonneAffiche dashboard ', this.abonnementAffiche);

      for (let i = 0; i < this.etatAbonnements.length; i++) {
        if (this.abonnementAffiche.etatAbonnement == this.etatAbonnements[i].id){
          console.log('activePaiementttttttttttttttttt', this.etatAbonnements[i] );
          if (this.etatAbonnements[i].code === 'NON_PAYE'){
            console.log('activePaiementttttttttttttttttt2');
            this.activePaiement = true;
            console.log('activePaiementttttttttttttttttt', this.activePaiement);
          }
        }

      }

      this.imageService.getAbonneById(this.abonnementAffiche.idAbonne).subscribe(response => {
        console.log('reponse abonnement', response);
        this.abonneAffiche = response;
        console.log('abonne affiche', this.abonneAffiche);
      });
      this; this.imageService.getDelaiById(this.abonnementAffiche.idDelai).subscribe(response => {
        console.log('reponse delai', response);
        this.delaiAffiche = response;
        console.log('delai affiche', this.delaiAffiche);
      });
      this; this.imageService.getTerminalById(this.abonnementAffiche.idTerminal).subscribe(response => {
        console.log('reponse terminal', response);
        this.terminalAffiche = response;
        console.log('delai affiche', this.terminalAffiche);
       /* if(this.terminalAffiche.libelle === "Tv box"){
          this.precisionEcran = true;
          console.log("precsiooooooooooooo",this.precisionEcran)
        }*/
      });
      this.imageService.getListeOeuvre(this.abonnementAffiche.idListeSelection).subscribe(response => {
        console.log('reponse terminal', response);
        this.listeOeuvreAffiche = response;
        console.log('liste affiche', this.listeOeuvreAffiche);
        for (let i = 0; i < this.listeOeuvreAffiche.length; i++) {
          this.imageService.getImage(this.listeOeuvreAffiche[i].nomOeuvre).subscribe(response => {
            const oeuvre = response;
            console.log('oeuvre', oeuvre);
            this.montantOeuvres =  this.montantOeuvres + oeuvre.tarif;
            console.log('oeuvres total', this.montantOeuvres);
            this.oeuvresAffiche.push(oeuvre);
          });
        }
        console.log('oeuvres affiche', this.oeuvresAffiche);



      });

      this.infopage = 10;
    }
  }

}

showDetailsCommande(idCommande: number){

  this.infopage = 11;
  this.checkoutService.getCommandeById(idCommande).subscribe(
         (response) => {
          this.commande = response;

         /*  this.commande.lignesCommande.forEach(element => {
            this.commande.total += element.prix * element.quantite;
          });
 */
          this.Sum = (this.commande.total + 1100/* this.commande.totalLivraison */);
          this.ligneCommande = this.commande.lignesCommande;
          this.idLigneCMD = this.ligneCommande[0].id;
          for (let i = 0; i < this.ligneCommande.length; i++){
            this.image = environment.API_ENDPOINT + 'image/oeuvre/' + this.ligneCommande[i].oeuvre.id;
          }
          console.log('Details de la commande', this.commande);
         }
       );
  this.checkoutService.getLivraisonBycommande(idCommande).subscribe(
      (response) => {
          this.livraison = response;
          this.adressLivraison = this.livraison.adresseLivraison;
          console.log('Les informations sur la livraison', this.livraison);
      }
    );
  this.checkoutService.getPaiementById(idCommande).subscribe(
      (response) => {
          this.paiement = response;
          console.log('Les informations sur le paiement', this.paiement);
      }
    );



    }

    get(i: number){
      return environment.API_ENDPOINT + 'image/oeuvre/' + this.ligneCommande[i].oeuvre.id;
    }

    //REABONNEMENT


    reAbonner(index: number){
      this.reabonnement = this.abonnements[index];
      console.log("REABONNEMENT : "+this.reabonnement);
      this.imageService.getTerminalById(this.reabonnement.idTerminal).subscribe(response => {
        this.choixTerminal(response);
      })
    }

    terminalSignArt(){
      Swal.fire({
        title: 'Voulez vous conserver votre terminal SignArt?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #f07c10',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result)=> {
        if(result.value){
          this.terminalResponse = true;
          console.log(this.terminalResponse)
        }else{
          this.terminals = this.terminals.filter(terminal => terminal.code.split(" ").join("") != 'JDT');
          this.shownTerminal = true;
          this.terminalResponse = false;
          console.log(this.terminalResponse)
        }
      });
    }
  
    terminalTvBox(){
      Swal.fire({
        title: 'Voulez vous conserver votre Tv Box?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #f07c10',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result)=> {
        if(result.value){
          this.terminalResponse = true;
          console.log(this.terminalResponse)
        }else{
          this.terminals = this.terminals.filter(terminal => terminal.code.split(" ").join("") != 'JDT');
          this.shownTerminal = true
          this.terminalResponse = false;
          console.log(this.terminalResponse)
        }
      });
    }
  
    myTerminal(){
      Swal.fire({
        title: 'Avez-vous toujours votre terminal?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #f07c10',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result)=> {
        if(result.value){
          this.terminalResponse = true;
          console.log(this.terminalResponse)
        }else{
          this.terminals = this.terminals.filter(terminal => terminal.code.split(" ").join("") != 'JDT');
          this.shownTerminal = true
          this.terminalResponse = false;
          console.log(this.terminalResponse)
        }
      });
    }
  
    terminalLoue(){
      Swal.fire({
        title: 'Voulez vous continuer la location?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #f07c10',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then((result)=> {
        if(result.value){
          this.terminalResponse = true;
          console.log(this.terminalResponse)
        }else{
          this.terminals = this.terminals.filter(
            terminal => terminal.code.split(" ").join("") != 'JDT'
            && terminal.code.split(" ").join("") != 'LOUE'
            );
          this.shownTerminal = true
          this.terminalResponse = false;
          console.log(this.terminalResponse)
        }
      });
    }
  
    choixTerminal(chooseTerminal: Terminal){

      switch(chooseTerminal.code.split(' ').join('')){
        case 'TSIGNART':
          this.terminalSignArt();
          break;
  
        case 'TBOX':
          this.terminalTvBox();
          break;
  
        case 'JDT':
          this.myTerminal();
          break;
  
        case 'LOUE':
          this.terminalLoue();
          break;
      }
    }
    
    annulerReabonnement(){
      this.shownTerminal = false;
    }

    reAbonnement(){
      this.terminalDelai.terminalId = this.terminalDelaiForm.value.terminalId;

      this.terminals.filter(terminal => {
        if(terminal.id == this.terminalDelai.terminalId){
          this.chooseTerminal = terminal;
        }
      })

      this.imageService.reabonnement(this.reabonnement, this.terminalResponse, this.chooseTerminal).subscribe(res=>{
        console.log(res);
      })
    }
}
