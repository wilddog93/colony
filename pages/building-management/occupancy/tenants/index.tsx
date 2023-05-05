import React, { useState } from 'react'
import DefaultLayout from '../../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../../components/Layouts/Sidebar/Building-Management';
import { MdAdd, MdArrowRightAlt, MdChevronLeft, MdCleaningServices, MdClose, MdLocalHotel } from 'react-icons/md';
import Button from '../../../../components/Button/Button';
import { SearchInput } from '../../../../components/Forms/SearchInput';
import Modal from '../../../../components/Modal';

import { ModalFooter, ModalHeader } from '../../../../components/Modal/ModalComponent';
import { useRouter } from 'next/router';
import DefaultTables from '../../../../components/tables/layouts/DefaultTables';
import RowSelectTables from '../../../../components/tables/layouts/RowSelectTables';
import Tables from '../../../../components/tables/layouts/Tables';
import DropdownSelect from '../../../../components/Dropdown/DropdownSelect';

type Props = {}

const sortOpt = [
  { value: "A-Z", label: "A-Z" },
  { value: "Z-A", label: "Z-A" },
];

const stylesSelect = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
    flexDirection: "row-reverse"
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none'
  }),
  dropdownIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  clearIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  singleValue: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
    })
  },
  control: (provided: any, state: any) => {
    console.log(provided, "control")
    return ({
      ...provided,
      background: "",
      padding: '.6rem',
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7"
      },
      minHeight: 40,
      flexDirection: "row-reverse"
    })
  },
  menuList: (provided: any) => (provided)
};

const Tenants = (props: any) => {
  const router = useRouter();
  const { pathname, query } = router

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);

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
      logo="../../image/logo/logo-icon.svg"
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      description=""
    >
      <div className='absolute inset-0 mt-20 z-9 bg-boxdark flex text-white'>
        <SidebarBM sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2'>
            <div className='w-full flex items-center justify-between py-3 lg:hidden'>
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
            </div>

            <div className='w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0'>
              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3 border-0 gap-2.5'
                onClick={() => router.back()}
                variant='secondary-outline'
                key={'1'}
              >
                <MdChevronLeft className='w-6 h-6 text-gray-4' />
                <div className='flex flex-col gap-1 items-start'>
                  <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Tenant List</h3>
                  <span className='text-gray-4 font-semibold text-lg'>322 Registered User</span>
                </div>
              </Button>
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
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className='w-full flex flex-col lg:flex-row gap-2.5 px-4'>
                <div className='w-full lg:w-3/4'>
                  <SearchInput
                    className='w-full text-sm rounded-xl'
                    classNamePrefix=''
                    filter={search}
                    setFilter={setSearch}
                    placeholder='Search...'
                  />
                </div>
                <div className='w-full lg:w-1/4 flex flex-col lg:flex-row items-center gap-2'>
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={sort}
                    onChange={setSort}
                    error=""
                    className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId='1'
                    isDisabled={false}
                    isMulti={false}
                    placeholder='Sorts...'
                    options={sortOpt}
                    icon='MdSort'
                  />
                </div>
              </div>

              {/* table */}
              <Tables
                loading={loading}
                setLoading={setLoading}
                page={pages}
                setPage={setPages}
                limit={limit}
                setLimit={setLimit}
                totalPage={pageCount}
              />
            </div>
          </main>
        </div>
      </div>

      {/* modal example */}
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