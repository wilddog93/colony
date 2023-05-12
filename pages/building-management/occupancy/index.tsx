import React, { Fragment, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts'
import SidebarBM from '../../../components/Layouts/Sidebar/Building-Management';
import { MdAdd, MdArrowRightAlt, MdCleaningServices, MdClose, MdDelete, MdLocalHotel, MdOutlinePeople, MdOutlineVpnKey } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal';

import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';
import { useRouter } from 'next/router';
import { ColumnItems } from '../../../components/tables/components/makeData';
import Cards from '../../../components/Cards/Cards';
import { useScrollPosition } from '../../../utils/useHooks/useHooks';

type Props = {}

const Occupancy = (props: any) => {
  const router = useRouter();
  const { pathname, query } = router;

  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<ColumnItems>();
  const [isSelectedRow, setIsSelectedRow] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const { scrollPosition, lastScrollPosition } = useScrollPosition();
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [offsetHight, setOffsetHight] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);


  let refTable = useRef<HTMLTableSectionElement>(null)

  const loadHandler = () => {
    setLimit(limit => limit + 10);
  }

  const handleScroll = () => {
    const table = refTable.current;
    const scrollTo = table?.scrollTop;
    const offsetHeight = table?.offsetHeight;
    const scrollHeight = table?.scrollHeight;
    console.log('scroll To:', scrollTo);
    console.log('scroll Heigh:', scrollHeight);
    console.log("scroll scrollOffsetHeight: ", offsetHeight)

    if (scrollTo) setScrollPosition(scrollTo)
    if (scrollHeight) setScrollHeight(scrollHeight)
    if (offsetHeight) setOffsetHight(offsetHeight)

    if (!scrollHeight || !offsetHeight || !scrollTo) {
      return;
    } else {
      if (scrollHeight - scrollTo === offsetHeight) {
        loadHandler()
      }
    }
  };

  // useEffect(() => {
  //   if(scrollHeight - scrollPosition === offsetHight){
  //     loadHandler()
  //   }
  // }, [scrollHeight, scrollPosition, offsetHight]);

  console.log(limit, 'limits')


  // form modal
  const onClose = () => setIsOpenModal(false);
  const onOpen = () => setIsOpenModal(true);

  // detail modal
  const onCloseDetail = () => {
    setDetails(undefined)
    setIsOpenDetail(false)
  };
  const onOpenDetail = (items: any) => {
    setDetails(items)
    setIsOpenDetail(true)
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Occupancy"
      logo="../image/logo/logo-icon.svg"
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      description=""
    >
      <div className='absolute inset-0 mt-20 z-9 bg-boxdark flex text-white'>
        <SidebarBM sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2'>
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
              <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Occupancy</h3>
            </div>

            <div className='w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto'>
              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => router.push("occupancy/tenants")}
                variant='primary-outline'
                key={'1'}
              >
                <span className='hidden lg:inline-block text-graydark'>Tenant List</span>
                <MdOutlinePeople className='w-5 h-5' />
              </Button>

              <Button
                type="button"
                className='rounded-lg text-sm font-semibold py-3'
                onClick={() => console.log("klik")}
                variant='primary-outline'
                key={'2'}
              >
                <span className='hidden lg:inline-block text-graydark'>New Request</span>
                <MdOutlineVpnKey className='w-4 h-4' />
              </Button>
            </div>
          </div>

          <main className='tracking-wide text-left text-boxdark-2 mt-5'>
            <div className="w-full flex flex-col">
              {/* content */}
              <div className="w-full flex flex-col sm:flex-row gap-2.5 tracking-wider mb-5">
                <Cards className='w-full sm:w-2/4 lg:w-1/4 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray'>
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Occupancy Level</h1>
                    <div className='w-full flex items-center gap-2'>
                      <span className='w-full max-w-max font-semibold'>86%</span>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="overflow-hidden h-3 text-xs flex rounded-xl bg-[#EFEAD8] shadow-card w-full my-auto">
                          <div style={{ width: "70%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary hover:opacity-50 font-semibold text-[.5rem]">70%</div>
                          <div style={{ width: "10%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-warning hover:opacity-50 font-semibold text-[.5rem]">16%</div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex flex-col lg:flex-row items-center text-xs tracking-normal justify-between'>
                      <p>322 Occupied</p>
                      <p>400 Owned</p>
                      <p>500 Units</p>
                    </div>
                  </div>
                </Cards>

                <Cards className='w-full sm:w-2/4 lg:w-1/4 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray'>
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Occupancy Level</h1>
                    <div className='w-full flex items-center gap-2'>
                      <span className='w-full max-w-max font-semibold'>86%</span>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="overflow-hidden h-3 text-xs flex rounded-xl bg-[#EFEAD8] shadow-card w-full my-auto">
                          <div style={{ width: "70%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary hover:opacity-50 font-semibold text-[.5rem]">70%</div>
                          <div style={{ width: "10%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-warning hover:opacity-50 font-semibold text-[.5rem]">16%</div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex flex-col lg:flex-row items-center text-xs tracking-normal justify-between'>
                      <p>322 Occupied</p>
                      <p>400 Owned</p>
                      <p>500 Units</p>
                    </div>
                  </div>
                </Cards>

                <Cards className='w-full sm:w-2/4 lg:w-1/4 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray'>
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Occupancy Level</h1>
                    <div className='w-full flex items-center gap-2'>
                      <span className='w-full max-w-max font-semibold'>86%</span>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="overflow-hidden h-3 text-xs flex rounded-xl bg-[#EFEAD8] shadow-card w-full my-auto">
                          <div style={{ width: "70%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary hover:opacity-50 font-semibold text-[.5rem]">70%</div>
                          <div style={{ width: "10%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-warning hover:opacity-50 font-semibold text-[.5rem]">16%</div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex flex-col lg:flex-row items-center text-xs tracking-normal justify-between'>
                      <p>322 Occupied</p>
                      <p>400 Owned</p>
                      <p>500 Units</p>
                    </div>
                  </div>
                </Cards>

                <Cards className='w-full sm:w-2/4 lg:w-1/4 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray'>
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Occupancy Level</h1>
                    <div className='w-full flex items-center gap-2'>
                      <span className='w-full max-w-max font-semibold'>86%</span>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="overflow-hidden h-[.5rem] text-xs flex rounded-xl bg-[#EFEAD8] shadow-card w-full my-auto">
                          <div style={{ width: "70%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary hover:opacity-50 font-semibold text-[.5rem]">70%</div>
                          <div style={{ width: "10%" }} className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-warning hover:opacity-50 font-semibold text-[.5rem]">16%</div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex flex-col lg:flex-row items-center text-xs tracking-normal justify-between'>
                      <p>322 Occupied</p>
                      <p>400 Owned</p>
                      <p>500 Units</p>
                    </div>
                  </div>
                </Cards>
              </div>

              {/* table */}
              <div className="grid grid-cols-1">
                <div ref={refTable} onScroll={handleScroll} className='col-span-1 h-[560px] overflow-x-auto rounded-lg'>
                  <table className='relative w-full overflow-y-auto border-separate border-0 border-spacing-y-4 px-6'>
                    <thead className='sticky bg-white top-0 transform duration-500 ease-in-out text-left divide-y dark:divide-gray-700 text-xs font-semibold tracking-wide text-gray-500 uppercase border-b dark:border-gray-700'>
                      <tr>
                        <th className='px-4 py-6'>1</th>
                        <th className='px-4 py-6'>2</th>
                        <th className='px-4 py-6'>3</th>
                      </tr>
                    </thead>
                  </table>
                  <table className='relative bg-gray w-full overflow-y-auto rounded-lg shadow-lg border-separate border-0 border-spacing-y-4 p-6'>
                    {/* <thead className='sticky bg-white top-0 transform duration-500 ease-in-out text-left divide-y dark:divide-gray-700 text-xs font-semibold tracking-wide text-gray-500 uppercase border-b dark:border-gray-700'>
                      <tr>
                        <th className='px-4 py-6'>1</th>
                        <th className='px-4 py-6'>2</th>
                        <th className='px-4 py-6'>3</th>
                      </tr>
                    </thead> */}
                    <tbody className='text-gray-700 dark:text-gray-400 text-xs px-4'>
                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>

                      <tr className='bg-white rounded-sm'>
                        <td className='py-6 px-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>1</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>2</td>
                        <td className='px-4 py-4 border-y first:border-l last:border-r first:rounded-l-lg last:rounded-r-lg border-gray shadow'>3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div >
      </div >
      <Modal
        size=''
        onClose={onClose}
        isOpen={isOpenModal}
      >
        <Fragment>
          <ModalHeader
            className='p-4 border-b-2 border-gray mb-3'
            isClose={true}
            onClick={onClose}
          >
            <h3 className='text-lg font-semibold'>Modal Header</h3>
          </ModalHeader>
          <div className="w-full px-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, optio. Suscipit cupiditate voluptatibus et ut alias nostrum architecto ex explicabo quidem harum, porro error aliquid perferendis, totam iste corporis possimus nobis! Aperiam, necessitatibus libero! Sunt dolores possimus explicabo ducimus aperiam ipsam dolor nemo voluptate at tenetur, esse corrupti sapiente similique voluptatem, consequatur sequi dicta deserunt, iure saepe quasi eius! Eveniet provident modi at perferendis asperiores voluptas excepturi eius distinctio aliquam. Repellendus, libero modi eligendi nisi incidunt inventore perferendis qui corrupti similique id fuga sint molestias nihil expedita enim dolor aperiam, quam aspernatur in maiores deserunt, recusandae reiciendis velit. Expedita, fuga.
          </div>
          <ModalFooter
            className='p-4 border-t-2 border-gray mt-3'
            isClose={true}
            onClick={onClose}
          ></ModalFooter>
        </Fragment>
      </Modal>
    </DefaultLayout >
  )
}

export default Occupancy;