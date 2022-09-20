import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, AfterViewInit,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../classes/product";
import { Oeuvre } from '../../../modeles/oeuvre';
import { environment } from '../../../../../environments/environment';
import { OeuvreNumerique } from 'src/app/shared/modeles/imageNumerique';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-cart-modal-oeuvre-numerique',
  templateUrl: './cart-modal-oeuvre-numerique.component.html',
  styleUrls: ['./cart-modal-oeuvre-numerique.component.scss']
})
export class CartModalOeuvreNumeriqueComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() product: Product;
  @Input() oeuvre: Oeuvre;
  @Input() oeuvreNumerique: OeuvreNumerique;
  @Input() currency : any;
  
  @ViewChild("cartModal", { static: false }) CartModal: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public products: any[] = [];
  public oeuvres: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private productService: ProductService,
    public domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


  async openModal(oeuvre) {
    await this.productService.getOeuvres.subscribe(response => this.oeuvres = response);
    this.oeuvres = await this.oeuvres.filter(items => items.id != oeuvre.id);
    const status = await this.productService.addToCart(oeuvre);
    if(status) {
      this.modalOpen = true;
      if (isPlatformBrowser(this.platformId)) { // For SSR 
        this.modalService.open(this.CartModal, { 
          size: 'lg',
          ariaLabelledBy: 'Cart-Modal',
          centered: true,
          windowClass: 'theme-modal cart-modal CartModal'
        }).result.then((result) => {
          `Result ${result}`
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if(this.modalOpen){
      this.modalService.dismissAll();
    }
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

}
