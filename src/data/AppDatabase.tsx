import Dexie from 'dexie';
import { productSales, payment } from './Product/ReturRespon'

export class AppDatabase extends Dexie {

    products: Dexie.Table<Product, number>;
    productsOffline: Dexie.Table<ProductOffline, number>;
    sallesesOffline: Dexie.Table<SallesOffline, number>;
    notaCabangOfflines: Dexie.Table<NotaCabangOffline, number>;
    returOfflines: Dexie.Table<ReturOffline, number>;
    returRowOfflines: Dexie.Table<ReturOffline, number>;
    dataReturOfflines : Dexie.Table<ReturOffline, number>;

    constructor() {

        super("FashionStoreDatabase");

        var db = this;

        //
        // Define tables and indexes
        //
        db.version(1).stores({
            products: '++id, description',
            productsOffline: '++id, description',
            sallesesOffline: '++id, description',
            notaCabangOfflines: '++id, description',
            returOfflines: '++id, description',
            returRowOfflines: '++id, description',
            dataReturOfflines: '++id, description',
        });

        // Let's physically map Contact class to contacts table.
        // This will make it possible to call loadEmailsAndPhones()
        // directly on retrieved database objects.
        db.products.mapToClass(Product);
        db.productsOffline.mapToClass(ProductOffline);
        db.sallesesOffline.mapToClass(SallesOffline);
        db.notaCabangOfflines.mapToClass(SallesOffline);
        db.returOfflines.mapToClass(ReturOffline);
        db.returRowOfflines.mapToClass(ReturOffline);
    }
}

export class Product {
  id?: number;
  barcode: number;
  diskon: number;
  description: string;
  harga?: number;

  constructor(description: string, id?:number, harga?: number){
    this.description = description;
    this.barcode = 0;
    this.diskon = 0;
    if (harga) this.harga = harga;
    if (id) this.id = id;
  }
}

export class ProductOffline {
  id?: number;
  inventory?: number;
  product: any;
  reminderStockAt: number;
  stock?: number;

  constructor(id?:number, inventory?: number, product?: any, reminderStockAt?: any, stock?: number){
    if (inventory) this.inventory = inventory;
    this.product = product;
    this.reminderStockAt = reminderStockAt;
    if (stock) this.stock = stock;
    if (id) this.id = id;
  }
}

export class SallesOffline {
  id?: number;
  amount: number;
  cabang: number;
  employee: number;
  payment: any;
  productSales: any;
  promotion: any

  constructor(id?:number, amount?: number, cabang?: number, employee?: number, payment?: any, productSales?: any, promotion?: any,
    ){
    if (amount) this.amount = amount;
    if (cabang) this.cabang = cabang;
    if (employee) this.employee = employee;
    this.payment = payment;
    this.productSales = productSales;
    this.promotion = promotion
    if (id) this.id = id;
  }
}


export class NotaCabangOffline {
  id?: number;
  notanumber?: number;
  cabang_id?: number;

  constructor(
      id?: number,
      notanumber?: number,
      cabang_id?: number
    ){
    if (id) this.id = id;
    if (notanumber) this.notanumber = notanumber;
    if (cabang_id) this.cabang_id = cabang_id;
  }
}

export class ReturOffline{
  id?: number;
  sales_id?: string;
  description?: string;
  date?: Date;
  amount?: number;
  comment?: string | null;
  employee?: number;
  cabang?: number;
  payment?: payment;
  detail?: null;
  productSales?: productSales[];
  promotion?: null;
  refund?: boolean;
  constructor(
    id?: number,
    sales_id?: string,
    date?: Date,
    amount?: number,
    comment?: string | null,
    employee?: number,
    cabang?: number,
    payment?: payment,
    detail?: null,
    productSales?: productSales[],
    promotion?: null,
    refund?: boolean,
  ){
    if(id) this.id = id;
    if(sales_id) this.sales_id = sales_id;
    if(date) this.date = date;
    if(amount) this.amount = amount;
    if(comment) this.comment = comment;
    if(employee) this.employee = employee;
    if(cabang) this.cabang = cabang;
    if(payment) this.payment = payment;
    if(detail) this.detail = detail;
    if(productSales) this.productSales = productSales;
    if(promotion) this.promotion = promotion;
    if(refund) this.refund = refund;
  }
}

export var db = new AppDatabase();

