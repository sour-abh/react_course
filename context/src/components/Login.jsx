import React ,{useState,useContext}from 'react'
import UserContext from '../UserContext/UserContext'

function Login() {

    const [userName,setUserName]=useState('')
    const[password,setPassword]=useState('')
    const {setUser}=useContext(UserContext)
    const handleSubmit=(e)=>{
        e.preventDefault()
        setUser({userName,password})

    }
  return (
    <div>
        <h2>LOGIN</h2>
        <input type="text" onChange={(e)=>setUserName(e.target.value)} value={userName}placeholder='username'/>
        <input type='text' placeholder='password'  onChange={(e)=>{setPassword(e.target.value)}}value={password}/>
        <button type='button' onClick={handleSubmit}>Submit</button>

    </div>
  )
}

export default Login