import { useState } from "react";
import React from "react";
import { MdSettings } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";

const EditInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

    const checked = ()=>{
        setIsChecked(true);
    }

    const unChecked = () =>{
        setIsChecked(false);
    }

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopUp = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={openPopup}
        className="flex flex-row space-x-2 bg-white rounded-lg content-center items-center text-slate-400 p-2"
      >
        <span>Edit Info</span>
        <MdSettings className=" w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg flex items-center justify-center">
          <div className="absolute inset-0 z-30 bg-black opacity-70"></div>
          <div className="relative mx-auto w-full inline-block text-left align-middle transition-all transform max-w-2xl z-50 opacity-100 scale-100">
            <div className="bg-white flex flex-col rounded-lg z-50 p-4">
              <div className="flex flex-row justify-between items-center border-b-2 border-b-slate-300 pb-2">
                <h1 className="text-xl">Edit Info</h1>
                <svg
                  onClick={closePopUp}
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  className="text-gray-500 w-5 h-5 cursor-pointer"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </div>
              <div className="flex flex-row w-full mt-2">

                <div className="flex flex-col w-1/2 p-2">
                  <h1 className="font-bold text-lg">Amenities</h1>
                  <div className="p-2 w-full rounded-lg flex flex-col space-y-2 bg-slate-300">
                    <div className="flex-row flex w-full items-center">
                      <div className="w-full flex flex-row items-center p-2 bg-white rounded-lg shadow-sm">
                        <MdSearch className="w-6 h-6 text-slate-400 mr-2" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="focus:outline-0 w-full"
                        />
                      </div>
                    </div>
                    <div className="max-h-36 overflow-y-auto w-full flex flex-col space-y-2">
                        <div className="w-full flex flex-row items-center p-2 space-x-2 bg-white rounded-lg shadow-sm">
                            <button onClick={() => setIsChecked(!isChecked)}>
                                
                            
                            {!isChecked ?(
                             <MdCheckBoxOutlineBlank className="h-5 w-5"/>                       
                            ):(
                                <MdOutlineCheckBox className="h-5 w-5"/>
                            )

                            }</button>
                            <span className=" text-base"><b>DP</b> - Dog Park</span>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col border-l-[1px] border-slate-300 w-1/2 p-2">
                    <h1 className="font-bold text-lg border-b-2 border-slate-300">List of Amenities</h1>
                </div>
              </div>
                    <button className="flex justify-center items-center mt-2 p-2 rounded-lg bg-primary border-[1px] text-white shadow-sm w-full">
                        Upload Video
                    </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditInfo;
