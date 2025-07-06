import React ,{useState,useEffect}from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from "../src/appwrite/auth";
import {login,logout} from './store/authSlice'
import {Header,Footer} from './components/index.js'
import {Outlet} from 'react-router-dom'
import ToastContainer from './components/Toast/Toast'

function App() {
const [loading,setLoading]=useState(true)


// everytime we open the website our state will always be updated 

const dispatch=useDispatch()

  useEffect(()=>{
    authService.getCurrentUser()
      .then((user)=> {
        console.log("user from getCurrentUser:", user);
        if (user){
          dispatch(login({userData:user}))
        }else{
          dispatch(logout())
        }
      })
      .finally(()=>setLoading(false))
  },[dispatch])
  return !loading ? (
      <div  className='min-h-screen flex flex-wrap content-between bg-gray-800'>
        <div className="w-full block">
          <h1 className="text-3xl">Test</h1>
          <Header/>
          <main>
          <Outlet/>
          </main>
          <Footer/>
        </div>
        <ToastContainer />
      </div>

  ) :
   null
}

export default App
