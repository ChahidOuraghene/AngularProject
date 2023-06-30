import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{
  productId!:String
  product!:Product
  productFormGroup!:FormGroup
  constructor(private route:ActivatedRoute ,public productService:ProductService,private formBuilder :FormBuilder) {
    this.productId=this.route.snapshot.params["id"];
  }
  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next:(product)=>{
        this.product=product
        this.productFormGroup=this.formBuilder.group({
          name:this.formBuilder.control(product.name,[Validators.required,Validators.minLength(4),Validators.maxLength(15)]),
          price:this.formBuilder.control(product.price,[Validators.required,Validators.min(50)]),
          promotion:this.formBuilder.control(product.promotion,Validators.required)
        })

      },error:(err)=>{
        console.log(err)
      }
    })

  }

  handleUpdateProduct() {
  let p=this.productFormGroup.value;
  p.id=this.product.id
    this.productService.updateProduct(p).subscribe({
      next:(data)=>{
        alert("Produit ajouté")
      },error:(err)=>{
        console.log(err)
      }
    })

  }
}
