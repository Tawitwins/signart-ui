import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { MustMatchValidators } from './must-Match';
import { ModalDirective } from 'angular-bootstrap-md';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Commande } from '../../../shared/modeles/commande';
import { Biographie } from '../../../shared/modeles/exposition';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { CheckoutService } from '../../../shared/services/checkout.service';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { ArticleService } from '../../../shared/services/article.service';
import { VisiteurService } from '../../../shared/services/visiteur.service';
import { environment } from '../../../../environments/environment';
import { AccountInfo, User } from '../../../shared/modeles/user';
import { Formation, Presentation, ImageProfil, Artiste } from '../../../shared/modeles/artiste';


declare interface MenuInfo { 
  path: string;
  title: string;
  id: string;
}

declare var $: any;


export const NAVIGATION: MenuInfo[] = [
  
  /*
  { path: '#mes-expots', title: 'Mes expots', id: 'mes-expots' },
  { path: '#annoncer-event', title: 'Mes annonces', id: 'annoncer-event' },
  { path: '#abonnement', title: 'Abonnement', id: 'abonnement' },
  { path: '#oeuvres', title: 'Mes oeuvres', id: 'mesoeuvres' },
  */

];

@Component({
  selector: 'app-artiste-param',
  templateUrl: './artiste-param.component.html',
  styleUrls: ['./artiste-param.component.scss']
})
export class ArtisteParamComponent implements OnInit {
 // @ViewChild('childModal') public childModal:ModalDirective;
  
  user:User;
  token:string;
  @Input() tk:any;
  form:FormGroup;
 idUser:number;
 commandes:Commande[];
 adresses:any[];
 artistes:any[];
 oeuvres:any = [];
 oeuvresImg: any;
 clients:any=[];
 Visiteurs:any=[];
 artiste:any=[];
 biographie:any;
 biographies: Biographie[];
 idCustomer:number;
 url:any;
 navigations: any[];
 //--pagination
 pageSize = 5;
 page=1;
 p=1;
 size:number;
 myGroup:FormGroup;
 biographieForm:FormGroup;
 photoProfilForm: FormGroup;
 mdpForm:FormGroup;
 presentationForm:FormGroup;
 etudeForm: FormGroup;
 presentationVideo: FormGroup;
 listesFormation: Formation[] | any;
 formation: Formation;
 isclicked: number;
 hide: boolean;
 hide2: boolean;
 ongletMdp: number;
 artistePresentations: Presentation[];
 fileData: File = null;
 formData = new FormData();
 message: string;
 photoProfil: ImageProfil;
 presentations: any[] = null;
 presentationMessage: string;
 artistePresentation: Presentation=new Presentation("","",false,0);

 fileDataVideo: File = null;
 formDataVideo = new FormData();
 urlVideo: any;
 urlTest:any;
 youtubeUrlInsert:string;
 afficheVideo: number;
 closeResult: string;

 presentationFalse: any[] = null;
 
  constructor(
    private authS:AuthServiceS,
    private oeuvreS:OeuvreService,private fb:FormBuilder,
    private artisteService:ArtisteService,
    public jwtHelper: JwtHelperService,
    private articleService: ArticleService,
    public sanitizer: DomSanitizer,
    private visiteurService : VisiteurService,
    private expoService: OeuvreService,
    private modalService: NgbModal
    
  ){
    this.onStart();
    this.afficheVideo = 0
  }

  onStart(){
    
    this.isclicked=1;
    this.ongletMdp=0;
    this.user=this.authS.getUserConnected();
    this.youtubeUrlInsert="http://www.youtube.com/embed/"
    this.urlTest="http://www.youtube.com/embed/_zBElvF1VhY";
   
    console.log('utilisateur',this.user)
    
    if(this.user.userType == 'ARTISTE'){
    this.artisteService.getArtisteByUser(this.user.id).subscribe(
      res => {
        this.artiste = res
        console.log('Artiste connected ', res)
        this.expoService.getFormationByArtiste(this.artiste.id).subscribe(response => { this.listesFormation = response
          console.log('formation',this.listesFormation);
      });
      this.artisteService.getAllBiographie(this.artiste.id).subscribe(
        resp => { 
          this.biographie = resp;
        console.log('Biographie',this.biographie);
    });

    this.artisteService.getAllPresentation(this.artiste.id).subscribe(
      resp => { 
        console.log(resp)
        this.presentations = resp;
       // console.log("taille presentation",this.presentations.length)
        if(this.presentations.length >= 2){
         // console.log("vrai")
          this.artistePresentations = this.presentations.filter(a => a.etatPubPresentation===true);
         // console.log(" artistePresentations",this.artistePresentations)
          this.artistePresentation = this.artistePresentations[0];
        }else{
          
          this.artistePresentations = resp;
          this.artistePresentation = this.artistePresentations[0];
          console.log(this.artistePresentations);

        }
      
       
  });

      }
    );
    console.log('User connected ', this.user)
  }  
  }

