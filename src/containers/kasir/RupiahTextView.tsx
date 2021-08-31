import React from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format';

interface RupiahProps {
  harga: number
}

export const RupiahTextView: React.FC<any> = (props: any & RupiahProps) => {
  return (
    <NumberFormat value={props.harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={(value: NumberFormatProps) => {
      return (<div>{value}</div>)
    }} />
  )
}
