import { useState } from "react";
import React from "react";
import { Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import { MdLogout } from "react-icons/md";

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div>
        <button
        onClick={() => setIsOpen(!isOpen)} 
        className="flex flex-row items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <p className="text-sm font-medium">Thomas Anree</p>
            <p className="text-xs">UX Designer</p>
          </div>
          <div className="h-12 w-12 rounded-full">
            <img src="../../image/user/user-01.png"></img>
          </div>
          <FaChevronDown className=" hidden md:flex" width="12" height="8" />
        </button>
      </div>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="origin-top-right absolute z-0 right-0 mt-2 px-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="flex flex-row items-center hover:rounded-lg space-x-2 px-4 py-2 border-b-[1px] border-slate-300 text-sm text-black hover:bg-primary hover:text-white" role="menuitem">
              <MdPersonOutline className="w-6 h-6"/>
              <span>Profile</span>
            </div>
            <div className="flex flex-row items-center hover:rounded-lg space-x-2 px-4 py-2 text-sm text-black hover:bg-primary hover:text-white" role="menuitem">
              <MdLogout className="w-6 h-6"/>
              <span>Log out</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default DropDown;
