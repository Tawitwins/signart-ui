import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { Oeuvre } from '../../modeles/oeuvre';
import { Technique } from '../../modeles/technique';
import { OeuvreService } from '../../services/oeuvre.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  //public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  public techniques: any;
  public collapse: boolean = true;

  constructor(public productService: ProductService,  private expoService: OeuvreService) { 
    //this.productService.getProducts.subscribe(product => this.products = product);
    this.productService.getOeuvres.subscribe(oeuvre => this.oeuvres = oeuvre);
    this.expoService.getTechnique().subscribe(response => {
      this.techniques = response
      //console.log("tech", this.techniques)
    });
   
  }

  ngOnInit(): void {
  }

  getArtisteName(idTechnique: number): string{
    for (let i = 0; i < this.techniques.length; i++) {
      if(this.techniques[i].id == idTechnique){
        return this.techniques[i].libelle
      }
      
    }
  }


 /* get filterbyCategory() {
    const category = [...new Set(this.products.map(product => product.type))]
    return category
  }*/

  get filterbyCategory() {
    const category = [...new Set(this.oeuvres.map(oeuvre => oeuvre.idTechnique))]
    return category
  }

}
