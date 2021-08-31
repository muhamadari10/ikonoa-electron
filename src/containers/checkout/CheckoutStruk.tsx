import React, { useEffect, useState } from 'react'
import { ProductListProp } from '../kasir/ProductListView'
import { Button, Card, RadioGroup, RenderIf } from 'react-rainbow-components';
import { PaymentMethod } from './CheckoutView';
import { getAsset } from '../../PathUtil';
import './Checkout.css'
import NumberFormat from 'react-number-format';
import { Cart } from '../../data/product/Cart';
import { CartProd } from '../../data/product/CartProd';
import { getCabang, getUser } from '../../data/auth/AuthData';
import { getNota } from '../../data/LocalData';

const { PosPrinter } = require('electron').remote.require("electron-pos-printer");

let dir = getAsset(["img_test.png"])

interface RadioValue {
  value: string,
  label: string
}

interface StrukProps {
  paymentMethods: PaymentMethod[]
}

export const CheckoutStruk: React.FC<any & ProductListProp & StrukProps> = (props: any & ProductListProp & StrukProps) => {

  let paymentMethods: PaymentMethod[] = props.paymentMethods

  let cart: Cart = props.cart

  let { remote } = require("electron");

  let webContents = remote.getCurrentWebContents();

  const [hasPrinter, setHasPrinter] = useState(false)

  const [radioValue, setRadioValue] = useState("")

  let radioValuesInit: RadioValue[] = []

  const [radioValues, setRadioValues] = useState(radioValuesInit)

  const [hasKembalian, setHaskembalian] = useState(false)

  const [kembalian, setKembalian] = useState(0)

  const [itemNota, setItemNota] = useState("")

  function handleOnChange(event: any) {
    return setRadioValue(event.target.value)
  }

  useEffect(() => {
    calculateKembalian()
    checkHasPrinter()
    let options: RadioValue[] = []
    webContents.getPrinters().forEach((value, index) => {
      if (index == 0) {
        setRadioValue(value.name)
        testPrint(value.name)
      }
      options.push({ value: value.name, label: value.displayName })
    })
    setRadioValues(options)

  }, [])

  function checkHasPrinter() {
    setHasPrinter(webContents.getPrinters().length > 0)
  }

  function calculatePaymentTotal() {
    let total = 0
    paymentMethods.forEach((value: PaymentMethod, i: number) => {
      total += +value.total
    })
    return total
  }

  function calculateKembalian() {
    let kembalian = +calculatePaymentTotal() - +cart.getSubtotalWithDiscount()
    if (kembalian > 0) {
      setHaskembalian(true)
      setKembalian(kembalian)
    } else {
      setHaskembalian(false)
      setKembalian(0)
    }
  }

  return (
    <Card className="rainbow-m-around_large rainbow-p-around_large">
      <div className="rainbow-flex rainbow-flex_column rainbow-align-content_space-between">
        <div className="rainbow-m-bottom_large rainbow-flex rainbow-flex_column rainbow-align-content_space-between">
          <div className="heading2 ">Pembayaran Berhasil!</div>

          <RenderIf isTrue={hasKembalian} >
            <span className="heading2">Total Kembalian</span>
            <NumberFormat value={kembalian} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={(value: any) => {
              return (<div className="heading1">{value}</div>)
            }} />
          </RenderIf>

        </div>
        <div className="heading3 rainbow-m-bottom_medium">
          Silahkan Cetak Struk
      </div>

        <RenderIf isTrue={!hasPrinter}>
          <label >Tidak Ada Printer</label>
        </RenderIf>

        <RenderIf isTrue={hasPrinter}>
          <RadioGroup
            id="radio-group-component-1"
            options={radioValues}
            value={radioValue}
            onChange={handleOnChange}
            label="Pilih Printer"
          />

          <Button
            size="large"
            variant="brand"
            onClick={() => {
              testPrint(radioValue)
            }}>
            Print
          </Button>
        </RenderIf>
      </div>

      <div className="rainbow-align-content_center rainbow-m-top_large">
        <Button
          size="large"
          variant="success"
          onClick={() => { props.onTutup() }}
        >
          Tutup
        </Button>
      </div>
    </Card>
  )

  const data = [
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "||---",
      style: `text-align:left;`,
      css: { "font-size": "12px" },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "HEADER",
      style: `text-align:center;`,
      css: { "font-weight": "700", "font-size": "18px" },
    },
    {
      type: "image",
      path: dir, // file path
      position: "center", // position of image: 'left' | 'center' | 'right'
      width: "auto", // width of image in px; default: auto
      height: "60px", // width of image in px; default: 50 or '50px'
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value:
        "Lorem ipsum<br><br> . , ; : ( ) - + = ! # % \" ' <br><br> ã Ã ç Ç $ & @ ê Ê í Í<br><br> 0 1 2 3 4 5 6 7 8 9 <br>a b c d e f g h i j k l m n o p q r s t u v w x y z<br>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br><br><hr><br>elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation \n ullamco \n laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum<br>",

      css: {
        "font-size": "12px",
        "font-family": "sans-serif",
        "text-align": "center",
      },
    },
    {
      type: "barCode", // Do you think the result is ugly? Me too. Try use an image instead...
      value: "HB4587896",
      height: 12,
      width: 1,
      displayValue: true, // Display value below barcode
      fontsize: 8,
    },
    {
      type: "qrCode",
      value: "https://github.com/fssonca",
      height: 80,
      width: 80,
      style: "margin-left:50px",
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "---||",
      style: `text-align:right;`,
      css: { "font-size": "12px" },
    },
  ];

  function date() {
    const x = new Date();

    const y = "0" + x.getHours();
    const z = "0" + x.getMinutes();
    const s = "0" + x.getSeconds();
    const h = "0" + x.getDate();
    const ano = x.getFullYear().toString().substr(-2);
    const ms = x.getMonth();
    const meses = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      h.substr(-2) + " " + meses[ms] + " " + ano + " " + y.substr(-2) +
      ":" +
      z.substr(-2) +
      ":" +
      s.substr(-2)
    )
  }

  function testPrint(printerName: string) {
    try {

      const diskonHtml = {
        type: "text",
        value: "Diskon " + cart.getDiscountPrice(),
        style: `text-align:end;`,
        css: { "font-size": "10px", "font-family": "sans-serif", "padding": "2px 0px 2px" },
      };

      const subtotalWithDiskonHtml = {
        type: "text",
        value: "Total " + cart.getSubtotalWithDiscount(),
        style: `text-align:end;`,
        css: { "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      const totalPayHtml = {
        type: "text",
        value: "Bayar " + getTotalPay(paymentMethods),
        style: `text-align:end;`,
        css: { "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      const kembalianHtml = {
        type: "text",
        value: "Kembalian " + kembalian,
        style: `text-align:end;`,
        css: { "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      const space = {
        type: "text",
        value: "  ",
        style: `text-align:start;`,
        css: { "font-size": "10px", "font-family": "sans-serif" },
      };
      
      let user = getUser()
      
      let cashierName = `${user.first_name} ${user.last_name}`

      const cashier = {
        type: "text",
        value: `Cashier : ${cashierName}`,
        style: `text-align:start;`,
        css: { "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      let cabangData = getCabang()

      const cabang = {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: `TOKO ${cabangData.name}`,
        style: `text-align:center;`,
        css: { "font-weight": "700", "font-size": "18px" }
      }

      getNota()
      .then((respon:any) => {
        let dateToday : string;
        var d = new Date();

        var years = d.getFullYear().toString();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var monthPrint = month >= 10 ? month.toString() : "0"+month.toString()
        var dayPrint = day >= 10 ? day.toString() : "0"+day.toString()

        
          dateToday = dayPrint+monthPrint+years.substring(2)
          
        var code = cabangData.code
        var notaC = respon[0].notanumber - 1
        setItemNota(code+notaC.toString()+dateToday)
      })

      console.log("notaItem ",itemNota);
      

      const nota = {
        type: "text",
        value: `Nota : ${itemNota}`,
        style: `text-align:start;`,
        css: { "font-weight": "400", "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      const now = {
        type: "text",
        value: "Tanggal : " + date(),
        style: `text-align:start;`,
        css: { "font-size": "10px", "font-family": "sans-serif" , "padding": "2px 0px 2px" },
      };

      let paymentTableHtml = getPaymentTableHtml(paymentMethods);
      let productTableHtml = getProductTableHtml(cart);

      const printData = [
        // {
        //   type: 'image',
        //   path: dir,     // file path
        //   position: 'center',                                  // position of image: 'left' | 'center' | 'right'
        //   width: '60px',                                           // width of image in px; default: auto
        //   height: '60px',                                          // width of image in px; default: 50 or '50px'
        // }, 
        {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Payment Resume Report',
          style: `text-align:center;`,
          css: { "font-weight": "700", "font-size": "14px" }
        },
        cabang,
        now,
        nota,
        cashier,
        space,
        productTableHtml,
        diskonHtml,
        subtotalWithDiskonHtml,
        totalPayHtml,
        kembalianHtml,
        paymentTableHtml
      ]

      const options = {
        preview: false, // Preview in window or print
        width: "300px", //  width of content body
        margin: "0 0 0 0", // margin of content body
        copies: 1, // Number of copies to print
        printerName: printerName, // printerName: string, check it at webContent.getPrinters()
        timeOutPerLine: 5000,
        silent: true,
      };

      const noReturnText = {
        type: "text",
        value: "Barang yang sudah dibeli tidak dapat ditukar kembali",
        style: `text-align:center;`,
        css: { "font-size": "12px", "font-family": "sans-serif" },
      };

      const terimaKasihText = {
        type: "text",
        value: "* Terima Kasih *",
        style: `text-align:center;`,
        css: { "font-size": "10px", "font-family": "sans-serif", "font-weight": "700" },
      };

      const d = [...printData,space, noReturnText, terimaKasihText];

      PosPrinter.print(d, options)
        .then(() => { })
        .catch((error: any) => {
          alert(error)
        });
    } catch (e) {
      alert(e)
    }
  }
}

function getProductTableHtml(cart: Cart) {
  let productTable: [number, string, number, number, number][] = [];

  let no = 1
  cart.products.forEach((value: CartProd, key: String, map: Map<String, CartProd>) => {
    let produk = value.product.actual.description
    let qty = value.count
    let harga = Number(value.product.actual.hargaJual) * 1
    let jumlah = Number(+value.product.actual.hargaJual) * +qty
    productTable.push([no++, produk, qty, harga, jumlah])
  })

  let paymentTableHtml = {
    type: 'table',
    // style the table
    // style: 'border: 1px solid #ddd',
    // list of the columns to be rendered in the table header
    tableHeader: ['No', 'Produk', 'Qty', 'Harga', 'Jumlah'],
    // multi dimensional array depicting the rows and columns of the table body
    tableBody: productTable,
    // custom style for the table header
    tableHeaderStyle: 'background-color: white; color: #000;',
    // custom style for the table body
    tableBodyStyle: 'border: 0.5px solid white',
    // custom style for the table footer
    tableFooterStyle: 'background-color: white; color: #000;',
  };
  return paymentTableHtml;
}

function getTypeString(type: number) {
  if (type == 1) {
    return "Cash"
  } else if(type == 0) {
    return "Retur"
  } else {
    return "Card"
  }
}

function getTotalPay(paymentMethods: PaymentMethod[]){
  let total: number = 0;
  paymentMethods.forEach(value => {
    total = +total + +value.total;
  });
  return total;
}

function getPaymentTableHtml(paymentMethods: PaymentMethod[]) {
  let paymentTable: [string, string, number][] = [];
  
  paymentMethods.forEach(value => {
    let noTrx = "************"
    if (value.type != 1) {
      noTrx = value.cardNumber
    }
    paymentTable.push([getTypeString(value.type), noTrx, value.total]);
  });

  let paymentTableHtml = {
    type: 'table',
    // style the table
    // style: 'border: 1px solid #ddd',
    // list of the columns to be rendered in the table header
    tableHeader: ['Metode', 'No. Trx.', 'Bayar'],
    // multi dimensional array depicting the rows and columns of the table body
    tableBody: paymentTable,
    // list of columns to be rendered in the table footer
    // custom style for the table header
    // tableHeaderStyle: 'background-color: white; color: #000;',
    // custom style for the table body
    tableBodyStyle: 'border: 0.5px solid white',
    // custom style for the table footer
    tableFooterStyle: 'background-color: white; color: #000;',
  };

  return paymentTableHtml;
}

