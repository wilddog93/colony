import React, { useState, useEffect, useRef, Fragment } from 'react';
import SidebarLinkGroup from '../SidebarLinkGroup';
// import Logo from '../images/logo/logo.svg';
import { useRouter } from 'next/router';
import { MdArrowBack, MdOutlineBusiness } from 'react-icons/md';
import { menuBM } from '../../../../utils/routes';
import Icon from '../../../Icon';
import SidebarLink from '../SidebarLink';

type Props = {
    sidebarOpen: boolean,
    setSidebarOpen: any;
    children?: JSX.Element;
    position?: string;
}

const SidebarMedia = ({ sidebarOpen, setSidebarOpen, children, position }: Props) => {
    const router = useRouter()
    const { pathname, query } = router;
    const [isOpsition, setIsOpsition] = useState(true);



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

    const initiaLocalStorage: any = { sidebar: getFromLocalStorage("sidebar-media") ? JSON.parse(getFromLocalStorage("sidebar-media") || '{}') : [] };

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

        localStorage.setItem('sidebar-media', sidebarExpanded?.toString())
        if (sidebarExpanded) {
            body?.classList.add('sidebar-media')
        } else {
            body?.classList.remove('sidebar-media')
        }
    }, [sidebarExpanded]);

    useEffect(() => {
      if(position === "right"){
        setIsOpsition(false);
      }
      setIsOpsition(true)
    }, [position])
    

    return (
        <Fragment>
            <aside
                ref={sidebar}
                className={`border-gray-4 shadow-card absolute inset-y-0 righ-0 z-40 flex w-full max-w-sm flex-col overflow-y-hidden bg-gray duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
            >
                {/* <!-- SIDEBAR HEADER --> */}

                <div className='w-full flex flex-col h-full overflow-y-auto duration-300 ease-linear mt-20 lg:mt-14'>
                    {/* <!-- Sidebar Menu --> */}
                    <div className='w-full flex-flex-col gap-2 px-4 lg:px-6 overflow-y-auto pt-12'>
                        {children}
                    </div>
                    {/* <!-- Sidebar Menu --> */}
                </div>
            </aside>
            {/* overlay */}
            <button
                ref={trigger}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls='sidebar'
                aria-expanded={sidebarOpen}
                className={`lg:static ${sidebarOpen && 'fixed z-30 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100'}`}>

            </button>
        </Fragment>
    )
}

export default SidebarMedia;
