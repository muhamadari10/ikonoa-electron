import React, { useEffect, useState } from 'react';
import { Button, Card, Column, Lookup, TableWithBrowserPagination, Modal } from 'react-rainbow-components';
import { RupiahTextView } from '../kasir/RupiahTextView';
import { Cart } from '../../data/product/Cart';
import { ProductActionView } from '../kasir/ProductActionView';
import { retur, productSalesRetur, productSales } from "../../data/product/ReturRespon";
import { getReturSales, saveLocalRetur } from '../../data/LocalData';
import { GetProductInventoryResponse } from '../../data/inventory/GetProductInventoryResponse';
import { getProductCabang } from '../../data/product/ProductData';
import { Product } from '../../data/product/Product';


export const ReturnDaftarView: React.FC<any> = (props: any) => {

    const { cart, setCart, onBayar } = props;

    const [isLoading, setIsLoading] = useState(false);

    const initOptions: any[] = []
    const initTable: productSalesRetur[] = [];
    const initValidate : boolean = false
    const initRetur : retur = {
            id: 0,
            sales_id: "",
            description: "",
            date: new Date,
            amount: 0,
            comment: null,
            employee: 0,
            cabang: 0,
            payment: {
                id: 0,
                amount: 0,
                detail: null,
                date: new Date,
                refund: false,
                paymethod: "",
                expiryDate: null
            },
            detail: null,
            productSales: [],
            promotion: null,
            refund: false
        };
    const [data, setData] = useState(initOptions);
    const [dataRetur, setDataRetur] = useState(initRetur)
    const [dataTable, setDataTable] = useState(initTable);
    const [options, setOptions] = useState(initOptions);
    const [validate, setValidate] = useState(initValidate)

    function filterData(query:string, options: retur[]) {
        if (query) {
            return options.filter((item:retur) => {
                const regex = new RegExp(query, 'i');
                return regex.test(item.sales_id) && !item.refund
            });
        }
        return [];
    }

    useEffect(() => {
        //get data
        getReturSales()
        .then((respon : any) => {
            setData(respon)
        }).catch(e => {
            console.log("error: " + e.stack || e);
        });
    }, [])

    const addProduct = (index:number, item: productSalesRetur) => {
        if(dataTable[index].retur < dataTable[index].quantity){
            dataTable[index].retur++
            setDataTable([...dataTable])
        }
    }

    const removeProduct = (index:number, item: productSalesRetur) => {
        if(dataTable[index].retur > 0){
            dataTable[index].retur--
            setDataTable([...dataTable])
        }
    }

    const search = (barcode : string, status: string) => {
        getProductCabang(
            barcode,
            (response: GetProductInventoryResponse) => {
              setIsLoading(false);
              if (response.results.length > 0) {
                if(status == 'add'){
                    cart.addProduct(new Product(response.results[0].product, -1))
                    setCart(new Cart(cart.products))
                }else{
                    cart.removeProduct(new Product(response.results[0].product, -1))
                    setCart(new Cart(cart.products))
                }
                
                // setOptions(optionProducts)
              }
            },
            (errorResp: Response) => {
              console.log("error ");
              setIsLoading(false);
            } 
        )
    }

    const confirm = (props:props) => {
        var count:number = 0
        dataTable.forEach(e => {
            if(e.retur > 0){
                count++
            }
        });
        if(count===0){
            setValidate(true)
        }else{
            dataRetur['productSales'] = dataTable
            setDataRetur(dataRetur)
            saveLocalRetur(dataRetur)
            .then((respon : any) => {
                var productSales: productSales[] = respon.productSales
                let count = productSales.length
                productSales.forEach((e:any)=> {
                    var dataLoop:number = e.quantity - e.retur
                    for (let i = 0; i < dataLoop; i++) {
                        search(e.product.barcode.toLowerCase(), 'add')
                    }
                    count--
                });
                if(count == 0){
                    props.retur(true)
                }
            }).catch(e => {
                console.log("error: " + e.stack || e);
            });
        }
    }

    const searchNota = (item: string) => 
    {
        setIsLoading(true);
        var result = filterData(item, data);
        setOptions(result);
        if(result){
            setIsLoading(false);    
        }
    }

    const saveOnChange = (item : productSalesRetur[]) => {
        var data:productSalesRetur[] = [];
        item.forEach((e : productSalesRetur) => {
            e['retur'] = 0
            data.push(e)
        });
        setDataTable([...data])
    }

    return (
        <Card className="rainbow-m-around_large rainbow-p-around_large">
            <Modal
                isOpen={validate}
                onRequestClose={()=>{ 
                    setValidate(false)
                }}
            >
                Belum ada barang yang di tukar
            </Modal>
            <div>
                <div className="rainbow-m-around_large">
                    <Lookup
                        id="search-nota"
                        label="Cari Berdasarkan Kode Nota"
                        placeholder="Masukan nomor nota"
                        options={options}
                        isLoading={isLoading}
                        onChange={
                            (item:any) => {
                                setDataRetur(item)
                                saveOnChange(item.productSales)
                            }
                        }
                        onSearch={(keyword) => {
                            searchNota(keyword)
                        }}
                    />
                </div>

                <div className="rainbow-m-bottom_xx-large">
                    <TableWithBrowserPagination 
                        pageSize={100} 
                        data={dataTable} 
                        keyField="barcode"
                    >
                        <Column header="Barcode" field="product.barcode" defaultWidth="130" />
                        <Column header="Desc" field="product.description" />
                        <Column header="Harga" field="product.hargaJual" />
                        <Column header="Qty" field="quantity" />
                        <Column header="Retur" defaultWidth="150" component={(data: any) => (
                            <ProductActionView
                                count={data.row.retur}
                                row={data.row}
                                enableClear={false}
                                addProduct={() => {
                                    addProduct(data.index, data.row)
                                }}
                                removeProduct={() => {
                                    removeProduct(data.index, data.row)
                                }}
                            />
                        )}/>
                        <Column header="Status" component={(data: any) =>(data.row.product.returnable ? <label>Boleh Tukar</label> : <label>Tidak Boleh Tukar</label>)}/>
                    </TableWithBrowserPagination>
                </div>

                <div className="rainbow-flex rainbow-flex_column rainbow-align_end">
                    <Button
                        onClick={()=>confirm(props)}
                        className="rainbow-m-top_small rainbow-m-horizontal_large"
                        size="large"
                        variant="success"
                    >
                        Konfirmasi
                    </Button>
                </div>
            </div>
        </Card>
    );
};

interface props {
    retur : (retur: boolean) => void
}