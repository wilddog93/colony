import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import EditInfo from "./button/EditInfo";

const TenantSideBar = () => {
  return (
    <div className="h-screen w-full bg-[#1C2D3D] px-5 pt-6">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row items-center space-x-2 text-white">
            <FaChevronLeft />
            <span className=" text-lg">Back</span>
          </div>
          <EditInfo/> 
        </div>
        <div className="flex flex-col space-y-4 mt-5">
            <span className="text-white font-bold text-xl">4</span>
            <div className="flex flex-row space-x-2 items-center text-white">
                <FaBuilding className=" w-7 h-7"/>
                <span className="text-xl font-bold">Unit D</span>
            </div>
        </div>
        <div className="flex flex-col text-white space-y-2 mt-8">
            <span className="font-bold text-xl">Amenities</span>
            <span className="">Swimming Pool 1</span>
        </div>
      </div>
    </div>
  );
};

export default TenantSideBar;
