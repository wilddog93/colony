import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import { IconType } from "react-icons";

type Props = {
  menus?: any | any[];
  classMenu?: string;
  classListMenu?: string;
  classIcon?: string;
  menuName?: string;
  classMenuName?: string;
  menuIcon?: IconType | any;
  classMenuIcon?: string;
  position?: string;
};
export default function Dropdown({
  menus,
  classMenu,
  classListMenu,
  menuName,
  classMenuName,
  classIcon,
  classMenuIcon,
  menuIcon,
  position,
}: Props) {
  const [positions, setPositions] = useState<string>("left");

  useEffect(() => {
    if (!position) {
      setPositions("left");
    } else {
      setPositions(position as string);
    }
  }, [position]);

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className={`font-bold inline-flex w-full justify-center items-center px-4 py-2 text-sm hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${classMenuName}`}>
            {menuName || "-"}
            {menuIcon ? (
              <Icon
                className={`w-6 h-6 ${classMenuIcon}`}
                aria-hidden="true"
                icon={menuIcon}
              />
            ) : null}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items
            className={`absolute mt-2 w-32 origin-top-right divide-y divide-gray-3 rounded-md shadow-card bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
              positions == "left" ? "left-0" : "right-0"
            } ${classMenu}`}>
            {menus?.map?.((menu: any, idx: any) => (
              <div key={idx} className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={menu?.onClick}
                      className={`${
                        active ? "bg-primary text-white" : "text-gray-6"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}>
                      {!menu?.icon ? null : (
                        <Icon
                          className={`w-5 h-5 ${classIcon}`}
                          aria-hidden="true"
                          icon={menu.icon}
                        />
                      )}
                      <span className={`${classListMenu}`}>{menu?.name}</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
