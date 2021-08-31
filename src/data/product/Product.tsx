import { ProductResponse } from "./ProductResponse";

export class Product {
    actual: ProductResponse
    diskonKasir: number

    constructor(productResponse: ProductResponse, diskonKasir: number){
        this.actual = productResponse
        this.diskonKasir = diskonKasir
    }

    calculateDiscount(discountPercent: number){
        if ( this.actual != undefined){
            let hargaJual = Number(this.actual.hargaJual)
            return hargaJual - (hargaJual * (discountPercent / 100))
        } else {
            return -1
        }
    }
}

