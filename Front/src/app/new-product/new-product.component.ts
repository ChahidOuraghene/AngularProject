import {Component, OnInit} from '@angular/core';
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {formatNumber} from "@angular/common";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit{
  public productFormGroup!:FormGroup;
  constructor(private formBuilder:FormBuilder ,public productService:ProductService) {
  }

  ngOnInit(): void {
    this.productFormGroup=this.formBuilder.group({
      name:this.formBuilder.control("",[Validators.required,Validators.minLength(4),Validators.maxLength(15)]),
      price:this.formBuilder.control(null,[Validators.required,Validators.min(50)]),
      promotion:this.formBuilder.control(false,Validators.required)
    })
  }

  handleAddProduct() {
    let product=this.productFormGroup.value
    this.productService.addNewProduct(product).subscribe({
      next:(data)=> {
        alert("Produit Ajouté ")
        //this.productFormGroup.reset()

      },error:err => {
        console.log(err)

      }
    })

    }


}
