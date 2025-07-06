import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function Postcard( {$id,title,FeaturedImage}) {

  return (

    <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4" data-testid="post-card">
            <div className='w-full justify-center mb-4'>
              {FeaturedImage ? 
                (<img src={appwriteService.getFilePreview(FeaturedImage)} alt={title}
                className='rounded-xl'/>):( <div className='w-full bg-gray-300 rounded-lg' data-testid="no-image">No image </div>
                )}
            </div>
            <h2
            className="text
            -xl font-bold">{title}</h2>
        </div>
    </Link>
  )
}

export default Postcard