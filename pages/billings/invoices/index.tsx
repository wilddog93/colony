import React, { Fragment, useEffect, useMemo, useState } from 'react'
import DefaultLayout from '../../../components/Layouts/DefaultLayouts';
import { GetServerSideProps } from 'next';
import { getCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../redux/features/auth/authReducers';
import { ColumnDef } from '@tanstack/react-table';
import Button from '../../../components/Button/Button';
import { MdAdd, MdArrowRightAlt, MdCheck, MdInfo, MdMonetizationOn, MdMoreHoriz, MdWork } from 'react-icons/md';
import SidebarComponent from '../../../components/Layouts/Sidebar/SidebarComponent';
import { menuPayments, menuTask } from '../../../utils/routes';
import { SearchInput } from '../../../components/Forms/SearchInput';
import DropdownSelect from '../../../components/Dropdown/DropdownSelect';
import Modal from '../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';
import { DivisionProps, createDivisionArr } from '../../../components/tables/components/taskData';
import moment from 'moment';
import CardTables from '../../../components/tables/layouts/CardTables';
import Teams from '../../../components/Task/Teams';
import DropdownDefault from '../../../components/Dropdown/DropdownDefault';
import { CustomDateRangePicker } from '../../../components/DatePicker/CustomDateRangePicker';
import SidebarMedia from '../../../components/Layouts/Sidebar/Media';
import SidebarBody from '../../../components/Layouts/Sidebar/SidebarBody';
import SelectTables from '../../../components/tables/layouts/SelectTables';
import { BillingProps, createBillingArr } from '../../../components/tables/components/billingData';
import ManualForm from '../../../components/Forms/Billings/Invoices/ManualForm';

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

const ProjectType = ({ pageProps }: Props) => {
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
    // side-body
    const [sidebar, setSidebar] = useState(false);

    // data-table
    const [dataTable, setDataTable] = useState<DivisionProps[]>([]);
    const [isSelectedRow, setIsSelectedRow] = useState({});
    const [pages, setPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pageCount, setPageCount] = useState(2000);
    const [total, setTotal] = useState(1000);

    // modal
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [details, setDetails] = useState<DivisionProps>();

    // date
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const [startDate, setStartDate] = useState<Date | null>(start);
    const [endDate, setEndDate] = useState<Date | null>(end);

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
        setDataTable(() => createDivisionArr(100))
    }, []);

    const goToTask = (id: any) => {
        if (!id) return;
        return router.push({ pathname: `/tasks/settings/team-members/${id}` })
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

    const columns = useMemo<ColumnDef<DivisionProps, any>[]>(() => [
        {
            accessorKey: 'divisionName',
            header: (info) => (
                <div className='uppercase'>Title</div>
            ),
            cell: ({ getValue, row }) => {
                let id = row?.original?.id
                return (
                    <div className='w-full flex items-center justify-between cursor-pointer p-4'>
                        <div className='text-lg font-semibold'>{getValue()}</div>
                        <button
                            onClick={() => setSidebar(e => !e)}
                            type='button'
                            className='text-primary focus:outline-none'
                        >
                            <MdMoreHoriz className='w-4 h-4' />
                        </button>
                    </div>
                )
            },
            footer: props => props.column.id,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'divisionDescription',
            cell: ({ row, getValue }) => {
                return (
                    <div className='w-full text-sm text-gray-5 text-left p-4'>
                        {getValue().length > 70 ? `${getValue().substring(70, 0)}...` : getValue()}
                    </div>
                )
            },
            header: props => (<div className='w-full text-left uppercase'>Description</div>),
            footer: props => props.column.id,
            enableColumnFilter: false,
            size: 150
        },
        {
            accessorKey: 'member',
            cell: ({ row, getValue }) => {
                let member = getValue()
                return (
                    <div className='w-full text-sm p-4 text-left border-b-2 border-gray'>
                        {member.length > 1 ? `${member.length} Members` : member?.length == 0 ? `Division hasn't any member yet` : `${member.length} Member`}
                    </div>
                )
            },
            header: props => (<div className='w-full text-left uppercase'>Date Added</div>),
            footer: props => props.column.id,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'id',
            cell: ({ row, getValue }) => {
                let member = row?.original?.member;
                return (
                    <div className='w-full text-sm text-left p-4'>
                        <Teams items={member} />
                    </div>
                )
            },
            header: props => (<div className='w-full text-left uppercase'>Date Added</div>),
            footer: props => props.column.id,
            enableColumnFilter: false,
        }
    ], []);

    useEffect(() => {
        if (token) {
            dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
        }
    }, [token]);

    // console.log(dataTable, 'data table')

    return (
        <DefaultLayout
            title="Colony"
            header="Billings & Payments"
            head="Payments"
            logo="../../../image/logo/logo-icon.svg"
            images="../../../image/logo/building-logo.svg"
            userDefault="../../../image/user/user-01.png"
            description=""
            token={token}
            icons={{
                icon: MdMonetizationOn,
                className: "w-8 h-8 text-meta-3"
            }}
        >
            <div className='absolute inset-0 mt-20 z-20 bg-boxdark flex text-white'>
                <SidebarComponent menus={menuPayments} sidebar={sidebarOpen} setSidebar={setSidebarOpen} />

                <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 lg:overflow-y-hidden">
                    <div className='sticky bg-white top-0 z-50 py-6 w-full flex flex-col gap-2'>
                        {/* headers */}
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

                            <div className='w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0'>
                                <Button
                                    type="button"
                                    className='rounded-lg text-sm font-semibold py-3 border-0 gap-2.5'
                                    onClick={() => router.back()}
                                    variant='secondary-outline'
                                    key={'1'}
                                >
                                    <div className='flex flex-col gap-1 items-start'>
                                        <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Invoices</h3>
                                        <div className='flex items-center gap-3 font-semibold text-gray-5 tracking-wide'>
                                            <div>322 Overdue</div>
                                            <div>322 Ongoing</div>
                                            <div>32 Posted</div>
                                        </div>
                                    </div>
                                </Button>
                            </div>

                            <div className='w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto'>
                                <Button
                                    type="button"
                                    className='rounded-lg text-sm font-semibold py-3'
                                    onClick={onOpen}
                                    variant='primary'
                                >
                                    <span className='hidden lg:inline-block'>New Invoices</span>
                                    <MdAdd className='w-4 h-4' />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <main className='relative h-full lg:max-h-[700px] tracking-wide text-left text-boxdark-2 lg:overflow-auto'>
                        <div className='w-full h-full flex'>
                            <div className="w-full h-full flex flex-col overflow-auto gap-2.5 lg:gap-6 lg:overflow-y-auto">
                                {/* filters */}
                                <div className='w-full grid grid-cols-1 lg:grid-cols-5 gap-2.5 p-4'>
                                    <div className='w-full lg:col-span-3'>
                                        <SearchInput
                                            className='w-full text-sm rounded-xl'
                                            classNamePrefix=''
                                            filter={search}
                                            setFilter={setSearch}
                                            placeholder='Search...'
                                        />
                                    </div>
                                    <div className='w-full flex flex-col lg:flex-row items-center gap-2'>
                                        <DropdownSelect
                                            customStyles={stylesSelectSort}
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
                                    <div className='w-full flex flex-col lg:flex-row items-center gap-2'>
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
                                            placeholder='All status...'
                                            options={sortOpt}
                                            icon=''
                                        />
                                    </div>
                                </div>
                                {/* table */}
                                <SelectTables
                                    loading={loading}
                                    setLoading={setLoading}
                                    pages={pages}
                                    setPages={setPages}
                                    limit={limit}
                                    setLimit={setLimit}
                                    pageCount={pageCount}
                                    columns={columns}
                                    dataTable={dataTable}
                                    total={total}
                                    setIsSelected={setIsSelectedRow}
                                    // isInfiniteScroll
                                    classTable="bg-gray p-4"
                                />
                            </div>

                            <SidebarBody
                                sidebarOpen={sidebar}
                                setSidebarOpen={setSidebar}
                            >
                                <div className="w-full h-full">
                                    <ModalHeader
                                        className='sticky top-0 bg-white border-b-2 border-gray p-4'
                                        isClose
                                        onClick={() => setSidebar(false)}
                                    >
                                        <div className='flex flex-col tracking-wide'>
                                            <h3 className='font-semibold text-primary'>B123</h3>
                                            <p>Lorem ipsum dolor sit amet.</p>
                                        </div>
                                    </ModalHeader>
                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div className='w-full flex items-center justify-between gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <h3>Status:</h3>
                                                <span className='px-4 py-2 rounded-lg bg-red-300 text-red-500 font-semibold'>Overdue</span>
                                            </div>
                                            <div>
                                                <Button
                                                    type="button"
                                                    className='rounded-lg text-sm font-semibold py-3'
                                                    onClick={onOpen}
                                                    variant='primary'
                                                >
                                                    <span className='inline-block'>Manual Payment</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div>Tagihan</div>
                                        <div>
                                            <span>3213 - Tagihan Bulanan</span>
                                        </div>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div>Periode</div>
                                        <p>00/00/0000 - 00/00/0000</p>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div>Owner</div>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='text-base font-semibold'>John Doe</h3>
                                            <p>johndoe@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div className='w-full flex items-center justify-between gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <h3>Release Date:</h3>
                                                <p className=''>00/00/0000</p>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <h3>Due Date:</h3>
                                                <p className=''>00/00/0000</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div className='w-full flex items-center justify-between gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <h3>Electricity</h3>
                                                <h3>Facility</h3>
                                                <h3>Water Supply</h3>
                                                <h3>Environment</h3>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <p>IDR 00.000.000</p>
                                                <p>IDR 00.000.000</p>
                                                <p>IDR 00.000.000</p>
                                                <p>IDR 00.000.000</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full border-b-2 border-gray p-4'>
                                        <div className='w-full flex items-center justify-between gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <h3>Sub Total</h3>
                                                <h3>Tax</h3>
                                                <h3>Discount</h3>
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <p>IDR 00.000.000</p>
                                                <p>IDR 00.000.000</p>
                                                <p>IDR 00.000.000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SidebarBody>
                        </div>
                    </main>
                </div>
            </div>

            {/* modal example */}
            <Modal
                size='small'
                onClose={onClose}
                isOpen={isOpenModal}
            >
                <Fragment>
                    <ModalHeader
                        className='p-4 mb-3'
                        isClose={true}
                        onClick={onClose}
                    >
                        <h3 className='text-lg font-semibold'>Manual Payment</h3>
                    </ModalHeader>
                    <ManualForm isOpen={isOpenModal} onClose={onClose} />
                </Fragment>
            </Modal>

            {/* detail modal */}
            <Modal
                size='small'
                onClose={onCloseDetail}
                isOpen={isOpenDetail}
            >
                <Fragment>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia quam, ab iusto aliquam cumque esse repellendus voluptas inventore iure in! Tempora repellendus consectetur nisi recusandae asperiores quo aspernatur esse nobis nulla ex dolorum, fugit illo incidunt tempore consequuntur qui numquam maiores accusantium possimus. Exercitationem adipisci tenetur dolores expedita culpa accusamus officia sit laborum possimus qui! Magni obcaecati exercitationem laboriosam nemo voluptates aspernatur adipisci, fuga dicta maxime ipsam animi repellat aliquam sit vero delectus perspiciatis labore pariatur, consectetur, temporibus nesciunt reprehenderit placeat. Voluptatem placeat laborum temporibus! Consectetur reiciendis exercitationem dolorum. Voluptates fugit repellat repellendus ullam fugiat repudiandae odio debitis tempore magnam.
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

export default ProjectType;