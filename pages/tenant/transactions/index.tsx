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
import { MdOutlinePlayArrow } from "react-icons/md";
import { MdAttachFile } from "react-icons/md";
import { MdOutlineUpload } from "react-icons/md";
import VideoButton from "../../../components/Tenant/button/VideoButton";
import MerchantLayouts from "../../../components/Layouts/MerchantLayouts";
import TenantTabs from "../../../components/Tenant/TenantTabs";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal";
import { useEffect, useMemo, useState } from "react";
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
import { ColumnDef } from "@tanstack/react-table";
import SelectTables from "../../../components/tables/layouts/server/SelectTables";

type TransactionProps = {
  id?: any;
  createdAt?: any | string;
  transactionName?: string | any;
  transactionTotal?: string | number | any;
  transactiondate?: string | any;
  localshopName?: string | any;
  dueDate?: string | any;
};

type Props = {
  pageProps: any;
};

const TransactionTenant = ({ pageProps }: Props) => {
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

  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState<string | any>(null);
  const [dataTable, setDataTable] = useState<TransactionProps[] | any[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<TransactionProps | any>(
    null
  );

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

  const columns = useMemo<ColumnDef<TransactionProps, any>[]>(
    () => [
      {
        accessorKey: "transactionName",
        header: (info) => <div className="uppercase">Transaction</div>,
        cell: ({ row, getValue }) => {
          const name = getValue() || "-";
          return (
            <div className="w-full flex items-center gap-2 text-left uppercase font-semibold">
              <span>{name}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "loccalshopName",
        header: (info) => (
          <div className="uppercase w-full text-center">Localshop</div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          return <div className="w-full text-center">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "transactionDate",
        header: (info) => (
          <div className="uppercase w-full text-center">Transaction Date</div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          return <div className="w-full text-center">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "transactionTotal",
        header: (info) => <div className="uppercase">Total</div>,
        cell: ({ row, getValue }) => {
          const value = getValue() || "-";
          return <div className="w-full">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  console.log(data, "data");

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
                onClick={() => console.log("back")}>
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
                  <SelectTables
                    loading={loading}
                    setLoading={setLoading}
                    pages={pages}
                    setPages={setPages}
                    limit={limit}
                    setLimit={setLimit}
                    pageCount={pageCount}
                    columns={columns}
                    dataTable={dataTable}
                    total={total}
                    setIsSelected={setIsSelectedRow}
                    isInfiniteScroll={false}
                  />
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
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{`${
                      data?.user?.firstName || ""
                    } ${data?.user?.lastName || ""}`}</p>
                    <p className="">{`${data?.user?.email || ""}`}</p>
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
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{`${
                      data?.user?.firstName || ""
                    } ${data?.user?.lastName || ""}`}</p>
                    <p className="">{`${data?.user?.email || ""}`}</p>
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

export default TransactionTenant;

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
