import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Lookup, Modal, Picklist, Option, RenderIf, Input } from 'react-rainbow-components';
import { ProductListProp, ProductListView } from '../kasir/ProductListView';
import './Checkout.css'
import NumberFormat from 'react-number-format';
import debounce from 'lodash.debounce';
import { PickOptions } from './CheckoutBayar';
import { GetProductInventoryResponse } from '../../data/inventory/GetProductInventoryResponse';
import { getProductCabang } from '../../data/product/ProductData';
import { Productinventory } from '../../data/inventory/ProductInventory';
import { Cart } from '../../data/product/Cart';
import { Product } from '../../data/product/Product';
import { Promo, PromoEnum } from '../../data/product/Promotion';

interface OptionProduct {
  label?: string
  description?: string
  icon?: string
  value?: Product
};

interface ProductSearch {
  label?: string
  description?: string
  value?: Product
};

interface InputDiscount {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  cart:Cart
  setCart: (cart: Cart) => void
  productDiscount ?:Product
};



export const CheckoutKonfirm: React.FC<ProductListProp> = (props: ProductListProp) => {

  const { cart, setCart, onBayar } = props;

  const [barcodeSearch, setBarcodeSearch] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  let initOptions: OptionProduct[] = []

  const [options, setOptions] = useState(initOptions);

  const [productDiscount, setProductDiscount] = useState()

  const cariBarangInput = useRef(null)

  function requestFocusCariBarang() {
    cariBarangInput?.current?.focus() 
  }

  function checkSearchbarcode(barcode: string) {
    if (barcode.length > 0) {
      searchProduct(barcode)
    }
  }

  const getProduct = (barcode:string) => {
    // setIsLoading(true);
    
  }

  useEffect(() => {
    getProduct('')
    requestFocusCariBarang()
  }, [])

  function searchProduct(barcode: string) {
    setIsLoading(true);
    getProductCabang(
      barcode,
      (response: GetProductInventoryResponse) => {
        setIsLoading(false);
        if (response.results.length > 0) {
          let optionProducts: OptionProduct[] = []
          response.results.map((item: Productinventory) => {
            optionProducts.push({
              label: item.product.description,
              description: item.product.hargaJual,
              value: new Product(item.product, -1)
            })
          })
          console.log("success ",optionProducts);
          setOptions(optionProducts)
        } else {
          setOptions([])
        }
      },
      (errorResp: Response) => {
        console.log("error ");
        setIsLoading(false);
      } 
    )
  }

  const debouncedSave = useCallback(
    debounce((barcode: string) => checkSearchbarcode(barcode), 1000, { leading: false, trailing: true }),
    [],
  );

  useEffect(() => {
    debouncedSave(barcodeSearch)
  }, [barcodeSearch])

  function isCanCheckout() {
    return cart.products.size > 0
  }

  const containerStyles = {
    width: 200,
  };

  return (
    <Card className="rainbow-m-around_large rainbow-p-around_large">
      <div>
        <div className="rainbow-flex rainbow-flex_column rainbow-align_end rainbow-m-bottom_small">
          <div className="rainbow-flex rainbow-flex_column rainbow-align_center">
            <span className="heading1">Total Pembelian</span>
            <NumberFormat 
              value={cart.getSubtotalWithDiscount()} 
              displayType={'text'} 
              thousandSeparator={true} 
              prefix={'Rp. '} 
              renderText={(value: string) => {
                return (<div className="heading2">{value}</div>)
              }} 
            />
          </div>
        </div>

        <div className="rainbow-m-around_large">
          <Lookup
            id="lookup-1"
            label="Cari Barang"
            placeholder="Masukan nama barang atau kode barcode"
            options={options}
            isLoading={isLoading}
            onChange={(item: any) => {
                console.log('add cart 1',props)
                console.log('add cart',item)
                if (item.value) {
                  cart.addProduct(item.value)
                  setCart(new Cart(cart.products))
                }
              }
            }
            onSearch={(keyword) => {
              setIsLoading(true);
              setBarcodeSearch(keyword)
            }}
            ref={cariBarangInput}
          />
        </div>

        <div className="productList">
          <ProductListView
            setProductDiscount={setProductDiscount}
            setIsOpen={setIsOpen}
            productList={cart.getCartProdList()}
            setCart={(cart: Cart) => {
              setCart(cart);
            }}
            cart={cart} />
        </div>

        <div className="rainbow-flex rainbow-flex_column rainbow-align_end">
          <Input
            label="Kode Diskon"
            type="text"
            className="rainbow-p-around_medium"
            style={containerStyles}

          // value={discountPercent}
          // onChange={(event: any) => {
          //   let value = event.target.value
          //   if (+value < 1 || +value > 100) {
          //     setDiscountPercent(null)
          //   } else {
          //     setDiscountPercent(value)
          //   }
          // }}
          // onKeyDown={(it: any) => {
          //   if (it.key == 'Enter') {
          //     onSubmit();
          //   }
          // }}
          />
        </div>


        <div className="rainbow-flex rainbow-flex_column rainbow-align_end">
          <Button
            className="rainbow-m-top_small rainbow-m-horizontal_large"
            size="large"
            variant="success"
            disabled={!isCanCheckout()}
            onClick={() => {
              onBayar()
            }}>
            Konfirmasi
          </Button>
        </div>

        <InputDiscountModalView
          isOpen={isOpen}
          setIsOpen={(isOpenModal: boolean) => setIsOpen(isOpenModal)}
          cart={cart}
          setCart={setCart}
          productDiscount={productDiscount}
        />

      </div>
    </Card>
  );
};

