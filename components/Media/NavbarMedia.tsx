import React, { useEffect, useState } from 'react'
import Navbar from '../Layouts/Header/Navbar'
import ActiveLink from '../Layouts/ActiveLink';

type Props = {}

const NavbarMedia = (props: Props) => {
    const [navbarOpen, setNavbarOpen] = useState(true);

    const handleResize = () => {
        if (window.innerWidth < 768) {
            setNavbarOpen(false);
        } else {
            setNavbarOpen(true);
        }
    };

    // create an event listener
    useEffect(() => {
        window.addEventListener("resize", handleResize);
    }, []);

    return (
        <Navbar sticky>
            <div className='absolute lg:static left-0 top-0 z-9999 w-full flex flex-col'>
                <div className='bg-boxdark text-white relative w-full flex items-center justify-between p-6 lg:hidden z-40'>
                    <span>Menus</span>
                    <button
                        aria-controls='sidebar'
                        aria-expanded={navbarOpen}
                        onClick={(e) => {
                            e.stopPropagation()
                            setNavbarOpen(!navbarOpen)
                        }}
                        className='z-99999 block rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark'
                    >
                        <span className='relative block h-5.5 w-5.5 cursor-pointer'>
                            <span className='du-block absolute right-0 h-full w-full'>
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-[0] duration-200 ease-in-out bg-white ${!navbarOpen && '!w-full delay-300'
                                        }`}
                                ></span>
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-150 duration-200 ease-in-out bg-white ${!navbarOpen && 'delay-400 !w-full'
                                        }`}
                                ></span>
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm delay-200 duration-200 ease-in-out bg-white ${!navbarOpen && '!w-full delay-500'
                                        }`}
                                ></span>
                            </span>
                            <span className='absolute right-0 h-full w-full rotate-45'>
                                <span
                                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300 duration-200 ease-in-out bg-white ${!navbarOpen && '!h-0 !delay-[0]'
                                        }`}
                                ></span>
                                <span
                                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm duration-200 ease-in-out bg-white ${!navbarOpen && '!h-0 !delay-200'
                                        }`}
                                ></span>
                            </span>
                        </span>
                    </button>
                </div>

                <ul className={`bg-boxdark text-white w-full flex flex-1 flex-col lg:flex-row transform duration-300 ease-in-out ${navbarOpen ? "" : "-translate-y-full invisible"}`}>
                    <li className='w-full lg:max-w-max py-6 gap-2 px-8'>
                        <ActiveLink href={{ pathname: "/media/videos" }} activeClass="bg-transparent" className='w-full justify-center text-base lg:text-lg text-gray hover:text-white'>
                            Video Media
                        </ActiveLink>
                    </li>
                    <li className='w-full lg:max-w-max py-6 gap-2 px-8'>
                        <ActiveLink href={{ pathname: "/media/articles" }} activeClass="bg-transparent" className='w-full justify-center text-base lg:text-lg text-gray hover:text-white'>
                            News & Articles
                        </ActiveLink>
                    </li>
                </ul>
            </div>
        </Navbar>
    )
}

export default NavbarMedia