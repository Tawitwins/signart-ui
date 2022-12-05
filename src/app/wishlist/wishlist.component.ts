import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { getTotalWishlistItems} from './reducers/selectors';
import { getAllWishlist } from './reducers/selectors';
import { ArticleActions } from '../detail-article/actions/article-actions';
import { AppState } from '../interfaces';
import { Store } from '@ngrx/store';
import { FavoriteActions } from './actions/favorite.actions';
import { ArticleService } from '../shared/services/article.service';
import { WishItem } from '../shared/modeles/wish_item';
import {Client} from '../shared/modeles/client';
import {User} from '../shared/modeles/user';
import { environment } from 'src/environments/environment.prod';
import { AuthServiceS } from '../shared/services/auth.service';
import { OeuvreService } from '../shared/services/oeuvre.service';
//import { AuthService } from 'angularx-social-login';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  //totalWishlistItems$: Observable<number>;
  totalWishlistItems:number;
  wishItems$: any[];
  maClass:string = 'btn btn-default waves-effect';
  wishlistLibelle = 'Retirer de ma liste';
  user:User;
  client:Client;
  idUser:number;

  constructor(private store: Store<AppState>, private favoriteActions: FavoriteActions,
     private articleService: ArticleService,
     private authS:AuthServiceS,
     private oeuvreS:OeuvreService
    
    ) { 
    this.user=this.authS.getUserConnected();
    this.client={
      id:0,
      nom: '',
      prenom: '',
      sexe: '',
      adresseFacturation:'',
      adresseLivraison:'',
      ville:'',
      telephone: '',
      dateNaissance:new Date(),
      etatClient:'',
      idEtatClient: 0,
      idPays:1,
      pays: '',
      idUser:0,
    }
    
   // let idClient = 12 ;//à changer
    //this.store.dispatch(this.favoriteActions.getAllWishlist(idClient));
    
    //this.totalWishlistItems$ = this.store.select(getTotalWishlistItems);
    //this.wishItems$ = this.store.select(getAllWishlist);
  }

  ngOnInit() {
    //à changer
    this.idUser=parseInt(this.user.id);
    this.oeuvreS.getClientByUser(this.idUser)
    .subscribe(
      response => { 
        this.client = response;
        this.store.dispatch(this.favoriteActions.getAllWishlist(this.client.id))
        this.getWishlist(this.client.id);
      },
          error => {
            console.log(error)
      });

  
    }
  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

  removefromWishlist(idOeuvre: number) {
    //à changer
    this.articleService.deleteFromWishlist(this.client.id, idOeuvre, 'FAV').subscribe();
    this.ngOnInit();
  }
  getWishlist(id:number){
    this.articleService.getAllWishlist(id).subscribe(
      (response:any)=>{
      this.wishItems$=response;
      this.totalWishlistItems=<number>this.wishItems$.length;
      localStorage.setItem('totalwishItem',JSON.stringify(this.totalWishlistItems));
      console.log('total',this.totalWishlistItems)      
      }
    );

  }

}
