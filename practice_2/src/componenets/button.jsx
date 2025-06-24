import React from 'react';


export const Button = ( {colorName='red',colorClass='bg-white',onClick}) => {
    
    const style=" text-black  text-sm border border-black rounded h-14 w-25 px-4 py-2"
    
  return (
    <button className={`${colorClass} ${style}`} onClick={onClick}>{colorName}</button>
  )
}
