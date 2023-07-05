import { useState } from "react";
import React from "react";
import { FaChevronDown } from 'react-icons/fa'

const DropDown = () => {

    const [isOpen,setIsopen] = useState(false)

  return (
    <button className='flex flex-row items-center gap-4'>
      <div className="hidden md:flex flex-col text-right">
        <p className="text-sm font-medium">Thomas Anree</p>
        <p className="text-xs">UX Designer</p>
      </div>
      <div className="h-12 w-12 rounded-full">
        <img src="../../image/user/user-01.png"></img>
      </div>
      <FaChevronDown className=" hidden md:flex" width="12" height="8" />
    </button>
  );
};

export default DropDown;
