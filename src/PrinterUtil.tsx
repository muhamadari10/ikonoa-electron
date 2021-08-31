import { getAsset } from './PathUtil'

let dir = getAsset(["img_test.png"])
const { PosPrinter } = require('electron').remote.require("electron-pos-printer");

const printData = [
    {
        type: 'image',
        path: dir,     // file path
        position: 'center',                                  // position of image: 'left' | 'center' | 'right'
        width: '60px',                                           // width of image in px; default: auto
        height: '60px',                                          // width of image in px; default: 50 or '50px'
    }, {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'SAMPLE HEADING',
        style: `text-align:center;`,
        css: { "font-weight": "700", "font-size": "18px" }
    }, {
        type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: 'Secondary text',
        style: `text-align:left;color: red;`,
        css: { "text-decoration": "underline", "font-size": "10px" }
    }, {
        type: 'barCode',
        value: 'HB4587896',
        height: 12,                     // height of barcode, applicable only to bar and QR codes
        width: 1,                       // width of barcode, applicable only to bar and QR codes
        displayValue: true,             // Display value below barcode
        fontsize: 8,
    }, {
        type: 'qrCode',
        value: 'https://github.com/Hubertformin/electron-pos-printer',
        height: 55,
        width: 55,
        style: 'margin: 10 20px 20 20px'
    }, {
        type: 'table',
        // style the table
        style: 'border: 1px solid #ddd',
        // list of the columns to be rendered in the table header
        tableHeader: ['Animal', 'Age'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
            ['Cat', 2],
            ['Dog', 4],
            ['Horse', 12],
            ['Pig', 4],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: ['Animal', 'Age'],
        // custom style for the table header
        tableHeaderStyle: 'background-color: #000; color: white;',
        // custom style for the table body
        tableBodyStyle: 'border: 0.5px solid #ddd',
        // custom style for the table footer
        tableFooterStyle: 'background-color: #000; color: white;',
    }, {
        type: 'table',
        style: 'border: 1px solid #ddd',             // style the table
        // list of the columns to be rendered in the table header
        tableHeader: [{ type: 'text', value: 'Animal' }, { type: 'image', path: dir }],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
            [{ type: 'text', value: 'Cat' }, { type: 'image', path: './animals/cat.jpg' }],
            [{ type: 'text', value: 'Dog' }, { type: 'image', path: './animals/dog.jpg' }],
            [{ type: 'text', value: 'Horse' }, { type: 'image', path: './animals/horse.jpg' }],
            [{ type: 'text', value: 'Pig' }, { type: 'image', path: './animals/pig.jpg' }],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: [{ type: 'text', value: 'Animal' }, 'Image'],
        // custom style for the table header
        tableHeaderStyle: 'background-color: #000; color: white;',
        // custom style for the table body
        tableBodyStyle: 'border: 0.5px solid #ddd',
        // custom style for the table footer
        tableFooterStyle: 'background-color: #000; color: white;',
    },
]

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

export function testPrint(printerName: string) {
    try {
        const options = {
            preview: false, // Preview in window or print
            width: "170px", //  width of content body
            margin: "0 0 0 0", // margin of content body
            copies: 1, // Number of copies to print
            printerName: printerName, // printerName: string, check it at webContent.getPrinters()
            timeOutPerLine: 5000,
            silent: true,
        };

        const now = {
            type: "text",
            value: "aaaaa",
            style: `text-align:center;`,
            css: { "font-size": "12px", "font-family": "sans-serif" },
        };

        // const d = [...data, now];
        const d = [...printData, now];

        PosPrinter.print(d, options)
            .then(() => { })
            .catch((error: any) => {
                alert(error)
            });
    } catch (e) {
        alert(e)
    }
}