export const InputDiscountModalView: React.FC<InputDiscount> = (props: InputDiscount) => {

  let tipeDiskonOptionInit: PickOptions = {
    name: 'option 1', label: 'Persen'
  }

  const [tipeDiskon, setTipeDiskon] = useState(tipeDiskonOptionInit)

  const [discountPercent, setDiscountPercent] = useState()

  const [discountCash, setDiscountCash] = useState()

  const {isOpen, setIsOpen, productDiscount, cart, setCart } = props

  const [errorPercent, setErrorPercent] = useState("")

  const [errorCash, setErrorCash] = useState("")

  useEffect(() => {
    const discCash = discountCash
    if (discCash === undefined || discCash.length === 0) {
      setErrorCash("Tidak Boleh Kosong")
    } else {
      setErrorCash("")
    }
  }, [discountCash])

  useEffect(() => {
    const discPercent = discountPercent
    if (discPercent === undefined || discPercent.length === 0) {
      setErrorPercent("Diskon antara 1 - 100%")
    } else {
      setErrorPercent("")
    }
  }, [discountPercent])

  function handleOnClose() {
    return setIsOpen(false)
  }

  function isTipeSelected(tipe: string) {
    return tipeDiskon.name === tipe
  }

  const diskonCashInput = useRef(null)

  function onSubmit() {
    if (tipeDiskon.name === "option 1" && discountPercent === null) {
      setErrorPercent("Tidak Boleh Kosong")
      setErrorCash("")
    } else if (tipeDiskon.name === "option 2" && discountCash === null) {
      setErrorCash("Tidak Boleh Kosong")
      setErrorPercent("")
    } else {
      setErrorCash("")
      setErrorPercent("")
      handleOnClose()
      onDiscountSubmit()
    }
  }

  const containerStyles = {
    width: 300,
  };

  function onDiscountSubmit() {
    const prodDiscToUpdate = productDiscount
    const cartToUpdate: Cart = cart
    const discPercent = discountPercent
    const discCash = discountCash
  
    if (
      prodDiscToUpdate === undefined ||
      cartToUpdate === undefined
      ) {
      return
    }

    let promo
    if (tipeDiskon.name === "option 1"){
      if (discPercent === undefined){
        return
      }
      promo = new Promo(
          PromoEnum.PERCENTAGE,
          Number(discPercent)
        )
    } else {
      if (discCash === undefined){
        return
      }
      promo = new Promo(
        PromoEnum.CASH,
        Number(discCash)
      )
    }

    cartToUpdate.updateDiscount(
      promo,
      prodDiscToUpdate
    )

    setCart(new Cart(cartToUpdate.products))
  }


  return (
    <div>
      <Modal id="modal-1" isOpen={isOpen} onRequestClose={handleOnClose} size="medium">
        <div className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-p-around_large">
          <h1>Pilih Tipe Diskon</h1>
          <Picklist
            className="rainbow-m-bottom_medium widthmax"
            id="picklist-1"
            style={containerStyles}
            onChange={value => setTipeDiskon({
              name: value.name,
              label: value.label
            })}
            value={tipeDiskon}
            label="Pilih Tipe Diskon"
            hideLabel
          >
            <Option name="header" label="Tipe Diskon" variant="header" />
            <Option name="option 1" label="Persen" />
            <Option name="option 2" label="Cash" />
          </Picklist>

          <RenderIf isTrue={isTipeSelected("option 1")}>
            <Input
              style={containerStyles}
              error={errorPercent}
              label="Masukan Persen Diskon"
              placeholder="1 - 100%"
              type="number"
              className="rainbow-p-around_medium"
              value={discountPercent}
              onChange={(event: any) => {
                let value = event.target.value
                if (+value < 1 || +value > 100) {
                  setDiscountPercent(null)
                } else {
                  setDiscountPercent(value)
                }
              }}
              onKeyDown={(it: any) => {
                if (it.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
          </RenderIf>

          <RenderIf isTrue={isTipeSelected("option 2")}>
            <NumberFormat
              style={containerStyles}
              error={errorCash}
              className="rainbow-m-bottom_medium widthmax"
              value={discountCash}
              thousandSeparator={true}
              prefix={'Rp. '}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                if (+value <= 0) {
                  setDiscountCash(null)
                } else {
                  setDiscountCash(+value)
                }
              }}
              renderText={value => <div>{value}</div>}
              customInput={Input}
              getInputRef={diskonCashInput}
              onKeyDown={(it: any) => {
                if (it.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
          </RenderIf>

        </div>
      </Modal>
    </div>
  )
}


