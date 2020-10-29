export class ImageIco{
    filename: String;
    filetype: String;
    value: String;
    constructor(){}
}
export class Menu {
    
    children: any[];
    image: ImageIco;
    classe:string;
    id?:number;
    path: string;
    title: string;
    idParent?:number;
  
   
}