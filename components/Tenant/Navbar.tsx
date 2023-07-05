import React from 'react'
import { FaBell } from 'react-icons/fa'
import DropDown from './button/DropDown'

const Navbar = () => {
  return (
    <div className='p-5 bg-[#111F2C] flex flex-row sticky top-0 z-999 justify-between items-center text-white'>
        <div className='flex flex-row items-center space-x-2'>
            <img src='../../image/logo-icon.svg' className=''></img>
            <p className='text-2xl font-semibold'>Colony</p>
        </div>
        <div className='flex flex-row items-center gap-4'>
            <DropDown/>
            <div className="relative h-10 mx-3">
                <div className="border-l border-gray absolute inset-y-0"></div>
            </div>
            
            <button className='relative flex h-8.5 w-8.5 items-center justify-center rounded-full hover:text-gray text-white'>
                <FaBell/>
            </button>

        </div>
    </div>
  )
}

export default Navbar