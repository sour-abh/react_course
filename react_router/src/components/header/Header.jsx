import React from 'react'
import {Link, NavLink} from 'react-router-dom' 

const Header = () => {
  return (
    <header className="shadow sticky z-50 top-0">
        <nav className="bg-white border-gray-200 px-4  lg:px-6 py-2.5">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl ">
                <Link to="/" className="flex items-center">
                    <img src="https://www.logoai.com/uploads/output/2025/06/18/189e9f37e8a82227100661c53f39122b.jpg" className='mr-3 h-20' alt='Logo'/>
                </Link>
                <div className=" felx-items-center lg:order-2">
                <Link to="#" className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none">
                Log in </Link>
                <Link to="#" className="bg-red-600 rounded-lg text-white text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-red-700 focus:ring-4 focus:ring-red-800 focus:outline-none "  >
                Get started  
                </Link>
                </div>
                <div className="  justify-between items-center w-full lg:flex lg:w-auto lg:order-1 " id="mobile-menu-2">
                   <ul className="flex flex-col mt-4 font-medum lg:flex-row lg:space-x-8 lg:mt-0">
                    <li> <NavLink className={({isActive})=>`block py-2   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `} to="/">HOME
                      </NavLink>
                      </li>
                      <li> <NavLink className={({isActive})=>`block py-2   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `} to="/about">About us
                      </NavLink>
                      </li>
                      <li> <NavLink  to="/contact"className={({isActive})=>`block py-2   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `}>Contact
                      </NavLink>
                      </li>
                      <li> <NavLink to='/github' className={({isActive})=>`block py-2   pr-4 pl-3 duration-200 ${isActive ?"text-red-700":"text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-red-600 lg:p-0 `}>GitHub
                      </NavLink>
                      </li>
                   </ul>

                </div> 
            </div>
        </nav>
    </header>
  )
}

export default Header