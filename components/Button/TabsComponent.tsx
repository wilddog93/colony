import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useRouter } from "next/router";
import Icon from "../Icon";

type Props = {
  variant?: string | any;
  menus?: any | any[];
  value: string | any;
  setValue: Dispatch<SetStateAction<any>>;
  className?: string;
};

const TabsComponent = ({
  variant,
  menus,
  value,
  setValue,
  className,
}: Props) => {
  const primary =
    "flex flex-col md:flex-row overflow-x-auto scrollbar-none bg-white shadow-card rounded gap-2 transform transition-all duration-300";
  const underline =
    "flex flex-col md:flex-row overflow-x-auto scrollbar-none shadow ronded gap-2 transform transition-all duration-300";
  const [isMobile, setIsMobile] = useState(false);
  const [variants, setVariants] = useState<any>(null);

  const handleTabs = (val: any) => {
    setValue(val);
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  // console.log(isMobile, 'mobile')

  useEffect(() => {
    if (variant == underline) {
      setVariants(underline);
    } else {
      setVariants(primary);
    }
  }, [variant]);

  return (
    <div className="w-full mx-auto text-gray-5">
      <div className="flex w-full md:hidden items-center justify-between bg-white px-6 py-4">
        {/* <!-- Hamburger Toggle BTN --> */}
        <button
          aria-controls="header"
          aria-expanded={isMobile}
          onClick={(e) => {
            e.stopPropagation();
            setIsMobile(!isMobile);
          }}
          className="z-99999 block rounded-lg border p-1.5 shadow-sm border-primary bg-primary">
          <span className="relative block h-5.5 w-5.5 cursor-pointer">
            <span className="du-block absolute right-0 h-full w-full">
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-[0] duration-200 ease-in-out bg-white ${
                  !isMobile && "!w-full delay-300"
                }`}></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-150 duration-200 ease-in-out bg-white ${
                  !isMobile && "delay-400 !w-full"
                }`}></span>
              <span
                className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-200 duration-200 ease-in-out bg-white ${
                  !isMobile && "!w-full delay-500"
                }`}></span>
            </span>
            <span className="absolute right-0 h-full w-full rotate-45">
              <span
                className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300 duration-200 ease-in-out bg-white ${
                  !isMobile && "!h-0 !delay-[0]"
                }`}></span>
              <span
                className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out bg-white ${
                  !isMobile && "!h-0 !delay-200"
                }`}></span>
            </span>
          </span>
        </button>
        {/* <!-- Hamburger Toggle BTN --> */}
      </div>

      <div
        className={`${variants} ${
          isMobile ? "-translate-y-full scale-0" : "translate-y-1 scale-100"
        }`}
        style={{ boxShadow: "inset 0 -2px 0 #edf2f7" }}>
        {!isMobile &&
          menus?.length > 0 &&
          menus?.map((menu: any, idx: any) => {
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleTabs(menu?.pathname)}
                className={`${
                  value === menu?.pathname
                    ? "border-primary font-bold mb-3 md:mb-0 text-primary"
                    : "text-gray-500 hover:text-gray-700 border-transparent"
                } items-center gap-1 block py-4 text-base border-b-4 rounded focus:outline-none whitespace-no-wrap ${className}`}>
                {menu.icon ? (
                  <Icon
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                    icon={menu?.icon}
                  />
                ) : null}
                <span>{menu?.pathname}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default TabsComponent;
