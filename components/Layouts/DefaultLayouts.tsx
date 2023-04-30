import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Head from 'next/head';

type Props = {
    children: any,
    header: any,
    head: any,
    title: any,
    description: any,
    logo: string,
    images: string,
    userDefault: string
}

const DefaultLayout = ({ children, title, description, logo, header, head, images, userDefault }: Props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className='dark:bg-boxdark-2 dark:text-bodydark'>
            <Head>
                <title>{head} - {header} | Colony</title>
                <link rel="icon" href={logo ? logo : `./image/logo-bar.png`} />
                <meta name="description" content={`Colony - ${description}`} />
            </Head>
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className='flex h-screen overflow-hidden'>
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} logo={logo} title={title} images={images} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} logo={logo} title={title} header={header} userDefault={userDefault} />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        {/* <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'> */}
                        <div className='mx-auto max-w-screen-2xl'>
                            {children}
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    )
}

export default DefaultLayout;
