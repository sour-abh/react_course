import React from 'react'
import {useState,useCallback,useRef,useEffect} from 'react'

export const Password = () => {

    // create different state for different inputs 

    const[length,setLength]=useState(8)
    const[numberAllowed,setNumberAllowed]=useState(false)
    const[charAllowed,setCharAllowed]=useState(false);
    const[password,setPassword]=useState('')

// use ref hook
    const passwordRef=useRef(null)


 // password generator and used callback function for memory optimization

 // in password generation we created str and if number and char are allowed str will contains those values too then we ran a loop 
 // for length number of values and make a random password with math.random and str length
 //then we add that to the password and make the setpassword to the password created and then give callback the charallowed and numberallowed and setpassword 
 // the callback function helps to recall the value we didnot feed the password to it as it will continously recall it and it will be endless loop

    const passwordGenerator = useCallback(()=>{
        let pass="";
        let str="ABCDEFIJKLMNOPQRSTUVWXYZabcdefijklmnopqrstuvwxyz";
        if(charAllowed) str +="!@#$%^&*()__-=`~+{}[]<>";
        if (numberAllowed) str +="123457890";

        for(let i=1; i<=length;i++){
            let char=Math.floor(Math.random()* str.length+1)
            pass+=str.charAt(char)
        }

        setPassword(pass)
    },[charAllowed,numberAllowed,length,setPassword])

    // now we created a function for copypassword to clip board it uses callback hook we use window navigator clipboard write text and give password to it then we give passwordred to the current and give option to select
    
    const copyPasswordToClipboard=useCallback(()=>{
        passwordRef.current?.select();
        passwordRef.current?.setSelectionRange(0,999);
        window.navigator.clipboard.writeText(password)
    },[password])

    // useEffect function render the function at start and rerender when something is changed in he function

    useEffect(()=>{
        passwordGenerator()
    },[charAllowed,numberAllowed,length,passwordGenerator])

    // then to run the range we change the state of the length to the event.target.value and usestate of the char by toggling the previous state 

  return (
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 my-8 bg-gray-800 text-orange-500 pt-4">
        <h1 className='text-white text-center my-3'>Password Generator</h1>
        <div className='flex shadow rounded-lg overflow-hidden mb-4 bg-white'>
            <input
                type='text'
                value={password}
                className='outline-none w-full py-1 px-3'
                placeholder="Password"
                readOnly
                ref={passwordRef}
                />
            <button
                onClick={copyPasswordToClipboard}
                className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0">Copy</button>

        </div>
        <div className='flex text-sm gap-x-2'>
            <div className='flex items-center gap-x-1 pb-3'>
                <input type='range' min='6' max='100' value={length}
                className='cursor-pointer'
                onChange={(e)=>setLength(e.target.value)}/>
                <label>Length({length})</label>
                <input type='checkbox'defaultChecked={charAllowed} id="charInput" onChange={()=>{setCharAllowed((prev)=>!prev)}}/>
                <label htmlFor="charInput">special Character</label>
                <input type='checkbox'defaultChecked={numberAllowed} id="numberInput" onChange={()=>{setNumberAllowed((prev)=>!prev)}}/>
                <label htmlFor="numberInput">Number</label>
            </div>
        </div>


    </div>
  )
}
   