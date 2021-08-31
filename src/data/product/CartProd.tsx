import { Product } from "./Product";
import { Promo, PromoEnum } from "./Promotion";

export class CartProd {
  listNum: number;
  barcode: number;
  diskon: number;
  discount: Promo | undefined;
  product: Product;
  count: number;
  discountText: string;

  constructor(product: Product,
    count: number) {
    this.product = product
    this.count = count
    this.barcode = 0;
    this.diskon = 0;
    this.discountText = "";
    this.listNum = 0;
  }

  getPayAmount(): number {
    return Number(this.product.actual.hargaJual) * +this.count
  }

  getPriceAfterDiscount(): number {
    const hargaJual = Number(this.product.actual.hargaJual)
    if (this.discount){
      if (this.discount.type == PromoEnum.PERCENTAGE){
        return ( hargaJual * (this.discount.value / 100) )
      } else {
        return this.discount.value
      }
    } else {
      return 0 
    }
  }

  getPrice(): number {
    return Number(this.product.actual.hargaJual)
  }

  updateDiscount(discount: Promo) {
    this.discount = discount
    this.discountText = `${Number(this.product.actual.hargaJual) - this.getPriceAfterDiscount()}`
  }
}
