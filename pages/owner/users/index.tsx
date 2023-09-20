import React, { Fragment, useEffect, useMemo, useState } from "react";
import DomainLayouts from "../../../components/Layouts/DomainLayouts";
import {
  MdMail,
  MdMuseum,
  MdOutlineRemoveRedEye,
  MdPhone,
} from "react-icons/md";
import { getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../redux/features/auth/authReducers";
import { useRouter } from "next/router";
import { SearchInput } from "../../../components/Forms/SearchInput";
import DropdownSelect from "../../../components/Dropdown/DropdownSelect";
import { ColumnDef } from "@tanstack/react-table";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { getDomainId } from "../../../redux/features/accessDomain/accessDomainReducers";
import Modal from "../../../components/Modal";
import { ModalHeader } from "../../../components/Modal/ModalComponent";
import PropertyForm from "../../../components/Forms/owner/PropertyForm";
import SelectTables from "../../../components/tables/layouts/server/SelectTables";
import {
  getDomainUserAll,
  selectDomainUser,
} from "../../../redux/features/domain/domainUser";
import Button from "../../../components/Button/Button";
import Tabs from "../../../components/Layouts/Tabs";
import { menuParkings } from "../../../utils/routes";
import Cards from "../../../components/Cards/Cards";
import { formatPhone } from "../../../utils/useHooks/useFunction";

type Props = {
  pageProps: any;
};

type UserData = {
  id?: number | string;
  email?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  documentNumber?: number | string;
  documentSource?: string;
  profileImage?: string;
  phoneNumber?: number | string;
  birthday?: Date | string | any;
  gender?: string;
  userAddress?: string;
};

type Options = {
  value: any;
  label: any;
};

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const stylesSelectSort = {
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
    return {
      ...provided,
      background: "",
      padding: ".6rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 40,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
};

const DomainUsers = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // state
  const [search, setSearch] = useState<string | any>("");
  const [sort, setSort] = useState<Options>();
  // table
  const [dataTable, setDataTable] = useState<UserData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // form
  const [isForm, setIsForm] = useState(false);
  const [isFormDetail, setIsFormDetail] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  const isOpenFormDetail = (items: UserData) => {
    setFormData(items);
    setIsFormDetail(true);
  };
  const isCloseFormDetail = () => {
    setIsFormDetail(false);
  };

  // redux
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(selectDomainUser);

  console.log(users, "user data");

  const columns = useMemo<ColumnDef<UserData, any>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: (info) => <div className="uppercase">Name</div>,
        cell: ({ getValue, row }) => {
          let image = row?.original?.profileImage;
          let firstName = row?.original?.firstName;
          let lastName = row?.original?.lastName;
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider items-center text-center lg:text-left">
              <img
                src={
                  image
                    ? `${url}user/profileImage/${image}`
                    : "../image/no-image.jpeg"
                }
                alt="avatar"
                className="object-cover rounded-full object-center w-10 h-10"
              />
              <span>{`${firstName || " "} ${lastName || " "}`}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "email",
        header: (info) => <div className="uppercase">Email</div>,
        cell: ({ getValue, row }) => {
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider">
              <span>{getValue()}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "phoneNumber",
        header: (info) => <div className="uppercase">Phone Number</div>,
        cell: ({ getValue, row }) => {
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider">
              <span>{getValue() || "-"}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "gender",
        header: (info) => <div className="uppercase">Gender</div>,
        cell: ({ getValue, row }) => {
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider">
              <span>{getValue()}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        header: (info) => (
          <div className="w-full uppercase text-center">Actions</div>
        ),
        cell: ({ getValue, row }) => {
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 p-4 tracking-wider text-center justify-center">
              <Button
                type="button"
                variant="secondary-outline-none"
                className="py-0 px-0 text-center"
                onClick={() => isOpenFormDetail(row?.original)}>
                <MdOutlineRemoveRedEye className="w-5 h-5" />
              </Button>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication/sign-in"),
        })
      );
    }
  }, [token]);

  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search);
    if (query?.sort)
      setSort({
        value: query?.sort,
        label: query?.sort == "ASC" ? "A-Z" : "Z-A",
      });
  }, []);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };
    if (search) qr = { ...qr, search: search };
    if (sort?.value) qr = { ...qr, sort: sort?.value };

    router.replace({ pathname, query: qr });
  }, [search, sort]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [
            { email: { $contL: query?.search } },
            { firstName: { $contL: query?.search } },
            { lastName: { $contL: query?.search } },
            { nickName: { $contL: query?.search } },
            { gender: { $contL: query?.search } },
          ],
        },
      ],
    };
    // query?.status && search["$and"].push({ status: query?.status });

    qb.search(search);

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    if (query?.sort)
      qb.sortBy({
        field: "firstName",
        order: query?.sort == "ASC" ? "ASC" : "DESC",
      });
    qb.query();
    return qb;
  }, [query]);

  useEffect(() => {
    if (token)
      dispatch(getDomainUserAll({ params: filters.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    let arr: UserData[] = [];
    const { data, pageCount, total } = users;
    if (data || data?.length > 0) {
      data?.map((item: UserData) => {
        arr.push(item);
      });
      setDataTable(data);
      setPageCount(pageCount);
      setTotal(total);
    } else {
      setDataTable([]);
      setPageCount(1);
      setTotal(0);
    }
  }, [users.data]);

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Users"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="w-full absolute inset-0 z-99 bg-boxdark flex text-white">
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <div className="w-full relative tracking-wide text-left text-boxdark-2 mt-20 overflow-hidden">
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className="sticky z-40 top-0 w-full py-6 px-8 bg-gray">
                  <div className="w-full mb-5">
                    <h3 className="text-lg lg:text-title-lg font-semibold">
                      User List
                    </h3>
                  </div>

                  {/* <div className='w-full mb-5'>
                    <Tabs menus={menuParkings} />
                  </div> */}

                  <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5">
                    <div className="w-full lg:col-span-3">
                      <SearchInput
                        className="w-full text-sm rounded-xl"
                        classNamePrefix=""
                        filter={search}
                        setFilter={setSearch}
                        placeholder="Search..."
                      />
                    </div>
                    <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                      <DropdownSelect
                        customStyles={stylesSelectSort}
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
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                  <Cards className=" w-full rounded-lg">
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
                      classTable="px-4"
                    />
                  </Cards>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal isOpen={isForm} onClose={isCloseForm} size="small">
        <div>
          <ModalHeader
            className="border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full flex">
              <h3>New Property</h3>
            </div>
          </ModalHeader>
          <div className="w-full">
            <PropertyForm onClose={isCloseForm} isOpen={isForm} />
          </div>
        </div>
      </Modal>

      {/* modal detail */}
      <Modal isOpen={isFormDetail} onClose={isCloseFormDetail} size="small">
        <Fragment>
          <ModalHeader
            isClose
            onClick={() => isCloseFormDetail()}
            className="p-4 flex justify-between border-b-2 border-gray">
            <div className="flex flex-col gap-2 tracking-wide">
              <h3 className="text-lg font-semibold">Profile Info</h3>
            </div>
          </ModalHeader>

          <div className="w-full flex flex-col gap-4 p-4">
            <div className="w-full flex flex-col items-center justify-center gap-4 border-b-0 border-gray py-2">
              <div className="w-full">
                <img
                  src={
                    formData?.profileImage
                      ? `${url}user/profileImage/${formData?.profileImage}`
                      : "../../image/no-image.jpeg"
                  }
                  alt="avatar"
                  className="w-32 h-32 object-cover object-center mx-auto rounded-full"
                />
              </div>
              <div className="w-full flex flex-col gap-2 text-center">
                <h3 className="font-semibold">
                  {formData?.firstName || ""} {formData?.lastName || ""}
                </h3>
                <div className="w-full flex items-center justify-center gap-2">
                  <MdPhone className="w-5 h-5" />
                  <p>
                    {formData?.phoneNumber
                      ? formatPhone("+", formData?.phoneNumber)
                      : "-"}
                  </p>
                </div>

                <div className="w-full flex items-center justify-center gap-2">
                  <MdMail className="w-5 h-5" />
                  <p>{formData?.email ? formData?.email : "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className='w-full p-4 flex items-center justify-center gap-2'>
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg text-sm"
              onClick={isCloseFormDetail}
            >
              Remove Access
            </Button>
          </div> */}
        </Fragment>
      </Modal>
    </DomainLayouts>
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

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication/sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, accessId, firebaseToken },
  };
};

export default DomainUsers;
