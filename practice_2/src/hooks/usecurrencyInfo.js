import {useState,useEffect} from 'react'

function useCurrencyInfo(currency) {

    // we created a state for the data to fetch then useEffect to fetch the api then read it in json and then setData to the to the the response for the input currency then export it 
    const[data,setData]=useState({})
    useEffect(()=>{
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then((res)=>res.json())
        .then((res)=>setData(res[currency]))
    },[currency])
    console.log(data)
  return data

}

export default useCurrencyInfo