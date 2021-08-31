import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Column, TableWithBrowserPagination } from 'react-rainbow-components';
import { ProductListProp } from '../kasir/ProductListView';
import { RupiahTextView } from '../kasir/RupiahTextView';
import { Input } from 'react-rainbow-components';
import { Picklist, Option, RenderIf } from 'react-rainbow-components';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import './Checkout.css'
import { GenericActionView } from '../kasir/GenericActionView';
import { PaymentMethod } from './CheckoutView';
import Mousetrap from 'mousetrap';
import { PaymentRequest } from '../../data/sales/PaymentRequest';
import { doSales, returSales } from '../../data/sales/SalesData';
import { getReturLocal } from '../../data/LocalData';

export interface PickOptions {
  name: string | undefined | number
  label: string | undefined
}

function getTypeString(type: string) {
  if (type == "1") {
    return "Cash"
  } else if(type == "0") {
    return "Retur"
  } else {
    return "Card"
  }
}

export const CheckoutBayar: React.FC<any & ProductListProp> = (props: any) => {

  const { paymentMethods, setPaymentMethods } = props

  const { cart, onBayar, onBatal } = props;

  const inputStyles = {
    width: 300,
  };

  const containerStyles = {
    width: '200px',
  };

  let initPaymentOption: PickOptions = {
    name: 'option 1', label: 'Cash'
  }

  const [paymentId, setPaymentId] = useState(1)

  const [paymentOption, setPaymentOption] = useState(initPaymentOption)

  let initUang: number | null = null

  const [uangDiterima, setUangDiterima] = useState(initUang);

  const [cardNumber, setCardNumber] = useState("");

  const [hasCardNumber, setHasCardNumber] = useState(false);

  const [hasUangDiterima, setHasUangDiterima] = useState(false);

  const [isCard, setIsCard] = useState(true)

  const [isCash, setIsCash] = useState(true)

  const [reloadRetur, setReloadRetur] = useState(true)
  const [paymentRetur, setPaymentRetur] = useState(0)

  const bayarInput = useRef(null)


  useEffect(() => {
    requestFocusBayarInput();
    Mousetrap.bind('enter', function () { bayarWithCheck() }, 'keyup');
  }, [])


  useEffect( () => () => {
    Mousetrap.unbind('enter', 'keyup');
  }, [] );


  useEffect(() => {
    setIsCash(paymentOption.name == "option 1")
    setIsCard(paymentOption.name == "option 2")
    requestFocusBayarInput();
  }, [paymentOption])

  function requestFocusBayarInput() {
    bayarInput?.current?.focus();
  }

  useEffect(() => {
    const uangDiterimaConst = uangDiterima
    if ( uangDiterimaConst != null){
      setHasUangDiterima(uangDiterimaConst > 0)
      cart.pembayaran = uangDiterimaConst
    }
  }, [uangDiterima])

  useEffect(() => {
    setHasCardNumber(cardNumber.length > 0)
  }, [cardNumber])

  useEffect(() => {
    if(props.retur){
      //get data
      getReturLocal()
      .then((respon : any) => {
          console.log("payments 0", respon[0]);
          let amount = 0
          respon[0].productSales.forEach((item:any) => {
            amount += parseInt(item.amount)
          });
          const payment = parseInt(respon[0].payment.amount)
          setReloadRetur(false)
          returPayment(amount)
      }).catch(e => {
          console.log("error: " + e.stack || e);
      });
      

    }
  }, [])

  function returPayment(payment: number) {
    
    

      setPaymentRetur(payment)
      const uangDiterimaConst = payment

      // if (uangDiterimaConst == null){
      //   return
      // }
      
      // const id = reloadRetur ? incrimentPaymentMethod() : "0"
  
      let paymentMethod: PaymentMethod = {
        id: incrimentPaymentMethod(),
        type: 0,
        total: uangDiterimaConst,
        cardNumber: ""
      }

      console.log("payments ",paymentMethod);  
      paymentMethods.push(paymentMethod)
      console.log("paymentMethod ",paymentMethod);
      if(paymentMethod.type == 0){
        setPaymentMethods([...paymentMethods])
        setUangDiterima(0)
        setCardNumber("")
      }
  }

  function addPaymentMethod() {
    const uangDiterimaConst = uangDiterima
    if (uangDiterimaConst == null){
      return
    }
    
    let paymentMethod: PaymentMethod = {
      id: incrimentPaymentMethod(),
      type: 1,
      total: uangDiterimaConst,
      cardNumber: ""
    }

    if (isCard) {
      paymentMethod.type = 2
      paymentMethod.cardNumber = cardNumber
    }

    paymentMethods.push(paymentMethod)
    setPaymentMethods([...paymentMethods])
    setUangDiterima(0)
    setCardNumber("")
  }

  function incrimentPaymentMethod(): string {
    let id = +paymentId + +1
    setPaymentId(id)
    return id.toString()
  }

  function bayarUangPas() {
    let paymentMethod: PaymentMethod = {
      id: incrimentPaymentMethod(),
      type: 1,
      total: cart.getSubtotalWithDiscount(),
      cardNumber: ""
    }

    paymentMethods.push(paymentMethod)
    setPaymentMethods([...paymentMethods])
    setUangDiterima(0)
    setCardNumber("")
  }

  function calculatePaymentTotal() {
    let total = 0
    paymentMethods.forEach((value: PaymentMethod, i: number) => {
      total += +value.total
    })
    return total
  }

  function canAddPaymentMethod() {
    if (isCard) {
      return hasCardNumber && hasUangDiterima
    } else {
      return hasUangDiterima
    }
  }

  function isCanPay() {
    return calculatePaymentTotal() >= cart.getSubtotalWithDiscount()
  }

  function bayarWithCheck() {

    if (isCanPay()) {
      createSale()
    } else if (isCash) {
      addPaymentMethod()
      createSale()
    } else if (isCard) {
      addPaymentMethod()
      createSale()
    }
  }

  function getPaymetMethodRequest(){
    if (isCash){
      return 'CASH'
    } else {
      return 'CARD'
    }
  }

  function createSale(){

    const payment: PaymentRequest = {
      amount: calculatePaymentTotal(),
      detail: null,
      expiryDate: null,
      paymethod: getPaymetMethodRequest()
    }

    const products = cart.getProductRequestList()
    
    doSales(
      payment, 
      products, 
      () => {
        if(props.retur){
          console.log("send retur");
          returSales(
            () => { onBayar() },
            () => { console.log('onError') }
          )
        }else{
          onBayar();
        }
      }, 
      () => {
        alert('error sales')
      }
    )
  }
  
  return (
    <Card className="rainbow-m-around_large rainbow-p-around_large">
      <div className="rainbow-flex rainbow-flex_column rainbow-align_end">
        <span className="heading2">Total Pembelian</span>
        <NumberFormat 
          value={cart.getSubtotalWithDiscount()} 
          displayType={'text'} 
          thousandSeparator={true} 
          prefix={'Rp. '} 
          renderText={(value: any) => {
            return (<div className="heading1">{value}</div>)
          }} 
        />

      </div>

      <div className="rainbow-flex rainbow-flex_row rainbow-align_start paymentWrapper rainbow-m-vertical_medium rainbow-p-vertical_small">
        <div className="rainbow-flex rainbow-flex_column rainbow-align_center paymentAdd rainbow-p-right_small">

          <h1> Pilih Opsi Pembayaran </h1>
          <Picklist
            className="rainbow-m-bottom_medium widthmax"
            id="picklist-1"
            style={containerStyles}
            onChange={value => setPaymentOption({
              name: value.name,
              label: value.label
            })}
            value={paymentOption}
            label="Pilih Metode Pembayaran"
            hideLabel
          >
            <Option name="header" label="Opsi Pembayaran" variant="header" />
            <Option name="option 1" label="Cash" />
            <Option name="option 2" label="Card" />
          </Picklist>

          <h1>Masukan Jumlah Pembayaran</h1>
          <NumberFormat
            className="rainbow-m-bottom_medium widthmax"
            value={uangDiterima}
            thousandSeparator={true}
            prefix={'Rp. '}
            onValueChange={(values) => {
              const { formattedValue, value } = values;
              if (+value <= 0) {
                setUangDiterima(null)
              } else {
                setUangDiterima(+value)
              }

            }}
            renderText={value => <div>{value}</div>}
            customInput={Input}
            getInputRef={bayarInput}
            onKeyDown={(it: any) => {
              if (it.key == 'Enter') {
                bayarWithCheck();
              }
            }}
          />

          <div className="rainbow-m-bottom_medium">
            <RenderIf isTrue={isCard} >
              <Input
                className="widthmax"
                label="Masukan Nomor Transaksi"
                placeholder="Contoh 'BCA 1234923812752'"
                type="text"
                value={cardNumber}
                onChange={(event: any) => {
                  setCardNumber(event.target.value)
                }}
                style={inputStyles}
                onKeyDown={(it: any) => {
                  if (it.key == 'Enter') {
                    bayarWithCheck();
                  }
                }}
              />
            </RenderIf>
          </div>

          <div className="rainbow-m-bottom_medium widthmax">
            <Button
              variant="success"
              className="widthmax"
              onClick={() => { addPaymentMethod() }}
              disabled={!canAddPaymentMethod()}
            >
              Tambah Pembayaran
          </Button>
          </div>

          <RenderIf isTrue={isCash} >
            <Button
              variant="brand"
              className="widthmax"
              onClick={() => {
                if (!isCanPay()){
                  bayarUangPas()
                }
              }}
            >
              Uang Pas
            </Button>
          </RenderIf>
        </div>

        <div className="paymentList rainbow-flex_column rainbow-align_end">
          <TableWithBrowserPagination variant="listview" pageSize={20} data={paymentMethods} keyField="id">
            <Column header="Tipe" field="type" component={(data: any) => (
              getTypeString(data.row.type)
            )} />

            <Column header="No. Kartu" field="cardNumber" />
            <Column header="Total" component={(data: any) => (
              <RupiahTextView harga={data.row.total} />
            )} />
            <Column header="Aksi" component={(data: any) => (
              <GenericActionView
                enableAdd={false}
                enableRemove={true}
                remove={() => {
                  console.log("remove " + data.row)
                  setPaymentMethods(paymentMethods.filter((value:any) => value.id != data.row.id))
                }}
              />

            )} />

          </TableWithBrowserPagination>
          
          <div className={(props.retur ? "desc-bayar" : "")}>
            {
              props.retur ?
              <div style={{ paddingLeft:15 }}>
                <span className="heading2">Selisih ({ paymentRetur >= cart.getSubtotalWithDiscount() ? 'Kembali' : 'Bayar' })</span>
                <NumberFormat value={paymentRetur} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={(value: any) => {
                  return (<div className="heading1">{value}</div>)
                }} />
              </div>:<div></div>
            }
            <div>
              <span className="heading2">Total Bayar</span>
              <NumberFormat value={calculatePaymentTotal()} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={(value: any) => {
                return (<div className="heading1">{value}</div>)
              }} />
            </div>
          </div>

        </div>
      </div>
      <div className="rainbow-align-content_space-between">
        <Button
          size="large"
          variant="destructive"
          onClick={() => { onBatal() }}
        >
          Batal
        </Button>

        <Button
          variant="brand"
          onClick={() => { bayarWithCheck() }}
          disabled={!isCanPay()}
          size="large"
        >
          Bayar
        </Button>
      </div>
    </Card>
  );
};

