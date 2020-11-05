import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthServiceS } from '../../../shared/services/auth.service';
import { AppState } from '../../../interfaces';
import { getAuthStatus } from '../../../auth/reducers/selectors';
import { User } from '../../../shared/modeles/user';
import { Artiste } from '../../../shared/modeles/artiste';
import { ArtisteService } from '../../../shared/services/artiste.service';
import { Client } from '../../../shared/modeles/client';
import { OeuvreService } from '../../../shared/services/oeuvre.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user:User;
  artiste:Artiste;
  client:Client;
  public openDashboard: boolean = false;

  constructor(private authService: AuthServiceS,  private store: Store<AppState>, private router: Router,private artisteS:ArtisteService,private oeuvreServices:OeuvreService) 
  {
    
  }

  ngOnInit(): void {
    this.user=this.authService.getUserConnected();
    if(this.user.userType == 'ARTISTE'){
    this.artiste=this.authService.getArtisteConnected();
    console.log(this.artiste);
    }
    if(this.user.userType == 'CLIENT'){
      this.client=this.authService.getArtisteConnected();
      console.log(this.client);
    }
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  logout() {
    this.authService.signOut();
    this.redirectIfUserLoggedOut();
    location.reload();
 }
 redirectIfUserLoggedOut(){
  this.store.select(getAuthStatus).subscribe(
    data => {
      if (data === false) {
      this.router.navigate(['home']);
     }
    }
  );
}

}
