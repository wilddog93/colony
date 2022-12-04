import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react'
import { MdClose } from "react-icons/md"
import Icon from '../../Icon';

type Props = {
  children: ReactNode,
  sidebar: boolean,
  handleSidebar: () => void,
  images: string,
  header: string,
}

function Mobile({ children, sidebar, handleSidebar, images, header }: Props) {
  let router = useRouter();

  const [logoutNotif, setLogoutNotif] = useState<Boolean>(false);

  const handleOpenSignout = () => {
    setLogoutNotif(true);
  };

  const handleCloseSignout = () => {
    setLogoutNotif(false);
  };

  const logout = async () => {
    console.log("logout")
  };

  return (
    <div className='relative group-hover:w-full'>
      <aside className={`font-sans flex md:hidden w-full max-w-xs transform transition-all duration-700 ease-in-out fixed inset-y-0 z-[101] shadow-lg lg:flex-shrink-0 overflow-y-auto bg-white ${sidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-full mb-6 flex flex-col">
          {/* <!--Start logo --> */}
          <div className={`sticky top-0 z-40 bg-white shadow shadow-black/20 p-4 flex justify-between items-center transform transition-all duration-700 ease-in-out`}>
            <Link href="/">
              <div className="flex w-12 h-12 rounded-lg items-center">
                <img
                  src={images ?? "/image/eclipse-icon.png"}
                  className="w-auto h-10"
                />
                <span className='ml-2 font-extrabold text-lg lg:text-xl py-2 text-green-300'>{header || 'Building Management'}</span>
              </div>
            </Link>
            <button
              onClick={handleSidebar}
              className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 focus:outline-none"
              type="button"
            >
              <MdClose className="text-gray-500 w-5 h-5" />
            </button>
          </div>
          <ul className="mt-6 leading-10">
            {children}
            <li className="relative mb-3 rounded-md flex items-center justify-center cursor-pointer px-4">
              <button
                onClick={handleOpenSignout}
                className={`text-sm inline-flex p-2 items-center w-full transition-colors duration-150 hover:text-green-400 hover:bg-green-100 dark:hover:text-green-200 rounded-lg text-gray-500`}>
                <Icon className="w-6 h-6" aria-hidden="true" icon="MdOutlineLogout" />
                <span className={`ml-2`}>Sign out</span>
              </button>
            </li>
          </ul>
          {/* <!--End NavItem --> */}
        </div>
      </aside>
      <div onClick={handleSidebar} className={`${sidebar && 'fixed z-[100] inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100'}`}></div>

      {/* Modal */}
      {/* <AlertModal
        isOpen={logoutNotif}
        closeModal={handleCloseSignout}
        title="Sign Out"
        content="Are you sure to sign out?"
        buttonText="Sign Out"
        variant="primary"
        sizes="max-w-sm"
        onSubmit={logout}
        icon={<QuestionMarkCircleIcon className="w-20 text-green-300" />}
      /> */}
    </div>
  )
}

export default Mobile