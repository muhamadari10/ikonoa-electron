import React, { useState } from 'react';
import { TableWithBrowserPagination, Column, Input } from 'react-rainbow-components';
import { Cart } from '../../data/product/Cart';
import { CartProd } from '../../data/product/CartProd';
import { Product } from '../../data/product/Product';
import { ProductActionView } from './ProductActionView';
import { RupiahTextView } from './RupiahTextView';

export interface ProductListProp {
  productList: CartProd[],
  cart: Cart,
  setCart: (cart: Cart) => void
  onBayar: (page: boolean) => void
}

export const ProductListView: React.FC<any & ProductListProp> = (props: any & ProductListProp) => {

  const addProduct = (product: Product) => {
    console.log("product ",product);
    
    let cart: Cart = props.cart
    cart.addProduct(product)
    props.setCart(new Cart(cart.products))
  }

  const removeProduct = (product: Product) => {
    let cart: Cart = props.cart
    cart.removeProduct(product)
    props.setCart(new Cart(cart.products))
  }

  const clearProduct = (product: Product) => {
    props.cart.clearProduct(product)
    props.setCart(new Cart(props.cart.products))
  }

  return (
    <div className="rainbow-m-bottom_xx-large">
      <TableWithBrowserPagination pageSize={100} data={props.productList} keyField="barcode">
        <Column header="Barcode" field="product.actual.barcode" defaultWidth="130" />
        <Column header="Deskripsi" field="product.actual.description" />
        <Column
          header="Diskon"
          component={(data: any) => (
            <Input
              onClick={() => {
                props.setProductDiscount(data.row.product)
                props.setIsOpen(true)
              }}
              type="text"
              value={data.row.discountText}
              className="rainbow-m-horizontal_medium"
            />
          )}
        />
        <Column header="Harga" component={(data: any) => (
          <RupiahTextView harga={data.row.product.actual.hargaJual} />
        )} />
        <Column header="Aksi" defaultWidth="300" component={(data: any) => (
          <ProductActionView
            enableClear={props.retur ? false : true}
            count={data.row.count}
            row={data.row}
            addProduct={() => {
              addProduct(data.row.product)
            }}
            removeProduct={() => {
              if(props.retur){
                var productSales:any[] = props.retur[0].productSales
                var product : Product = data.row.product
                var prodBarcode : string = product.actual.barcode
                productSales.forEach((e : any) => {
                  var pSalesBarcode = e.product.barcode
                  if(prodBarcode == pSalesBarcode){
                    var qty = e.quantity - e.retur
                    var count = data.row.count
                    if(count > qty){
                      removeProduct(data.row.product)   
                    }
                  }
                });
              }else{
                removeProduct(data.row.product)
              }
            }}
            clearProduct={() => {
                clearProduct(data.row.product)
            }}
          />
        )} />
      </TableWithBrowserPagination>
    </div>
  )
}


