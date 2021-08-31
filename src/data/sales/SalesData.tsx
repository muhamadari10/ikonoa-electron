import { postApi } from "../RemoteData";
import { PaymentRequest } from "./PaymentRequest";
import { ProductRequest } from "./ProductRequest";
import { CreateSalesRequest, CreateReturSalesRequest } from "./CreateSalesRequest";
import { createSallesOffline, getSalles, removeRowById, updateStock, getFirstProduct, getNota, 
    getReturLocal, saveReturAll, updateRetur, clearTableReturLocal, 
    getReturAll, removeReturById
} from '../../data/LocalData';
import { createsalesApi, createSalesReturApi } from "../Url";
import { getCabang, getUser } from "../auth/AuthData";
import { User } from "../auth/User";
import { Cabang } from "../auth/Cabang";

export function doSales(payment: PaymentRequest, products: ProductRequest[], onSuccess: ()=> void, onError: () => void){
    const cabang: Cabang = getCabang()
    const employee: User = getUser()

    if (cabang == undefined || employee == undefined){
        onError()
        return
    }


    getNota()
    .then((respon:any) => {
        let dateToday : string;
        var d = new Date();

        var years = d.getFullYear().toString();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var monthPrint = month >= 10 ? month.toString() : "0"+month.toString()
        var dayPrint = day >= 10 ? day.toString() : "0"+day.toString()

        
          dateToday = dayPrint+monthPrint+years.substring(2)
          
        var code = cabang.code
        var notaC = respon[0].notanumber - 1
        var sales_id = code+notaC.toString()+dateToday

        let createSalesRequest: CreateSalesRequest = {
            sales_id : sales_id,
            code : respon[0].notanumber,
            amount: 200,
            employee: employee.id,
            promotion: undefined,
            cabang: cabang.id,
            payment: payment,
            productSales: products
        }
        
        // create salles offline
        console.log("createSalesRequest ",createSalesRequest);

        createSallesOffline(createSalesRequest)
        .then(respon => {
            onSuccess()
            //penyesuaian data
        }).catch(e => {
            console.log("error: " + e.stack || e);
        });
    })


    // postApi<CreateSalesRequest, CreateSalesRequest>(createsalesApi, createSalesRequest)
    // .then((response) => {
    //     onSuccess()
    // }).catch( (error) => {
    //     console.log('error sale' + JSON.stringify(error))
    //     // onError()
    // })
}

export function returSales(onSuccess: ()=> void, onError: () => void){
    getReturLocal()
    .then((respon:any) => {
        respon.forEach((item:any, index:number) => {
            let refund = item
                refund['refund'] = true
                refund['payment']['refund'] = true
                saveReturAll(refund)
                .then((r:any)=>{
                    updateRetur(item.id, {payment:refund['payment']})
                    updateRetur(item.id, {refund:refund['refund']})
                }).catch(e => {
                    console.log("error: " + e.stack || e);
                });
        });
        clearTableReturLocal()
        onSuccess()
    }).catch(e => {
        console.log("error: " + e.stack || e);
    });
}

export function pushServer(code : number, sales_id : string, payment: PaymentRequest, products: ProductRequest[], onSuccess: ()=> void, onError: () => void){
    const cabang: Cabang = getCabang()
    const employee: User = getUser()

    if (cabang == undefined || employee == undefined){
        onError()
        return
    }

    let createSalesRequest: CreateSalesRequest = {
        sales_id : sales_id,
        code : code,
        amount: 200,
        employee: employee.id,
        promotion: undefined,
        cabang: cabang.id,
        payment: payment,
        productSales: products
    }

    postApi<CreateSalesRequest, CreateSalesRequest>(createsalesApi, createSalesRequest)
    .then((response) => {
        onSuccess()
    }).catch( (error) => {
        console.log('error sale' + JSON.stringify(error))
        // onError()
    })
}

export function pushDataServer(){
    getSalles()
    .then((respon:any) => {
        let data = []
        for(let i=0; i < respon.length; i++) {
            pushServer(
                respon[i].code, 
                respon[i].sales_id, 
                respon[i].payment, 
                respon[i].productSales, 
                () => {
                    let productSales = respon[i].productSales
                    let actionDelete = productSales.length
                    getFirstProduct()
                    .then((result:any) => {
                        for(var ix=0; ix < result.length; ix++) {
                            for(var y=0; y < productSales.length; y++) {
                                if(productSales[y].product == result[ix].product.id){
                                    let stock : number = result[ix].stock - productSales[y].quantity
                                    // console.log("ketemu ", stock);
                                    // console.log("sukses ",productSales[y]);
                                    // console.log("result ",result[ix]);

                                    updateStock(result[ix].id, stock)
                                    .then(()=>{
                                        console.log("update ",stock);
                                    })
                                    actionDelete--
                                    console.log("actionDelete ",productSales[y].product, actionDelete);
                                    if(actionDelete === 0){
                                        removeRowById(respon[i].id)
                                        .then(()=>{
                                            console.log("test abc delete");
                                        })
                                    }
                                }
                            }
                        }
                    }).catch(e => {
                        console.log("error: " + e.stack || e);
                    });
                    console.log("result action ",actionDelete);
                }, 
                () => {
                    alert('error sales')
                }
            )
        }
    }).catch(e => {
        console.log("error: " + e.stack || e);
    });
}


/** Retur */
export function pushServerRetur(code : number, retur_sales_id : string, payment: PaymentRequest, products: ProductRequest[], onSuccess: ()=> void, onError: () => void){
    const cabang: Cabang = getCabang()
    const employee: User = getUser()

    if (cabang == undefined || employee == undefined){
        onError()
        return
    }

    let createSalesReturRequest: CreateReturSalesRequest = {
        retur_sales_id : retur_sales_id,
        code : code,
        amount: 200,
        employee: employee.id,
        promotion: undefined,
        cabang: cabang.id,
        payment: payment,
        productSales: products
    }

    postApi<CreateReturSalesRequest, CreateReturSalesRequest>(createSalesReturApi, createSalesReturRequest)
    .then((response) => {
        onSuccess()
    }).catch( (error) => {
        console.log('error sale' + JSON.stringify(error))
        // onError()
    })
}

function productSalles(item:any){
    let ps : any = []
    item.forEach((i:any) => {
        ps.push({
            product: i.product.id,
            amount: i.amount,
            quantity: i.quantity
        })
    });
    return ps
}

export function pushDataServerRetur(){
    getReturAll()
    .then((respon:any) => {
        console.log("respon ",respon);
        
        let data = []
        for(let i=0; i < respon.length; i++) {
            Promise.all([
                productSalles(respon[i].productSales)
            ]).then((items : any) =>{
                pushServerRetur(
                    respon[i].code, 
                    respon[i].sales_id, 
                    respon[i].payment, 
                    items[0], 
                    () => {
                        removeReturById(respon[i].id)
                    }, 
                    () => {
                        alert('error sales')
                    }
                )
            })
            
        }
    }).catch(e => {
        console.log("error: " + e.stack || e);
    });
}