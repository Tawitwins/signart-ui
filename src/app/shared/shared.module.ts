import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BarRatingModule } from "ngx-bar-rating";
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';

// Header and Footer Components
import { HeaderOneComponent } from './header/header-one/header-one.component';
import { FooterOneComponent } from './footer/footer-one/footer-one.component';

// Components
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProductBoxOneComponent } from './components/product/product-box-one/product-box-one.component';
import { OeuvreNumeriqueBoxOneComponent } from './components/product/oeuvre-numerique-box-one/oeuvre-numerique-box-one.component';
import { ProductBoxTwoComponent } from './components/product/product-box-two/product-box-two.component';
import { ProductBoxThreeComponent } from './components/product/product-box-three/product-box-three.component';
import { ProductBoxFourComponent } from './components/product/product-box-four/product-box-four.component';
import { ProductBoxFiveComponent } from './components/product/product-box-five/product-box-five.component';
import { ProductBoxVerticalComponent } from './components/product/product-box-vertical/product-box-vertical.component';
import { ProductBoxVerticalSliderComponent } from './components/product/product-box-vertical-slider/product-box-vertical-slider.component';

// Modals Components
import { NewsletterComponent } from './components/modal/newsletter/newsletter.component';
import { QuickViewComponent } from './components/modal/quick-view/quick-view.component';
import { QuickViewOeuvreNumeriqueComponent } from './components/modal/quick-view-oeuvre-numerique/quick-view-oeuvre-numerique.component';

import { CartModalComponent } from './components/modal/cart-modal/cart-modal.component';
import { CartModalOeuvreNumeriqueComponent } from './components/modal/cart-modal-oeuvre-numerique/cart-modal-oeuvre-numerique.component';

import { CartVariationComponent } from './components/modal/cart-variation/cart-variation.component';
import { VideoModalComponent } from './components/modal/video-modal/video-modal.component';
import { SizeModalComponent } from './components/modal/size-modal/size-modal.component';
import { AgeVerificationComponent } from './components/modal/age-verification/age-verification.component';

// Skeleton Loader Components
import { SkeletonProductBoxComponent } from './components/skeleton/skeleton-product-box/skeleton-product-box.component';


// Tap To Top
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';

// Pipes
import { DiscountPipe } from './pipes/discount.pipe';
import { FavoriteActions } from '../wishlist/actions/favorite.actions';
import { TchatComponent } from './components/menu/TchatSpace/tchat.component';
import { RightClicMenuTchatComponent } from './components/menu/TchatSpace/rightClicMenuTchat.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    HeaderOneComponent,
    FooterOneComponent,
    MenuComponent,
    SettingsComponent,
    BreadcrumbComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    ProductBoxTwoComponent,
    ProductBoxThreeComponent,
    ProductBoxFourComponent,
    ProductBoxFiveComponent,
    ProductBoxVerticalComponent,
    ProductBoxVerticalSliderComponent,
    NewsletterComponent,
    QuickViewComponent,
    CartModalComponent,
    CartModalOeuvreNumeriqueComponent,
    CartVariationComponent,
    VideoModalComponent,
    SizeModalComponent,
    AgeVerificationComponent,
    SkeletonProductBoxComponent,
    TapToTopComponent,
    DiscountPipe,
    TchatComponent,
    RightClicMenuTchatComponent,
    OeuvreNumeriqueBoxOneComponent,
    QuickViewOeuvreNumeriqueComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule.forRoot({
      // preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
    }),
    NgxSkeletonLoaderModule,
    TranslateModule,
    NgxFileDropModule,
    PickerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxSkeletonLoaderModule,
    TranslateModule,
    HeaderOneComponent,
    FooterOneComponent,
    BreadcrumbComponent,
    CategoriesComponent,
    ProductBoxOneComponent,
    ProductBoxTwoComponent,
    ProductBoxThreeComponent,
    ProductBoxFourComponent,
    ProductBoxFiveComponent,
    ProductBoxVerticalComponent,
    ProductBoxVerticalSliderComponent,
    NewsletterComponent,
    QuickViewComponent,
    CartModalComponent,
    CartModalOeuvreNumeriqueComponent,
    CartVariationComponent,
    VideoModalComponent,
    SizeModalComponent,
    AgeVerificationComponent,
    SkeletonProductBoxComponent,
    TapToTopComponent,
    DiscountPipe,
    PickerModule,
    OeuvreNumeriqueBoxOneComponent,
    QuickViewOeuvreNumeriqueComponent,
    
  ],
  providers: [FavoriteActions]
})
export class SharedModule { }
