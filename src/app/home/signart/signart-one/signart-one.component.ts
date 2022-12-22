import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { Oeuvre } from '../../../shared/modeles/oeuvre';
import { ArticleService } from '../../../shared/services/article.service';
import { environment } from '../../../../environments/environment';
import { SecurityService } from 'src/app/shared/services/security.service';

@Component({
  selector: 'app-signart-one',
  templateUrl: './signart-one.component.html',
  styleUrls: ['./signart-one.component.scss']
})
export class SignartOneComponent implements OnInit {

  public products: Product[] = [];
  public productCollections: any[] = [];
  public oeuvres: Oeuvre[] = [];
  
  constructor(
    public productService: ProductService, 
    private articleService: ArticleService,
    private securityService: SecurityService
    ) {
    this.productService.getProducts.subscribe(response => {
      this.products = response.filter(item => item.type === 'art','sculpture');
      // //console.log(this.products)
      // Get Product Collection
      this.products.filter((item) => {
        item.collection.filter((collection) => {
          const index = this.productCollections.indexOf(collection);
          if (index === -1) this.productCollections.push(collection);
        })
      })
    });

    this.articleService.getAllArticles().subscribe(response => { 
      this.oeuvres = response;
            });
  }

  public ProductSliderConfig: any = ProductSlider;

  public sliders = [{
    title: 'Signart',
    subTitle: 'Tableau 1',
    image: 'assets/images/slider/video.mp4'
  },
    {
    title: 'Signart',
    subTitle: 'Tableau 1',
    image: 'assets/images/slider/slider_1.jpg'
  }, {
    title: 'Tableau By Signart',
    subTitle: 'Peinture',
    image: 'assets/images/slider/slider_2.jpg'
  }]

  /* // Collection banner
  public collections = [{
    image: 'assets/images/collection/fashion/1 2.jpg',
    save: 'Catégorie',
    title: "L'architecture"
  }, {
    image: 'assets/images/collection/fashion/tableau_2.jpg',
    save: 'Catégorie',
    title: 'La peinture'
  }]; */
  // Collection banner
  public collections = [{
    image: 'assets/images/collection/fashion/encreChine.png',
    save: 'Catégorie',
    title: "L'architecture"
  }, {
    image: 'assets/images/collection/fashion/peinture.png',
    save: 'Catégorie',
    title: 'La peinture'
  }];

    // Collection banner
    public eric = [{
      image: 'assets/images/collection/fashion/dessin.png',
      save: 'Catégorie',
      title: 'Le dessin'
    }, {
      image: 'assets/images/collection/fashion/gravure.png',
      save: 'Catégorie',
      title: 'La gravure'
    }, {
      image: 'assets/images/collection/fashion/sculpture.png',
      save: 'Catégorie',
      title: 'La sculpture'
    }];

    // Collection Technique
    public dan = [{
      image: 'assets/images/collection/fashion/acrilic.png',
      save: 'Technique',
      title: 'Acrylique sur toile'
    }, {
      image: 'assets/images/collection/fashion/huile.png',
      save: 'Technique',
      title: 'Huile sur toile'
    }, {
      image: 'assets/images/collection/fashion/installation.png',
      save: 'Technique',
      title: 'installation'
    }];

      // Collection Technique 2
      public dan2 = [{
        image: 'assets/images/collection/fashion/encreChine.png',
        save: 'Technique',
        title: 'Encre de Chine'
      }, {
        image: 'assets/images/collection/fashion/gouach.png',
        save: 'Technique',
        title: 'Gouache'
      }];
  
  // Blog
  public blog = [{
    image:  this.getProductImageUrl(7),
    date: '30 Novembre 2020',
    title: "L'inédit",
    by: 'El Hadj Sy'
  }, {
    image: this.getProductImageUrl(4),
    date: '27 Novembre 2020',
    title: 'Anniversaire : 40 ans de carrière',
    by: 'Kalidou kassé'
  }, {
    image:  this.getProductImageUrl(6),
    date: '25 Décembre 2020',
    title: "Fin d'année Artistique",
    by: 'Omar BA'
  }, {
    image: 'assets/images/blog/blog_signart.jpg',
    date: '01 Janvier 2021',
    title: 'La nouvelle collection',
    by: 'Le pinceau'
  }];
  getProductImageUrl(id: number) {
    return environment.API_ENDPOINT + 'image/artiste/' + id;
  }

  // Logo
  public logo = [{
    image: 'assets/images/logos/1.png',
  }, {
    image: 'assets/images/logos/2.png',
  }, {
    image: 'assets/images/logos/3.png',
  }, {
    image: 'assets/images/logos/4.png',
  }, {
    image: 'assets/images/logos/5.png',
  }, {
    image: 'assets/images/logos/6.png',
  }, {
    image: 'assets/images/logos/7.png',
  }, {
    image: 'assets/images/logos/8.png',
  }];

  ngOnInit(): void {
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    return this.products.filter((item) => {
      if (item.collection.find(i => i === collection)) {
        return item
      }
    })
  }
  
}
