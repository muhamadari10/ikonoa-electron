import { getCabang, getUser } from "../auth/AuthData";
import { ProductInventoryRequest } from "../inventory/ProductInventoryRequest";
import { GetProductInventoryResponse } from "../inventory/ProductInventoryResponse";
import { GetNotaResponResponse } from "../product/NotaRespon";
import { GetReturResponResponse, ReturRequest } from "../product/ReturRespon";
import { saveFirstProduct, 
    getFirstProduct, clearTableProduct, 
    saveNota, clearTableNota ,
    clearTableRetur, saveRetur, getReturSales
} from '../../data/LocalData';
import { getApi } from "../RemoteData";
import { getProductInventoryApi, productApi, getNotaCabangApi, getTransactionApi } from "../Url";

export function getProductCabang(
        desc: string,
        onSuccess: (response: GetProductInventoryResponse) => void, 
        onError: (error: Response) => void
    ){
    getFirstProduct()
    .then((respon:any) => {
        console.log("respon",respon);
        var resultsData = [];
        for(var i=0; i < respon.length; i++) {
          for(let key in respon[i].product) {
            if(key == "barcode" || key == "description"){
                if(respon[i].product[key].toLowerCase().includes(desc)) {
                    console.log("product ",respon[i].product);
                    var abc = resultsData.filter(x => x.id === respon[i].id);
                    if(abc.length < 1){
                        resultsData.push(respon[i]);
                    }
                }
            }
          }
        }
        onSuccess({results:resultsData})
    }).catch(e => {
        console.log("error: " + e.stack || e);
    });
}

export function syncronOfflineProduct(
        desc: string,
        onSuccess: (response: GetProductInventoryResponse) => void, 
        onError: (error: Response) => void
    ){

    let cabang = getCabang()
    let body: ProductInventoryRequest = {
        cabang: cabang.id,
        desc: desc
    }

    let url = `${getProductInventoryApi}?cabang=${body.cabang}&desc=${body.desc}`

    getApi<ProductInventoryRequest, GetProductInventoryResponse>(url)
    .then((val: GetProductInventoryResponse) => {
        
        clearTableProduct();

        if(val.results.length > 0){
            val.results.forEach((e:any) => {
                saveFirstProduct(e)
            });
        }
        
        getFirstProduct()
        .then(respon => {
            onSuccess({results:respon})
        }).catch(e => {
            console.log("error: " + e.stack || e);
        });
    })
    .catch((response: any) => {
        onError(response)
    })
}

export function getProductData(
    desc: string,
    onSuccess: (response: GetProductInventoryResponse) => void, 
    onError: (error: Response) => void
    ){

    let cabang = getCabang()
    let body: ProductInventoryRequest = {
        cabang: cabang.id,
        desc: desc
    }

    let url = `${productApi}`
    url = `${url}?search=${desc}`

    getApi<ProductInventoryRequest, GetProductInventoryResponse>(url)
    .then((val: GetProductInventoryResponse) => {
        onSuccess(val)
    })
    .catch((response: any) => {
        onError(response)
    })
}

interface NotaRequest {
    cabang: number
}

export function getNotaCabang(
    onSuccess: (response: GetNotaResponResponse) => void, 
    onError: (error: Response) => void
    ){

    let cabang = getCabang()
    let body: NotaRequest = {
        cabang: cabang.id
    }
    let url = `${getNotaCabangApi}`
    url = `${url}?cabang=${body.cabang}`

    getApi<NotaRequest, GetNotaResponResponse>(url)
    .then((val: GetNotaResponResponse) => {
        clearTableNota()
        if(val.results.length > 0){
            saveNota(val.results[0])
            .then((respon:any) => {
                console.log("respon",respon);
            })
        }else{
            saveNota({
                cabang_id: body.cabang,
                id: 0,
                notanumber: 1
            })
            .then((respon:any) => {
                console.log("respon",respon);
            })
        }
        onSuccess(val)
    })
    .catch((response: any) => {
        onError(response)
    })
}

export function getRetur(
    onSuccess: (response: GetReturResponResponse) => void, 
    onError: (error: Response) => void
){

    let cabang = getCabang()
    let user = getUser()
    let body: ReturRequest = {
        id : user.id,
        cabang: cabang.id,
        diff: 2,
    }

    let url = `${getTransactionApi}?cabang=${body.cabang}&id=${body.id}&diff=${body.diff}`

    getApi<ReturRequest, GetReturResponResponse>(url)
    .then((val: GetReturResponResponse) => {

        console.log(val)
        clearTableRetur();

        if(val.results.length > 0){
            val.results.forEach((e:any) => {
                console.log("save retur ",e);
                
                saveRetur(e)
            });
        }
        
        // getReturSales()
        // .then(respon => {
        //     // onSuccess({results:respon})
        // }).catch(e => {
        //     console.log("error: " + e.stack || e);
        // });
    })
    .catch((response: any) => {
        onError(response)
    })
}
