import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import {
  MdAdd,
  MdArrowDropUp,
  MdArrowRightAlt,
  MdEdit,
  MdKeyboardArrowRight,
  MdLayers,
  MdLocationCity,
  MdMail,
  MdMap,
  MdMuseum,
  MdOutlinePeople,
  MdOutlineVpnKey,
} from "react-icons/md";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal";

import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import { useRouter } from "next/router";
import Cards from "../../../../components/Cards/Cards";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import { selectAuth } from "../../../../redux/features/auth/authReducers";
import { getAuthMe } from "../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import ScrollCardTables from "../../../../components/tables/layouts/server/ScrollCardTables";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuBM } from "../../../../utils/routes";
import {
  getUnitsTenant,
  selectUnitManagement,
} from "../../../../redux/features/building-management/unit/unitReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import OccupantForm from "../../../../components/Forms/employee/occupant/OccupantForm";
import CardTablesRow from "../../../../components/tables/layouts/server/CardTablesRow";

type FormValues = {
  id?: number | string | any;
  floor?: any;
  occupant?: any;
  tenant?: any;
  totalAmenity?: number;
  totalOngoingBill?: number;
  totalUnreadMessageLocalshop?: number;
  unitDescription?: string | any;
  unitImage?: any | string;
  unitName?: string | any;
  unitOrder?: number;
  unitSize?: number;
  createdAt: string | any;
  updatedAt?: any;
};

type Props = {
  pageProps: any;
};

