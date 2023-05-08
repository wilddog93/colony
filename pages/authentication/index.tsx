import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/Layouts/AuthLayouts';
import SignIn from '../../components/Forms/authentication/SignIn';
import SignUp from '../../components/Forms/authentication/SignUp';

const Authentication = () => {
    const [signIn, setSignIn] = useState(true);
    const [signUp, setSignUp] = useState(false);

    const handleChangePage = () => {
        if (!signIn) {
            setSignIn(true);
            setSignUp(false);
            return;
        }
        setSignIn(false);
        setSignUp(true);
    };

    return (
        <AuthLayout
            title="Authentication"
            logo="../image/logo/logo-icon.svg"
            description=""
        >
            <div className="w-full h-full p-6 lg:p-10">
                {/* <Breadcrumb pageName='Sign In' /> */}
                <div className='relative w-full h-full flex items-center rounded-xl bg-white shadow-default'>
                    <SignIn onChangePage={handleChangePage} isOpen={signIn} />

                    <div className={`hidden w-full lg:w-1/2 h-full xl:block transition-transform duration-500 border bg-primary text-white border-stroke rounded-xl translate-x-0 ease-linear ${signIn ? "translate-x-full" : ""}`}>
                        <div className='w-full h-2/3 flex flex-col py-17.5 px-26 justify-center'>
                            <div className='flex flex-col justify-center'>
                                <h2 className='text-title-md2 lg:text-title-lg mb-5'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                </h2>

                                <p className='leading-1 text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod, minus cumque molestias voluptatibus veniam minima soluta accusamus aspernatur praesentium maiores?</p>
                            </div>
                        </div>
                        <div className='w-full h-1/3 flex flex-col justify-end py-10 px-26 tracking-wider'>
                            <div className='w-full p-6 rounded-lg bg-[#111f2c3d] text-sm'>
                                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. In tempore debitis beatae doloremque eveniet eos sunt repellendus accusantium ab distinctio.</p>
                            </div>
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
