export interface Product{
  id:String
  name:string
  price:number
  promotion:boolean
}
export interface PageProduct{
  products:Product[],
  page:number,
  size:number,
  totalPages:number
}
