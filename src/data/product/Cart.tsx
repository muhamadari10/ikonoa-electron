import { ProductRequest } from "../sales/ProductRequest";
import { CartProd } from "./CartProd";
import { Product } from "./Product";
import { Promo } from "./Promotion";

export class Cart {

  discount: Promo | undefined;

  hasProduct() {
    return this.getTotalProductCount() > 0
  }

  products: Map<String, CartProd>;

  constructor(products: Map<String, CartProd>) {
    this.products = products;
  }

  clearProduct(product: Product) {
    this.products.delete(product.actual.barcode)
  }

  updateDiscount(discount: Promo, product: Product) {
    let productExist = this.products.get(product.actual.barcode)
    if (productExist) {
      productExist.updateDiscount(discount)
      this.products.set(product.actual.barcode, productExist)
    }
  }

  addProduct(product: Product) {
    let cartProd = this.getCartProd(product)
    if (!cartProd) {
      cartProd = new CartProd(product, 0)
    }
    cartProd.count++
    this.products.set(product.actual.barcode, cartProd)
  }

  removeProduct(product: Product) {
    let cartProd = this.getCartProd(product)
    if (cartProd.count > 0) {
      cartProd.count -= 1
      this.products.set(product.actual.barcode, cartProd)
    } else {
      this.clearProduct(product)
    }
  }

  getSubtotal() {
    let harga = 0
    this.products.forEach((cartProd: CartProd) => {
      harga = +harga + (+cartProd.getPrice() * cartProd.count)
    })
    return harga
  }

  getDiscountPrice() {
    let diskonPrice = 0
    this.products.forEach((cartProd: CartProd) => {
      diskonPrice = +diskonPrice + ( ( +cartProd.getPriceAfterDiscount()) * cartProd.count )
    })
    return diskonPrice
  }

  getSubtotalWithDiscount() {
    return this.getSubtotal() - this.getDiscountPrice()
  }

  private getCartProd(product: Product) {    
    let productExist = this.products.get(product.actual.barcode)
    if (!productExist) {
      productExist = new CartProd(product, 0)
    }
    return productExist;
  }

  getTotalProductCount(): number {
    let count = 0
    this.products.forEach((cartProd: CartProd) => {
      count = +count + cartProd.count
    })
    return count
  }

  getProductCount(product: Product) {
    return this.getCartProd(product).count
  }

  getProductList() {
    let productList: Product[] = []
    this.products.forEach((cartProd: CartProd) => {
      if (cartProd.product) {
        productList.push(cartProd.product)
      }
    })
    return productList
  }

  getCartProdList() {
    let productList: CartProd[] = []
    this.products.forEach((cartProd: CartProd) => {
      if (cartProd.product) {
        productList.push(cartProd)
      }
    })
    return productList
  }

  getProductRequestList(): ProductRequest[] {
    let products: ProductRequest[] = []
    
    this.products.forEach((cartProd: CartProd) => {
      let product: ProductRequest = {
        product: cartProd.product.actual.id,
        amount: cartProd.getPayAmount(),
        quantity: cartProd.count  
      }

      products.push(
          product
      )
    })

    return products
  }

}
