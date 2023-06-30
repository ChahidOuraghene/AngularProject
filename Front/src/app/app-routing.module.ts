import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Ajout de l'importation

import { ProductsComponent } from './products/products.component';
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthentificationGuard} from "./guards/authentification.guard";
import {NewProductComponent} from "./new-product/new-product.component";
import {EditProductComponent} from "./edit-product/edit-product.component";
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminTemplateComponent,canActivate:[AuthentificationGuard],
    children:[
      { path: 'products', component: ProductsComponent },
      { path: 'newProduct', component: NewProductComponent },
      { path: 'editProduct/:id', component: EditProductComponent },
    ] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule, // Ajout de l'importation
    HttpClientModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
