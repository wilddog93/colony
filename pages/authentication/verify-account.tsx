import React, { ChangeEvent, SetStateAction, useEffect, useMemo, useState } from 'react'
import AuthLayout from '../../components/Layouts/AuthLayouts'
import Button from '../../components/Button/Button'
import Link from 'next/link'
import { MdArrowBack, MdCheckCircleOutline, MdLockOutline, MdOutlineEmail } from 'react-icons/md'
import { useRouter } from 'next/router'
import AccountVerify from '../../components/Forms/authentication/AccountVerify'
import AccountVerified from '../../components/Forms/authentication/AccountVerified'

const VerifyAccount = (props: any) => {
    const router = useRouter();
    const { pathname, query } = router;
    const [tabs, setTabs] = useState<string | string[]>("");
    const [code, setCode] = useState<string | string[]>("");
    const [email, setEmail] = useState<string | string[]>("");

    const [isVerified, setIsVerified] = useState(false);

    // query
    useEffect(() => {
        if (query?.page) setTabs(query?.page)
        if (query?.code) setCode(query?.code)
        if (query?.email) setEmail(query?.email)
    }, [query]);

    // set state query
    useEffect(() => {
        let qr = {
            page: tabs || query?.page,
            code: code || query?.code,
            email: email || query?.email,
        };
        if (!tabs || !code || !email) return;
        router.replace({ pathname, query: qr });
    }, [tabs, code, email]);

    const verify = useMemo(() => {
        let res;
        res = (tabs === "verify") ? true : false
        return res
    }, [tabs])

    const verified = useMemo(() => {
        let res;
        res = (tabs === "verified") ? true : false
        return res
    }, [tabs]);

    console.log({ verified, verify, tabs, code, email }, 'boolean')

    return (
        <AuthLayout
            title="Verify account"
            logo="../image/logo/logo-icon.svg"
            description=""
        >
            <div className='relative w-full h-full flex items-center rounded-xl bg-white shadow-default p-10'>
                <AccountVerify
                    isOpen={verify}
                    code={code}
                    onCodeChange={setCode}
                    email={email}
                    onEmailChange={setEmail}
                />

                <AccountVerified
                    isOpen={verified}
                />

                <div className={`hidden w-full lg:w-1/2 h-full lg:block transition-transform duration-500 border bg-primary text-white border-stroke rounded-3xl ease-in-out`}>
                    <div className="w-full h-full flex flex-col items-center justify-between">
                        <Link className='w-full pt-5.5 flex items-start gap-4 px-10' href='/authentication?page=sign-in'>
                            <img src="../image/logo/logo-icon-white.png" alt="logo" />
                            <h2 className='text-lg text-white sm:text-title-lg'>
                                Colony.
                            </h2>
                        </Link>
                        <div className='w-full flex flex-col px-10 justify-center'>
                            <div className='flex flex-col justify-center'>
                                <h2 className='text-title-md2 lg:text-title-lg mb-5'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                </h2>

                                <p className='leading-1 text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod, minus cumque molestias voluptatibus veniam minima soluta accusamus aspernatur praesentium maiores?</p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col justify-end py-10 px-10 tracking-wider'>
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

export default VerifyAccount