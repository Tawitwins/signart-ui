import { Component, OnInit } from '@angular/core';
import { Commande } from '../../shared/modeles/commande';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {
  order: Commande;

  constructor() { 
    this.order =<Commande>JSON.parse(localStorage.getItem('order'));
    console.log(this.order);
  }

  ngOnInit(): void {
  }

}
