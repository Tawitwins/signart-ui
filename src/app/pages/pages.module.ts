import { RegisterArtistComponent } from './account/register-artist/register-artist.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

// Pages Components
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
import { ArtisteComponent } from './artiste/artiste.component';
// Blog Components
import { BlogLeftSidebarComponent } from './blog/blog-left-sidebar/blog-left-sidebar.component';
import { BlogRightSidebarComponent } from './blog/blog-right-sidebar/blog-right-sidebar.component';
import { BlogNoSidebarComponent } from './blog/blog-no-sidebar/blog-no-sidebar.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
// Artist Components
import { AllartistComponent } from './allartist/allartist.component';
import { ExpositionComponent } from './exposition/exposition.component';
import { AddAnnonceComponent } from './add-annonce/add-annonce.component';
import { AddExpoComponent } from './add-expo/add-expo.component';
import { HistoireComponent } from './histoire/histoire.component';
import { MesOeuvresComponent } from './mes-oeuvres/mes-oeuvres.component';
import { MesAnnoncesComponent } from './mes-annonces/mes-annonces.component';
import { FollowersComponent } from './followers/followers.component';
import { AbonnementComponent } from './abonnement/abonnement.component';
import { MyformatcurrencyPipe } from '../shared/pipes/myformatcurrency.pipe';
import { CompteArtisteComponent } from './compte-artiste/compte-artiste.component';
import { ArtisteProfilComponent } from './compte-artiste/artiste-profil/artiste-profil.component';
import { AddOeuvreComponent } from './add-oeuvre/add-oeuvre.component';
import { TchatComponent } from '../shared/components/menu/TchatSpace/tchat.component';
import { RightClicMenuTchatComponent } from '../shared/components/menu/TchatSpace/rightClicMenuTchat.component';
import { AddAddressComponent } from '../checkout/address/add-address/add-address.component';


@NgModule({
  declarations: [
    WishlistComponent,
    CartComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    ContactComponent,
    CheckoutComponent,
    AboutUsComponent,
    SearchComponent,
    TypographyComponent,
    OrderSuccessComponent,
    ErrorComponent,
    ComingSoonComponent,
    FaqComponent,
    BlogLeftSidebarComponent,
    BlogRightSidebarComponent,
    BlogNoSidebarComponent,
    BlogDetailsComponent,
    ArtisteComponent,
    AllartistComponent,
    RegisterArtistComponent,
    ExpositionComponent,
    AddAnnonceComponent,
    AddExpoComponent,
    AddOeuvreComponent,
    HistoireComponent,
    MesOeuvresComponent,
    MesAnnoncesComponent,
    FollowersComponent,
    AbonnementComponent,
    CompteArtisteComponent,
    MyformatcurrencyPipe,
    ArtisteProfilComponent,
    AddAddressComponent,
  ],
  imports: [
    CommonModule,
    GalleryModule.forRoot(),
    SharedModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
