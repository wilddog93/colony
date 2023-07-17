import Navbar from "../../../components/Tenant/Navbar";
import TenantMenu from "../../../components/Tenant/TenantMenu";
import TenantSideBar from "../../../components/Tenant/TenantSideBar";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlinePlayArrow } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineUpload } from "react-icons/md";
import VideoButton from "../../../components/Tenant/button/VideoButton";
import MerchantLayouts from "../../../components/Layouts/MerchantLayouts";
import TenantTabs from "../../../components/Tenant/TenantTabs";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal";
import { useState } from "react";
import { ModalHeader } from "../../../components/Modal/ModalComponent";
import NewItem from "../../../components/Forms/Merchant/detail/NewItem";

type Props = {
  pageProps: any;
};

const tenant = ({ pageProps }: Props) => {
  // form
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  return (
    <MerchantLayouts
      title="Colony"
      header="Tenant"
      head="Menu"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png">
      <div className="w-full absolute inset-0 mt-16 z-99 bg-white flex">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-1/4">
            <TenantSideBar />
          </div>
          <div className="w-full flex flex-col lg:flex-row p-2">
            <TenantTabs />
            <div className="w-full px-2 lg:w-1/4 md:gap-3 flex flex-col">
              {/* Unit Owner */}
              <div className="flex flex-col mt-2 lg:mt-5 gap-1">
                <h1 className="text-xl">Unit Owner</h1>
                <div className="bg-white p-2 mt-1 space-x-2 items-center rounded-lg shadow border-stroke border flex flex-row">
                  <div className="w-12 h-12">
                    <img src="../../../image/user/user-01.png"></img>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-sm">Thomas Anree</p>
                    <p className="text-xs">thomasanree@gmail.com</p>
                  </div>
                </div>
              </div>
              {/* Occupant */}
              <div className="mt-2 flex flex-col gap-1">
                <h1 className="text-xl">Occupant</h1>
                <div className="bg-white p-2 mt-1 justify-between items-center rounded-lg border-stroke border shadow flex flex-row">
                  <div className="w-12 h-12">
                    <img src="../../../image/user/user-01.png"></img>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-sm">Thomas Anree</p>
                    <p className="text-xs">thomasanree@gmail.com</p>
                  </div>
                  <MdDeleteOutline className="w-6 h-6 hover:text-red-500 cursor-pointer" />
                </div>
              </div>
              {/* media */}
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex flex-row  items-center justify-between">
                  <h1 className="text-xl">Media</h1>
                  <button className="mr-1 font-semibold text-purple-400 hover:text-primary">
                    View All
                  </button>
                </div>
                <div className="bg-white p-2 mt-1 rounded-lg shadow border-stroke border flex flex-col gap-2">
                  <img
                    src="../../../image/no-image.jpeg"
                    className="mx-auto rounded-lg max-h-[200px] w-full"></img>
                  <div className="border-slate-400 shadow-sm rounded-lg flex flex-row items-center justify-center w-full border-[1px] p-2">
                    <MdOutlinePlayArrow />
                    <span>Preview</span>
                  </div>
                  <div className="border-slate-400 shadow-sm rounded-lg flex flex-row items-center w-full border-[1px]">
                    <button className="bg-white w-1/4 flex justify-center items-center">
                      <MdAttachFile />
                    </button>
                    <div className="bg-slate-400 h-full w-[1px]"></div>
                    <input
                      className="w-3/4 p-2 bg-slate-300"
                      value="https://www.youtube.com/watch?v=undefined"></input>
                  </div>

                  <span className="font-bold text-lg">-</span>
                  <span className="">-</span>
                </div>
              </div>
              {/* video upload */}
              <Button
                type="button"
                onClick={isOpenForm}
                className="rounded-lg text-sm font-semibold py-4"
                variant="primary">
                <span>Upload Video</span>
                <MdOutlineUpload />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isForm} onClose={isCloseForm} size="medium">
        <div>
          <ModalHeader
            className="border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full flex">
              <h3>Add New Video Promotion</h3>
            </div>
          </ModalHeader>
          <div className="w-full">
            <form className="w-full p-4 text-sm">
              <div className="w-full flex flex-col gap-3 py-4 bg-white rounded-lg border border-stroke">
                <div className="w-full px-3">
                  <label className="font-semibold text-lg">Add New URL</label>
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=0ABCDE"
                        className="w-full rounded-xl border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-1/4">
                      <Button
                        type="button"
                        className="rounded-lg text-sm font-semibold py-4"
                        variant="primary">
                        <span>Add Video</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </MerchantLayouts>
  );
};

export default tenant;
