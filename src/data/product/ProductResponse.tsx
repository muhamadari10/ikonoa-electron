import { DeptResponse } from "./DeptResponse";
import { MclassResponse } from "./MClassResponse";

export interface ProductResponse {
            id: number,
            sku: number,
            barcode: string,
            description: string,
            hargaBeli: string,
            hargaJual: string,
            hargaJual2: string,
            hargaJual3: string,
            hargaBeliBesar: string,
            hpp: number,
            dept: DeptResponse,
            mclass: MclassResponse,
            returnable: false,
            promotions: null,
            mainCategory: null,
            subCategoryOne: null,
            subCategoryTwo: null
        }