import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,createBrowserRouter,RouterProvider} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Layout from './Layout.jsx';
import Home from './components/home/Home.jsx';
import About from './components/About/About.jsx';
import Contact from './components/Contact/contact.jsx';
import { Profile,githubLoaderInfo } from './components/github/profile.jsx';
import User from './components/User/User.jsx';
const router=createBrowserRouter(
  [{
    path:"/",
    element:<Layout/>,
    children:[
      {path:"",element:<Home />},
      {path:"about",element:<About/>},
      {path:"contact",element:<Contact/>},
 
      {path:"user/:userName",element:<User/>},
      {path:"user/:userName",element:<User />},
      { loader:githubLoaderInfo,path:"github",element:<Profile />},
    ]

  }]
)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<div>Loading..</div>} />
  </React.StrictMode>
)
