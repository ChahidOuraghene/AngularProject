import {Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
 products!:Array<Product> ;
 errorMessage! : String
  searchFormGroup!:FormGroup
  currentPage:number=0;
 pageSize:number=5
  totalPages:number=0
  currentAction:String="all"

constructor(private productService: ProductService,private fb :FormBuilder ,
            public authService:AuthenticationService,
            public router:Router
) {}


  ngOnInit(): void {
   this.searchFormGroup=this.fb.group({
     Keyword :this.fb.control(null)
   });
   this.handleGetPageProducts()
  }

  handleGetPageProducts(){
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.products=data.products;
        this.totalPages=data.totalPages
      },error:(err)=>{
        this.errorMessage=err


      }
    });



  }
  handleGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next:(data)=>{
        this.products=data;
      },error:(err)=>{
        this.errorMessage=err


      }
    });

  }

  handlDeleteProduct(p: Product) {
    let conf=confirm("are you sure you want to Delete Product "+ p.id)
    if (conf==false) return;
    this.productService.handlDeleteProduct(p.id).subscribe({
      next:(data:boolean)=>{
        let index =this.products.indexOf(p)
        this.products.splice(index,1)
      }
    })

  }

  handleSetPromotion(p: Product) {
   let promo=p.promotion;
   this.productService.SetPromotion(p.id).subscribe({
     next:(data:boolean)=>{
       p.promotion=!promo;


     },
     error:err => {
       this.errorMessage=err;
     }
   })
  }

  handleSearchProducts(current:number) {
   this.currentAction="search";
    this.currentPage=current
    let keyword = this.searchFormGroup.value.Keyword;
    this.productService.SearchProducts(keyword,this.currentPage,this.pageSize).subscribe({
      next: (data) => {

        this.products = data.products;
        this.totalPages=data.totalPages
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  gotopage(i: number) {
   this.currentPage=i
    if (this.currentAction==='all'){
      //this.handleGetPageProducts()

    }else{this.handleSearchProducts(i)}

  }

  handleNewProduct() {
   this.router.navigateByUrl("/admin/newProduct")
  }

  handleEditProduct(p: Product) {
   this.router.navigateByUrl("/admin/editProduct/"+p.id);

  }
}
