import React, {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import SidebarBM from "../../../../../components/Layouts/Sidebar/Building-Management";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCalendarToday,
  MdChevronLeft,
  MdCleaningServices,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdFemale,
  MdLocalHotel,
  MdMale,
  MdMuseum,
  MdPhone,
} from "react-icons/md";
import Button from "../../../../../components/Button/Button";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import Modal from "../../../../../components/Modal";

import {
  ModalFooter,
  ModalHeader,
} from "../../../../../components/Modal/ModalComponent";
import { useRouter } from "next/router";
import Tables from "../../../../../components/tables/layouts/Tables";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnItems } from "../../../../../components/tables/components/makeData";
import { makeData } from "../../../../../components/tables/components/makeData";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuBM } from "../../../../../utils/routes";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import {
  getUsersTenantProperty,
  selectUserPropertyManagement,
} from "../../../../../redux/features/building-management/users/propertyUserReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import { getAuthMe } from "../../../../../redux/features/auth/authReducers";

type Options = {
  label?: string | number;
  value?: string | number;
};

interface PropsData {
  id?: number | any;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  birthday?: string | Date | any;
  documentNumber?: string | number;
  documentSource?: string;
  email?: string;
  gender?: string | any;
  phoneNumber?: any;
  profileImage?: any;
  userAddress?: any;
  occupants?: any | any[];
  tenants?: any | any[];
  userPropertyOccupants?: any | any[];
  userPropertyTenants?: any | any[];
}

type Props = {
  pageProps: any;
};

const sortOpt = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const stylesSelect = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
    flexDirection: "row-reverse",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    console.log(provided, "control");
    return {
      ...provided,
      background: "",
      padding: ".5rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 28,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
};

