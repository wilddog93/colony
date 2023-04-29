import React, { useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';

type Props = {}

const Areas = (props: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Area Grouping"
      logo="../image/logo/logo-icon.svg"
      description=""
    >
      {/* <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
      </div>

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div className='col-span-12 xl:col-span-8'>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, voluptates.</div>
        </div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, dicta.</div>
      </div> */}
      <div className='absolute left-0 top-20 bottom-0 right-0 z-99 bg-boxdark flex text-white'>
        {/* <div className={`flex w-full lg:w-90 flex-col overflow-y-hidden duration-300 ease-linear p-4 md:p-6 2xl:p-10 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className='w-full px-4 overflow-auto'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid, voluptate!
          </div>
        </div> */}
        <SidebarBM sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="w-full bg-white lg:rounded-tl-[3rem] p-4 md:p-6 2xl:p-10">
          <button
            aria-controls='sidebar'
            aria-expanded={sidebarOpen}
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className='rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden'
          >
            <span className='relative block h-5.5 w-5.5 cursor-pointer'>
              <span className='du-block absolute right-0 h-full w-full'>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-[0] duration-200 ease-in-out bg-white ${!sidebarOpen && '!w-full delay-300'
                    }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-150 duration-200 ease-in-out bg-white ${!sidebarOpen && 'delay-400 !w-full'
                    }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-200 duration-200 ease-in-out bg-white ${!sidebarOpen && '!w-full delay-500'
                    }`}
                ></span>
              </span>
              <span className='absolute right-0 h-full w-full rotate-45'>
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300 duration-200 ease-in-out bg-white ${!sidebarOpen && '!h-0 !delay-[0]'
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out bg-white ${!props.sidebarOpen && '!h-0 !delay-200'
                    }`}
                ></span>
              </span>
            </span>
          </button>
          <div className='tracking-wide text-left text-boxdark-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora maiores obcaecati nobis magni labore, ipsum maxime, aut qui, eaque in exercitationem optio beatae dicta dolorem illum! Minus vero inventore veniam!
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Areas;