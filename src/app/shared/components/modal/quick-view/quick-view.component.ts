import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Product } from "../../../classes/product";
import { ProductService } from '../../../../shared/services/product.service';
import { Oeuvre } from 'src/app/shared/modeles/oeuvre';
import { environment } from 'src/environments/environment';
import { AuthServiceS } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy  {

  @Input() product: Product;
  @Input() oeuvre: Oeuvre;
  @Input() currency: any;  
  @ViewChild("quickView", { static: false }) QuickView: TemplateRef<any>;

  public closeResult: string;
  public ImageSrc: string;
  public counter: number = 1;
  public modalOpen: boolean = false;
  user: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private modalService: NgbModal,
    public productService: ProductService, private authService: AuthServiceS) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modalOpen = true;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.QuickView, { 
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview' 
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  /*openModal() {
    this.modalOpen = true;
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalService.open(this.QuickView, { 
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'Quickview' 
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }*/

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
    }
    return uniqSize
  }

  // Change Variants
  ChangeVariants(color, product) {
    product.variants.map((item) => {
      if (item.color === color) {
        product.images.map((img) => {
          if (img.image_id === item.image_id) {
            this.ImageSrc = img.src
          }
        })
      }
    })
  }

  // Increament
  increment() {
    this.counter++ ;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter-- ;
  }

  // Add to cart
  /*async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if(status)
      this.router.navigate(['/shop/cart']);
  }*/

  async addToCart(oeuvre: any) {
    this.user = this.authService.getUserConnected();
    if(this.user==null){
      Swal.fire({
        //title: 'Are you sure?',
        text: "Vous devez vous connecter pour effectuer cet action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#376809',
        cancelButtonColor: '#601A17',
        confirmButtonText: 'Oui, se connecter!'
      }).then((result) => {
        if (result.value) {
          console.log("useeeeeeeeeeeeerrrrrrrrrrrr",this.user)
          this.router.navigate(['/pages/login']);
        }
      })  
     }else{
      oeuvre.stock = this.counter || 1;
      const status = await this.productService.addToCart(oeuvre);
      //if(status)
       // this.router.navigate(['/shop/cart']);
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
