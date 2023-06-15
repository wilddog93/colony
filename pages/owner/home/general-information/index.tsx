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
import { getDomainId, selectDomainAccess } from '../../../../redux/features/domainAccess/domainAccessReducers';

// googlemap

type Props = {
  pageProps: any
}

type FormValues = {
  id?: number | string | null;
  domainName?: string | null;
  domainLogo?: string | null;
  domainDescription?: string | null;
  legalEntityName?: string | null;
  url?: any | null;
  website?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  country?: any | null;
  province?: any | null;
  city?: any | null;
  postCode?: string | null;
  street?: string | null;
  gpsLatitude?: string | null;
  gpsLongitude?: string | null;
  searchGoogleMap?: any;
};

const DomainInformation = ({ pageProps }: Props) => {

  const router = useRouter();
  const { pathname, query } = router;
  const { token, accessId, access, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { domain } = useAppSelector(selectDomainAccess);
  const { data } = useAppSelector(selectAuth);

  const [formData, setFormData] = useState<FormValues>({})

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  console.log(accessId, 'id')

  useEffect(() => {
    let id = accessId;
    if (accessId) {
      dispatch(getDomainId({ id, token }))
    }
  }, [accessId]);

  const getWebString = (value: any) => {
    let condition = value?.slice(0, 8) === "https://";
    if (!value) {
      return ({
        website: null,
        url: null,
      })
    } else {
      if (condition) {
        return { website: value?.slice(8), url: { value: value?.slice(0, 8), label: value?.slice(0, 8) } }
      } else {
        return { website: value?.slice(7), url: { value: value?.slice(0, 7), label: value?.slice(0, 7) } }
      }
    }
  }

  useEffect(() => {
    if (domain) {
      setFormData({
        ...domain,
        url: getWebString(domain?.website).url,
        website: getWebString(domain?.website).website,
        phoneNumber: !domain?.phoneNumber ? "" : domain?.phoneNumber,
        country: domain?.country ? { label: domain?.country, name: domain?.country } : null,
        province: domain?.province ? { label: domain?.province, name: domain?.province } : null,
        city: domain?.city ? { label: domain?.city, name: domain?.city } : null,
      })
    }
  }, [domain])

  console.log(domain, 'data domain')

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
                <FormInfoDomain items={formData} token={token} id={accessId} />

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
  const accessId = cookies['accessId'] || null;
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
    props: { token, access, accessId, firebaseToken },
  };
};

export default DomainInformation;