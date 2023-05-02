import React, { useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';
import { MdAdd, MdArrowRightAlt, MdCleaningServices, MdLocalHotel } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import { SearchInput } from '../../../components/Forms/SearchInput';
import Modal from '../../../components/Modal';

type Props = {}

const Tenants = (props: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [towers, setTowers] = useState(null);
  const [status, setStatus] = useState(null)

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tenant Management"
      logo="../image/logo/logo-icon.svg"
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      description=""
    >
      <div className='absolute left-0 top-20 bottom-0 right-0 z-99 bg-boxdark flex text-white'>
        <SidebarBM sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='shadow-bottom sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2'>
            <div className='w-full flex items-center justify-between py-3'>
              <button
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation()
                  setSidebarOpen(!sidebarOpen)
                }}
                className='rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden'
              >
                <MdArrowRightAlt className={`w-5 h-5 delay-700 ease-in-out ${sidebarOpen ? "rotate-180" : ""}`} />
              </button>
              <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Tenant Management</h3>
            </div>

            <div className='w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto'>
              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => console.log("klik")}
                variant='primary-outline'
                key={'1'}
              >
                <span className='hidden lg:inline-block'>Amenities</span>
                <MdLocalHotel className='w-4 h-4' />
              </Button>

              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => console.log("klik")}
                variant='primary-outline'
                key={'2'}
              >
                <span className='hidden lg:inline-block'>Facilities</span>
                <MdCleaningServices className='w-4 h-4' />
              </Button>

              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => console.log("klik")}
                variant='primary'
                key={'3'}
              >
                <span className='hidden lg:inline-block'>New Tower</span>
                <MdAdd className='w-4 h-4' />
              </Button>
            </div>
          </div>

          <main className='relative tracking-wide text-left text-boxdark-2'>
            <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 focus-within:text-primary">
              {/* content */}
              <div className='w-full flex flex-col lg:flex-row gap-2.5'>
                <div>
                  <SearchInput 
                    className='' 
                    classNamePrefix='' 
                    filter={search} 
                    setFilter={setSearch} 
                    placeholder='Search...' 
                  />
                </div>
                <div>
                  
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Tenants;