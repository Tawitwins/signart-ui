import { NgModule }      from '@angular/core';
import { OeuvreArtistePipePipe } from './oeuvre-artiste-pipe.pipe';


@NgModule({
    imports:        [],
    declarations:   [],
    exports:        [],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule,
         providers: [],
     };
  }
} 