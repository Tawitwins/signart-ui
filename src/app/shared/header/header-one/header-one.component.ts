import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {
  
  @Input() class: string;
  //@Input() themeLogo: string = 'assets/images/icon/logo_signart.png'; // Default Logo
  @Input() themeLogo: string = 'assets/images/icon/LogoGif.gif';
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  
  public stick: boolean = false;
  codeCountryList: string[] = [];
  flagUrl: string = environment.flagCountry_url;
  currentLanguage: string = 'fr';

  constructor(
    private router:Router,
    public languageService: LanguageService
    ) { }

  ngOnInit(): void {
    this.codeCountryList = this.languageService.languageCodeList;
  }

  redirect(url){
    this.router.navigate([url]);
  }
  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 300 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }

  changecode(code: string) {
    code == 'us' ? code = 'en' : code = code;
    localStorage.setItem("userLanguage", code);
    this.currentLanguage = code;
    console.log(localStorage.getItem("userLanguage"))
    window.location.reload();
  }
}
