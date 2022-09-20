import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { OeuvreService } from 'app/shared/services/oeuvre.service';
import { ArtisteService } from 'app/shared/services/artiste.service';
import { Souscription } from 'app/shared/modeles/souscription';
import { OeuvreSousc } from 'app/shared/modeles/oeuvre';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  

  //infoArtisteForm:FormGroup;
  //oeuvre1Form: FormGroup;
  //oeuvre2Form: FormGroup;
  form1Value: any;
  form2Value: any;
  form3Value: any;
  etape:number;
  titreInfoArtistes: any[];
  titreInfoOeuvre1: any[];
  titreInfoOeuvre2: any[];
  techniques : any = null;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  infoArtisteForm = this.formbuilder.group({
    'prenom': ['',Validators.required],
    'nom': ['',Validators.required],
    'telephone':['',Validators.required],
    'email': ['',Validators.pattern(this.emailPattern)],
    'genre': ['',Validators.required],
    'nomGalerie': ['',Validators.required],
    'siteWeb': ['',Validators.required],
    'adresseGalerie': ['',Validators.required],
    'ville': ['',Validators.required],
    'specialite': ['',Validators.required],
    'formation': ['',Validators.required],
    'exposition': ['',Validators.required]
    //[disabled]="!infoArtisteForm.valid"
    
  });

  oeuvre1Form = this.formbuilder.group({
    'image': new FormControl('',Validators.required),
    'nom': ['',Validators.required],
    'auteur':['',Validators.required],
    'idTechnique': ['',Validators.required],
    'annee': [null,Validators.required],
    'dimensions': ['',Validators.required]
  });

  oeuvre2Form = this.formbuilder.group({
    'image': new FormControl('',Validators.required),
    'nom': ['',Validators.required],
    'auteur':['',Validators.required],
    'idTechnique': ['',Validators.required],
    'annee': [null,Validators.required],
    'dimensions': ['',Validators.required]
  });

  constructor(
    private formbuilder: FormBuilder, 
    private oeuvreService: OeuvreService,
    private artisteService: ArtisteService,) { 
  this.etape=1;

  this.oeuvreService.getTechnique().subscribe(
    resp => {
      
      this.techniques = resp;
      console.log('Les techniques ', this.techniques);
    }
  );
}

  ngOnInit() {

  }
  goetape(val){
    this.form1Value = this.infoArtisteForm.value;
    this.form2Value = this.oeuvre1Form.value;
    this.form3Value = this.oeuvre2Form.value;
    this.etape=val;
  }
  onFileSelected(event,i){
    console.log(event);
    //this.fileData = <File>event.target.files[0];
    let reader = new FileReader();
    //if (files && files.length > 0) {
     let file = event.target.files[0];
     reader.readAsDataURL(file);
     reader.onload = () => {
      if(i==1)
      {
        this.oeuvre1Form.get('image').patchValue({
          filename: file.name,
          filetype: file.type,
          value: (<string>reader.result).split(',')[1]
        })
      }
      else{
        this.oeuvre2Form.get('image').patchValue({
          filename: file.name,
          filetype: file.type,
          value: (<string>reader.result).split(',')[1]
        })
      }
     };
     
    console.log("file", file)
     
  }

  

  onSubmit() {
    console.log("Soumission en cours");
    Swal.fire({
      title: 'Confirmez vous la souscription de cette demande?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        this.artisteService.addSouscription(<Souscription>this.form1Value).subscribe(resp=>{
          let val = <Souscription>resp;
          if(val.id!=null)
          {
            let oeuvreUne=<OeuvreSousc>this.form2Value;
            oeuvreUne.idSouscription= val.id;
            this.oeuvreService.addOeuvreSouscriptionArtiste(oeuvreUne).subscribe(resp=>{
              let val = <Souscription>resp;
              if(val.id!=null)
              {
                console.log("oeuvre une ajouté avec succès");
              }
            });
            let oeuvreDeux=<OeuvreSousc>this.form3Value;
            oeuvreDeux.idSouscription = val.id;
            this.oeuvreService.addOeuvreSouscriptionArtiste(oeuvreDeux).subscribe(resp=>{
              let val = <Souscription>resp;
              if(val.id!=null)
              {
                console.log("oeuvre deux ajouté avec succès");
              }
            });
          }
        });
        /*this.oeuvreService.addOeuvreArtiste(addeddArticle).subscribe(
          res =>{
            console.log('la reponse est ', res)
            Swal.fire(
              'Oeuvre souscrite avec succès!',
              'Votre oeuvre est en attente de publication!',
            )
          }
         

        );*/
        Swal.fire(
          "Formulaire soumis avec succès!",
          "En attente de Validation par l'administration!",
        ).then((result)=> {if(result.value){
          location.replace("./accueil");
        }})

      }

    });
    console.log('info artiste',this.form1Value)
    console.log('oeuvre1', this.form2Value)
    console.log('oeuvre2', this.form3Value)
      
  }
  onCancel() {
    
    Swal.fire({
      title: 'Êtes vous sure de vouloir annuler cette soumission?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {
        /*this.oeuvreService.addOeuvreArtiste(addeddArticle).subscribe(
          res =>{
            console.log('la reponse est ', res)
            Swal.fire(
              'Oeuvre souscrite avec succès!',
              'Votre oeuvre est en attente de publication!',
            )
          }
         

        );*/
        Swal.fire(
          "Soumission annuler!",
        ).then((result)=> {if(result.value){
          location.replace("./accueil");}})
          
      }

    });
  }
  onReturn(){
    location.replace("./accueil");
  }

  SoumettreFormSouscription(){
    console.log("Soumission en cours by click");
  }
  onSubmitForm1(){
    this.form1Value = this.infoArtisteForm.value;

    this.titreInfoArtistes = [
      {
        titre: 'Prenom',
        valeur: this.form1Value.prenom,
      },
      {
        titre: 'Nom',
        valeur: this.form1Value.nom,
      },
      {
        titre: 'Telephone',
        valeur: this.form1Value.telephone,
      },
      {
        titre: 'Email',
        valeur: this.form1Value.email,
      },
      {
        titre: 'Genre',
        valeur: this.form1Value.genre,
      },
      {
        titre: 'Nom Galerie',
        valeur: this.form1Value.nomGalerie,
      },
      {
        titre: 'Site Web',
        valeur: this.form1Value.siteWeb,
      },
      {
        titre: 'Adresse Galerie',
        valeur: this.form1Value.adresseGalerie,
      },
      {
        titre: 'Ville',
        valeur: this.form1Value.ville,
      },
      {
        titre: 'Specialite',
        valeur: this.form1Value.specialite,
      },
      {
        titre: 'Formation',
        valeur: this.form1Value.formation,
      },
      {
        titre: 'Exposition',
        valeur: this.form1Value.exposition,
      }
    ]
    //this.titreInfoArtistes.Valeur.push(1);
     /* [
        
        this.form1Value.nom,
        this.form1Value.telephone,
        this.form1Value.email,
        this.form1Value.genre,
        this.form1Value.nomGalerie,
        this.form1Value.siteWeb,
        this.form1Value.adresseGalerie,
        this.form1Value.ville,
        this.form1Value.specialite,
        this.form1Value.formation,
        this.form1Value.exposition,   
      ]];
      
      
      'titre':[
      'Prenom',
      'Nom',
      'Telephone',
      'Email',
      'genre',
      'Nom Galerie',
      'Site Web',
      'Adresse Galerie',
      'Ville',
      'Specialite',
      'Formation',
      'Exposition'],
      'valeur':[]
    }*/
    
    console.log(this.form1Value)
    console.log(this.titreInfoArtistes)
    this.etape=3;
  }
  onSubmitForm2(){
    this.form2Value = this.oeuvre1Form.value;
    this.titreInfoOeuvre1 = [
      {
        titre: 'Image',
        valeur: this.form2Value.image,
      },
      {
        titre: 'Titre',
        valeur: this.form2Value.nom,
      },
      {
        titre: 'Auteur',
        valeur: this.form2Value.auteur,
      },
      {
        titre: 'Technique',
        valeur: this.form2Value.idTechnique,
      },
      {
        titre: 'Annee',
        valeur: this.form2Value.annee,
      },
      {
        titre: 'Dimension',
        valeur: this.form2Value.dimensions,
      }
    ]
    console.log(this.form2Value)
    this.etape=4;
  }

  onSubmitForm3(){
    this.form3Value = this.oeuvre2Form.value;
    this.titreInfoOeuvre2 = [
      {
        titre: 'Image',
        valeur: this.form3Value.image,
      },
      {
        titre: 'Titre',
        valeur: this.form3Value.nom,
      },
      {
        titre: 'Auteur',
        valeur: this.form3Value.auteur,
      },
      {
        titre: 'Technique',
        valeur: this.form3Value.idTechnique,
      },
      {
        titre: 'Annee',
        valeur: this.form3Value.annee,
      },
      {
        titre: 'Dimension',
        valeur: this.form3Value.dimensions,
      }
    ]
    console.log(this.form3Value)
    this.etape=5;
  }

  
}
