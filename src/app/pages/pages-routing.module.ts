import { AbonnementComponent } from './abonnement/abonnement.component';
import { FollowersComponent } from './followers/followers.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';
import { MesOeuvresComponent } from './mes-oeuvres/mes-oeuvres.component';
import { HistoireComponent } from './histoire/histoire.component';
import { AddExpoComponent } from './add-expo/add-expo.component';
import { AddAnnonceComponent } from './add-annonce/add-annonce.component';
import { ExpositionComponent } from './exposition/exposition.component';
import { RegisterArtistComponent } from './account/register-artist/register-artist.component';
import { AllartistComponent } from './allartist/allartist.component';
import { ArtisteComponent } from './artiste/artiste.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishlistComponent } from './account/wishlist/wishlist.component';
import { CartComponent } from './account/cart/cart.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ContactComponent } from './account/contact/contact.component';
import { CheckoutComponent } from './account/checkout/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SearchComponent } from './search/search.component';
import { TypographyComponent } from './typography/typography.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ErrorComponent } from './error/error.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { FaqComponent } from './faq/faq.component';
import { BlogLeftSidebarComponent } from './blog/blog-left-sidebar/blog-left-sidebar.component';
import { BlogRightSidebarComponent } from './blog/blog-right-sidebar/blog-right-sidebar.component';
import { BlogNoSidebarComponent } from './blog/blog-no-sidebar/blog-no-sidebar.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { from } from 'rxjs';

const routes: Routes = [
  { 
    path: 'wishlist', 
    component: WishlistComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  {
    path: 'add-expo',
    component: AddExpoComponent
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent 
  },
  { 
    path: 'contact', 
    component: ContactComponent 
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent 
  },
  { 
    path: 'aboutus', 
    component: AboutUsComponent 
  },
  { 
    path: 'search', 
    component: SearchComponent 
  },
  { 
    path: 'typography', 
    component: TypographyComponent 
  },
  {
    path: 'allartist',
    component: AllartistComponent
  },
  { 
    path: 'artiste', 
    component: ArtisteComponent 
  },
  {
    path:'add-annonce',
    component: AddAnnonceComponent
  },
  { 
    path: 'order/success', 
    component: OrderSuccessComponent 
  },
  { 
    path: '404', 
    component: ErrorComponent 
  },
  { 
    path: 'comingsoon', 
    component: ComingSoonComponent 
  },
  { 
    path: 'faq', 
    component: FaqComponent 
  },
  { 
    path: 'blog/left/sidebar', 
    component: BlogLeftSidebarComponent 
  },
  { 
    path: 'blog/right/sidebar', 
    component: BlogRightSidebarComponent 
  },
  { 
    path: 'blog/no/sidebar', 
    component: BlogNoSidebarComponent 
  },
  { 
    path: 'blog/details', 
    component: BlogDetailsComponent 
  },
  {
    path: 'exposition',
    component: ExpositionComponent
  },
  {
    path: 'register-artist',
    component: RegisterArtistComponent
  },
  {
    path: 'histoire',
    component: HistoireComponent
  },
  {
    path: 'mes-oeuvres',
    component: MesOeuvresComponent
  },
  {
    path: 'mes-annonces',
    component: MesAnnoncesComponent
  },
  {
    path: 'followers',
    component: FollowersComponent
  },
  {
    path: 'abonnement',
    component: AbonnementComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
