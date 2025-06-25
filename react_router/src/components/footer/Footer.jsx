import React from 'react'
import {Link,NavLink} from 'react-router-dom'
import {Youtube,Github,Linkedin,Facebook} from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-white border-y">
        <div className="mx-auto w-full max-w-screen-xl p-4 lg:py-8">
            <div className="md:flex md:justify-between">
                <div className= " md:mb-0 mt-7.5">

                    <Link to="/" className="flex items-center">
                    <img src="https://www.logoai.com/uploads/output/2025/06/18/189e9f37e8a82227100661c53f39122b.jpg" className="mr-3 h-24 " alt="logo"/></Link>
                </div>
                <div >
                  <h2 className="text-xl text-red-600 font-semibold">Quick links</h2>
                  <ul className="my-5">
                    <li className=" pt-3 pb-6"> <NavLink className={({isActive})=>`block py-2   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `} to="/">HOME
                    </NavLink></li>
                    <li><NavLink className={({isActive})=>`block py-10   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `} to="/about">About us
                    </NavLink></li>
                  </ul>

                </div>
                <div>
                  <div className=''>
                  <h2 className=" text-red-600 font-semibold pb-2">Follow our newsletter</h2>
                  <input type="text" placeholder=" your Email" className="border-2 border-red-600 placeholder:text-red-400 placeholder:pl-5 outline-none w-full rounded-lg mb-2"/>
                  <button type='button' className="outline-none bg-red-600 rounded-lg  w-full pb-2 my-2" >Subscribe</button>
                  </div>

                  <ul className="flex mt-5 items-center justify-center ">
                    <li className="px-4">
                      <Link to="https://github.com/sour-abh">
                      <Github className=" text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200"/>
                      </Link>
                      </li>
                  <li className="px-4">
                  <Link to="/">
                      <Facebook className=" text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200"/>
                      </Link>
                  </li>
                  <li className="px-4">
                  <Link to="https://github.com/sour-abh">
                      <Youtube className=" text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200"/>
                      </Link>
                  </li>
                  <li className="px-4">
                  <Link to="https://github.com/sour-abh">
                      <Linkedin className=" text-gray-700 hover:text-red-500 cursor-pointer transition-colors duration-200"/>
                      </Link></li>
                      </ul>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
