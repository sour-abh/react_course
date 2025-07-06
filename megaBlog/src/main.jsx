import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx'
import AllPosts from './pages/AllPosts.jsx'
import AddPost from './pages/AddPost.jsx'
import EditPost from './pages/EditPost'
import Post from './pages/Post.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import store  from './store/store.js';

import './index.css'
import {Protected} from './components/index.js';

import App from './App.jsx'
const router=createBrowserRouter([

  {
    path:'/',
    element:<App/>,
    children:[
      {path:'/',
        element:<Home/>,
      },
      {path:'/login',
        element:(<Protected authentication={false} >
          <Login/>
          </Protected>
        ),
      },
      {path:'/signup',
        element:(<Protected authentication={false} >
          <Signup/>
          </Protected>
        ),},

        {path:'/all-posts',
          element:(<Protected authentication >
            {" "}
            <AllPosts/>
            </Protected>
          ),
        },
        {path:'/add-post',
          element:(<Protected authentication >
            <AddPost/>
            </Protected>
          ),
        },

        {path:'/edit-post/:slug',
          element:(<Protected authentication>
            {" "}
            <EditPost/>
            </Protected>
          ),
        },

        {path:'/post/:slug',
          element:(<Post/>
          ),
        },
    ]
      },



    
  
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store} >
    <RouterProvider router={router}/>
  </Provider>
  </React.StrictMode>,
)
