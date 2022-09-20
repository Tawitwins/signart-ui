export class ItemPaydunya {
  name?: string;
  description?: string;
  unit_price?: number;
  total_price?: number;
  quantity?:number;
  constructor(name: string,description:string,unit_price:number,total_price:number,quantity:number){
    this.name=name;
    this.description=description;
    this.unit_price=unit_price;
    this.quantity=quantity;
    this.total_price=total_price;
  }
}
