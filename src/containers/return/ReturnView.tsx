import React, { useEffect, useState } from 'react'
import { Input, Modal } from 'react-rainbow-components';
import { Path, PathStep } from 'react-rainbow-components';
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ProductListProp } from '../kasir/ProductListView';
import { useHistory } from "react-router-dom";
import { CheckoutKonfirm } from '../checkout/CheckoutKonfirm';
import { CheckoutBayar } from '../checkout/CheckoutBayar';
import { CheckoutStruk } from '../checkout/CheckoutStruk';
import { Cart } from '../../data/product/Cart';

import { ReturnInput } from './ReturnInput';
import { ReturnDaftarView } from './ReturnDaftarView';

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

export interface Retur {
    tanggal: string,
    status: string,
    keterangan: string,
}

export const ReturnView: React.FC<any & ProductListProp> = (props: any) => {

  let initPaymentMethod: PaymentMethod[] = []

  const [paymentMethods, setPaymentMethods] = useState(initPaymentMethod)

  const [cart, setCart] = useState(new Cart(new Map))

  const [page, setPage] = useState("0")

  let returInitList: Retur[] = []

  const [returList, setReturList] = useState(returInitList)
  const [returTrans, setReturTrans] = useState(true)

  let { url, path } = useRouteMatch();

  const history = useHistory();

  useEffect(() => {
    //get data
    history.push(`${path}/checkout/0`)
}, [])

  return (
    <div>
      <div className="rainbow-p-around_large">
        <Path currentStepName={page}>
          <PathStep name="0" label="Return Barang" />
          <PathStep name="1" label="Daftar Pesanan" />
          <PathStep name="2" label="Pembayaran" />
          <PathStep name="3" label="Pesanan Sukses" />
        </Path>
      </div>

      <Switch>
        <Route path={`${path}/checkout/0`}>
            <ReturnDaftarView
            setCart={(cart: Cart) => {
                setCart(cart)
              }}
              cart={cart}
              retur={(e:boolean) => {
                  setPage("1")
                  history.push(`${path}/checkout/1`)
              }}
            />
        </Route>  
        <Route path={`${path}/checkout/1`}>
          <ReturnInput
            setCart={(cart: Cart) => {
              setCart(cart)
            }}
            cart={cart}
            onBayar={(page: boolean) => {
              setPaymentMethods(initPaymentMethod)
              setPage("2")
              history.push(`${path}/checkout/2`)
            }}
          />
        </Route>
        <Route
          path={`${path}/checkout/2`}
        >
          <CheckoutBayar
            cart={cart}
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
            retur
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
              setPage("0")
              history.push(`${url}/checkout/0`)
            }}
          >
          </CheckoutStruk>
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
        <ReturnView
          cart={cart}
          setCart={setCart}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </div>
  )
}
