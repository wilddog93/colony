import Link from 'next/link';
import { useRouter } from 'next/router';

const SidebarLink = ({ children, href, className }: any) => {
    const router = useRouter();
    return (
        <Link
            href={{ pathname: href?.pathname, query: href?.query }}
            scroll={true}
            // className={`${router.pathname === href?.pathname
            //     ? "border-primary font-bold mb-3 md:mb-0 text-primary"
            //     : "text-gray-500 hover:text-gray-700 border-transparent"
            //     } ${className} block py-4 text-base border-b-4 rounded focus:outline-none whitespace-no-wrap`}
            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${router.pathname === href?.pathname && 'bg-primary dark:bg-primary'} ${className}`}
        >
            {children}
        </Link>
    );
};

export default SidebarLink