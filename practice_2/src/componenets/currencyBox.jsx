import React from 'react'
import {useId} from 'react'


// created a currency Input boc with inputs of label amount onAmountChange onCurrencyChange currency Options currency disable amountDisable classname

// we used useId hook to create a seperate id for the label
function CurrencyBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions=[],
    selectCurrency="",
    currencyDiasable=false,
    amountDisable=false,
    className="",
}) {
    const amountInputId=useId()

    // we created white bacckground in flex under it another div then label for the currency chosen  then we give ;the input number with transparent background with the value of the amount on change the amount value will change  we then creates another div with flex flex wrap and gavei t a p tag and select tag the css of the select tag a color gray px-1 py-1 we gave value selectcurrency the currency then we run a loop using a map function on the currency options and created the options of the select tag
  return (

    <>
    <div className={`bg-white  p-3 rounded-lg text-sm flex ${className} ` } >
        <div className="w-1/2 ">
            <label  htmlFor={amountInputId}className="text-black/40 mb-2  inline-block">
            {label}
            </label>
            <input  id={amountInputId}className="outline-none w-full bg-transparent py-1.5"
            type="number"
            placeholder='Amount'
            disabled={amountDisable}
            value={amount}
            onChange={(e)=>onAmountChange && onAmountChange(Number(e.target.value))}/>
        </div>

    <div className="w-12 flex flex-wrap justify-end text-right">
        <p className='text-black/40 mb-2 w-full'>Currency Type</p>
        <select className='rounded-lg px-1 py-1 bg-gray-100 cursor-pointer outline-none'
        value={selectCurrency}
        onChange={(e)=> onCurrencyChange && onCurrencyChange(e.target.value)}
        disabled={currencyDiasable}>
            {currencyOptions.map((currency)=>(

                <option  key ={currency} value={currency}>{currency}</option>
            ))}
            
        </select>
        </div>
    </div>
    </>
  )
}
export default CurrencyBox
