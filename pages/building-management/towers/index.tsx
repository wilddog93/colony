import React, { Fragment, useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';
import Button from '../../../components/Button/Button';
import { MdAdd, MdArrowDropDown, MdArrowRightAlt, MdCleaningServices, MdEdit, MdLocalHotel, MdLocationOn, MdMoreHoriz } from 'react-icons/md';
import Cards from '../../../components/Cards/Cards';
import DropdownDefault from '../../../components/Dropdown/DropdownDefault';
import CardTower from '../../../components/BM/Towers/CardTower';
import Modal from '../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';

type Props = {}

const Towers = (props: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenTower, setIsOpenTower] = useState(false);
  const [isOpenAmenities, setIsOpenAmenities] = useState(false);
  const [isOpenFacilities, setIsOpenFacilities] = useState(false);

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tower Management"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
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
              <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Tower Management</h3>
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
                onClick={() => setIsOpenTower(true)}
                variant='primary'
              >
                <span className='hidden lg:inline-block'>New Tower</span>
                <MdAdd className='w-4 h-4' />
              </Button>
            </div>
          </div>

          <main className='relative tracking-wide text-left text-boxdark-2'>
            <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* cards */}
              <CardTower items={""} />

              <CardTower items={""} />

              <CardTower items={""} />
            </div>
          </main>
        </div>
      </div>

      {/* modal */}
      <Modal
        isOpen={isOpenTower}
        onClose={() => setIsOpenTower(false)}
        size=''
      >
        <ModalHeader isClose={true} className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
          <h3 className='text-lg font-semibold'>New Tower</h3>
        </ModalHeader>
        <div className="w-full px-6">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, distinctio ullam. Cupiditate, nostrum eligendi voluptatibus beatae laboriosam odit facilis ea nihil corporis id dolorum totam, expedita, repellendus nemo natus eius sed qui deleniti molestias maiores ipsam distinctio aliquam? Quaerat reprehenderit, quae in fugit odit mollitia molestias qui possimus nostrum rem ipsa consequatur corrupti sed nemo repellat optio debitis architecto eligendi. Pariatur sed blanditiis dicta aspernatur, cumque sunt, eligendi obcaecati magni eaque tempore dolorem possimus tenetur. Aut distinctio veniam rerum commodi laboriosam laborum reprehenderit earum asperiores praesentium molestiae vel consequuntur dolore, dolorum nihil quisquam? Similique assumenda nostrum eius esse qui nihil!
        </div>
        <ModalFooter
          className='sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3'
          isClose={true}
        ></ModalFooter>
      </Modal>
    </DefaultLayout>
  )
}

export default Towers;