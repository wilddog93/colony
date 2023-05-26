import React, { Fragment, useEffect, useMemo, useState } from 'react'
import DefaultLayout from '../../../../components/Layouts/DefaultLayouts';
import { GetServerSideProps } from 'next';
import { getCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../redux/features/auth/authReducers';
import { ColumnDef } from '@tanstack/react-table';
import Button from '../../../../components/Button/Button';
import { MdAdd, MdArrowRightAlt, MdCheckCircleOutline, MdChevronLeft, MdChevronRight, MdEdit, MdOutlineCalendarToday, MdWork } from 'react-icons/md';
import SidebarComponent from '../../../../components/Layouts/Sidebar/SidebarComponent';
import { menuProjects, menuTask } from '../../../../utils/routes';
import Tabs from '../../../../components/Layouts/Tabs';
import { SearchInput } from '../../../../components/Forms/SearchInput';
import DropdownSelect from '../../../../components/Dropdown/DropdownSelect';
import SelectTables from '../../../../components/tables/layouts/SelectTables';
import Modal from '../../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../../components/Modal/ModalComponent';
import { WorkProps, createDataTask } from '../../../../components/tables/components/taskData';
import moment from 'moment';
import DatePicker from "react-datepicker"
import { createTask } from '../../../../components/tables/components/taskData';
import Teams from '../../../../components/Task/Teams';

type Props = {
  pageProps: any
}

const sortOpt = [
  { value: "A-Z", label: "A-Z" },
  { value: "Z-A", label: "Z-A" },
];

const stylesSelectSort = {
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

const stylesSelect = {
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
    // console.log(provided, "control")
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
      // flexDirection: "row-reverse"
    })
  },
  menuList: (provided: any) => (provided)
};

