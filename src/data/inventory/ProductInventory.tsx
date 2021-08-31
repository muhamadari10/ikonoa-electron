import { ProductResponse } from "../product/ProductResponse";

export interface Productinventory {
    inventory: number
    product: ProductResponse
    stock: number
    reminderStockAt: number
}