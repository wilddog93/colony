import { useMemo } from "react";


export default function Navbar(props: any) {
  const { fixed, sticky, absolute, className, children } = props;

  const variants = useMemo(() => {
    if (fixed) return "fixed top-0 inset-x-0 z-50 md:pl-[20rem]";
    if (absolute) return "absolute top-0 inset-x-0 z-50";
    if (sticky) return "sticky top-0 inset-x-0 z-50";
    return ""
  }, [fixed, absolute, sticky])

  return (
    <div
      className={`w-full flex shadow bg-white py-3.5 md:py-5 px-4 duration-300 ease-in-out ${variants}`}
    >
      <div className="relative w-full flex flex-col md:flex-row items-center">
        {children}
      </div>
    </div>
  )
}