const Occupancy = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId } = pageProps;

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { units, pending } = useAppSelector(selectUnitManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenAddOwner, setIsOpenAddOwner] = useState(false);
  const [isOpenAddOccupant, setIsOpenAddOccupant] = useState(false);
  const [formData, setFormData] = useState<FormValues | any>(null);

  // data-table
  const [dataTable, setDataTable] = useState<FormValues[]>([]);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState<number>(5);
  const [pageCount, setPageCount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // scroll table
  const [isSelectedRow, setIsSelectedRow] = useState<any[]>([]);

  // add owner modal
  const onOpenAddOwner = (items: any) => {
    setFormData({
      ...items,
      propertyStructures: parseInt(accessId),
    });
    setIsOpenAddOwner(true);
  };
  const onCloseAddOwner = () => {
    setFormData(null);
    setIsOpenAddOwner(false);
  };
  // add owner modal end

  // add Occupant modal
  const onOpenAddOccupant = (items: any) => {
    setFormData({
      ...items,
      propertyStructures: parseInt(accessId),
    });
    setIsOpenAddOccupant(true);
  };
  const onCloseAddOccupant = () => {
    setFormData(null);
    setIsOpenAddOccupant(false);
  };
  // add occupant modal end

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

  const goToDetails = (id: number | string) => {
    if (!id) {
      return;
    }
    router.push({ pathname: `/employee/building-management/occupancy/${id}` });
  };

  const columns = useMemo<ColumnDef<FormValues, any>[]>(
    () => [
      {
        accessorKey: "unitName",
        cell: ({ row, getValue }) => {
          const unit = row?.original;
          return (
            <div className="w-full pr-2">
              <div className="w-full flex items-center gap-2">
                <div className="w-1/3">
                  <img
                    src={
                      unit?.unitImage
                        ? url + "unit/unitImage/" + unit?.unitImage
                        : "../../image/no-image.jpeg"
                    }
                    alt="images"
                    className="w-full h-20 object-cover object-center"
                  />
                </div>
                <div className="w-2/3 flex flex-col gap-2 text-gray-5">
                  <h3 className="text-base font-semibold">
                    {getValue() || "-"}
                  </h3>
                  <div className="w-full max-w-max flex gap-2">
                    <p className="w-full max-w-max flex items-center gap-1">
                      <span>
                        <MdLocationCity className="w-4 h-4" />
                      </span>
                      {unit?.floor?.tower?.towerName || "-"}
                    </p>

                    <p className="w-full max-w-max flex items-center gap-1">
                      <span>
                        <MdLayers className="w-4 h-4" />
                      </span>
                      {unit?.floor?.floorName || "-"}
                    </p>

                    <p className="w-full max-w-max flex items-center gap-1">
                      <span>
                        <MdMap className="w-4 h-4" />
                      </span>
                      {unit?.unitSize || 0}{" "}
                      <span>
                        m<sup>2</sup>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        header: () => <span>Unit</span>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "tenant.user.firstName",
        cell: ({ row, getValue }) => {
          const user = row?.original.tenant?.user;
          console.log(user, "owner");
          if (user == undefined) {
            return (
              <button
                type="button"
                onClick={() => onOpenAddOwner(row?.original)}
                className="bg-primary text-white px-4 py-2 border border-primary shadow-1 inline-flex items-center rounded-lg text-xs">
                <span>Add Owner</span>
                <MdAdd className="w-4 h-4" />
              </button>
            );
          }
          return (
            <div className="w-full">
              <div className="w-full flex items-center gap-2">
                <img
                  src={
                    user?.profileImage
                      ? `${url}user/profileImage/${user?.profileImage}`
                      : "../../image/no-image.jpeg"
                  }
                  alt="images"
                  className="w-[20%] object-cover object-center rounded-full"
                />
                <div className="w-[80%] flex flex-col gap-2 text-gray-5">
                  <h3 className="text-sm font-semibold">
                    {getValue() || "-"} {user?.lastName}
                  </h3>
                  <div className="w-full max-w-max flex gap-2">
                    <p className="flex items-center gap-1">
                      <span>
                        <MdMail className="w-4 h-4" />
                      </span>
                      {user?.email?.length > 20
                        ? `${user?.email?.substring(20, 0)}...`
                        : user?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        header: () => <span>Owner</span>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "occupant.user.firstName",
        cell: ({ row, getValue }) => {
          const user = row?.original.occupant?.user;
          if (user == undefined) {
            return (
              <button
                type="button"
                onClick={() => onOpenAddOccupant(row?.original)}
                className="bg-primary text-white px-4 py-2 border border-primary shadow-1 inline-flex items-center rounded-lg text-xs">
                <span>Add Occupant</span>
                <MdAdd className="w-4 h-4" />
              </button>
            );
          }
          return (
            <div className="w-full">
              <div className="w-full flex items-center gap-2">
                <img
                  src={
                    user?.profileImage
                      ? `${url}user/profileImage/${user?.profileImage}`
                      : "../../image/no-image.jpeg"
                  }
                  alt="images"
                  className="w-[20%] object-cover object-center rounded-full"
                />
                <div className="w-[80%] flex flex-col gap-2 text-gray-5">
                  <h3 className="text-sm font-semibold">
                    {getValue() || "-"} {user?.lastName}
                  </h3>
                  <div className="w-full max-w-max flex gap-2">
                    <p className="flex items-center gap-1">
                      <span>
                        <MdMail className="w-4 h-4" />
                      </span>
                      {user?.email?.length > 20
                        ? `${user?.email?.substring(20, 0)}...`
                        : user?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        header: () => <span>Occupant</span>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          // console.log(row.original, "info")
          return (
            <div className="w-full text-center flex items-center cursor-pointer px-4 py-6">
              <Button
                onClick={() => goToDetails(getValue())}
                className="px-0 py-0"
                type="button"
                variant="danger-outline-none">
                <MdKeyboardArrowRight className="w-5 h-5 text-gray-5" />
              </Button>
            </div>
          );
        },
        header: (props) => {
          return <div></div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 50,
      },
    ],
    []
  );

  // data-occupancy
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
  }, []);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    router.replace({ pathname, query: qr });
  }, [pages, limit]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.sortBy({
      field: "updatedAt",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [query?.page, query?.limit]);

  useEffect(() => {
    if (token) dispatch(getUnitsTenant({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = units;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [units]);

  console.log(units, "data-unit");

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Occupancy"
      logo="../../image/logo/logo-icon.svg"
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          className=""
          menus={menuBM}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2">
            <div className="w-full flex items-center justify-between py-3">
              <button
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
                className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden">
                <MdArrowRightAlt
                  className={`w-5 h-5 delay-700 ease-in-out ${
                    sidebarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                Occupancy
              </h3>
            </div>

            <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={() =>
                  router.push({
                    pathname: "/employee/building-management/occupancy/tenants",
                    query: {
                      page: 1,
                      limit: 10,
                    },
                  })
                }
                variant="primary-outline"
                key={"1"}>
                <span className="hidden lg:inline-block text-graydark">
                  Tenant List
                </span>
                <MdOutlinePeople className="w-5 h-5" />
              </Button>

              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={() => console.log("klik")}
                variant="primary-outline"
                key={"2"}>
                <span className="hidden lg:inline-block text-graydark">
                  New Request
                </span>
                <MdOutlineVpnKey className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <main className="tracking-wide text-left text-boxdark-2 mt-5">
            <div className="w-full flex flex-col">
              {/* content */}
              <div className="w-full grid col-span-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 tracking-wider mb-5">
                <Cards className="w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray">
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Occupancy Level</h1>
                    <div className="w-full flex items-center gap-2">
                      <span className="w-full max-w-max font-semibold">
                        86%
                      </span>
                      <div className="w-full h-full flex justify-center items-center">
                        <div className="overflow-hidden h-3 text-xs flex rounded-xl bg-[#EFEAD8] shadow-card w-full my-auto">
                          <div
                            style={{ width: "70%" }}
                            className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary hover:opacity-50 font-semibold text-[.5rem]">
                            70%
                          </div>
                          <div
                            style={{ width: "10%" }}
                            className="shadow-none z-10 flex flex-col text-center whitespace-nowrap text-white justify-center bg-warning hover:opacity-50 font-semibold text-[.5rem]">
                            16%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-center text-xs tracking-normal justify-between">
                      <p>322 Occupied</p>
                      <p>400 Owned</p>
                      <p>500 Units</p>
                    </div>
                  </div>
                </Cards>

                <Cards className="w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray">
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Total Tenant</h1>
                    <div className="w-full flex items-center gap-2">
                      <span className="w-full lg:w-2/12 font-semibold">
                        522
                      </span>
                      <div className="w-full lg:w-10/12 flex items-center justify-between gap-2">
                        <div className="w-full max-w-max flex items-center gap-2">
                          <MdArrowDropUp className="w-4 h-4" />
                          <p>5 new tenants</p>
                        </div>
                        <Button
                          className="px-0 py-0"
                          type="button"
                          onClick={() => console.log("edit")}
                          variant="primary-outline-none">
                          <MdEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between text-xs tracking-normal">
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdArrowDropUp className="w-4 h-4" />
                        <p>5 new tenants</p>
                      </div>
                      <p>123 m2</p>
                    </div>
                  </div>
                </Cards>

                <Cards className="w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray">
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Total Tenant</h1>
                    <div className="w-full flex items-center gap-2">
                      <span className="w-full lg:w-2/12 font-semibold">
                        522
                      </span>
                      <div className="w-full lg:w-10/12 flex items-center justify-between gap-2">
                        <div className="w-full max-w-max flex items-center gap-2">
                          <MdArrowDropUp className="w-4 h-4" />
                          <p>5 new tenants</p>
                        </div>
                        <Button
                          className="px-0 py-0"
                          type="button"
                          onClick={() => console.log("edit")}
                          variant="primary-outline-none">
                          <MdEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between text-xs tracking-normal">
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdArrowDropUp className="w-4 h-4" />
                        <p>5 new tenants</p>
                      </div>
                      <p>123 m2</p>
                    </div>
                  </div>
                </Cards>

                <Cards className="w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray">
                  <div className="w-full p-4 flex flex-col gap-4">
                    <h1>Total Tenant</h1>
                    <div className="w-full flex items-center gap-2">
                      <span className="w-full lg:w-2/12 font-semibold">
                        522
                      </span>
                      <div className="w-full lg:w-10/12 flex items-center justify-between gap-2">
                        <div className="w-full max-w-max flex items-center gap-2">
                          <MdArrowDropUp className="w-4 h-4" />
                          <p>5 new tenants</p>
                        </div>
                        <Button
                          className="px-0 py-0"
                          type="button"
                          onClick={() => console.log("edit")}
                          variant="primary-outline-none">
                          <MdEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between text-xs tracking-normal">
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdArrowDropUp className="w-4 h-4" />
                        <p>5 new tenants</p>
                      </div>
                      <p>123 m2</p>
                    </div>
                  </div>
                </Cards>
              </div>

              {/* table test */}
              <CardTablesRow
                columns={columns}
                dataTable={dataTable}
                loading={loading}
                setLoading={setLoading}
                pages={pages}
                setPages={setPages}
                limit={limit}
                setLimit={setLimit}
                pageCount={pageCount}
                total={total}
                setIsSelected={setIsSelectedRow}
                // isInfiniteScroll
              />
            </div>
          </main>
        </div>
      </div>

      {/* add owner */}
      <Modal size="small" onClose={onCloseAddOwner} isOpen={isOpenAddOwner}>
        <Fragment>
          <OccupantForm
            items={formData}
            token={token}
            isOwner
            isOpen={isOpenAddOwner}
            getData={() =>
              dispatch(getUnitsTenant({ token, params: filters.queryObject }))
            }
            isCloseModal={onCloseAddOwner}
          />
        </Fragment>
      </Modal>

      {/* add occupant */}
      <Modal
        size="small"
        onClose={onCloseAddOccupant}
        isOpen={isOpenAddOccupant}>
        <Fragment>
          <OccupantForm
            items={formData}
            token={token}
            isOccupant
            isOpen={isOpenAddOccupant}
            getData={() =>
              dispatch(getUnitsTenant({ token, params: filters.queryObject }))
            }
            isCloseModal={onCloseAddOccupant}
          />
        </Fragment>
      </Modal>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const accessId = cookies["accessId"] || null;
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
    props: { token, access, accessId, firebaseToken },
  };
};

export default Occupancy;
