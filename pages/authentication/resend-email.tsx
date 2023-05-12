import React, { SetStateAction, useEffect } from 'react'
import AuthLayout from '../../components/Layouts/AuthLayouts'
import Button from '../../components/Button/Button'
import Link from 'next/link'
import { MdArrowBack, MdLockOutline, MdOutlineEmail } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useInput } from '../../utils/useHooks/useHooks'
import { validation } from '../../utils/useHooks/validation'

const ResendEMail = (props: any) => {
    const router = useRouter();
    const { pathname, query } = router;

    const { value: email, setValue: setEmail, reset: resetEmail, error: emailError, setError: setEmailError, onChange: onEmailChange } = useInput({
        defaultValue: "",
        validate: (value) => validation?.email(value),
    });

    useEffect(() => {
      if(!query?.email) return;
      else setEmail(query?.email as SetStateAction<string>)
    }, [query])
    
    
    return (
        <AuthLayout
            title="Authentication"
            logo="../image/logo/logo-icon.svg"
            description=""
        >
            <div className="w-full h-full p-6">
                {/* <Breadcrumb pageName='Sign In' /> */}
                <div className='relative w-full h-full flex items-center rounded-xl bg-white shadow-default p-10'>
                    <div className='w-full lg:w-1/2 h-full flex flex-col p-6 lg:pr-10 gap-2 text-gray-5'>
                        <Link className='mb-5.5 flex items-center gap-4' href='/authentication?page=sign-in'>
                            <span className='p-2 rounded-lg bg-primary text-white hover:opacity-80 hover:shadow-1'>
                                <MdArrowBack className='w-6 h-6' />
                            </span>
                            <h2 className='text-lg text-graydark dark:text-white sm:text-title-lg'>
                                back to login.
                            </h2>
                        </Link>

                        <div className="w-full h-full flex flex-col justify-center gap-6">
                            <div className='flex flex-col gap-2'>
                                <h2 className='font-bold text-2xl text-graydark dark:text-white sm:text-title-xl2'>Resend your email to verify your account here!</h2>
                                <p className='text-gray-5 text-sm sm:text-title-sm'>We will send you a message trough your email to resend verification.</p>
                            </div>

                            <form>
                                <div className='mb-5'>
                                    <label className='mb-2.5 block font-medium text-black dark:text-white'>
                                        Email *
                                    </label>
                                    <div className='relative'>
                                        <input
                                            value={email}
                                            onChange={onEmailChange}
                                            type='email'
                                            placeholder='Enter your email'
                                            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />

                                        <MdOutlineEmail className='absolute right-4 top-4 h-6 w-6 text-gray-5' />
                                    </div>
                                </div>

                                <div className='w-full flex flex-col gap-2 items-center mb-5'>
                                    <div className='w-full'>
                                        <Button
                                            type='submit'
                                            variant="primary"
                                            className='w-full cursor-pointer rounded-lg border py-4 text-white transition hover:bg-opacity-90'
                                        >
                                            Send Email
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={`hidden w-full lg:w-1/2 h-full lg:block transition-transform duration-500 border bg-primary text-white border-stroke rounded-3xl ease-in-out`}>
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
                </div>
            </div>
        </AuthLayout>
    )
}

export default ResendEMail