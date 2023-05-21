import React, { useState, useEffect, useRef, Fragment } from 'react';
import SidebarLinkGroup from '../SidebarLinkGroup';
// import Logo from '../images/logo/logo.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MdArrowBack, MdCardMembership, MdLocalParking, MdOutlineBusiness, MdOutlineDashboard, MdOutlineMap, MdOutlinePeople, MdOutlinePeopleAlt } from 'react-icons/md';
import { menuBM } from '../../../../utils/routes';
import Icon from '../../../Icon';
import SidebarLink from '../SidebarLink';

type Props = {
    sidebarOpen: boolean,
    setSidebarOpen: any
}

const SidebarBM = ({ sidebarOpen, setSidebarOpen }: Props) => {
    const router = useRouter()
    const { pathname, query } = router;



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

    return (
        <Fragment>
            <aside
                ref={sidebar}
                className={`absolute left-0 top-0 bottom-0 z-999 flex w-90 flex-col overflow-y-hidden bg-boxdark duration-300 ease-in-out dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                                {menuBM?.length > 0 ?
                                    menuBM.map((route, idx) => {
                                        const { subMenus, routes } = route;
                                        if (subMenus && subMenus?.length > 0) {
                                            return (
                                                <div key={idx}>
                                                    {!route.title ?
                                                        <div className='border-gray border-t w-full border-2 my-4'></div> :
                                                        <h3 className='my-4 text-lg font-semibold text-white'>
                                                            {route?.title}
                                                        </h3>
                                                    }

                                                    <ul className='mb-6 flex flex-col gap-1.5'>
                                                        {/* <!-- Menu Parking List --> */}
                                                        {subMenus?.map((menu, i) => {
                                                            const { routes } = menu;
                                                            if (!routes) {
                                                                return (
                                                                    <li key={i}>
                                                                        <SidebarLink
                                                                            href={{ pathname: menu.url, query: menu?.query }}
                                                                            className={`text-base ${menu.className}`}
                                                                        >
                                                                            {!menu?.icons?.icon ? null :
                                                                                <Icon className={`w-5 h-5 ${menu.icons.className}`} icon={menu.icons.icon} />
                                                                            }
                                                                            {menu?.pathname}
                                                                        </SidebarLink>
                                                                    </li>
                                                                )
                                                            }
                                                            return (
                                                                <SidebarLinkGroup key={i} activeCondition={pathname === menu?.url || pathname.includes(menu?.pages as string)}>
                                                                    {(handleClick: any, open: boolean) => {
                                                                        return (
                                                                            <React.Fragment>
                                                                                <button
                                                                                    type='button'
                                                                                    className={`w-full group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === menu?.url ||
                                                                                        pathname.includes(menu?.pages as string)) &&
                                                                                        'bg-primary'
                                                                                        } ${menu?.className}`}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        sidebarExpanded
                                                                                            ? handleClick()
                                                                                            : setSidebarExpanded(true)
                                                                                    }}
                                                                                >
                                                                                    {menu?.icons ? <Icon className={`w-5 h-5 ${menu?.icons.className}`} icon={menu?.icons.icon} /> : null}
                                                                                    {menu?.pathname}
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
                                                                                    <ul className='mt-4 mb-5.5 flex flex-col gap-2.5'>
                                                                                        {routes && routes?.length > 0 ?
                                                                                            routes?.map((route, id) => {
                                                                                                return (
                                                                                                    <li key={id}>
                                                                                                        <SidebarLink
                                                                                                            href={{ pathname: route.url, query: route?.query }}
                                                                                                            className={`text-base pl-6 ${route?.className}`}
                                                                                                            activeClass="bg-graydark"
                                                                                                        >
                                                                                                            {!route?.icons?.icon ? null :
                                                                                                                <Icon className={`w-5 h-5 ${route?.icons.className}`} icon={route.icons.icon} />
                                                                                                            }
                                                                                                            {route?.pathname}
                                                                                                        </SidebarLink>
                                                                                                    </li>
                                                                                                )
                                                                                            }) : null
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            </React.Fragment>
                                                                        )
                                                                    }}
                                                                </SidebarLinkGroup>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            )
                                        } else {
                                            if (!routes) {
                                                return (
                                                    <li key={idx}>
                                                        <SidebarLink
                                                            href={{ pathname: route.url, query: route?.query }}
                                                            className={`text-base ${route?.className}`}
                                                        >
                                                            {!route?.icons?.icon ? null :
                                                                <Icon className={`w-5 h-5 ${route?.icons.className}`} icon={route.icons.icon} />
                                                            }
                                                            {route?.pathname}
                                                        </SidebarLink>
                                                    </li>
                                                )
                                            }
                                            return (
                                                <SidebarLinkGroup key={idx} activeCondition={pathname === route?.url || pathname.includes(route?.pages as string)}>
                                                    {(handleClick: any, open: boolean) => {
                                                        return (
                                                            <React.Fragment>
                                                                <button
                                                                    type='button'
                                                                    className={`w-full group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === route?.url ||
                                                                        pathname.includes(route?.pages as string)) &&
                                                                        'bg-primary'
                                                                        } ${route?.className}`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        sidebarExpanded
                                                                            ? handleClick()
                                                                            : setSidebarExpanded(true)
                                                                    }}
                                                                >
                                                                    {route?.icons?.icon ?
                                                                        <Icon
                                                                            className={`w-8 h-8 ${route?.icons.className}`}
                                                                            icon={route?.icons.icon}
                                                                        />
                                                                        : null
                                                                    }
                                                                    {route?.pathname}
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
                                                                    <ul className='mt-4 mb-5.5 flex flex-col gap-2.5'>
                                                                        {routes && routes?.length > 0 ?
                                                                            routes?.map((r, id) => {
                                                                                return (
                                                                                    <li key={id}>
                                                                                        <SidebarLink
                                                                                            href={{ pathname: r.url, query: r?.query }}
                                                                                            className={`text-base pl-6 ${r.className}`}
                                                                                            activeClass="bg-graydark"
                                                                                        >
                                                                                            {!r?.icons?.icon ? null :
                                                                                                <Icon className={`w-5 h-5 ${r.icons.className}`} icon={r.icons.icon} />
                                                                                            }
                                                                                            {r?.pathname}
                                                                                        </SidebarLink>
                                                                                    </li>
                                                                                )
                                                                            }) : null
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </React.Fragment>
                                                        )
                                                    }}
                                                </SidebarLinkGroup>
                                            )
                                        }
                                    }) : null
                                }
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
