export interface payment {
    id: number,
    amount: number,
    detail: null,
    date: Date,
    refund: boolean,
    paymethod: string,
    expiryDate: null
}

interface product {
    id: number,
    description: string,
    hargaBeli: number,
    hargaJual: number,
    barcode: string,
    returnable: boolean
}

export interface productSales {
    product: product,
    salesTransaction: number,
    amount: number,
    quantity: number
}

export interface productSalesRetur {
    product: product,
    salesTransaction: number,
    amount: number,
    retur: number,
    quantity: number
}

export interface retur {
    id: number,
    sales_id: string,
    description: string,
    date: Date,
    amount: number,
    comment: string | null,
    employee: number,
    cabang: number,
    payment: payment,
    detail: null,
    productSales: productSales[],
    promotion: null,
    refund: boolean
}

export interface GetReturResponResponse {
    results: retur[]
}

export interface ReturRequest{
    id:number,
    diff:number,
    cabang:number
}