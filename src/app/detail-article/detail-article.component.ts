import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Image } from '../shared/modeles/image';
import { Subscription ,  Subject } from 'rxjs';
import { ArticleService } from '../shared/services/article.service';
import { Store } from '@ngrx/store';
import { AppState } from '../interfaces';
import { CheckoutActions } from '../checkout/actions/checkout.actions';
import { Oeuvre } from '../shared/modeles/oeuvre';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { getLineItems } from '../checkout/reducers/selectors';
import { ImageDto } from '../shared/modeles/image';
import { Panier } from '../shared/modeles/panier';
import { AuthServiceS } from '../shared/services/auth.service';
import { CheckoutService } from '../shared/services/checkout.service';
import { LanguageService } from '../shared/services/language.service';
import { TranslateService } from '@ngx-translate/core';



declare var $: any;
declare interface MenuInfo {
  path: string;
  title: string;
  id: string;
}

export const NAVIGATION: MenuInfo[] = [
  { path: '#description', title: 'Description', id: 'description' },
  { path: '#livraison', title: 'Livraison', id: 'livraison' },
  { path: '#retour', title: 'Retour', id: 'retour' },
  { path: '#garantie', title: 'Garantie', id: 'garantie' }
];
declare var $: any;

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss'],
  providers: [ArticleService]
})
export class DetailArticleComponent implements OnInit {

  public loading = new Subject<{ loading: boolean, hasError: boolean, hasMsg: string }>();
  navigations: any[];
  actionsSubscription: Subscription;
  article$: Oeuvre = null;
  routeSubs: Subscription;
  articleId: number;
  oeuvreId: any;
  tab: Oeuvre[];
  url: any;
  private button: any;
  elmt: HTMLElement;
  listarticle: any = null;
  panier: Panier;
  listeItems:any[];
  present: boolean;
  user: any;
  imageRes: ImageDto;
  isAdd: boolean;


  constructor(
    private languageService: LanguageService,

    private route: ActivatedRoute, private articleService: ArticleService,
    private store: Store<AppState>, private checkoutActions: CheckoutActions,
    private sanitizer: DomSanitizer, private router:Router,private toastr:ToastrService, private element: ElementRef, private checkoutService: CheckoutService, public domSanitizer: DomSanitizer,private authService: AuthServiceS,
    public translate: TranslateService) {
    /**On Init
   * 1. Parse route params
   * 2. Retrive article id
   * 3. Ask for the article detail based on article id 
   * */
  this.isAdd = true;
  this.user = this.authService.getUserConnected();
  if( this.user != null){
    if( this.user.userType === "ARTISTE"){
        this.isAdd = false;
         }
}

    this.actionsSubscription = this.route.params.subscribe(
      (params: any) => {
        this.articleId = params['id'];
        console.log('id: ', this.articleId)
        //récupération de l'image de l'oeuvre

        this.articleService.getImage(this.articleId).subscribe(response => {
            console.log("response")
            //this.imageRes = response;
            let urlCreator = window.URL; let blob; let url;
            
            blob = new Blob([response], { type: 'application/octet-stream' });
            url = urlCreator.createObjectURL(blob);
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
           // console.log("image", this.imageRes.valeur)
          },
            error => {
              console.log('Erreur récupération image oeuvre');
              this.translate.get("ErrorRecovImage").subscribe(popup=>{
                this.translate.get("ERROR").subscribe(alertType=>{
                  this.toastr.error(popup, alertType)
                })
              })
              // this.toastr.error('Erreur récupération de l\'image', 'ERREUR')
            }
          );

        //Récupération des infos détaillés de l'oeuvre
        this.articleService.getArticle(this.articleId)
          .subscribe(oeuvre => {
            this.article$ = oeuvre;
            console.log('oeuvre:' + this.article$);
          },
            error => {
              console.log('Erreur récupération détail oeuvre');
              this.translate.get("ErrorRecovInfoDetails").subscribe(popup=>{
                this.translate.get("ERROR").subscribe(alertType=>{
                  this.toastr.error(popup, alertType)
                })
              })
              // this.toastr.error('Erreur récupération des infos détaillés', 'ERREUR')
            }
          );
      }
    );
  }

  ngOnInit() {
    this.elmt = this.element.nativeElement;
    this.button = this.elmt.getElementsByClassName('btn')[0];
    this.store.select(getLineItems).subscribe(
      res => {
        this.listeItems = res;
        console.log('line items ', this.listeItems)
        if(this.listeItems.length !== 0){
          for(let i = 0; i < this.listeItems.length; i++){
            //console.log('list id: ', this.listeItems[i].oeuvre.id)
            //console.log('article id: ', this.articleId)
            if(this.listeItems[i] !== undefined && this.listeItems[i].oeuvre.id == this.articleId){
              this.button.classList.add('disabled');
              //this.button.classList.add('disabled');
            }
          }
        }
      }
    );
    
    //console.log('present ? : ', this.present);
    //console.log('element', this.elmt);
    //console.log('bouton', this.button);
    /*if(this.addToCart){
      this.button.classList.add('disabled');
    }*/
    this.navigations = NAVIGATION.filter(navigation => navigation);
    this.oeuvreId = this.articleId;

    $('.tile')
    // tile mouse actions
    .on('mouseover', function(){
      $(this).children('.photo').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
    })
    .on('mouseout', function(){
      $(this).children('.photo').css({'transform': 'scale(1)'});
    })
    .on('mousemove', function(e){
      $(this).children('.photo').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
    })
    // tiles set up
    .each(function(){
      $(this)
        .children('.photo').css({'background-image': 'url('+ $(this).attr('src') +')'});
    })
  }

  addToCart() {
    /*Utilisation des effects 
    this.store.dispatch(this.checkoutActions.addToCart(this.article$));*/
    /* Sans les effects*/
      //this.button.classList.add('disabled');
      if(this.user==null){
        this.router.navigate(['/auth', 'account']);
        
       }else{
        this.panier = this.checkoutService.createNewLineItemInLocalStorage(this.article$);
        this.store.dispatch(this.checkoutActions.addToCartSuccess(this.panier));
       }
      
  }

 
  cancelContextMenu(){
    return false;
  }
}
