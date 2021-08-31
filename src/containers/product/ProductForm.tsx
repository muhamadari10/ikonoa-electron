import React, { useState, useEffect } from "react";
import { InjectedFormProps, reduxForm } from "redux-form";
import { Product } from '../../data/AppDatabase';
import { printProductsLocal, saveProduct, syncProducts } from '../../data/LocalData';
import { postApi, productApi, ProductRequest } from "../../data/RemoteData";
import { validate } from "../product/validate"
import { getView } from "./view";

const ProductFormView: React.FC<any & InjectedFormProps> = (props: any) => {

  let initProducts: Product[] = []

  const [products, setProducts] = useState(initProducts)

  const { handleSubmit } = props;

  function reloadOfflineProducts() {
    printProductsLocal().then(
      (allProducts: Product[]) => {
        setProducts(allProducts);
      });
  }


  useEffect(() => {
    reloadOfflineProducts();
  }, [])

  const submit = (product: ProductRequest) => {
    // postApi<ProductRequest, ProductRequest>(productApi, product)
    //   .then(() => {
    //     saveProduct(product.description).then(() => {
    //       setProducts([...products, new Product(product.description)])
    //       alert("Produk berhasil terjual offline")
    //     }
    //     )
    //     alert("Produk berhasil terjual")
    //   }).catch((error: Response) => {

    //     if (error.status == undefined) {
    //       saveProduct(product.description).then(() => {
    //         setProducts([...products, new Product(product.description)])
    //         alert("Produk berhasil terjual offline")
    //       }
    //       )
    //     } else {
    //       error.json()
    //         .then((a: any) => {
    //           alert("error " + JSON.stringify(a))
    //         })
    //     }
    //   })
  };

  function handleKirim() {
    // syncProducts((product: Product) => {
    //   let request: ProductRequest = {
    //     description: product.description
    //   }
    //   return postApi<ProductRequest, Response>(productApi, request)
    // })
    //   .then(() => {
    //     reloadOfflineProducts();
    //   })
  }

  return getView(handleSubmit, submit, products, handleKirim)
}


export default reduxForm<{}>({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  form: 'product',
  touchOnChange: true,
  validate,
})(ProductFormView);
