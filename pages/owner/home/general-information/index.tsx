import React, { useEffect, useState } from 'react'
import DomainLayouts from '../../../../components/Layouts/DomainLayouts'
import { MdChevronLeft, MdMuseum } from 'react-icons/md';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import Tabs from '../../../../components/Layouts/Tabs';
import { menuManageDomainOwner } from '../../../../utils/routes';
import FormInfoDomain from '../../../../components/Forms/owner/general-information/FormInfoDomain';

// googlemap

type Props = {
  pageProps: any
}

const DomainInformation = ({ pageProps }: Props) => {
  
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);


  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Home"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5"
      }}
    >
      <div className='w-full absolute inset-0 z-99 bg-boxdark flex text-white'>
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <div className='w-full relative tracking-wide text-left text-boxdark-2 mt-20 overflow-hidden'>
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className='static z-40 top-0 w-full mt-6 px-8 bg-gray'>
                  <div className='w-full mb-5'>
                    <button
                      type='button'
                      className='focus:outline-none flex items-center gap-2'
                      onClick={() => router.push("/owner/home")}
                    >
                      <MdChevronLeft className='w-5 h-5' />
                      <h3 className='text-lg lg:text-title-lg font-semibold'>Manage Domain</h3>
                    </button>
                  </div>

                  <div className='w-full mb-5'>
                    <Tabs menus={menuManageDomainOwner} />
                  </div>
                </div>

                {/* Form */}
                <FormInfoDomain items={""} token={token} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </DomainLayouts>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context)

  // Access cookies using the cookie name
  const token = cookies['accessToken'] || null;
  const access = cookies['access'] || null;
  const firebaseToken = cookies['firebaseToken'] || null;

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default DomainInformation;