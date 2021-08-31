interface notaCabang {
    id:number,
    notanumber:number,
    cabang_id:number
}

export interface GetNotaResponResponse {
    results: notaCabang[]
}