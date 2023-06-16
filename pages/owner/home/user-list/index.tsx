import React, { useEffect, useState } from 'react'
import DomainLayouts from '../../../../components/Layouts/DomainLayouts'
import { MdChevronLeft, MdEdit, MdMuseum } from 'react-icons/md';
import Button from '../../../../components/Button/Button';
import Cards from '../../../../components/Cards/Cards';
import Barcharts from '../../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import PieCharts from '../../../../components/Chart/Piecharts';
import Tabs from '../../../../components/Layouts/Tabs';
import { menuManageDomainOwner, menuParkings } from '../../../../utils/routes';

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

                <div className='sticky z-40 top-0 w-full px-8'>
                  <div className='w-full flex items-center gap-4 justify-between mb-5 bg-white p-4 rounded-lg shadow-card'>
                    <h3 className='text-base lg:text-title-md font-semibold'>General Information</h3>
                    <div className='flex items-center gap-2'>
                      <Button
                        type="button"
                        variant='secondary-outline'
                        onClick={() => console.log("save")}
                        className="rounded-lg text-sm"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        variant='primary'
                        onClick={() => console.log("save")}
                        className="rounded-lg text-sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                  <div className='w-full'>
                    
                  </div>
                  <div className='px-2'>
                    <Cards
                      className='w-full bg-white p-6 shadow-card rounded-xl'
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, sit nihil sapiente voluptatibus cupiditate in consectetur quasi quibusdam odit ab unde voluptatum, accusamus ducimus ut numquam nobis sunt tempora veritatis doloremque eos rem mollitia reiciendis. Molestias ab aliquam officia rerum tempore eveniet dolorum? Suscipit repellendus iusto laboriosam quia accusamus dolorum, maiores reiciendis nobis non facilis saepe qui asperiores libero rem. Quo natus quis dolorum voluptatem ratione nostrum quaerat illum repudiandae voluptates fuga aliquam ipsum, quia repellat odit? Labore quidem eligendi eaque maiores eius eum, quis ipsam doloribus, at possimus dolor esse delectus, nam eos voluptatibus est sed? Iusto, provident sunt!
                    </Cards>
                  </div>
                </div>
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