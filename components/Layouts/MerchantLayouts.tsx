import React, { useState } from "react";
import Head from "next/head";
import DomainHeader from "./Header/Domain";
import { menuOwnerMaster } from "../../utils/routes";
import MerchantHeader from "./Header/merchant";

type Props = {
  children?: any;
  header?: any;
  head?: any;
  title?: any;
  description?: any;
  logo?: string;
  images?: string;
  userDefault?: string;
  token?: any;
  icons?: any;
};

const MerchantLayouts = ({
  children,
  title,
  description,
  logo,
  header,
  head,
  images,
  userDefault,
  token,
  icons,
}: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <Head>
        <title>{`${head} - ${header}`} | Colony</title>
        <link rel="icon" href={logo ? logo : `./image/logo-bar.png`} />
        <meta name="description" content={`Colony - ${description}`} />
      </Head>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="w-full flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <DomainSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} logo={logo} title={title} images={images} token={token} /> */}
          {/* <!-- ===== Header Start ===== --> */}
          <MerchantHeader
            routes={menuOwnerMaster}
            logo={logo}
            images={images}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            header={header}
            userDefault={userDefault}
            token={token}
            icons={icons}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="mx-auto max-w-screen-2xl">{children}</main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default MerchantLayouts;
