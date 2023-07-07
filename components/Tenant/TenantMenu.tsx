import React, { useState } from "react";
import TransactionHistory from "./TransactionHistory";
import BillingHistory from "./BillingHistory";
import { MdSearch } from "react-icons/md";

const TenantMenu = () => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [isActive, setIsActive] = useState(true);

  const handleClick = (componentName: string) => {
    setActiveComponent(componentName);
  };

  return (
    <div>
      <div className="hidden md:flex flex-row justify-start items-center">
        <ul className="flex items-center w-full">
          <li
            onClick={() => handleClick("TransactionHistory")}
            className="mx-2 font-bold cursor-pointer active:border-b-[#5F59F7] p-2 hover:text-[#5F59F7] hover:border-b-[#5F59F7]"
          >
            <span>Transaction History</span>
          </li>
          <li
            onClick={() => handleClick("BillingHistory")}
            className="mx-2 font-bold cursor-pointer active:border-b-[#5F59F7] p-2 hover:text-[#5F59F7] hover:border-b-[#5F59F7]"
          >
            <span>Billing History</span>
          </li>
        </ul>
      </div>
      <div className="w-full h-[1px] bg-slate-400"></div>
      <div className="flex-row mt-4 flex w-full items-center">
        <div className="w-full flex flex-row items-center p-2 bg-white border-[1px] border-slate-400 rounded-lg shadow-sm">
          <MdSearch className="w-6 h-6 text-slate-400 mr-2"/>
          <input
            type="text"
            placeholder="Search"
            className="focus:outline-0 w-full"
          />
        </div>
      </div>
      <div>
        {activeComponent === "TransactionHistory" && <TransactionHistory />}
        {activeComponent === "BillingHistory" && <BillingHistory />}
      </div>
    </div>
  );
};

export default TenantMenu;
