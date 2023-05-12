import Link from 'next/link'
import React from 'react'
import { MdArrowBack } from 'react-icons/md';
import Button from '../../Button/Button';

const AccountVerify = (props: any) => {
    const { isOpen, email, onEmailChange, code, onCodeChange } = props;
    return (
        <div className={`w-full lg:w-1/2 h-full flex flex-col p-6 lg:pr-10 gap-2 text-gray-5 justify-between ${!isOpen ? "hidden" : ""}`}>
            <Link className='mb-5.5 flex items-center gap-4' href='/authentication?page=sign-in'>
                <span className='p-2 rounded-lg bg-primary text-white hover:opacity-80 hover:shadow-1'>
                    <MdArrowBack className='w-6 h-6' />
                </span>
                <h2 className='text-lg text-graydark dark:text-white sm:text-title-lg'>
                    back to login.
                </h2>
            </Link>

            <div className="w-full flex flex-col justify-center gap-6">
                <div className='flex flex-col gap-2'>
                    <h2 className='font-bold text-2xl text-graydark dark:text-white sm:text-title-xl2'>Verify your account!</h2>
                    <p className='text-gray-5 text-sm sm:text-title-sm'>We already sent an email to your account, please check regularly to verify</p>
                </div>
            </div>

            <div className="w-full flex flex-col justify-center gap-6">
                <form>
                    <div className='mb-5'>
                        <div className='relative'>
                            <input
                                value={code}
                                onChange={onCodeChange}
                                type='hidden'
                                placeholder='Enter your code verification'
                                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                    </div>

                    <div className='mb-5'>
                        <div className='relative'>
                            <input
                                value={email}
                                onChange={onEmailChange}
                                type='hidden'
                                placeholder='Enter your email'
                                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-2 items-start mb-5 text-left'>
                        <p className='text-gray-5 text-sm lg:text-sm'>not receiving e-mail?</p>
                        <div className='w-full max-w-max'>
                            <Button
                                type='submit'
                                variant="primary-outline-none"
                                className='w-full cursor-pointer rounded-lg py-4 px-0 transition hover:bg-opacity-90 text-left text-sm font-semibold'
                            >
                                Resend e-mail
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AccountVerify;