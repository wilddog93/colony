import DropdownNotification from "../../../Dropdown/DropdownNotification";
import DropdownUser from "../../../Dropdown/DropdownUser";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

type HeaderProps = {
  userDefault?: string;
  logo?: string;
  token?: any;
};

const MerchantHeader = ({ userDefault, logo, token }: HeaderProps) => {
  return (
    <Fragment>
      <header className="sticky top-0 z-999 flex w-full bg-boxdark-2 drop-shadow-none">
        <div className="w-full flex flex-grow items-center gap-4 py-1 shadow-2">
          <div className="w-full lg:w-2/3 flex items-center gap-2 sm:gap-8 px-6 py-5 lg:py-0">
            <Link
              href="/"
              className="w-full max-w-[200px] py-5 flex flex-shrink-0 items-center gap-2 text-white">
              <img
                src={!logo ? "../image/logo/logo-icon.svg" : logo}
                alt="Logo"
              />
              <span className="flex-shrink-0 flex text-2xl font-semibold">
                Colony
              </span>
            </Link>
          </div>

          <div className="w-full lg:w-1/3 flex items-center gap-3 2xsm:gap-7 px-6">
            <ul className="w-full flex items-center gap-2 2xsm:gap-4 justify-end">
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
    </Fragment>
  );
};

export const ActiveLink = ({
  children,
  href,
  className,
  activeClass,
  pages,
}: any) => {
  const router = useRouter();
  const { pathname } = router;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (pathname === href?.pathname || pathname.includes(pages as string))
      setActive(true);
    else setActive(false);
  }, [pathname, pages]);

  return (
    <Link
      href={{ pathname: href?.pathname, query: href?.query }}
      scroll={true}
      // className={`${router.pathname === href?.pathname
      //     ? "border-primary font-bold mb-3 md:mb-0 text-primary"
      //     : "text-gray-500 hover:text-gray-700 border-transparent"
      //     } ${className} block py-4 text-base border-b-4 rounded focus:outline-none whitespace-no-wrap`}
      className={`group relative w-full max-w-max flex items-center py-5 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark ${
        active ? `border-b-2 border-primary ${activeClass}` : ""
      } ${className}`}>
      {children}
    </Link>
  );
};

export default MerchantHeader;
