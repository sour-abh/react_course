// import { useState } from 'react'
import './App.css'
import {CurrencyBox} from './componenets/index.js'
import {useState} from 'react'
import useCurrencyInfo from './hooks/usecurrencyInfo'
function App() {

  // created the states for the amount from and to and converted amount then fetched the currencyInfo for the from currency and fetched the keys to get the options for the select menu 
  const[amount,setAmount]=useState(0)
  const[from,setFrom]=useState("usd")
  const[to,setTo]=useState("inr")
  const[convertedAmount,setConvertedAmount]=useState(0)

  const currencyInfo=useCurrencyInfo(from)

  const options=Object.keys(currencyInfo) 
// then we created a swap function which convert the from to to and to to from and amount to converted amount and converted amount to amount and created the convert function which takes the amount from the Input and multiply it with the currencies for which we want to convert
const swap=()=>{ 
  setFrom(to)
  setTo(from)
  setConvertedAmount(amount)
  setAmount(convertedAmount)
}
const convert = ()=> {
  setConvertedAmount(amount* currencyInfo[to])
}
// we created the div for the main body give it full width screen hight flex flex wrap justify center items center and give it a background image and create another div in it with full width under it another div with width ful auto x margin border and backdrop blur and transparent white background we created a form tag which on sbmit convert the currencies

  return (
<div className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('https://plus.unsplash.com/premium_photo-1666700698920-d2d2bba589f8?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}>
    <div className="w-full">
      <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
        <form onSubmit={(e)=>{
          e.preventDefault();
          convert();
        }}>
          {/* used the CurrencyBox element and gave it the options we fetched earlier */}
            <div className="w-full mb-1">
              <CurrencyBox
                label="from"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={setFrom}
                onAmountChange={(amount)=>setAmount(amount)}
                selectCurrency={from}/>
{/* created a swap button first a div with a relative full width height 0.5 inside it the button with absolute left and translate properties with white background and rounded-md which on click swap the currencies */}

            </div>
            <div className="relative w-full h-0.5">
              <button type="button"
                className="absolute left-1/2
                -translate-x-1/2
                -translate-y-1/2 border-2
                border-white rounded-md
                bg-blue-600 text-white px-2
                py-0.5"
                onClick={swap}>swap</button>
            </div>
            <div className="w-full mt-1 mb-4">
              <CurrencyBox label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={setTo}
                selectCurrency={to}
                amountDisable/>
            </div>

            {/* then we have the submit button in blue background  we use the react element to show the convert currencies heading dynamically */}
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">Convert {from.toUpperCase()} to {to.toUpperCase()}</button>

        </form>
      </div>
    </div>

</div>

  )
}

export default App  
 