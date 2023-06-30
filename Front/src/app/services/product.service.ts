import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../model/product.model";
import {UUID} from "angular2-uuid";
import {ValidationErrors} from "@angular/forms";
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private products! : Array<Product>
  constructor(
    private http: HttpClient,
  ) {
    this.products=[
      {id:UUID.UUID(),name:"lenovoV1",price:159.99,promotion:false},
      {id:UUID.UUID(),name:"lenovoV2",price:189.99,promotion:false},
      {id:UUID.UUID(),name:"lenovoV3",price:199.99,promotion:true},
      {id:UUID.UUID(),name:"lenovoV4",price:219.99,promotion:true},
      {id:UUID.UUID(),name:"lenovoV5",price:129.99,promotion:false},
      {id:UUID.UUID(),name:"lenovoV6",price:169.99,promotion:false},
      {id:UUID.UUID(),name:"lenovoV7",price:199.99,promotion:true},
      {id:UUID.UUID(),name:"lenovoV8",price:219.99,promotion:true},
      {id:UUID.UUID(),name:"lenovoV9",price:129.99,promotion:false},
      {id:UUID.UUID(),name:"lenovoV10",price:169.99,promotion:false},




    ];
    for (let i=0;i<=30;i++){
      this.products.push({id:UUID.UUID(),name:"Lenovo",price:149.99,promotion:false})
      this.products.push({id:UUID.UUID(),name:"Samsung",price:199.99,promotion:true})
      this.products.push({id:UUID.UUID(),name:"Dell",price:159.99,promotion:false})

    }
    this.products.push()

  }
  public getAllProducts() : Observable <Array<Product>> {
    let rmd= Math.random();
    if (rmd<0.) return throwError(()=>new Error("Internet Connexion Error"));
   else return of(this.products);
  }

  public getPageProducts(page:number,size:number) : Observable <PageProduct> {
      let index=page*size
   let totalPages=~~(this.products.length/size);
   if (this.products.length%size!=0){
      totalPages++
   }
   let pageProducts = this.products.slice(index,index+size);
   return of({page: page, size: size, totalPages: totalPages, products: pageProducts})
  }
  public handlDeleteProduct(index :String) :Observable<boolean>{
   //   this.products.splice(index,1)
    this.products=this.products.filter(p=>p.id!=index);
    return of(true)
  }
  SetPromotion(id: String) : Observable<boolean>{
  let product = this.products.find(p=>p.id==id);
  if (product!=undefined){
    product.promotion=!product.promotion
    return of(true)
  }else return throwError(()=>new Error("Product not found"))


  }
  SearchProducts(keyword:string,page:number,size:number ) :Observable<PageProduct>{
    let result = this.products.filter(p=>p.name.includes(keyword));
    let index=page*size
    let totalPages=~~(result.length/size);
    if (this.products.length%size!=0){
      totalPages++
    }
    let pageProducts = result.slice(index,index+size);
  return of({page: page, size: size, totalPages: totalPages, products: pageProducts})
  }
  public addNewProduct(product:Product):Observable<Product>{
      product.id=UUID.UUID();
      this.products.push(product)
    return of(product)


  }
  public getProduct(id:String):Observable<Product>{
       let product = this.products.find(p=>p.id==id);
       if (product==undefined){
         return   throwError(()=>new Error(" Product not found"))
       }
       return of(product)
  }
  getErrourMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']){
      return fieldName+" is required"
    }else if (error['minlength']) {
      return fieldName + " should have at least " + error['minlength']['requiredLength'] + " Characers"
    }else if (error['min']){
      return fieldName+" should have min value "+error['min']['min']
    }else return "";

  }
  public updateProduct(product:Product):Observable<Product>{
      this.products=this.products.map(p=>p.id==product.id?product:p);
      return of(product)

  }
}
