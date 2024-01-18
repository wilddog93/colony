import React, { Fragment, useEffect, useMemo, useState } from "react";
import DomainLayouts from "../../../../components/Layouts/DomainLayouts";
import {
  MdAdd,
  MdChevronLeft,
  MdDelete,
  MdEdit,
  MdMuseum,
  MdOutlineRemoveRedEye,
  MdPersonAddAlt,
} from "react-icons/md";
import Button from "../../../../components/Button/Button";
import Cards from "../../../../components/Cards/Cards";
import { getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { useRouter } from "next/router";
import Tabs from "../../../../components/Layouts/Tabs";
import { menuManageDomainOwner } from "../../../../utils/routes";
import {
  getDomainUser,
  selectDomainUser,
} from "../../../../redux/features/domain/domainUser";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { ColumnDef } from "@tanstack/react-table";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../components/tables/layouts/server/SelectTables";
import { IndeterminateCheckbox } from "../../../../components/tables/components/TableComponent";
import {
  deleteDomainAccessGroups,
  getDomainAccessGroup,
  selectDomainAccessGroup,
} from "../../../../redux/features/domain/user-management/domainAccessGroupReducers";
import {
  getDomainAccess,
  selectDomainAccess,
} from "../../../../redux/features/domain/user-management/domainAccessReducers ";
import Modal from "../../../../components/Modal";
import AccessGroupForm from "../../../../components/Owner/home/user-management/AccessGroupForm";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import { toast } from "react-toastify";

type Props = {
  pageProps: any;
};

type Options = {
  value: any;
  label: any;
};

type DomainAccessGroupData = {
  id?: number | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  domainAccessGroupName?: string;
  domainAccessGroupAcceses?: any | any[];
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
      padding: ".5rem",
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

const stylesSelect = {
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
    // console.log(provided, "control")
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
      minHeight: 40,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const DomainAccessGroupManagement = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT + "api/";
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { domainAccessGroups, domainAccessGroup, pending, error, message } =
    useAppSelector(selectDomainAccessGroup);
  const { domainAccesses } = useAppSelector(selectDomainAccess);
  const { data } = useAppSelector(selectAuth);

  // params
  const [search, setSearch] = useState<any>("");
  const [sort, setSort] = useState<Options>();
  const [roles, setRoles] = useState<Options>();
  const [accesses, setAccesses] = useState<Options>();
  const [accessOpt, setAccessOpt] = useState<Options[]>([]);

  // table
  const [dataTable, setDataTable] = useState<DomainAccessGroupData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState<DomainAccessGroupData[]>(
    []
  );
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // form
  const [isForm, setIsForm] = useState<boolean>(false);
  const [isFormEdit, setIsFormEdit] = useState<boolean>(false);
  const [isFormDelete, setIsFormDelete] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  // create
  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setFormData({});
    setIsForm(false);
  };
  // update
  const isOpenFormEdit = (items: DomainAccessGroupData) => {
    console.log(items, "edit");
    let newObj: any = {};
    newObj = {
      ...items,
      domainAccess:
        items?.domainAccessGroupAcceses?.length > 0
          ? items?.domainAccessGroupAcceses?.map((item: any) => ({
              ...item.domainAccess,
              value: item.domainAccess.domainAccessCode,
              label: item.domainAccess.domainAccessName,
            }))
          : [],
    };
    console.log(newObj, "edit new");
    setFormData(newObj);
    setIsFormEdit(true);
  };
  const isCloseFormEdit = () => {
    setFormData({});
    setIsFormEdit(false);
  };
  // delte arr
  const isOpenFormDelete = (items: DomainAccessGroupData[]) => {
    setFormData(items);
    setIsFormDelete(true);
  };
  const isCloseFormDelete = () => {
    setFormData({});
    setIsFormDelete(false);
  };

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

  const columns = useMemo<ColumnDef<DomainAccessGroupData, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          return (
            <IndeterminateCheckbox
              {...{
                checked: table?.getIsAllRowsSelected(),
                indeterminate: table?.getIsSomeRowsSelected(),
                onChange: table?.getToggleAllRowsSelectedHandler(),
              }}
            />
          );
        },
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 10,
        minSize: 10,
      },
      {
        accessorKey: "domainAccessGroupName",
        header: (info) => <div className="uppercase">Access Group Name</div>,
        cell: ({ getValue, row }) => {
          return (
            <div className="w-full flex flex-col lg:flex-row gap-4 cursor-pointer tracking-wider items-center text-center lg:text-left">
              <span>{getValue() || "-"}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "domainAccessGroupAcceses",
        header: (info) => <div className="uppercase">Access</div>,
        cell: ({ getValue, row }) => {
          let access = getValue();
          let index: any[] = [0, 1, 2];
          const lastIndex = access.length - 1;
          console.log(lastIndex, "last index");
          return (
            <div className="w-full flex flex-col cursor-pointer tracking-wider">
              {access?.length == 0
                ? null
                : access?.length > 3
                ? index?.map((acc: any, i: any) => {
                    return (
                      <div key={i}>
                        {access[acc]?.domainAccess?.domainAccessName},
                      </div>
                    );
                  })
                : access?.map((acc: any, i: any) => {
                    return (
                      <div key={i}>
                        {acc?.domainAccess?.domainAccessName}
                        {lastIndex == i ? "" : ","}
                      </div>
                    );
                  })}
              {access?.length > 3
                ? `+${access?.length - index.length} more access`
                : null}
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
                onClick={() => isOpenFormEdit(row?.original)}>
                <MdEdit className="w-5 h-5" />
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
    if (query?.accesses) setAccesses({ value: query?.accesses, label: "" });
  }, []);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };
    if (search) qr = { ...qr, search: search };
    if (sort?.value) qr = { ...qr, sort: sort?.value };
    if (accesses?.value) qr = { ...qr, accesses: accesses?.value };

    router.replace({ pathname, query: qr });
  }, [search, sort, accesses, limit, pages]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search: any = {
      $and: [
        {
          $or: [{ domainAccessGroupName: { $contL: query?.search } }],
        },
      ],
    };
    query?.accesses &&
      search["$and"].push({
        "domainAccessGroupAcceses.domainAccess.domainAccessCode":
          query?.accesses,
      });

    qb.search(search);

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    if (query?.sort)
      qb.sortBy({
        field: "domainAccessGroupName",
        order: !query?.status ? "ASC" : "DESC",
      });
    qb.query();
    return qb;
  }, [query]);

  useEffect(() => {
    if (token)
      dispatch(getDomainAccessGroup({ params: filters.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    let arr: DomainAccessGroupData[] = [];
    const { data, pageCount, total } = domainAccessGroups;
    if (data || data?.length > 0) {
      data?.map((item: DomainAccessGroupData) => {
        arr.push(item);
      });
      setDataTable(arr);
      setPageCount(pageCount);
      setTotal(total);
    } else {
      setDataTable([]);
      setPageCount(1);
      setTotal(0);
    }
  }, [domainAccessGroups]);

  const filterAccess = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search: any = {
      $and: [
        {
          $or: [{ domainAccessName: { $contL: query?.search } }],
        },
      ],
    };

    qb.search(search);

    if (query?.sort)
      qb.sortBy({
        field: "domainAccessName",
        order: !query?.status ? "ASC" : "DESC",
      });
    qb.query();
    return qb;
  }, [query]);

  useEffect(() => {
    if (token)
      dispatch(getDomainAccess({ params: filterAccess.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    let arr: any[] = [{ value: "all", label: "Select All" }];
    const { data } = domainAccesses;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        console.log(item, "items");
        arr.push({
          ...item,
          value: item.domainAccessCode,
          label: item.domainAccessName,
        });
      });
      setAccessOpt(arr);
    } else {
      setAccessOpt([]);
    }
  }, [domainAccesses.data]);

  const onDeleteAccess = (items: DomainAccessGroupData[]) => {
    console.log(items, "data delete");
    if (!items || items.length == 0) {
      toast.error("Data not found!");
    }
    let newData = {
      id: items.length > 0 ? items.map((item) => item.id) : [],
    };
    dispatch(
      deleteDomainAccessGroups({
        data: newData,
        token,
        isSuccess: () => {
          toast.dark("Delete Access Group is successfully!");
          dispatch(
            getDomainAccessGroup({ params: filters.queryObject, token })
          );
          isCloseFormDelete();
        },
        isError: () => toast.error("Delete Access Group is failed!"),
      })
    );
  };

  // console.log({ dataTable, pageCount, total }, 'options')
  console.log({ data: isSelectedRow }, "form delete");

  return (
    <DomainLayouts
      title="Colony"
      header="Access Group Management"
      head="Home"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
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
                <div className="static z-40 top-0 w-full mt-6 px-8 bg-gray">
                  <div className="w-full mb-5">
                    <button
                      className="focus:outline-none flex items-center gap-2"
                      onClick={() => router.push("/owner/home")}>
                      <MdChevronLeft className="w-5 h-5" />
                      <h3 className="text-lg lg:text-title-lg font-semibold">
                        Manage Domain
                      </h3>
                    </button>
                  </div>

                  <div className="w-full mb-5">
                    <Tabs menus={menuManageDomainOwner} />
                  </div>
                </div>

                <div className="sticky z-40 top-0 w-full px-8">
                  <div className="w-full flex flex-col gap-4 bg-white px-4 py-5 rounded-lg shadow-card">
                    <h3 className="text-base lg:text-title-md font-semibold">
                      Access Group
                    </h3>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-9 gap-2.5">
                      <div className="w-full lg:col-span-3">
                        <SearchInput
                          className="w-full text-sm rounded-xl"
                          classNamePrefix=""
                          filter={search}
                          setFilter={setSearch}
                          placeholder="Search..."
                        />
                      </div>
                      <div className="w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2">
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
                      <div className="w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2">
                        <DropdownSelect
                          customStyles={stylesSelect}
                          value={accesses}
                          onChange={setAccesses}
                          error=""
                          className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                          classNamePrefix=""
                          formatOptionLabel=""
                          instanceId="1"
                          isDisabled={false}
                          isMulti={false}
                          placeholder="Access..."
                          options={accessOpt}
                          icon=""
                        />
                      </div>
                      <div className="w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2">
                        <Button
                          className="rounded-lg text-sm border-1 lg:ml-auto"
                          type="button"
                          variant="primary-outline"
                          onClick={() => isOpenFormDelete(isSelectedRow)}
                          disabled={
                            !isSelectedRow || isSelectedRow?.length == 0
                          }>
                          <MdDelete className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                        <Button
                          className="rounded-lg text-sm"
                          type="button"
                          variant="primary"
                          onClick={isOpenForm}>
                          <span>Add</span>
                          <MdAdd className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                  <div className="px-2">
                    <Cards className="h-300 w-full bg-white shadow-card rounded-xl tracking-wider">
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
                        classTable=""
                      />
                    </Cards>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal form */}
      <Modal isOpen={isForm} onClose={isCloseForm} size="small">
        <Fragment>
          <ModalHeader
            isClose
            onClick={() => isCloseForm()}
            className="p-4 flex justify-between border-b-2 border-gray">
            <div className="flex flex-col gap-2 tracking-wide">
              <h3 className="text-lg font-semibold">New Access Group</h3>
            </div>
          </ModalHeader>
          <AccessGroupForm
            token={token}
            isOpen={isForm}
            items={formData}
            onClose={isCloseForm}
            options={accessOpt}
            filters={filters.queryObject}
          />
        </Fragment>
      </Modal>

      {/* modal form edit */}
      <Modal isOpen={isFormEdit} onClose={isCloseFormEdit} size="small">
        <Fragment>
          <ModalHeader
            isClose
            onClick={() => isCloseFormEdit()}
            className="p-4 flex justify-between border-b-2 border-gray">
            <div className="flex flex-col gap-2 tracking-wide">
              <h3 className="text-lg font-semibold">Update Access Group</h3>
            </div>
          </ModalHeader>
          <AccessGroupForm
            token={token}
            isOpen={isFormEdit}
            items={formData}
            onClose={isCloseFormEdit}
            options={accessOpt}
            filters={filters.queryObject}
            isUpdate
          />
        </Fragment>
      </Modal>

      {/* modal form delete */}
      <Modal isOpen={isFormDelete} onClose={isCloseFormDelete} size="small">
        <Fragment>
          <ModalHeader
            isClose
            onClick={() => isCloseFormDelete()}
            className="p-4 flex justify-between border-b-2 border-gray">
            <div className="flex flex-col gap-2 tracking-wide">
              <h3 className="text-lg font-semibold">
                Delete Domain Access Group
              </h3>
              <p className="text-gray-5">
                Are you sure to delete access group?
              </p>
            </div>
          </ModalHeader>

          <div className="w-full p-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg text-sm"
              onClick={isCloseFormDelete}>
              Discard
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="rounded-lg text-sm"
              onClick={() => onDeleteAccess(formData)}>
              Yes, Delete
            </Button>
          </div>
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

export default DomainAccessGroupManagement;
