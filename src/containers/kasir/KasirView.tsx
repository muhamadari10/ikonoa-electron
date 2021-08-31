import React, { useEffect, useState } from 'react';
import { Product } from '../../data/AppDatabase';
import { getApi } from '../../data/RemoteData';
import { Response } from '../../data/model/Response';
import { CheckoutModalView, CheckouView } from '../checkout/CheckoutView';
import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import { Cart } from '../../data/product/Cart';

export const KasirView: React.FC<any> = () => {

  const history = useHistory();
  let { url } = useRouteMatch();

  const [cart, setCart] = useState(new Cart(new Map))

  const [isVisible, setIsVisible] = useState(false);

  let initProducst: Product[] = []

  const [products, setProducts] = useState(initProducst)

  useEffect(() => {
    reloadOfflineProducts();
  }, [])

  useEffect(() => {
    setIsVisible(cart.hasProduct())
  }, [cart])

  function reloadOfflineProducts() {
    // getApi<string, Response<Product>>(productApi)
    //   .then((response: Response<Product>) => {
    //     console.log("response",response);
        
    //     setProducts(response.results)
    //   }).catch((e: any) => {
    //     console.error(" error " + e)
    //   })
  }

  return (
    <div>
      <CheckouView
        cart={cart}
        setCart={setCart}
      />
    </div>
  )
}
