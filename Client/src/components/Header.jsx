import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mh-6' alt="" />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer <img src={assets.hand_wave} alt="" /></h1>
      <h2 className='text-3xl sm:text-4xl font-semibold mb-4'>Welcome to our app</h2>
      <p className='mb-8 maxw-md'>Let's start with a product tour and we will have you up and running in no time!</p>
      <button className='border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all '>Get Started</button>
    </div> 
  )
}

export default Header
