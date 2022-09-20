import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { addOeuvre } from '../../shared/modeles/editOeuvre';
import { OeuvreService } from '../../shared/services/oeuvre.service';
import { AuthServiceS } from '../../shared/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-add-oeuvre',
  templateUrl: './add-oeuvre.component.html',
  styleUrls: ['./add-oeuvre.component.scss']
})
export class AddOeuvreComponent implements OnInit {
  oeuvreForm: FormGroup;
  addArticleInd: number;
  artiste: any;
  fileData: File;
  techniques: Object;

  constructor(private formbuilder:FormBuilder,private ngxService: NgxUiLoaderService,
    private authService:AuthServiceS ,private oeuvreService:OeuvreService,private toastrService: ToastrService) {
     }

  initForm() {
    this.oeuvreForm = this.formbuilder.group({
       'nom': ['',Validators.required],
       'technique': ['',Validators.required],
       'couleur': ["",Validators.required],
       'nouveau': ["",Validators.required],
       //'lithographie': [null,Validators.required],
       'auteur': [null,Validators.required],
       'dimensions': [null,Validators.required],
       'annee': [null,Validators.required],
       'prix': [0,Validators.required],
       'tauxremise': null,
       'taxes': [null,Validators.required],
       'image':['',  Validators.required], 
       //file: [null, Validators.required],
       'description': ['',Validators.required]
     });
   }
  ngOnInit(): void {
    this.artiste=this.authService.getArtisteConnected();
    this.oeuvreService.getTechnique().subscribe(
      resp => {
        
        this.techniques = resp;
        console.log('Les techniques ', this.techniques);
      }
    );
    this.initForm();
  }

  onFileSelected(event){
    this.fileData = <File>event.target.files[0];
    let reader = new FileReader();
    //if (files && files.length > 0) {
     let file = event.target.files[0];
     reader.readAsDataURL(file);
     reader.onload = () => {
      this.oeuvreForm.get('image').patchValue({
        filename: file.name,
        filetype: file.type,
        value: (<string>reader.result).split(',')[1]
      })
     };
     
    console.log("file", file)
     //this.formData.append('file', file);
     //console.log("formData change",this.formData)
     console.log("image value",this.oeuvreForm)
  }
  onAddArticle() {
    const formValue = this.oeuvreForm.value;
    const addeddArticle = new addOeuvre('',null,null,null,null,'','',null,null,null,null,null,'',null);
    addeddArticle.nom = formValue.nom;
    addeddArticle.idTechnique = +this.oeuvreForm.get('technique').value;
    addeddArticle.idCouleur = +this.oeuvreForm.get('couleur').value;
    addeddArticle.nouveau = formValue.nouveau;
    addeddArticle.lithographie = formValue.lithographie;
    addeddArticle.auteur = formValue.auteur;
    addeddArticle.dimensions = formValue.dimensions;
    addeddArticle.annee = formValue.annee;
    addeddArticle.prix = formValue.prix;
    addeddArticle.tauxremise = formValue.tauxremise;
    addeddArticle.taxes = 0;
    addeddArticle.image = this.oeuvreForm.get("image").value;
    addeddArticle.description = formValue.description;
    addeddArticle.idArtiste = this.artiste.id;
    //addeddArticle.fraisLivraison = formValue.fraisLivraison;
    //addeddArticle.artiste = this.artiste;  
    //this.userService.addUser(newUser);
    //this.router.navigate(['/users']);
    //console.log('To add', addeddArticle)
    //console.log('form value ', formValue)
    //this.article.nom = formValue.nom;
    //addeddArticle.technique = formValue.technique;
    //addeddArticle.idSousTechnique = formValue.soustechnique.id;
    //addeddArticle.sousTechnique = formValue.soustechnique;
    //addeddArticle.couleur = formValue.couleur;
    //addeddArticle.annee = formValue.annee;

    console.log('To add', addeddArticle);
    Swal.fire({
      title: 'Confirmez vous la souscription de cette oeuvre?',
      //text: "Ceci sera irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ' #f07c10',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {
        this.ngxService.startLoader("loader-01"); // start foreground spinner of the loader "loader-01" with 'default' taskId
        this.oeuvreService.addOeuvreSouscriptionArtiste(addeddArticle).subscribe(
          res =>{
            console.log('la reponse est ', res)
            setTimeout(() => {
              this.ngxService.stopLoader("loader-01"); // stop foreground spinner of the loader "loader-01" with 'default' taskId
            }, 3000);
            this.toastrService.success('Oeuvre soumise avec succès!');
            this.addArticleInd = 0;
            setTimeout(() => {
              location.reload();            
            }, 2800);
            
            /*$.notify({
              icon: "notifications",
              message: "Oeuvre souscrite avec succès!"
            }, {
                type: 'success',
                timer: 1000,
                placement: {
                  from: 'top',
                  align: 'center'
                }
              });*/
          }
         
        );
        //location.reload();
      }
    })
    //this.article.nom = formValue.nom;
    // console.log('addeded article ', this.article)
    // this.oeuvreService.editOeuvreArtiste(this.article).subscribe(
    //   res =>{
    //     let status = res;
    //     console.log('status', status)
    //   },
    //   error =>{
    //     let erreur = error;
    //     console.log('error', erreur)
    //   });
     

    //return this.oeuvre
  }
  cancelAdd(){
    this.addArticleInd = 0
  }
}
