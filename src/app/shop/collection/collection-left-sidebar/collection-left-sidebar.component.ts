import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import { Options } from 'ng5-slider';
import { OeuvreService } from '../../../shared/services/oeuvre.service';
import { Oeuvre } from '../../../shared/modeles/oeuvre';
import { ArticleService } from '../../../shared/services/article.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {
  
  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public oeuvres: Oeuvre[] = [];
  public oeuvresSave: Oeuvre[] = [];
  public brands: any[] = [];
  public artist: any [] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public maxValue: number = 0;
  public minPrice: number = 0;
  public maxPrice: number = 1000000;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  public collapse: boolean = true;
  public techniques: any;
  private _searchTerm: string;
  public collapseCategorie: boolean = true;
  public options: Options = {
    floor: 0,
    ceil: 5000000 //a modifier: mettre la valeur de l'oeuvre le plus chére
  };

  pageSize = 12;
  pag=1;
  pg=1;
  //size:number;
  pageSizeListe = 2;


  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    //console.log(value)
    this.oeuvres = this.filtrerImageName(value);
  }

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService, 
    private articleService: ArticleService, private expoService: OeuvreService) {   
      // Get Query params..
      this.expoService.getTechnique().subscribe(response => {
        this.techniques = response
        //console.log("tech", this.techniques)
      });
      this.articleService.getAllArticles().subscribe(response => { 
        this.oeuvres = response;
        
        this.oeuvres = this.oeuvres.filter(oeuvre => oeuvre.paid == false)
        this.oeuvresSave = this.oeuvres;
        ////console.log("maxi ",this.maxPriceValue(this.oeuvres));
        this.maxValue = this.maxPriceValue(this.oeuvres)
        this.options = {floor: 0, ceil: this.maxValue}
        ////console.log("ciel ",this.options);
              });
      
              
      this.route.queryParams.subscribe(params => {

        this.brands = params.brand ? params.brand.split(",") : [];
        this.artist= params.artidt ? params.artist.split(","): [];
        this.colors = params.color ? params.color.split(",") : [];
        this.size  = params.size ? params.size.split(",")  : [];
        this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
        this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
        this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array
        
        this.category = params.category ? params.category : null;
        this.sortBy = params.sortBy ? params.sortBy : 'ascending';
        this.pageNo = params.page ? params.page : this.pageNo;

       
        // Get Filtered Products..
        /*this.productService.filterProducts(this.tags).subscribe(response => {         
          // Sorting Filter
          this.products = this.productService.sortProducts(response, this.sortBy);
          // Category Filter
          if(params.category)
            this.products = this.products.filter(item => item.type == this.category);
          // Price Filter
          this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice) 
          
          // Paginate Products
          //this.paginate = this.productService.getPager(this.oeuvres.length, +this.pageNo);     // get paginate object from service
         // this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
           // get current page of items
        });*/

        this.productService.filterOeuvre(this.tags).subscribe(response => {         
          
          this.oeuvres = this.productService.sortOeuvres(this.oeuvres, this.sortBy);
          // Category Filter
         /* if(params.category)
            this.oeuvres = this.oeuvres.filter(item => item.Technique == this.category);*/
          // Price Filter
          this.oeuvres = this.oeuvres.filter(item => item.prix >= this.minPrice && item.prix <= this.maxPrice) 
          //this.paginate = this.productService.getPager(this.oeuvres.length, +this.pageNo); 
         // this.oeuvres = this.oeuvres.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
          //console.log("paginationnnnn", this.paginate)
        });

     


      })

    

      


  }

  ngOnInit(): void {
    if(this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
  }


  filtrerImageName(searchString: string){
    ////console.log("test",this.imageRes)
    return this.oeuvresSave.filter(image =>
      image.nom.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }
  

  // Append filter value to Url
  updateFilter(tags: any) {
    tags.page = null; // Reset Pagination
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  updateFilterPrice() {
    this.oeuvres = this.oeuvresSave;
    this.oeuvres = this.oeuvres.filter(item => item.prix >= this.minPrice && item.prix <= this.maxPrice) 
    //console.log("min price ",this.minPrice);
    //console.log("max price ",this.maxPrice);
    
  }

  updateFilterCategorie(idTechnique: number) {
    this.oeuvres = this.oeuvresSave;
    this.oeuvres = this.oeuvres.filter(item => item.idTechnique == idTechnique) 
    //console.log("technique ",idTechnique);
    
    
  }

  resetFilterCategorie() {
    this.oeuvres = this.oeuvresSave;
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null},
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Remove Tag
  removeTag(tag) {
  
    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag );

    let params = { 
      brand: this.brands.length ? this.brands.join(",") : null, 
      color: this.colors.length ? this.colors.join(",") : null, 
      size: this.size.length ? this.size.join(",") : null
    }

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    //console.log("number page", page)
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false,  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  getOeuvreImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/oeuvre/' + id;
  }

  maxPriceValue(oeuvres: Oeuvre[]): number{
    let min = 0;
    for (let i = 0; i < oeuvres.length; i++) {
      if(this.maxValue < oeuvres[i].prix){
        this.maxValue = oeuvres[i].prix;
      }  
    }
    return this.maxValue;
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
    const category = [...new Set(this.oeuvresSave.map(oeuvre => oeuvre.idTechnique))]
    return category
  }

}