  initmdpForm(){
    this.mdpForm = new FormGroup({
      mdpActu: new FormControl('',Validators.required),
      mdpNouv: new FormControl('',
        [Validators.required,
       // Validators.pattern('*[a-z]*[A-Z]*'),
        Validators.minLength(8)]
      ),
      mdpConf: new FormControl('',Validators.required)
   },MustMatchValidators.checkPasswords);
  }

  initForm(){
    this.biographieForm = new FormGroup({
      biographie: new FormControl()
   });

   this.photoProfilForm = new FormGroup({
    photo: new FormControl('',Validators.required)
 });


   this.mdpForm = new FormGroup({
    mdpActu: new FormControl('',Validators.required),
    mdpNouv: new FormControl('',
      [Validators.required,
     // Validators.pattern('*[a-z]*[A-Z]*'),
      Validators.minLength(8)]
    ),
    mdpConf: new FormControl('',Validators.required)
 },MustMatchValidators.checkPasswords);

   this.presentationForm = new FormGroup({
    libelle: new FormControl()
 });

 this.presentationVideo = new FormGroup({
  videoPresentation: new FormControl()
});


   this.myGroup = new FormGroup({
    prenom: new FormControl(),
    nom:new FormControl(),
    surnom:new FormControl(),
    telephone:new FormControl(),
    email:new FormControl(),
    adresse:new FormControl(),
    ville:new FormControl(),
    pays:new FormControl()
 });

 this.etudeForm = new FormGroup({
  sigle:new FormControl(),
  libelle:new FormControl(),
  lieu:new FormControl(),
  specialisation:new FormControl(),
  anneeDebut:new FormControl(),
  anneeFin:new FormControl()
});

this.hide =true;
this.hide2 =true;
  }

  ngOnInit() {
    this.isclicked==1;
    this.navigations = NAVIGATION.filter(navigation => navigation);
    this.infoUser();
    this.initForm();
   
  }

  onUploadVideo(event){
    console.log("videoooo",event.target.value)
    this.fileDataVideo = <File>event.target.files[0];
    let reader = new FileReader();
    //if (files && files.length > 0) {
     let file = event.target.files[0];
     reader.readAsDataURL(file);
     reader.onload = (event) => {
      this.urlVideo = (<FileReader>event.target).result;
      console.log("url video",this.urlVideo)
     };
    
     
    console.log("file", file)
     this.formDataVideo.append('file', file);
     console.log("formData change",this.formDataVideo)
  }