const TaskDetail = ({ pageProps }: Props) => {
  moment.locale("id")
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(true);

  // data-table
  const [dataTable, setDataTable] = useState<WorkProps>();
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(2000);
  const [total, setTotal] = useState(1000)

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<WorkProps>();

  // date
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const [dateRange, setDateRange] = useState<Date[]>([start, end])
  const [startDate, endDate] = dateRange;

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm")
  }

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

  // detail modal
  const onCloseDelete = () => {
    setDetails(undefined)
    setIsOpenDelete(false)
  };
  const onOpenDelete = (items: any) => {
    setDetails(items)
    setIsOpenDelete(true)
  };

  useEffect(() => {
    setDataTable(() => createTask())
  }, []);

  console.log(dataTable, 'data table')

  const goToTask = (id: any) => {
    if (!id) return;
    return router.push({ pathname: `/tasks/projects/${id}` })
  };

  const genWorkStatus = (value: string) => {
    if (!value) return "-";
    if (value === "Open") return <div className='w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200'>{value}</div>;
    if (value === "On Progress") return <div className='w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200'>{value}</div>;
    if (value === "Closed") return <div className='w-full max-w-max p-1 rounded-lg text-xs text-center border border-green-600 text-green-600 bg-green-200'>{value}</div>;
    if (value === "Overdue") return <div className='w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-1 text-meta-1 bg-red-200'>{value}</div>;
  };

  const genColorProjectType = (value: any) => {
    // #333A48
    let color = "";
    if (!value) return "";
    if (value == "Project") color = "#5E59CE";
    if (value == "Complaint Handling") color = "#FF8859";
    if (value == "Regular Task") color = "#38B7E3";
    if (value == "Maintenance") color = "#EC286F";
    return color;
  };

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  return (
    <DefaultLayout
      title="Colony"
      header="Task Management"
      head="Tables"
      logo="../../image/logo/logo-icon.svg"
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdWork,
        className: "w-8 h-8 text-meta-7"
      }}
    >
      <div className='absolute inset-0 mt-20 z-9 bg-boxdark flex text-white'>
        <SidebarComponent menus={menuTask} sidebar={sidebarOpen} setSidebar={setSidebarOpen} />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='lg:sticky bg-white top-0 z-50 py-6 w-full flex flex-col gap-2'>
            {/* button sidebar */}
            <div className='w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2'>
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
            </div>
            {/* header task */}
            <div className="w-full grid col-span-1 lg:grid-cols-6 gap-2 border-b-2 border-gray py-2 items-center justify-center">
              <div className='w-full flex gap-2 items-center mx-auto lg:mx-0'>
                <Button
                  type="button"
                  className='rounded-lg text-sm font-semibold py-3 border-0 gap-2.5'
                  onClick={() => router.back()}
                  variant='secondary-outline'
                  key={'1'}
                >
                  <MdChevronLeft className='w-5 h-5' />
                  <div className='flex flex-col gap-1 items-start'>
                    <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Task - 0111</h3>
                  </div>
                </Button>
              </div>

              <div className='w-full flex gap-2 items-center mx-auto lg:mx-0'>
                <div className='w-full text-center bg-primary px-4 py-2 rounded-xl'>
                  Project
                </div>
              </div>

              <div className='w-full flex gap-2 items-center mx-auto lg:mx-0'>
                <p className='text-graydark'>Lorem ipsum dolor sit amet.</p>
              </div>

              <div className='w-full lg:col-span-3 flex items-center justify-center lg:justify-end gap-2 lg:ml-auto'>
                <Button
                  type="button"
                  className='rounded-lg text-sm font-semibold py-3'
                  onClick={onOpen}
                  variant='primary-outline'
                >
                  <span className='hidden lg:inline-block'>Edit Task</span>
                  <MdEdit className='w-4 h-4' />
                </Button>

                <Button
                  type="button"
                  className='rounded-lg text-sm font-semibold py-3'
                  onClick={onOpen}
                  variant='primary'
                >
                  <span className='hidden lg:inline-block'>New Task</span>
                  <MdAdd className='w-4 h-4' />
                </Button>
              </div>
            </div>
            {/* tabs */}
            <div className='w-full max-w-max hidden lg:flex items-start text-graydark gap-2 p-4'>
              <h3 className='font-semibold'>Description:</h3>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum, perspiciatis!</p>
            </div>
          </div>

          <main className='relative w-full tracking-wide text-left text-boxdark-2'>
            <div className="w-full flex flex-col gap-2.5 lg:gap-6">
              {/* content */}
              <div className='lg:sticky bg-white top-40 z-50 w-full flex flex-col lg:flex-row py-4 lg:divide-x-2 divide-gray-4 items-center'>
                <div className="w-full max-w-max px-4 lg:ml-auto">
                  <Teams items={dataTable?.member} />
                </div>

                <div className='w-full max-w-max px-4'>
                  <label className='w-full text-gray-5 overflow-hidden'>
                    <div className='relative'>
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update: any) => {
                          setDateRange(update);
                        }}
                        isClearable={true}
                        placeholderText={"Select date"}
                        todayButton
                        dropdownMode="select"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        className='text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                      />
                      <MdOutlineCalendarToday className='absolute left-4 top-4 h-6 w-6 text-gray-5' />
                    </div>
                  </label>
                </div>

                <div className="w-full max-w-max flex items-center gap-2 px-4 py-2 text-sm">
                  <span className='font-semibold'>Work Status:</span>
                  <div className='bg-red-200 border-500 text-500 rounded-lg px-4 py-2 text-red-500 font-semibold'>
                    Overdue
                  </div>
                </div>
              </div>

              <div className='w-full flex flex-col'>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi magnam dolorem recusandae laborum, similique ea porro enim suscipit doloribus at adipisci aliquam officia praesentium iure qui nam deserunt eligendi aliquid ab! Voluptatem dolorem sapiente totam recusandae molestiae dignissimos, odit minus, beatae provident, saepe laudantium distinctio excepturi optio at asperiores quidem perspiciatis modi iure incidunt consectetur fuga delectus molestias! Reiciendis velit minus neque optio, et aliquam itaque atque nisi placeat! Neque vero nesciunt praesentium tempore eius adipisci eaque, dignissimos amet accusamus quia dolore expedita aliquid, totam in. Accusantium nihil sequi quibusdam quos. Aperiam dicta deserunt libero. Excepturi veritatis beatae voluptatibus perferendis omnis voluptatum odio, blanditiis, saepe nemo aliquid dolores! Dicta error possimus minima accusantium minus tempora suscipit ullam nisi labore saepe quia nostrum, officia mollitia similique facilis! Nisi pariatur, saepe consequatur odio quod quae, assumenda dignissimos ut nam ducimus, ad maxime similique obcaecati repudiandae doloremque veritatis explicabo nulla itaque totam? Sapiente ad aliquid rem molestiae veritatis architecto eveniet cupiditate alias similique assumenda at reiciendis officiis quia repellendus adipisci, obcaecati excepturi quos consequatur perspiciatis quam, in veniam quisquam nesciunt ex? Exercitationem, sit. Et ipsam vero porro, beatae animi aperiam nulla non voluptas id libero ipsum repudiandae ratione natus sequi officia consequuntur delectus provident fuga expedita aspernatur cumque eligendi modi molestiae tempore? In beatae neque dolorem quaerat tempora sint atque magnam adipisci temporibus iste animi earum pariatur modi, quasi nobis, voluptatum aliquid repellendus necessitatibus at. Quam dignissimos aliquam voluptatibus illo minima? Dolorem est enim cumque, dolores a in eveniet dolor dolore, ut eius quasi sint. Eos natus repellat, eaque blanditiis distinctio amet ab libero. Adipisci culpa, quo, dolorem a voluptatum molestiae veritatis, aperiam praesentium possimus similique recusandae blanditiis. Dolor quam obcaecati blanditiis natus odio, illum molestias tempore libero commodi sunt rem deleniti laborum dicta facilis, ad, beatae animi dignissimos reprehenderit autem exercitationem ratione quos porro possimus? Beatae adipisci facilis corrupti commodi omnis unde dolore minus, incidunt rerum consequatur! Adipisci blanditiis maxime ut aut veritatis tempore consectetur. Illum laudantium doloremque reprehenderit, odit, dolor impedit placeat doloribus soluta iure molestiae officiis consequatur tempora error unde et, laboriosam magnam dolores obcaecati expedita harum. Accusamus cum molestias quas necessitatibus dolor. Repudiandae hic laborum modi iusto quo, totam vitae animi eum aut doloremque nam possimus beatae soluta perferendis inventore nesciunt dolore atque debitis alias, reprehenderit ullam voluptates illo dolor? Non dolorum, consequatur omnis adipisci sit aliquid, vitae voluptatibus debitis atque mollitia, ipsam consectetur repudiandae voluptatum facilis! Rerum ipsum ad perspiciatis accusamus nesciunt fuga optio, nam facilis, numquam magni culpa. Vero repudiandae, corrupti perferendis esse ut inventore est eius molestiae cupiditate aperiam soluta voluptatum porro reiciendis sapiente officia nihil quia voluptates in id? Pariatur, praesentium, omnis nulla aut quis voluptatem deserunt nisi dolor quo possimus dolorum earum distinctio vero sit delectus impedit. Perspiciatis ratione repellendus adipisci! Ipsam aliquam alias eveniet vero, sapiente inventore officiis, quos enim, odit tenetur nesciunt ducimus dignissimos. Ipsam quasi ipsa corporis, saepe laborum consectetur corrupti, debitis eum assumenda ullam inventore mollitia atque qui incidunt. Cumque repudiandae neque quam laborum quas magnam itaque qui illum nam earum pariatur, at illo sapiente officiis error est laboriosam quia voluptatem ipsum obcaecati nihil expedita eaque. Libero, architecto? Fuga culpa non enim est explicabo ullam a error odit magni earum? Nostrum eaque ea magni distinctio ad facere officiis dicta sapiente aspernatur explicabo, cumque neque non. Soluta aut inventore quia necessitatibus laboriosam enim nulla provident. Cupiditate quo fuga dicta mollitia, dignissimos eius vel! Cumque sit voluptates doloremque ex adipisci nobis dolorem alias quasi perferendis iure inventore enim quia nesciunt, omnis beatae error in a eaque dicta eius possimus dolor explicabo? Vero ipsa aut iure dolorum harum expedita non, mollitia, quibusdam et minima accusantium, dignissimos in? Ex dolore aut maiores harum quas, praesentium alias omnis pariatur ea voluptatum aliquam recusandae magni consequatur, nisi voluptate vitae quod? Ipsum odio eius nemo ut consectetur voluptate impedit facilis dignissimos facere! Illo nulla eum voluptate magnam fugit quasi ratione ipsum perferendis ipsa expedita unde iusto minima amet, ea temporibus nisi repellat deserunt nobis nesciunt at sit reprehenderit. Magnam, minima doloribus quis assumenda voluptatum autem minus. Molestiae similique doloribus libero natus optio ut id itaque unde, ratione voluptas odit totam. Odit iusto alias dolorem ullam pariatur impedit voluptatum ducimus at praesentium ut. Dignissimos numquam ex iusto, tenetur quo dicta explicabo dolor nesciunt sit modi velit quisquam, repellendus soluta! Unde expedita tempore, maiores corrupti corporis enim minima. Minima, aut nostrum obcaecati veritatis ipsam et neque ipsum fuga veniam excepturi suscipit iste sed molestiae inventore saepe ipsa dicta rem vel velit nam. Consectetur nulla esse ipsam voluptatibus iusto facere, et autem sequi recusandae laboriosam dolore! Dolorum sunt dolore soluta iusto cum dignissimos quas beatae vitae laudantium. Sed, cumque quia, explicabo atque veniam iusto quibusdam possimus aliquid vero reprehenderit laudantium ex! Eligendi magnam, hic, ad blanditiis doloribus inventore quam reiciendis perferendis, eos repellendus possimus labore laborum dignissimos. Voluptas ducimus sunt consequatur, repellat aspernatur quia, natus quibusdam quidem tempore perspiciatis beatae veritatis debitis? Libero incidunt voluptatem consequuntur ea cupiditate eum quas voluptatibus est. Quibusdam commodi consectetur eaque corporis aliquam, voluptatum vitae voluptates veniam eos, dolorem nisi ea totam dolor sunt maiores animi quis porro, voluptate eum laborum reiciendis? Delectus animi ab voluptas nobis sint porro iusto odit fugit, quibusdam exercitationem quae, esse similique nesciunt! Cupiditate autem voluptatibus dicta omnis repellat commodi quod doloribus ullam facere rem, aspernatur placeat. Maiores, molestias labore. Debitis dolore aliquam mollitia laboriosam nesciunt nulla, dolor, cum cumque laborum maxime nostrum facere sunt, harum expedita eos libero ipsam! Nihil iusto in quisquam id culpa quam molestias eaque? Similique, numquam necessitatibus. Saepe commodi amet illo, officia, a voluptatum sapiente magni vitae repellat excepturi hic? Consequuntur pariatur enim voluptates omnis accusantium sequi maiores, atque eius et nostrum perspiciatis? Vel, officia similique iste ducimus libero nemo iusto reprehenderit, deserunt deleniti rem aut? Numquam, eos explicabo repellat nobis quidem rem distinctio ex commodi adipisci ipsam maiores qui? Molestias sint hic commodi consequatur ratione ea expedita iure. Voluptates ratione quis cumque sit modi ducimus, nemo dicta mollitia dolor exercitationem corporis ea totam eveniet repellendus voluptate sapiente repellat doloremque quia labore quod voluptatum maiores!
              </div>
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

      {/* detail modal */}
      <Modal
        size='small'
        onClose={onCloseDetail}
        isOpen={isOpenDetail}
      >
        <Fragment>
          <ModalHeader
            className='p-6 mb-3'
            isClose={true}
            onClick={onCloseDetail}
          >
            <div className="flex-flex-col gap-2">
              <h3
                className='text-sm font-semibold py-1 px-2 rounded-md w-full max-w-max'
                style={{
                  backgroundColor: !details?.workType ? "#FFFFFF" : genColorProjectType(details.workType),
                  color: !details?.workType ? "#333A48" : "#FFFFFF",
                }}
              >
                {details?.workType || ""}
              </h3>
              <div className="flex items-center gap-2">
                <p className='text-sm text-gray-5'>{details?.workName || ""}</p>
              </div>
            </div>
          </ModalHeader>
          <div className="w-full flex flex-col divide-y-2 divide-gray shadow-3 text-sm text-gray-5">
            <div className='w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2'>
              <div className='text-sm text-graydark'>Start Date</div>
              <p>{dateFormat(details?.scheduleStart)}</p>
            </div>
            <div className='w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2'>
              <div className='text-sm text-graydark'>End Date</div>
              <p>{dateFormat(details?.scheduleEnd)}</p>
            </div>
            <div className='w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2 mb-2'>
              <div className='text-sm text-graydark'>Total Task</div>
              <p>{details?.totalTask}</p>
            </div>
          </div>
        </Fragment>
      </Modal>

      {/* delete modal */}
      <Modal
        size='small'
        onClose={onCloseDelete}
        isOpen={isOpenDelete}
      >
        <Fragment>
          <ModalHeader
            className='p-4 border-b-2 border-gray mb-3'
            isClose={true}
            onClick={onCloseDelete}
          >
            <h3 className='text-lg font-semibold'>Delete Tenant</h3>
          </ModalHeader>
          <div className='w-full my-5 px-4'>
            <h3>Are you sure to delete tenant data ?</h3>
          </div>

          <ModalFooter
            className='p-4 border-t-2 border-gray'
            isClose={true}
            onClick={onCloseDelete}
          >
            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              onClick={onCloseDelete}
            >
              Yes, Delete it!
            </Button>
          </ModalFooter>
        </Fragment>
      </Modal>
    </DefaultLayout>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context)

  // Access cookies using the cookie name
  const token = cookies['accessToken'] || null;
  const access = cookies['access'] || null;
  const firebaseToken = cookies['firebaseToken'] || null;

  if (!token) {
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

export default TaskDetail;
