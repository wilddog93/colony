import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/Layouts/AuthLayouts';
import SignIn from '../../components/Forms/authentication/SignIn';
import SignUp from '../../components/Forms/authentication/SignUp';
import { useRouter } from 'next/router';
import { MdArrowBack } from 'react-icons/md';
import Button from '../../components/Button/Button';
import Tooltip from '../../components/Tooltip/Tooltip';

const Authentication = () => {
    const router = useRouter();
    const { query, pathname } = router;

    const [tabs, setTabs] = useState("");

    const handleChangePage = () => {
        if (tabs === "sign-in") {
            setTabs("sign-up")
            return;
        }
        setTabs("sign-in")
    };

    // query
    useEffect(() => {
        query?.page ? setTabs(query?.page as SetStateAction<string>) : setTabs("sign-in");
    }, [query]);

    // set state query
    useEffect(() => {
        let qr = {};
        if (tabs) qr = { ...qr, page: tabs };
        router.replace({ pathname, query: qr });
    }, [tabs]);

    const signIn = useMemo(() => {
        let res;
        res = tabs === "sign-in"
        return res
    }, [tabs])

    const signUp = useMemo(() => {
        let res;
        res = tabs === "sign-up"
        return res
    }, [tabs])

    return (
        <AuthLayout
            title="Authentication"
            logo="../image/logo/logo-icon.svg"
            description=""
        >
            <div className="w-full h-full p-6 lg:p-10">
                {/* <Breadcrumb pageName='Sign In' /> */}
                <div className='relative w-full h-full flex items-center rounded-xl bg-white shadow-default p-10'>
                    <SignIn onChangePage={handleChangePage} isOpen={signIn} />

                    <div className={`relative hidden w-full lg:w-1/2 h-full lg:block transition-transform duration-300 ease-in-out border bg-primary text-white border-stroke rounded-3xl translate-x-0 ${signIn ? "translate-x-full" : ""}`}>
                        <div className='w-full h-2/3 flex flex-col py-17.5 px-26 justify-center'>
                            <div className='flex flex-col justify-center'>
                                <h2 className='text-title-md2 lg:text-title-lg mb-5'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                </h2>

                                <p className='leading-1 text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod, minus cumque molestias voluptatibus veniam minima soluta accusamus aspernatur praesentium maiores?</p>
                            </div>
                        </div>
                        <div className='w-full h-1/3 flex flex-col justify-end py-10 px-26 tracking-wider'>
                            <div className='w-full p-6 rounded-lg bg-[#111F2C3D] text-sm'>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. In tempore debitis beatae doloremque eveniet eos sunt repellendus accusantium ab distinctio.</p>
                            </div>
                        </div>


                        {/* <div className="absolute z-50 inset-y-1/2 left-0 text-gray-4">
                            <div className='relative'>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Hover me
                                </button>
                                <div className="absolute bg-gray text-gray-700 px-4 py-2 rounded-lg shadow-md tooltip">
                                    This is a tooltip
                                </div>
                            </div>
                        </div> */}
                        <div className={`absolute z-40 inset-y-1/2 ${signIn ? "right-0" : ""}`}>
                            <Tooltip 
                                className={`tooltip w-full text-sm bg-[#111F2C3D] p-2 rounded-lg focus:outline-none ${signIn ? "rounded-tr-none rounded-br-none" : "rounded-tl-none rounded-bl-none"}`}
                                classTooltip='p-5 rounded-xl shadow-lg z-1 font-bold w-full min-w-max'
                                tooltip={!signIn ? "Go to Sign in" : "Go to Sign up please"}
                                color='light'
                                position={!signIn ? "right" : "left"}
                            >
                                <MdArrowBack onClick={handleChangePage} className={`w-10 h-10 transition-transform ease-in-out duration-1000 ${signIn ? "" : "rotate-180"}`} />
                            </Tooltip>
                        </div>
                    </div>

                    {/* sign up */}
                    <SignUp onChangePage={handleChangePage} isOpen={signUp} />
                </div>
                {/* <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        </div> */}
            </div>
        </AuthLayout>
    )
}

export default Authentication;
