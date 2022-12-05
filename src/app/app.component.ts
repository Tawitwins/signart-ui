import { Component, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map, delay, withLatestFrom } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './../app/shared/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  // Bar de progression
  loaders = this.loader.progress$.pipe(
    delay(1000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1]),
  );
  
  constructor(
    private languageService: LanguageService,
    // @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoadingBarService,
    //  translate: TranslateService
    ) {
    // if (isPlatformBrowser(this.platformId)) {
    //   translate.setDefaultLang('en');
    //   translate.addLangs(['en', 'fr']);
    // }
  }

}
