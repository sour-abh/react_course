import React from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const {userName} = useParams()
  return (
    <div className='text-white bg-red-400 text-3xl rounded-lg'>User:{userName}</div>
  )
}

export default User
