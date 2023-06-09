// import LogoIcon from '../images/logo/logo-icon.svg'
import DropdownNotification from '../../../Dropdown/DropdownNotification'
import DropdownUser from '../../../Dropdown/DropdownUser'
import Link from 'next/link'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import Icon from '../../../Icon'
import { useRouter } from 'next/router'
import DomainHeaderMobile from './DomainHeaderMobile'

type HeaderProps = {
    header?: string;
    userDefault?: string;
    sidebarOpen?: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    logo?: string;
    images?: string;
    title?: any;
    token?: any;
    icons?: any;
    routes?: any;
}

const DomainHeader = ({ header, userDefault, sidebarOpen, setSidebarOpen, logo, images, title, token, icons, routes }: HeaderProps) => {
    return (
        <Fragment>
            <header className='sticky top-0 z-999 flex w-full bg-boxdark-2 drop-shadow-none'>
                <div className='w-full flex flex-grow items-center gap-4 shadow-2'>
                    <div className='w-full lg:w-2/3 flex items-center gap-2 sm:gap-8 px-6 py-6 lg:py-0'>
                        {/* <!-- Hamburger Toggle BTN --> */}
                        <button
                            aria-controls='sidebar'
                            aria-expanded={sidebarOpen}
                            onClick={(e) => {
                                e.stopPropagation()
                                setSidebarOpen(!sidebarOpen)
                            }}
                            className='z-99999 block lg:hidden rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark'
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
                                        className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out bg-white ${!sidebarOpen && '!h-0 !delay-200'
                                            }`}
                                    ></span>
                                </span>
                            </span>
                        </button>
                        {/* <!-- Hamburger Toggle BTN --> */}

                        <Link href='/' className='w-full max-w-[200px] flex flex-shrink-0 items-center gap-2 text-white'>
                            <img src={!logo ? "../image/logo/logo-icon.svg" : logo} alt='Logo' />
                            <span className='flex-shrink-0 flex text-2xl font-semibold'>Colony</span>
                        </Link>

                        <div className='hidden lg:flex w-full text-white'>
                            <div className='w-full max-w-max flex items-center gap-4'>
                                {routes && routes?.length > 0 ?
                                    routes?.map((route: any, id: any) => {
                                        return (
                                            <li key={id} className='w-full flex  max-w-max'>
                                                <ActiveLink
                                                    href={{ pathname: route.url, query: route?.query }}
                                                    className={`text-base py-6 ${route?.className}`}
                                                    activeClass="border-b-2 border-primary"
                                                    pages={route?.pages}
                                                >
                                                    {!route?.icons?.icon ? null :
                                                        <Icon className={route?.icons?.className} icon={route.icons.icon} />
                                                    }
                                                    {route?.pathname}
                                                </ActiveLink>
                                            </li>
                                        )
                                    }) : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className='w-full lg:w-1/3 flex items-center gap-3 2xsm:gap-7 px-6'>
                        <ul className='w-full flex items-center gap-2 2xsm:gap-4 justify-end'>
                            {/* <!-- Dark Mode Toggler --> */}
                            {/* <DarkModeSwitcher /> */}
                            {/* <!-- Dark Mode Toggler --> */}

                            {/* <!-- Notification Menu Area --> */}
                            <DropdownUser userDefault={userDefault} token={token} />
                            {/* <!-- Notification Menu Area --> */}

                            <div className="relative h-10 mx-3">
                                <div className="border-l border-gray absolute inset-y-0"></div>
                            </div>

                            {/* <!-- Chat Notification Area --> */}
                            <DropdownNotification />
                        </ul>

                        {/* <!-- User Area --> */}
                        {/* <!-- User Area --> */}
                    </div>
                </div>
            </header>

            <DomainHeaderMobile isOpen={sidebarOpen} setIsOpen={setSidebarOpen} logo={logo} title={title} images={images} token={token} />
        </Fragment>
    )
}

export const ActiveLink = ({ children, href, className, activeClass, pages }: any) => {
    const router = useRouter();
    const { pathname } = router;
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (pathname === href?.pathname || pathname.includes(pages as string)) setActive(true);
        else setActive(false)
    }, [pathname, pages])

    return (
        <Link
            href={{ pathname: href?.pathname, query: href?.query }}
            scroll={true}
            // className={`${router.pathname === href?.pathname
            //     ? "border-primary font-bold mb-3 md:mb-0 text-primary"
            //     : "text-gray-500 hover:text-gray-700 border-transparent"
            //     } ${className} block py-4 text-base border-b-4 rounded focus:outline-none whitespace-no-wrap`}
            className={`group relative w-full max-w-max flex items-center py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${active ? `border-b-2 border-primary ${activeClass}` : ""} ${className}`}
        >
            {children}
        </Link>
    );
};

export default DomainHeader
