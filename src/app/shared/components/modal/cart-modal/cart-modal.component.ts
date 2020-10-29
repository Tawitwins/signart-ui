import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, AfterViewInit,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../classes/product";
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() product: Product;
  @Input() oeuvre: Oeuvre;
  @Input() currency : any;
  
  @ViewChild("cartModal", { static: false }) CartModal: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public products: any[] = [];
  public oeuvres: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private productService: ProductService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  /*async openModal(product) {
    await this.productService.getProducts.subscribe(response => this.products = response);
    this.products = await this.products.filter(items => items.category == product.category && items.id != product.id);
    const status = await this.productService.addToCart(product);
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
  }*/

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
