import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";
import { useAppDispatch } from "../../../../redux/Hook";

type Props = {
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
  className?: string;
  token?: any;
  children?: any;
};

const TenantSidebar = ({
  sidebar,
  setSidebar,
  className,
  token,
  children,
}: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // property-access
  const dispatch = useAppDispatch();
  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(key);
  };

  const initiaLocalStorage: any = {
    sidebar: getFromLocalStorage("sidebar-component")
      ? JSON.parse(getFromLocalStorage("sidebar-component") || "{}")
      : [],
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(
    initiaLocalStorage === null ? false : initiaLocalStorage === "true"
  );

  // close on click outside
  useEffect(() => {
    type Props = {
      target: any;
    };
    const clickHandler = ({ target }: Props) => {
      if (!sidebarRef.current || !trigger.current) return;
      if (
        !sidebar ||
        sidebarRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebar(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    type Props = {
      keyCode: any;
    };
    const keyHandler = ({ keyCode }: Props) => {
      if (!sidebar || keyCode !== 27) return;
      setSidebar(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    const body = document.querySelector("body");
    const parentNode = body?.parentNode;

    if (!(parentNode instanceof Element)) {
      throw new Error("box.parentNode is not an Element");
    }

    console.log(parentNode.querySelector("body"), "body");

    localStorage.setItem("sidebar-component", sidebarExpanded?.toString());
    if (sidebarExpanded) {
      body?.classList.add("sidebar-component");
    } else {
      body?.classList.remove("sidebar-component");
    }
  }, [sidebarExpanded]);

  return (
    <Fragment>
      <aside
        ref={sidebarRef}
        className={`border-gray-4 shadow-card absolute inset-y-0 left-0 z-99999 flex w-full max-w-xs flex-col overflow-y-hidden bg-boxdark duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        } ${className}`}>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="w-full flex flex-col h-full overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <div className="w-full flex-flex-col gap-2 px-4 lg:px-6 overflow-y-auto pt-8">
            <div className="w-full flex mb-3 -mt-5">
              <button
                type="button"
                ref={trigger}
                onClick={() => setSidebar(!sidebar)}
                aria-controls="sidebar-component"
                aria-expanded={sidebar}
                className="ml-auto inline-block text-black lg:hidden bg-white rounded-lg  p-1.5">
                <MdArrowBack className="w-5 h-5" />
              </button>
            </div>
            <div>{children}</div>
          </div>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
      {/* overlay */}
      <button
        ref={trigger}
        onClick={() => setSidebar(!sidebar)}
        aria-controls="sidebar-component"
        aria-expanded={sidebar}
        className={`lg:static ${
          sidebar &&
          "fixed z-9998 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100"
        }`}></button>
    </Fragment>
  );
};

export default TenantSidebar;
