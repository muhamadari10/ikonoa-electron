import React from 'react';
import { ButtonIcon, RenderIf } from 'react-rainbow-components';
import { MdAdd, MdClose, MdRemove } from "react-icons/md";
import './ProductAction.css'

interface ProductActionProps {
  addProduct: () => void,
  clearProduct: () => void,
  removeProduct: () => void,
  enableAdd: boolean,
  enableRemove: boolean,
  enableClear: boolean,
  enableCount: boolean,
  count: number
}

export const ProductActionView: React.FC<any & ProductActionProps> = (props: any) => {

  let enableRemove = props.enableRemove == undefined ? true : props.enableRemove

  let enableCount = props.enableCount == undefined ? true : props.enableCount

  let enableAdd = props.enableAdd == undefined ? true : props.enableAdd

  let enableClear = props.enableClear == undefined ? true : props.enableClear

  return (
    <div className="padding-vertical_xsmall rainbow-flex rainbow-align_center">

      <RenderIf isTrue={enableRemove}>
        <div className="rainbow-p-right_medium">
          <ButtonIcon size="medium" variant="border-filled" icon={<MdRemove />} onClick={() => {
            props.removeProduct()
          }} />
        </div>
      </RenderIf>


      <RenderIf isTrue={enableCount}>
        <div className="rainbow-p-right_medium">
          {props.count}
        </div>
      </RenderIf>

      <RenderIf isTrue={enableAdd}>
        <div className="rainbow-p-right_large">
          <ButtonIcon size="medium" variant="success" icon={<MdAdd />} onClick={() => {
            props.addProduct()
          }} />
        </div>
      </RenderIf>

      <RenderIf isTrue={enableClear}>
        <div className="rainbow-p-left_medium">
          <ButtonIcon size="medium" variant="destructive" icon={<MdClose />} onClick={() => {
            props.clearProduct()
          }} />
        </div>
      </RenderIf>
    </div>
  )
}
