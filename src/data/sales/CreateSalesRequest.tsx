import { ProductRequest } from "./ProductRequest";
import { PaymentRequest } from "./PaymentRequest";

export interface CreateSalesRequest {
    code : number,
    sales_id : string | undefined,
    amount: number,
    promotion: string | undefined,
	employee: number,
	cabang: number,
    payment : PaymentRequest,
    productSales: ProductRequest[]
}

export interface CreateReturSalesRequest {
    code : number,
    retur_sales_id : string | undefined,
    amount: number,
    promotion: string | undefined,
	employee: number,
	cabang: number,
    payment : PaymentRequest,
    productSales: ProductRequest[]
}