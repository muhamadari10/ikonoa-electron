import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'react-rainbow-components';
import { Path, PathStep } from 'react-rainbow-components';
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ProductListProp } from '../kasir/ProductListView';
import { useHistory } from "react-router-dom";
import { CheckoutKonfirm } from './CheckoutKonfirm';
import { CheckoutBayar } from './CheckoutBayar';
import { CheckoutStruk } from './CheckoutStruk';
import { Cart } from '../../data/product/Cart';

export interface CheckoutProps {
  isOpen: boolean,
  setIsOpen: any
}

export interface PaymentMethod {
  id: string
  type: number
  total: number
  cardNumber: string
}
export const CheckouView: React.FC<any & ProductListProp> = (props: any) => {

  let initPaymentMethod: PaymentMethod[] = []

  const [paymentMethods, setPaymentMethods] = useState(initPaymentMethod)

  const [cart, setCart] = useState(new Cart(new Map))

  const [page, setPage] = useState("1")

  let { url, path } = useRouteMatch();

  const history = useHistory();

  return (
    <div>
      <div className="rainbow-p-around_large">
        <Path currentStepName={page}>
          <PathStep name="1" label="Daftar Pesanan" />
          <PathStep name="2" label="Pembayaran" />
          <PathStep name="3" label="Pesanan Sukses" />
        </Path>
      </div>

      <Switch>
        <Route
          path={`${path}/checkout/2`}
        >
          <CheckoutBayar
            cart={cart}
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
            onBayar={() => {
              setPage("3")
              history.push(`${url}/checkout/3`)
            }}
            onBatal={() => {
              setPage("1")
              history.push(`${url}/checkout/1`)
            }}
          />
        </Route>
        <Route path={`${path}/checkout/3`}>
          <CheckoutStruk
            cart={cart}
            paymentMethods={paymentMethods}
            onTutup={() => {
              setCart(new Cart(new Map()))
              setPaymentMethods([])
              setPage("1")
              history.push(`${url}/checkout/1`)
            }}
          >
          </CheckoutStruk>
        </Route>
        <Route
        >
          <CheckoutKonfirm
            setCart={(cart: Cart) => {
              setCart(cart)
            }}
            cart={cart}
            onBayar={() => {
              setPage("2")
              history.push(`${path}/checkout/2`)
            }}
          />
        </Route>
      </Switch>
    </div>
  )
}

export const CheckoutModalView: React.FC<any & ProductListProp> = (props: any) => {

  const { isOpen, setIsOpen, cart, setCart } = props

  function handleOnClose() {
    return setIsOpen(false)
  }

  return (
    <div>
      <Modal id="modal-1" isOpen={isOpen} onRequestClose={handleOnClose} size="large">
        <CheckouView
          cart={cart}
          setCart={setCart}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </div>
  )
}
