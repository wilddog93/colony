import React, { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MdArrowBack, MdHelpOutline, MdMonetizationOn, MdMuseum, MdOutlineBusiness, MdOutlineSettings, MdPhotoSizeSelectActual, MdStore, MdUnarchive, MdWork } from 'react-icons/md';

type Props = {
    sidebarOpen: boolean,
    setSidebarOpen: any,
    logo: any,
    title: any,
    images: string
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, logo, title, images }: Props) => {
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

    const initiaLocalStorage: any = { sidebar: getFromLocalStorage("sidebar-expanded") ? JSON.parse(getFromLocalStorage("sidebar-expanded") || '{}') : [] };

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

        localStorage.setItem('sidebar-expanded', sidebarExpanded?.toString())
        if (sidebarExpanded) {
            body?.classList.add('sidebar-expanded')
        } else {
            body?.classList.remove('sidebar-expanded')
        }
    }, [sidebarExpanded]);

    const myLoader = (props: any) => {
        const { src, width, quality } = props;
        console.log(props, 'loader')
        // return `https://example.com/${src}?w=${width}&q=${quality || 75}`
        return `${src}`
    }

    return (
        <Fragment>
            <aside
                ref={sidebar}
                // className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                className={`absolute left-0 top-0 z-9999 flex h-screen w-full lg:w-90 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* <!-- SIDEBAR HEADER --> */}
                <div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
                    <Link href='/'>
                        <div className="flex items-center gap-2">
                            <Image loader={myLoader} src={!logo ? "image/logo/logo-icon.png" : logo} alt='Logo' width={30} height={30} />
                            <span className='flex-shrink-0 lg:flex text-white text-2xl font-semibold'>{!title ? "Building" : title}</span>
                        </div>
                    </Link>

                    <button
                        type='button'
                        ref={trigger}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls='sidebar'
                        aria-expanded={sidebarOpen}
                        className='block text-white'
                    >
                        <svg
                            className='fill-current'
                            width='20'
                            height='18'
                            viewBox='0 0 20 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z'
                                fill=''
                            />
                        </svg>
                    </button>
                </div>
                {/* <!-- SIDEBAR HEADER --> */}

                <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
                    {/* <!-- Sidebar Menu --> */}
                    <nav className='mt-3 py-4 px-4  lg:px-6'>
                        {/* <!-- Menu Group --> */}
                        <div>
                            <div className='w-full flex justify-between items-center mb-6 px-4 py-2.5 bg-white rounded-lg'>
                                <div className='flex items-center gap-2'>
                                    <img src={`${images ? images : "./image/logo/building-logo.svg"}`} alt='building logo' />
                                    <h3 className='text-lg font-semibold text-black'>
                                        Building Name
                                    </h3>
                                </div>
                            </div>

                            <div className='border-t w-full border-2 mb-3'></div>

                            <ul className='mb-6 flex flex-col gap-1.5'>
                                {/* <!-- Menu Gallery --> */}
                                <li>
                                    <Link
                                        href='/gallery'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('gallery') &&
                                                'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdPhotoSizeSelectActual className='w-8 h-8 text-[#5F59F7]' />
                                            gallery
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Gallery --> */}

                                {/* <!-- Menu BM --> */}
                                <li>
                                    <Link
                                        href='/building-management'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('building-management') &&
                                                'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdMuseum className='w-8 h-8 text-[#44C2FD]' />
                                            Building Management
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu BM --> */}

                                {/* <!-- Menu Billings & Payments --> */}
                                <li>
                                    <Link
                                        href='/calendar'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                                                'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdMonetizationOn className='w-8 h-8 text-[#44FDAF]' />
                                            Billings & Payments
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Billings & Payments --> */}

                                {/* <!-- Menu Task Management --> */}
                                <li>
                                    <Link
                                        href='/tasks'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('tasks') && 'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdWork className='w-8 h-8 text-[#F7597F]' />
                                            Task Management
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Task Management --> */}

                                {/* <!-- Menu Assets & Inventories --> */}
                                <li>
                                    <Link
                                        href='/assets-inventories'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('assets-inventories') && 'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdUnarchive className='w-8 h-8 text-[#F7E759]' />
                                            Assets & Inventories
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Assets & Inventories --> */}

                                {/* <!-- Menu Merchants --> */}
                                <li>
                                    <Link
                                        href='/merchants'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('merchants') && 'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdStore className='w-8 h-8 text-[#F79259]' />
                                            Merchants
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Merchants --> */}
                            </ul>
                        </div>

                        {/* <!-- Others Group --> */}
                        <div>
                            <div className='border-t w-full border-2 mb-3'></div>

                            <ul className='mb-6 flex flex-col gap-1.5'>
                                {/* <!-- Menu Settings --> */}
                                <li>
                                    <Link
                                        href='/settings'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('settings') &&
                                                'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdOutlineSettings className='h-6 w-6' />
                                            Settings
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Settings --> */}

                                {/* <!-- Menu Help --> */}
                                <li>
                                    <Link
                                        href='/help'
                                    >
                                        <div
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('help') && 'bg-graydark dark:bg-meta-4'
                                                }`}
                                        >
                                            <MdHelpOutline className='w-6 h-6' />
                                            Help
                                        </div>
                                    </Link>
                                </li>
                                {/* <!-- Menu Help --> */}
                            </ul>
                        </div>
                    </nav>
                    {/* <!-- Sidebar Menu --> */}
                </div>
            </aside>
            <button
                ref={trigger}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                className={`${sidebarOpen && 'fixed z-9998 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100'}`}>

            </button>
        </Fragment>
    )
}

export default Sidebar;