const Tenants = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const { token, access, accessId, firebaseToken } = pageProps;
  const router = useRouter();
  const { pathname, query } = router;

  // redux
  const dispatch = useAppDispatch();
  const { userTenants, pending } = useAppSelector(selectUserPropertyManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [loading, setLoading] = useState(true);

  // data-table
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isSelectedRow, setIsSelectedRow] = useState<PropsData[]>([]);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [details, setDetails] = useState<PropsData | any>(null);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // form modal
  const onClose = () => setIsOpenModal(false);
  const onOpen = () => setIsOpenModal(true);

  // detail modal
  const onCloseDetail = () => {
    setDetails(undefined);
    setIsOpenDetail(false);
  };
  const onOpenDetail = (items: any) => {
    setDetails(items);
    setIsOpenDetail(true);
  };

  // update modal
  const onOpenEdit = (items: PropsData) => {
    setFormData(items);
    setIsOpenEdit(true);
  };

  const onCloseEdit = () => {
    setFormData(null);
    setIsOpenEdit(false);
  };

  // delete modal
  const onOpenDelete = (items: any) => {
    setFormData(items);
    setIsOpenDelete(true);
  };

  const onCloseDelete = () => {
    setFormData(null);
    setIsOpenDelete(false);
  };

  const columns = useMemo<ColumnDef<PropsData, any>[]>(
    () => [
      {
        accessorKey: "fullName",
        cell: (info) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {info.getValue()}
            </div>
          );
        },
        header: () => <span className="uppercase">Full Name</span>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
      {
        accessorKey: "email",
        cell: (info) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {info.getValue()}
            </div>
          );
        },
        header: () => <span className="uppercase">Email</span>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "phoneNumber",
        cell: (info) => {
          let phone = info.getValue();
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {/* {phone ? formatPhone("+", info.getValue()) : ""} */}
              {phone ? phone : "-"}
            </div>
          );
        },
        header: () => <span className="uppercase">Phone No.</span>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "tenants",
        cell: ({ row, getValue }) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(row.original)}>
              {getValue()?.length}
            </div>
          );
        },
        header: () => <span className="uppercase">Owned</span>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "occupants",
        cell: ({ row, getValue }) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(row.original)}>
              {getValue()?.length}
            </div>
          );
        },
        header: () => <span className="uppercase">Occupied</span>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          console.log(row.original, "info");
          return (
            <div className="w-full flex gap-1 items-center">
              <button
                type="button"
                onClick={() => console.log(row.original)}
                className="w-full text-center flex items-center justify-center cursor-pointer">
                <MdEdit className="text-gray-5 w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenDelete(row.original)}
                className="w-full text-center flex items-center justify-center cursor-pointer">
                <MdDelete className="text-gray-5 w-4 h-4" />
              </button>
            </div>
          );
        },
        header: () => <span className="uppercase">Actions</span>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
    ],
    []
  );

  // data-user-tenant
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search || "");
    if (query?.sort) {
      if (query?.sort == "ASC") {
        setSort({ value: query?.sort, label: "A-Z" });
      } else {
        setSort({ value: query?.sort, label: "Z-A" });
      }
    }
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          $or: [
            { firstName: { $contL: query?.search } },
            { lastName: { $contL: query?.search } },
            { nickName: { $contL: query?.search } },
            { email: { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `firstName`,
        order: "ASC",
      });
    } else {
      qb.sortBy({
        field: `firstName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token)
      dispatch(getUsersTenantProperty({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = userTenants;
    if (data && data?.length > 0) {
      data?.map((item: PropsData) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [userTenants]);

  const tenantData = useMemo(() => {
    let newArr: PropsData[] = [];
    if (dataTable?.length > 0) {
      dataTable?.map((user: any) => {
        newArr.push({
          ...user,
          fullName: user?.firstName + " " + user?.lastName,
        });
      });
    }
    return newArr;
  }, [dataTable]);

  // auth
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

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tenant Management"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
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
            <div className="w-full flex items-center justify-between py-3 lg:hidden">
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
            </div>

            <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5"
                onClick={() => router.back()}
                variant="secondary-outline"
                key={"1"}>
                <MdChevronLeft className="w-6 h-6 text-gray-4" />
                <div className="flex flex-col gap-1 items-start">
                  <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                    Tenant List
                  </h3>
                  <span className="text-gray-4 font-semibold text-lg">
                    {total > 1
                      ? `${total} Registered Users`
                      : `${total} Registered User`}
                  </span>
                </div>
              </Button>
            </div>

            <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={onOpen}
                variant="primary"
                key={"3"}>
                <span className="hidden lg:inline-block">New Tenant</span>
                <MdAdd className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full flex flex-col lg:flex-row gap-2.5 p-4">
                <div className="w-full lg:w-3/4">
                  <SearchInput
                    className="w-full text-sm rounded-xl"
                    classNamePrefix=""
                    filter={search}
                    setFilter={setSearch}
                    placeholder="Search..."
                  />
                </div>
                <div className="w-full lg:w-1/4 flex flex-col lg:flex-row items-center gap-2">
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={sort}
                    onChange={setSort}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="1"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Sorts..."
                    options={sortOpt}
                    icon="MdSort"
                  />
                </div>
              </div>

              {/* table */}
              <SelectTables
                loading={loading}
                setLoading={setLoading}
                pages={pages}
                setPages={setPages}
                limit={limit}
                setLimit={setLimit}
                pageCount={pageCount}
                columns={columns}
                dataTable={tenantData}
                total={total}
                isSelected={isSelectedRow}
                setIsSelected={setIsSelectedRow}
              />
            </div>
          </main>
        </div>
      </div>

      {/* detail modal */}
      <Modal size="small" onClose={onCloseDetail} isOpen={isOpenDetail}>
        <Fragment>
          <ModalHeader
            className="p-6 mb-3"
            isClose={true}
            onClick={onCloseDetail}>
            <div className="flex-flex-col gap-2">
              <h3 className="text-lg font-semibold">
                {details?.firstName || ""}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-5">
                  {details?.firstName || ""} {details?.lastName || ""}
                </p>
                <p className="text-sm text-gray-5 capitalize flex items-center">
                  <span>
                    {details?.gender == "Female" ? (
                      <MdFemale className="w-4 h-4 text-danger" />
                    ) : details?.gender == "Male" ? (
                      <MdMale className="w-4 h-4 text-primary" />
                    ) : null}
                  </span>
                  {details?.gender || ""}
                </p>
              </div>
            </div>
          </ModalHeader>
          <div className="w-full px-6 mb-5 overflow-hidden">
            <div className="w-full flex gap-2.5">
              <img
                src={
                  details?.profileImage
                    ? `${url}user/profileImage/${details?.profileImage}`
                    : "../../../image/no-image.jpeg"
                }
                alt="profile-images"
                className="w-20 h-20 rounded-full shadow-2 object-cover object-center"
              />

              <div className="w-full flex flex-col gap-2 text-gray-5">
                <h3 className="font-bold text-lg">{details?.fullName}</h3>
                <div className="flex items-center gap-2">
                  <MdEmail />
                  {details?.email}
                </div>
                <div className="flex items-center gap-2">
                  <MdPhone />
                  {/* {formatPhone("+", details?.phoneNumber)} */}
                  {details?.phoneNumber}
                </div>
                <div className="flex items-center gap-2">
                  <MdCalendarToday />
                  {details?.birthday || "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col divide-y-2 divide-gray shadow-3">
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <p>Owner</p>
              <div className="text-lg text-primary">
                {details?.tenants?.length > 1
                  ? `${details?.tenants?.length} Units`
                  : `${details?.tenants?.length} Unit`}
              </div>
            </div>
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <p>Occupant</p>
              <div className="text-lg text-primary">
                {details?.occupants?.length > 1
                  ? `${details?.occupants?.length} Units`
                  : `${details?.occupants?.length} Unit`}
              </div>
            </div>
          </div>
        </Fragment>
      </Modal>

      {/* delete modal */}
      <Modal size="small" onClose={onCloseDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDelete}>
            <h3 className="text-lg font-semibold">Delete Tenant</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4">
            <h3>Are you sure to delete tenant data ?</h3>
          </div>

          <ModalFooter
            className="p-4 border-t-2 border-gray"
            isClose={true}
            onClick={onCloseDelete}>
            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              onClick={onCloseDelete}>
              Yes, Delete it!
            </Button>
          </ModalFooter>
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

export default Tenants;
