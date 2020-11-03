import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getAuthStatus } from 'src/app/auth/reducers/selectors';
import { AppState } from 'src/app/interfaces';
import { AuthServiceS } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = false;

  constructor(private authService: AuthServiceS,  private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
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
