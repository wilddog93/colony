import Navbar from "../../../components/Tenant/Navbar";
import TenantMenu from "../../../components/Tenant/TenantMenu";
import {
  MdArrowLeft,
  MdArrowRightAlt,
  MdBusiness,
  MdChevronLeft,
  MdDeleteOutline,
  MdSettings,
  MdShower,
} from "react-icons/md";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal";
import { useEffect, useState } from "react";
import { ModalHeader } from "../../../components/Modal/ModalComponent";
import NewItem from "../../../components/Forms/Merchant/detail/NewItem";
import SidebarBody from "../../../components/Layouts/Sidebar/SidebarBody";
import {
  getAuthMe,
  selectAuth,
} from "../../../redux/features/auth/authReducers";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import moment from "moment";
import { useRouter } from "next/router";
import TenantSidebar from "../../../components/Layouts/Sidebar/Tenants";
import TenantLayouts from "../../../components/Layouts/TenantLayouts";
import Tabs from "../../../components/Layouts/Tabs";
import { menuTabTenants } from "../../../utils/routes";
import Cards from "../../../components/Cards/Cards";

type Props = {
  pageProps: any;
};

const BillingTenant = ({ pageProps }: Props) => {
  // form
  moment.locale("id");
  const router = useRouter();
  const { pathname, query } = router;
  const url = process.env.ENDPOINT_API;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  const [sidebar, setSidebar] = useState(true);

  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication?page=sign-in"),
        })
      );
    }
  }, [token]);

  console.log(sidebar, "sidebar");

  return (
    <TenantLayouts
      title="Colony"
      header="Tenant"
      head="Menu"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png">
      <div className="absolute inset-0 mt-30 lg:mt-20 z-20 bg-boxdark flex text-white">
        <TenantSidebar setSidebar={setSidebar} sidebar={sidebar} token={token}>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md p-2 active:scale-95 text-lg"
                onClick={() =>
                  router.push({
                    pathname: "/",
                  })
                }>
                <MdChevronLeft className="w-6 h-6" />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="bg-gray text-gray-6 flex items-center gap-1 rounded-md border-2 border-gray p-2 active:scale-95"
                onClick={() => console.log("edit info")}>
                <span>Edit Info</span>
                <MdSettings className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full mt-5 font-bold">
              <h3 className="text-lg">Unit Code</h3>
              <div className="text-base w-full flex items-center gap-2">
                <MdBusiness className="w-8 h-8" />
                <span>Unit name</span>
              </div>
              <div className="text-sm font-normal">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Ducimus, provident.
              </div>
            </div>

            <div className="w-full mt-5 font-bold">
              <h3 className="text-lg">Amenities</h3>
              <div className="text-base w-full flex items-center gap-2 font-normal">
                <MdShower className="w-6 h-6" />
                <span>Bathup</span>
              </div>
            </div>
          </div>
        </TenantSidebar>
        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 lg:overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 px-8 2xl:px-10 gap-2">
            <div className="w-full flex items-center justify-between py-3">
              <button
                aria-controls="sidebar"
                aria-expanded={sidebar}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebar(!sidebar);
                }}
                className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden">
                <MdArrowRightAlt
                  className={`w-5 h-5 delay-700 ease-in-out ${
                    sidebar ? "rotate-180" : ""
                  }`}
                />
              </button>
              <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                Tenant Owner
              </h3>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-3">
            <div className="w-full lg:col-span-2">
              <div className="w-full">
                <Tabs menus={menuTabTenants} />
              </div>
              <div className="w-full mt-10">
                <div className="w-full text-gray-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  molestias illum voluptatibus repellendus tempore excepturi
                  ipsum praesentium neque? Nulla sint molestiae cupiditate nisi
                  tempore ipsa qui natus voluptatum soluta. Earum assumenda
                  culpa est illo laboriosam dolores dignissimos recusandae
                  perferendis expedita qui iure autem porro aliquid voluptas
                  voluptate explicabo ipsa quisquam saepe excepturi, inventore
                  quidem numquam aspernatur quo? Nobis dolore autem cum et a aut
                  excepturi adipisci, consequuntur commodi, magni amet ea soluta
                  voluptas quibusdam asperiores facilis, voluptatum quis eaque
                  quisquam nisi! Sit atque, et consequatur, aspernatur magni
                  pariatur labore id nisi voluptatem, ipsa aliquid cupiditate
                  fuga enim rem maxime repellendus.
                </div>
              </div>
            </div>

            <div className="w-full p-2 text-gray-6 tracking-wide ">
              <h3 className="text-lg font-bold mb-3">Owner</h3>
              <Cards className="w-full bg-white border border-gray shadow-card rounded-lg p-4 mb-3 text-gray-6">
                <div className="w-full text-sm flex items-center gap-2 overflow-hidden">
                  <img
                    src="../../image/no-image.jpeg"
                    className="rounded-full h-14 w-14 object-cover object-center"
                    alt="images"
                  />
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Omnis, soluta.
                  </div>
                </div>
              </Cards>

              <h3 className="text-lg font-bold mb-3">Occupant</h3>
              <Cards className="w-full bg-white border border-gray shadow-card rounded-lg p-4 mb-3 text-gray-6">
                <div className="w-full text-sm flex items-center gap-2 overflow-hidden">
                  <img
                    src="../../image/no-image.jpeg"
                    className="rounded-full h-14 w-14 object-cover object-center"
                    alt="images"
                  />
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Omnis, soluta.
                  </div>
                </div>
              </Cards>
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
    </TenantLayouts>
  );
};

export default BillingTenant;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};
