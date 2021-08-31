import { Field } from "redux-form";
import {
  Button,
  Input,
  Card
} from 'react-rainbow-components';
import { ProductRequest } from "../../data/RemoteData";
import { Product } from "../../data/AppDatabase";
import React from "react";

export function getView(handleSubmit: any, submit: (product: ProductRequest) => void, products: Product[], handleKirim: () => void): React.ReactElement<any, any> | null {
  return (
    <div className="rainbow-p-vertical_large rainbow-align-content_center rainbow-flex_wrap">

      <Card
        title="Kasir"
        className="react-rainbow-admin-user-detail_card">
        <div className="kasir">
          <form id="product" noValidate onSubmit={handleSubmit(submit)}
            className="react-rainbow-admin-forms_card"
          >
            <div>
              <Field
                className="rainbow-m-top_small rainbow-rainbow-forms_inputs-field"
                component={Input}
                name="description"
                label="Nama Product"
                required
                placeholder="Masukan Nama Product"
                type="text" />

              <Button
                form="product"
                label="Create"
                variant="brand"
                type="submit"
                className="rainbow-m-around_medium"
              >
                Jual Produk
            </Button>

            </div>
          </form>
        </div>
      </Card>


      <Card
        title="Daftar Penjualan Offline"
        className="react-rainbow-admin-user-detail_card">
        <ul>
          {products.map(item => {
            return <li><h2>{item.description}</h2></li>;
          })}
        </ul>
        <Button
          label="Create"
          variant="brand"
          className="rainbow-m-around_medium rainbow-align-content_center"
          onClick={handleKirim}
        >
          Kirim offline data
        </Button>
      </Card>

    </div>
  );
}
