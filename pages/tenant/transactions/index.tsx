import {
  MdArrowLeft,
  MdArrowRightAlt,
  MdBathtub,
  MdBed,
  MdBusiness,
  MdChevronLeft,
  MdDeleteOutline,
  MdSettings,
  MdShower,
} from "react-icons/md";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal";
import { useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../../../components/Modal/ModalComponent";
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
import { RequestQueryBuilder } from "@nestjsx/crud-request";

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

  // date
  const dateFormat = (value: any) => {
    const date = value ? moment(new Date(value)).format("MM/DD/YYYY") : "-";
    return date;
  };

  // description-read
  const [isHiddenDesc, setIsHiddenDesc] = useState<any[]>([]);
  const onReadDescription = (val: any) => {
    const idx = isHiddenDesc.indexOf(val);

    if (idx > -1) {
      // console.log("pus nihss");
      const _selected = [...isHiddenDesc];
      _selected.splice(idx, 1);
      setIsHiddenDesc(_selected);
    } else {
      // console.log("push ini");
      const _selected = [...isHiddenDesc];
      _selected.push(val);
      setIsHiddenDesc(_selected);
    }
  };

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

  // get transaction
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search || "");
  }, [query?.page, query?.limit, query?.search]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          $or: [
            // { "brand.brandName": { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    qb.sortBy({
      field: "updatedAt",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search]);

  useEffect(() => {
    if (token) {
      // dispatch(getUnitBilling({ token, params: filters.queryObject }));
    }
  }, [token, filters]);

  // useEffect(() => {
  //   let newArr: BillingProps[] | any[] = [];
  //   let newPageCount: number = 0;
  //   let newTotal: number = 0;

  //   const { data, pageCount, total } = unitBillings;
  //   if (data && data?.length > 0) {
  //     data?.map((item: any) => {
  //       newArr.push(item);
  //     });
  //     newPageCount = pageCount;
  //     newTotal = total;
  //   }
  //   setDataTable(newArr);
  //   setPageCount(newPageCount);
  //   setTotal(newTotal);
  // }, [unitBillings]);

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

  // unit
  const units = useMemo(() => {
    let newObj: any = {};
    const { unit } = data;
    if (unit) {
      newObj = unit;
    }
    return newObj;
  }, [data]);

  const amenityIcon = (value: any) => {
    let newValue: any | string = "";
    switch (value) {
      case "Bathroom":
        newValue = <MdBathtub className="w-6 h-6" />;
        break;
      case "Bedroom":
        newValue = <MdBed className="w-6 h-6" />;
        break;
      case "Water heater":
        newValue = <MdShower className="w-6 h-6" />;
        break;
      default:
        return newValue;
    }
    return newValue;
  };

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
                <span>{units?.unitName || "-"}</span>
              </div>
              <div className="text-sm font-normal">
                <p>
                  {units?.unitDescription?.length > 70 &&
                  !isHiddenDesc.includes(units?.id)
                    ? `${units?.unitDescription.substring(70, 0)} ...`
                    : units?.unitDescription || "-"}
                </p>

                <button
                  onClick={() => onReadDescription(units.id)}
                  className={`text-primary focus:outline-none font-bold mt-2 underline w-full max-w-max ${
                    units?.unitDescription?.length > 70 ? "" : "hidden"
                  }`}>
                  {isHiddenDesc.includes(units.id) ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="w-full mt-5 font-bold">
              <h3 className="text-lg">Amenities</h3>
              {units?.unitAmenities?.length > 0 ? (
                units?.unitAmenities?.map((item: any, idx: any) => (
                  <div
                    key={idx}
                    className="text-base w-full flex items-center gap-2 font-normal">
                    {item?.amenity?.amenityName
                      ? amenityIcon(item?.amenity?.amenityName)
                      : null}
                    <span>{item?.amenity?.amenityName || "-"}</span>
                  </div>
                ))
              ) : (
                <div className="text-base w-full flex items-center gap-2 font-normal">
                  <span>Amenities not found</span>
                </div>
              )}
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
                      units?.tenant?.user?.firstName || ""
                    } ${units?.tenant?.user?.lastName || ""}`}</p>
                    <p className="">{`${units?.tenant?.user?.email || ""}`}</p>
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
                      units?.occupant?.user?.firstName || ""
                    } ${units?.occupant?.user?.lastName || ""}`}</p>
                    <p className="">{`${
                      units?.occupant?.user?.email || ""
                    }`}</p>
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
