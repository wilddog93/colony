import Navbar from "../../../components/Tenant/Navbar";
import TenantMenu from "../../../components/Tenant/TenantMenu";
import TenantSideBar from "../../../components/Tenant/TenantSideBar";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlinePlayArrow } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineUpload } from "react-icons/md";

type Props = {
  pageProps: any;
};

const tenant = ({ pageProps }: Props) => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-row w-full h-screen">
        <div className="w-1/4 overflow-y-hidden hidden md:flex">
          <TenantSideBar />
        </div>
        <div className="w-3/4 flex flex-col md:flex-row rounded-tl-lg p-0 md:p-6">
          <div className="w-3/4 p-2">
            <TenantMenu />
          </div>
          <div className="w-full p-2 md:w-1/4 md:gap-3 flex flex-col">
            <div className="flex flex-col gap-3">
            <h1 className="text-xl">Unit Owner</h1>
            <div className="bg-white p-2 mt-2 space-x-2 items-center rounded-lg shadow-sm border-slate-400 border-[1px] flex flex-row">
              <div className="w-12 h-12">
                <img src="../../../image/user/user-01.png"></img>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-sm">Thomas Anree</p>
                <p className="text-xs">thomasanree@gmail.com</p>
              </div>
            </div>

            </div>

            <div className="mt-2 flex flex-col gap-3">
              <h1 className="text-xl">Occupant</h1>
              <div className="bg-white p-2 mt-2 justify-between items-center rounded-lg shadow-sm border-slate-400 border-[1px] flex flex-row">
                <div className="w-12 h-12">
                  <img src="../../../image/user/user-01.png"></img>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-sm">Thomas Anree</p>
                  <p className="text-xs">thomasanree@gmail.com</p>
                </div>
                <MdDeleteOutline className="w-6 h-6 hover:text-red-500 cursor-pointer"/>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-xl">Media</h1>
                    <button className=" font-semibold text-purple-400 hover:text-primary">View All</button>
                </div>
                <div className="bg-white p-2 mt-2 rounded-lg shadow-sm border-slate-400 border-[1px] flex flex-col gap-2">
                    <img src="../../../image/no-image.jpeg" className="mx-auto rounded-lg max-h-[200px] w-full"></img>
                    <div className="border-slate-400 shadow-sm rounded-lg flex flex-row items-center justify-center w-full border-[1px] p-2">
                        <MdOutlinePlayArrow/>
                        <span>Preview</span>
                    </div>
                    <div className="border-slate-400 shadow-sm rounded-lg flex flex-row items-center w-full border-[1px]">
                        <button className="bg-white w-1/4 flex justify-center items-center">
                            <MdAttachFile/>
                        </button>
                        <div className="bg-slate-400 h-full w-[1px]"></div>
                        <input className="w-3/4 p-2 bg-slate-300" value="https://www.youtube.com/watch?v=undefined"></input>
                    </div>
                    
                    <span className="font-bold text-lg">-</span>
                    <span className="">-</span>
                </div>
            </div>

            <div className="bg-primary rounded-lg text-white p-2 flex flex-row gap-2 items-center justify-center">
                <span className="font-semibold text-base">Upload Video</span>
                <MdOutlineUpload className="w-5 h-5"/>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default tenant;