  public fileChange(event) {
    this.fileData = <File>event.target.files[0];
    let reader = new FileReader();
    //if (files && files.length > 0) {
     let file = event.target.files[0];
     reader.readAsDataURL(file);
     reader.onload = () => {
      this.photoProfilForm.get('photo').setValue({
        filename: file.name,
        filetype: file.type,
        value: (<string>reader.result).split(',')[1]
      })
     };
     
    console.log("file", file)
     this.formData.append('file', file);
     console.log("formData change",this.formData)
     
     
   // }  

  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult= `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onChangePhotoProfil(){

    console.log("formvalue",this.photoProfilForm.get('photo').value)
    const formModel = this.photoProfilForm.get('photo').value;
    console.log("formModel", formModel)
    
    //console.log("photoProfil", this.photoProfil)

    Swal.fire({
      title: 'Confirmez vous la modification de votre photo de profil?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, je confirme!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        this.artisteService.putPhotoArtiste(this.artiste.id,formModel).subscribe(
          resp =>{
            console.log(resp)
            this.message = 'Image upload succesfully';
            console.log(this.message)   
            Swal.fire({
              title: 'Photo profil modifié avec succés! Veuillez actualiser la page SVP.'
            }).then((result) => {
              //location.reload();
              //this.initForm();
              this.isclicked=1;
            
              
             // $("#modifPhotoProfil").modal("hide");

            })
          }
        );
       // location.reload();
       this.photoProfilForm.reset();
        this.modalService.dismissAll();
      }
    })

  }

  getArtisteImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
  }

  
  infoUser(){
    this.user=this.authS.getUserConnected();
    console.log('MonUser',this.user);
  }
  infoArtiste(){
    this.artisteService.getArtisteByUser(this.user.id)
     .subscribe(
       response=>{
         this.artiste=response;
         console.log('les infos de l\'artiste',this.artiste)
       },
       error=>{
         console.log('erreur de récupération des informations de l\'artiste de l\'artiste')
       }
     );
  }
  goetape(etape:number){
    this.isclicked = etape;
    //console.log(this.artistePresentation);
  }

  onAddBiographie(){

  const formvalue = this.biographieForm.value;
  console.log('formvalue ', formvalue)
  const biographie = new Biographie('',null,'','',false,null);
  //biographie.dateNaissance = null;
 // biographie.lieuNaissance = 'Dakar',
 // biographie.nationalite = 'Senegalais',
  biographie.libelle = formvalue.biographie;
  biographie.etatBiographie = false;
  biographie.idArtiste =this.artiste.id;
  
  console.log('biographe ', biographie);

  Swal.fire({
    title: 'Confirmez vous la souscription de cette Biographie?',
    //text: "Ceci sera irreversible!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: ' #f07c10',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, je confirme!',
    cancelButtonText: 'Anuler'
  }).then((result) => {
    if (result.value) {
      this.artisteService.getAllBiographie(this.artiste.id).subscribe(
        resp=>{
            const actuBio = resp;
            console.log("all Biographie",actuBio)
            if(actuBio.length >= 2){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vous avez deja une biographie en attente de validation',
              })
            }else{
              console.log("etat pres",actuBio[0])
              if(actuBio[0].etatPubPresentation === false){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Vous avez deja une biographie en attente de validation',
                })
              }else{
                console.log('biographe will be saved', biographie);
                this.artisteService.addBiographie(biographie).subscribe(
                  resp =>{
                    console.log(resp)
                    Swal.fire(
                      'Biohgraphie souscrite avec succés!',
                      'Votre biohgraphie est en attente de validation!',
                    )
                  }
                );
              }
            }
           /* this.artisteService.deletePresentation(actuPres.id).subscribe(
              resp=>{
                console.log(resp);
              }
            ) */ 
        }
        
      );
      
      //var jQuery:any;
      //jQuery("#modifPhotoProfil").modal("hide");
    }
  })
  this.initForm();
  this.isclicked=1;

  }

 /* createFormation(){
     
    this.artisteService.addFormation(this.etudeForm.value).subscribe(
      data=>{
        console.log('data',data)
      },
      (error)=>{
        console.log('erreur',error)
      }
    )
  }*/

  createFormation(){

  this.formation = this.etudeForm.value;
   this.formation.idArtiste = this.artiste.id;
   this.formation.etatPublication = false;
   console.log('formation test',this.formation)
   this.artisteService.addFormation(this.formation).subscribe(
     data=>{
       console.log('data',data)
     },
     (error)=>{
       console.log('erreur',error)
     }
   )
 }


 onAddPresentation(valeur: number){
   if(valeur == 1){
    const presForm = this.presentationForm.value;
    console.log('formpres', this.presentationForm.value);
    const pres = new Presentation('','',false,null);
    pres.libelle = presForm.libelle;
    pres.etatPubPresentation = false;
    pres.idArtiste = this.artiste.id;
    pres.videoId = 'rien';
    Swal.fire({
      title: "Voulez vous vraiment soumettre cette presentation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        console.log('pres',pres)
        this.artisteService.getAllPresentation(this.artiste.id).subscribe(
          resp=>{
              const actuPres = resp;
              console.log("all presentation",actuPres)
              if(actuPres.length >= 2){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Vous avez deja une presentation en attente de validation',
                })
              }else{
                console.log("etat pres",actuPres[0])
                if(actuPres[0].etatPubPresentation === false){
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Vous avez deja une presentation en attente de validation',
                  })
                }else{
                  this.artisteService.addPresentation(pres).subscribe(
                    resp =>{
                      console.log(resp)
                      Swal.fire({
                       title: 'presentation soumis avec succés!'
                      }).then((result) => {
                        this.initForm();
                        this.isclicked=1;
                       // location.reload();
                      })
                    }
                    
                  );
                }
              }
             /* this.artisteService.deletePresentation(actuPres.id).subscribe(
                resp=>{
                  console.log(resp);
                }
              ) */ 
          }
          
        );
          /*this.artisteService.addPresentation(pres).subscribe(
            resp =>{
              console.log(resp)
              Swal.fire({
               title: 'presentation soumis avec succés!'
              }).then((result) => {
                this.initForm();
                this.isclicked=1;
               // location.reload();
              })
            }
            
          ); */
      }
    })
   }else{

    this.afficheVideo = 1;
    const presForm = this.presentationVideo.value;
    console.log('formpres', this.presentationVideo.value);
    const pres = new Presentation('','',false,null);
    pres.libelle = 'rien';
    pres.etatPubPresentation = false;
    pres.idArtiste = this.artiste.id;
    pres.videoId = 'rien';
    Swal.fire({
      title: "Voulez vous vraiment soumettre cette presentation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        console.log('pres',pres)
        this.artisteService.getAllPresentation(this.artiste.id).subscribe(
          resp=>{
              const actuPres = resp;
              console.log("all presentation",actuPres)
              if(actuPres.length >= 2){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Vous avez deja une presentation en attente de validation',
                })
              }else{
                console.log("etat pres",actuPres[0])
                if(actuPres.length!=0)
                {
                  if(actuPres[0].etatPubPresentation === false){
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Vous avez deja une presentation en attente de validation',
                    })
                  }else{
                    this.artisteService.addPresentation(pres).subscribe(
                      resp =>{
                        console.log("Ma video a été mise youpi");
                        console.log(resp);
                        Swal.fire({
                         title: 'presentation soumis avec succés!'
                        }).then((result) => {
                          this.initForm();
                          this.isclicked=1;
                         // location.reload();
                        })
                      }
                      
                    );
                  }
                }
                else{
                  this.artisteService.addPresentation(pres).subscribe(
                    resp =>{
                      console.log(resp)
                      Swal.fire({
                       title: 'presentation soumis avec succés!'
                      }).then((result) => {
                        this.initForm();
                        this.isclicked=1;
                       // location.reload();
                      })
                    }
                    
                  );
                }
              }
             /* this.artisteService.deletePresentation(actuPres.id).subscribe(
                resp=>{
                  console.log(resp);
                }
              ) */ 
          }
          
        );
          /*this.artisteService.addPresentation(pres).subscribe(
            resp =>{
              console.log(resp)
              Swal.fire({
               title: 'presentation soumis avec succés!'
              }).then((result) => {
                this.initForm();
                this.isclicked=1;
               // location.reload();
              })
            }
            
          ); */
      }
    })

   }
 
}


  onChangePwd(){
     
    const passwordForm = this.mdpForm.value;
    console.log('passworForm',passwordForm)
    const userDetails = new AccountInfo('','');
    userDetails.userName = this.user.email;
    userDetails.password = passwordForm.mdpActu;
    this.authS.testPassword(userDetails).subscribe(
      resp =>{
        const testUser = resp
        console.log('test1',testUser);
        if(testUser === null){
          Swal.fire({
            title: 'votre ancien mot de passe est incorrect!',
            icon: 'error',
            cancelButtonColor: '#d33',
          });
        }
        else{
          console.log('test2',testUser);
          this.authS.changeUserPassword(passwordForm.mdpNouv,userDetails).subscribe(
                resp =>{
                  console.log(resp)
                  
                  $.notify({
                    icon: "notifications",
                    message: "Votre mot de passe a été modifié avec avec succés!"
                  }, {
                      type: 'success',
                      timer: 1000,
                      placement: {
                        from: 'top',
                        align: 'center'
                      }
                    });
                }
              );
              //$("#modifPWD").modal("hide");
              //this.onStart();
         // this.isclicked=1;
         this.mdpForm.reset();
         this.modalService.dismissAll();
        // location.reload();
        
              
            }
            
          })
          
        
    
  }  

  onEditArtiste(){
    const formInfo = this.myGroup.value;
    console.log('formInfo',formInfo)
    const artistem = new Artiste('','','','','','','','','','',null);
    artistem.nom = formInfo.nom;
    artistem.prenom = formInfo.prenom;
    artistem.surnom = formInfo.surnom;
    artistem.telephone = formInfo.telephone;
    artistem.email = formInfo.email;
    artistem.adresse = formInfo.adresse;
    artistem.ville = formInfo.ville;
    artistem.pays = formInfo.pays;
    console.log('modif artiste',artistem);
    Swal.fire({
      title: 'Voulez vous vraiment modifier ces informations',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Anuler'
    }).then((result) => {
      if (result.value) {
        this.artisteService.putArtiste(this.artiste.id, artistem).subscribe(
          resp =>{
            console.log(resp)
            Swal.fire({
             title: 'Information mofidiés avec succés!'
            
              
            }).then((result) => {
              this.initForm();
              this.isclicked=1;
              location.reload();
            })
          }
          
        );
      }
    })
  }
}



