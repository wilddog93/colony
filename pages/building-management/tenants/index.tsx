import React, { useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';
import { MdAdd, MdArrowRightAlt, MdCleaningServices, MdClose, MdLocalHotel } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import { SearchInput } from '../../../components/Forms/SearchInput';
import Modal from '../../../components/Modal';

import { motion } from "framer-motion";
import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';

type Props = {}

const Tenants = (props: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [towers, setTowers] = useState(null);
  const [status, setStatus] = useState(null);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onClose = () => setIsOpenModal(false);
  const onOpen = () => setIsOpenModal(true);

  console.log(isOpenModal, 'open')

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
                  <Button
                    onClick={() => (isOpenModal ? onClose() : onOpen())}
                    className=''
                    type="button"
                    variant='primary'
                  >
                    Open
                  </Button>
                  {/* <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="save-button"
                    onClick={() => (isOpenModal ? onClose() : onOpen())}
                  >
                    Launch modal
                  </motion.button> */}
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Modal
        size=''
        onClose={onClose}
        isOpen={isOpenModal}
      >
        <ModalHeader
          className='p-4 border-b-2 border-gray mb-3'
          isClose={true}
        >
          <h3 className='text-lg font-semibold'>Modal Header</h3>
        </ModalHeader>
        <div className="w-full px-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, optio. Suscipit cupiditate voluptatibus et ut alias nostrum architecto ex explicabo quidem harum, porro error aliquid perferendis, totam iste corporis possimus nobis! Aperiam, necessitatibus libero! Sunt dolores possimus explicabo ducimus aperiam ipsam dolor nemo voluptate at tenetur, esse corrupti sapiente similique voluptatem, consequatur sequi dicta deserunt, iure saepe quasi eius! Eveniet provident modi at perferendis asperiores voluptas excepturi eius distinctio aliquam. Repellendus, libero modi eligendi nisi incidunt inventore perferendis qui corrupti similique id fuga sint molestias nihil expedita enim dolor aperiam, quam aspernatur in maiores deserunt, recusandae reiciendis velit. Expedita, fuga.
        </div>
        <ModalFooter
          className='p-4 border-t-2 border-gray mt-3'
          isClose={true}
        ></ModalFooter>
      </Modal>
    </DefaultLayout>
  )
}

export default Tenants;