import React, { useState, useEffect, useRef, Fragment } from 'react';
import SidebarLinkGroup from '../SidebarLinkGroup';
// import Logo from '../images/logo/logo.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MdArrowBack, MdCardMembership, MdLocalParking, MdOutlineBusiness, MdOutlineDashboard, MdOutlineMap, MdOutlinePeople, MdOutlinePeopleAlt } from 'react-icons/md';

type Props = {
    sidebarOpen: boolean,
    setSidebarOpen: any,
}

const SidebarBM = ({ sidebarOpen, setSidebarOpen }: Props) => {
    const location = useRouter()
    const { pathname, query } = location

    const trigger = useRef<HTMLButtonElement>(null)
    const sidebar = useRef<HTMLDivElement>(null)

    // const storedSidebarExpanded = localStorage?.getItem('sidebar-expanded')
    // const [storeParse, setStoreParse] = useState(null);

    // useEffect(() => {
    //     if (typeof storedSidebarExpanded === 'string') {
    //         setStoreParse(JSON.parse(storedSidebarExpanded))
    //     }
    // }, [storedSidebarExpanded])

    const getFromLocalStorage = (key: string) => {
        if (!key || typeof window === 'undefined') {
            return ""
        }
        return localStorage.getItem(key)
    };

    const initiaLocalStorage: any = { sidebar: getFromLocalStorage("sidebar-bm") ? JSON.parse(getFromLocalStorage("sidebar-bm") || '{}') : [] };

    const [sidebarExpanded, setSidebarExpanded] = useState(initiaLocalStorage === null ? false : initiaLocalStorage === 'true');

    // console.log(initiaLocalStorage, 'side')

    // close on click outside
    useEffect(() => {
        type Props = {
            target: any
        }
        const clickHandler = ({ target }: Props) => {
            if (!sidebar.current || !trigger.current) return
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return
            setSidebarOpen(false)
        }
        document.addEventListener('click', clickHandler)
        return () => document.removeEventListener('click', clickHandler)
    })

    // close if the esc key is pressed
    useEffect(() => {
        type Props = {
            keyCode: any
        }
        const keyHandler = ({ keyCode }: Props) => {
            if (!sidebarOpen || keyCode !== 27) return
            setSidebarOpen(false)
        }
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    })

    useEffect(() => {
        const body = document.querySelector('body');
        const parentNode = body?.parentNode;

        if (!(parentNode instanceof Element)) {
            throw new Error('box.parentNode is not an Element');
        }

        console.log(parentNode.querySelector('body'), 'body');

        localStorage.setItem('sidebar-bm', sidebarExpanded?.toString())
        if (sidebarExpanded) {
            body?.classList.add('sidebar-bm')
        } else {
            body?.classList.remove('sidebar-bm')
        }
    }, [sidebarExpanded]);

    const myLoader = (props: any) => {
        const { src, width, quality } = props;
        console.log(props, 'loader')
        // return `https://example.com/${src}?w=${width}&q=${quality || 75}`
        return `${src}`
    }

    console.log(pathname, 'pathname')

    return (
        <Fragment>
            <aside
                ref={sidebar}
                className={`absolute left-0 top-0 bottom-0 z-999 flex w-90 flex-col overflow-y-hidden bg-boxdark duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    // className={`absolute left-0 top-0 z-9999 flex h-screen w-full lg:w-90 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* <!-- SIDEBAR HEADER --> */}

                <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
                    {/* <!-- Sidebar Menu --> */}
                    <nav className='mt-3 py-4 px-4 lg:px-6'>
                        {/* <!-- Menu Group --> */}
                        <div>
                            <div className='w-full flex justify-between items-center mb-4 px-4 py-2.5 bg-white rounded-lg'>
                                <div className='flex items-center gap-2'>
                                    <MdOutlineBusiness className='w-5 h-5 text-black' />
                                    <h3 className='text-lg font-semibold text-black'>
                                        Building Name
                                    </h3>
                                </div>

                                <button
                                    type='button'
                                    ref={trigger}
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    aria-controls='sidebar'
                                    aria-expanded={sidebarOpen}
                                    className='block text-black lg:hidden'
                                >
                                    <MdArrowBack className='w-5 h-5' />
                                </button>

                            </div>

                            <ul className='mb-6 flex flex-col gap-1.5'>
                                {/* <!-- Menu Item Dashboard --> */}
                                <li>
                                    <Link
                                        href='/building-management'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "/building-management" &&
                                                'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdOutlineDashboard className='w-5 h-5' />
                                            Dashboard
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Item Dashboard --> */}

                                {/* <!-- Menu Item Tenant Management --> */}
                                <li>
                                    <Link
                                        href='/building-management/tenants'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "building-management/tenants" || pathname.includes('tenants') &&
                                                'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdOutlinePeopleAlt className='w-5 h-5' />
                                            Tenant Management
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Item Tenant Management --> */}

                                {/* <!-- Menu Item Tower Management --> */}
                                <li>
                                    <Link
                                        href='/building-management/towers'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "building-management/towers" || pathname.includes('towers') &&
                                                'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdOutlineBusiness className='w-5 h-5' />
                                            Tower Management
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Item Tower Management --> */}

                                {/* <!-- Menu Item Area Grouping --> */}
                                <li>
                                    <Link
                                        href='/building-management/areas'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "building-management/areas" || pathname.includes('areas') &&
                                                'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdOutlineMap className='w-5 h-5' />
                                            Area Grouping
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Item Area Grouping --> */}

                                {/* <!-- Menu Item Forms --> */}
                                {/* <SidebarLinkGroup
                                    activeCondition={
                                        pathname === '/forms' || pathname.includes('forms')
                                    }
                                >
                                    {(handleClick: any, open: boolean) => {
                                        return (
                                            <React.Fragment>
                                                <button
                                                    type='button'
                                                    className={`w-full group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/forms' ||
                                                        pathname.includes('forms')) &&
                                                        'bg-primary dark:bg-primary'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        sidebarExpanded
                                                            ? handleClick()
                                                            : setSidebarExpanded(true)
                                                    }}
                                                >
                                                    <svg
                                                        className='fill-current'
                                                        width='18'
                                                        height='18'
                                                        viewBox='0 0 18 18'
                                                        fill='none'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                        <path
                                                            d='M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z'
                                                            fill=''
                                                        />
                                                        <path
                                                            d='M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z'
                                                            fill=''
                                                        />
                                                        <path
                                                            d='M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z'
                                                            fill=''
                                                        />
                                                        <path
                                                            d='M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z'
                                                            fill=''
                                                        />
                                                        <path
                                                            d='M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z'
                                                            fill='white'
                                                        />
                                                    </svg>
                                                    Forms
                                                    <svg
                                                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                                                            }`}
                                                        width='20'
                                                        height='20'
                                                        viewBox='0 0 20 20'
                                                        fill='none'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                        <path
                                                            fillRule='evenodd'
                                                            clipRule='evenodd'
                                                            d='M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z'
                                                            fill=''
                                                        />
                                                    </svg>
                                                </button>
                                                <div
                                                    className={`translate transform overflow-hidden ${!open && 'hidden'
                                                        }`}
                                                >
                                                    <ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
                                                        <li>
                                                            <Link
                                                                href='/forms/form-elements'
                                                            >
                                                                <div className={'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                    (pathname === "/forms/form-elements" && '!text-white')
                                                                }>
                                                                    Form Elements
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                href='/forms/form-layout'
                                                            >
                                                                <div className={'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                                    (pathname === "/forms/form-layout" && '!text-white')
                                                                }>
                                                                    Form Layout
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </React.Fragment>
                                        )
                                    }}
                                </SidebarLinkGroup> */}
                                {/* <!-- Menu Item Forms --> */}
                            </ul>
                        </div>

                        <div>
                            <h3 className='mb-4 text-lg font-semibold text-white'>
                                Additional Features
                            </h3>

                            <ul className='mb-6 flex flex-col gap-1.5'>
                                {/* <!-- Menu Parking List --> */}
                                <li>
                                    <Link
                                        href='/building-management/parking'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "building-management/parking" || pathname.includes('parking') && 'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdLocalParking className='w-5 h-5' />
                                            Parking List
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Parking List --> */}

                                {/* <!-- Menu Access Card --> */}
                                <li>
                                    <Link
                                        href='/building-management/access-card'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === "building-management/access-card" || pathname.includes('access-card') && 'bg-primary dark:bg-primary'
                                                }`}
                                        >
                                            <MdCardMembership className='w-5 h-5' />
                                            Access Card
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Access Card --> */}
                            </ul>
                        </div>
                    </nav>
                    {/* <!-- Sidebar Menu --> */}
                </div>
            </aside>
            {/* overlay */}
            <button
                ref={trigger}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                className={`lg:static ${sidebarOpen && 'fixed z-99 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100'}`}>

            </button>
        </Fragment>
    )
}

export default SidebarBM;
