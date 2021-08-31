// import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { db, Product, ProductOffline, SallesOffline, NotaCabangOffline, ReturOffline } from '../data/AppDatabase';
import { payment } from './product/ReturRespon'

export function syncProducts(networkCall: (product: Product) => Promise<any>) {
  return new Promise<void>(
    async function (resolve, reject) {

      db.products.limit(10).toArray((products) => {

        let promises: Promise<Product>[] = []
        let error = false

        products.forEach(product => {
          let promise = new Promise<Product>(
            async function (resolve1, reject1) {
              try {
                await networkCall(product)
                await db.products.delete(product.id)
              } catch( err ){
                error = true
              }
              resolve1(product)
            }
          )

          promises.push(promise)
        })

        Promise.allSettled(promises)
          .then((results) => {
            console.log(results)
            if (error) {
              alert("Beberapa data gagal dikirim, coba lagi lain waktu")
            } else {
              alert("Berhasil sync semua data")
            }
            resolve()
          }
          );
      })
    }
  )
}

export function clearProducts() {
  return new Promise<void>(
    async function (resolve, reject) {
      await db.products.clear()
      resolve()
    }
  )
}

export function saveProduct(item: any) {
  return new Promise<Product>(
    async function (resolve, reject) {
      
      let product = new Product(item)
      console.log("saveProduct",product);
      product.id = await db.products.add(product)
      resolve(product)
    }
  )
}

export function createSallesOffline(item: any) {
  return new Promise<SallesOffline>(
    async function (resolve, reject) { 
      console.log("item ",item);
      
      let sallesesOffline = new SallesOffline(item)
      sallesesOffline = await db.sallesesOffline.add(item)
      .then(()=>{
        db.notaCabangOfflines.orderBy('id').last().then((x:any)=>{
          db.notaCabangOfflines.update(x.id, {notanumber: x.notanumber + 1})
          
          console.log("test", x);
        });
        
        return db.sallesesOffline.orderBy('id').last();
      });

      resolve(sallesesOffline)

    }
  )
}

interface nota {
  id: number,
  notanumber: number,
  cabang: number
}

export function saveNota(item:any){
  return new Promise<NotaCabangOffline>(
    async function (resolve, reject) { 
      let notaOffline:any = new NotaCabangOffline(item)
      notaOffline = await db.notaCabangOfflines.add(item)
      .then(()=>{
        return db.notaCabangOfflines.orderBy('id').last();
      });

      resolve(notaOffline)

    }
  )
}

export function clearTableNota() {
  return new Promise(
    async function (resolve, reject) { 
      const data = await db.notaCabangOfflines.clear();
      resolve(data)
    })
}

export function getReturSales() {
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      const data:any = db.returOfflines.orderBy('id').toArray();
      resolve(data)
    })
}

export function saveRetur(item:any){
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      item['description'] = item.sales_id
      let returOffline:any = new ReturOffline(item)
      returOffline = await db.returOfflines.add(item)
      .then(()=>{
        return db.returOfflines.orderBy('id').last();
      });

      resolve(returOffline)

    }
  )
}

export function saveLocalRetur(item:any){
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      let returRowOffline:any = new ReturOffline(item)
      returRowOffline = await db.returRowOfflines.clear().then(()=>{
        return db.returRowOfflines.add(item)
        .then(()=>{
          return db.returRowOfflines.orderBy('id').last();
        });
      })    
      resolve(returRowOffline)
    }
  )
}

export function saveReturAll(item:any){
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      let returRowOffline:any = new ReturOffline(item)
      returRowOffline =  await db.dataReturOfflines.add(item)
      .then(()=>{
        return db.dataReturOfflines.orderBy('id').last();
      });
      resolve(returRowOffline)
    }
  )
}

export function getReturAll(){
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      const data:any = db.dataReturOfflines.orderBy('id').toArray();
      resolve(data)
    })
}

export function getReturLocal() {
  return new Promise<ReturOffline>(
    async function (resolve, reject) { 
      const data:any = db.returRowOfflines.orderBy('id').toArray();
      resolve(data)
    })
}

export function clearTableRetur() {
  return new Promise(
  async function (resolve, reject) { 
    const data = await db.returOfflines.clear();
    resolve(data)
  })
}

export function clearTableReturLocal() {
  return new Promise(
  async function (resolve, reject) { 
    const data = await db.returRowOfflines.clear();
    resolve(data)
  })
}

export function updateRetur(id:number, update:any) {
  return new Promise(
    async function (resolve, reject) { 
      const data = await db.returOfflines.update(id, update);
      resolve(data)
    })
}

export function getNota() {
  return new Promise<NotaCabangOffline>(
    async function (resolve, reject) { 
      const data = db.notaCabangOfflines.orderBy('id').toArray();
      resolve(data)
    })
}

export function updateNota(id:number, change:number) {
  return new Promise(
    async function (resolve, reject) { 
      console.log(id, change);
      
      const data = await db.notaCabangOfflines.update(id, {notanumber: change});
      resolve(data)
    })
}

export function saveFirstProduct(item: any) {
  return new Promise<ProductOffline>(
    async function (resolve, reject) { 
       
      let productsOffline = new ProductOffline(item)
      console.log("saveFirstProduct",productsOffline); 
      productsOffline = await db.productsOffline.add(item)
      .then(()=>{
        return db.productsOffline.orderBy('id').last();
      });

      var result = "tes";

      resolve(productsOffline)

    }
  )
}

export function getFirstProduct() {
  return new Promise<ProductOffline>(
    async function (resolve, reject) { 
      const data = db.productsOffline.orderBy('id').toArray();
      resolve(data)
    })
}

export function getSalles() {
  return new Promise(
    async function (resolve, reject) { 
      const data = db.sallesesOffline.orderBy('id').toArray();
      resolve(data)
    })
}

export function removeRowById(id:number) {
  return new Promise(
    async function (resolve, reject) { 
      const data = await db.sallesesOffline.delete(id);
      resolve(data)
    })
}

export function removeReturById(id:number) {
  return new Promise(
    async function (resolve, reject) { 
      const data = await db.dataReturOfflines.delete(id);
      resolve(data)
    })
}

export function updateStock(id:number, change:number) {
  return new Promise(
    async function (resolve, reject) { 
      console.log(id, change);
      
      const data = await db.productsOffline.update(id, {stock: change});
      resolve(data)
    })
}

export function clearTableProduct() {
  return new Promise(
    async function (resolve, reject) { 
      const data = await db.productsOffline.clear();
      resolve(data)
    })
}

export function printProductsLocal(){
  return new Promise<Product[]>(
    async function (resolve, reject) {
      const all = await db.products.toArray()
      resolve(all)
    }
  )
}
