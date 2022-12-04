import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react'

type Props = {
  children: ReactNode,
  sidebar: boolean,
  handleSidebar: () => void,
  images: string,
  header: string,
}

function Dekstop({ children, sidebar, handleSidebar, images, header }: Props) {
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
      <aside className={`fixed z-[1000] hidden md:flex hover:w-full max-w-xs transform transition-all duration-700 ease-in-out inset-y-0 shadow-lg lg:flex-shrink-0 bg-white w-full`}>
        <div className={`w-full mb-6 flex flex-col overflow-y-auto`}>
          {/* <!--Start logo --> */}
          <div className={`sticky top-0 z-40 bg-white shadow shadow-black/20 px-6 py-3.5 flex items-center transform transition-all duration-700 ease-in-out`}>
            <Link href="/">
              <div className="w-full">
                <div className="h-14 flex items-center">
                  <img
                    src={images ?? "./image/eclipse-icon.png"} alt="logo"
                    className="w-8 h-8 my-auto mr-5"
                  />
                  <span className='hover:visible font-extrabold text-lg lg:text-xl py-2 text-green-300'>{header || 'Building Management'}</span>
                </div>
              </div>
            </Link>
          </div>
          <ul className="mt-6 leading-10">
            {children}
          </ul>
          {/* <!--End NavItem --> */}
        </div>
      </aside>
      <div onClick={handleSidebar} className={`${sidebar && 'fixed z-40 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100'}`}></div>
    </div>
  )
}

export default Dekstop