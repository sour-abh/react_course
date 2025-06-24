import React from 'react';
import {useState} from 'react';
import { Button } from './button';

export const ButtonBar = () => {
      const colors={red:"bg-red-500 ",
        blue:"bg-blue-500",
        green:"bg-green-500",
        yellow:"bg-amber-500",
        emerald:"bg-emerald-700",
        black:"bg-black",
        cyan:"bg-cyan-900"}

      const[bgColor,setBgColor]=useState('bg-white');

  return (
    <div className={`${bgColor} h-screen flex flex-col items-center justify-center`}>
    <div className='flex gap-4 p-8'>
      {Object.entries(colors).map(([name,className]) =>(<Button key={name} colorName={name} colorClass={className} onClick={()=>setBgColor(className)}/>))}
    </div>
    </div>

  )
}
