import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdDelete,
  MdEdit,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuTask } from "../../../../../utils/routes";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import Modal from "../../../../../components/Modal";
import { ModalHeader } from "../../../../../components/Modal/ModalComponent";
import moment from "moment";
import {
  deleteIssueTypes,
  getIssueTypes,
  selectIssueType,
} from "../../../../../redux/features/task-management/settings/issueTypeReducers";
import { FaCircleNotch } from "react-icons/fa";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import IssueTypeForm from "../../../../../components/Forms/employee/tasks/settings/IssueTypeForm";
import {
  deleteIssueCategory,
  getIssueCategories,
  selectIssueCategory,
} from "../../../../../redux/features/task-management/settings/issueCategoryReducers";
import IssueCategoryForm from "../../../../../components/Forms/employee/tasks/settings/IssueCategoryForm";

type Options = {
  label?: string | number;
  value?: string | number;
};

type Props = {
  pageProps: any;
};

interface PropsData {
  id: number | string | any;
  createdAt: string | any;
  updatedAt: string | any;
  issueCategoryCode: string | any;
  issueCategoryName: string | any;
  issueCategoryDescription: string | any;
}

const sortOpt = [
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
      minHeight: 32,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
};

const IssueCategory = ({ pageProps }: Props) => {
  moment.locale("id");
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, accessId, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { issueCategories, pending } = useAppSelector(selectIssueCategory);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // data-table
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // modal add
  const onOpenModalAdd = () => {
    setIsOpenAdd(true);
  };

  const onCloseModalAdd = () => {
    setFormData(null);
    setIsOpenAdd(false);
  };

  // modal update
  const onOpenModalEdit = (items: any) => {
    setFormData(items);
    setIsOpenEdit(true);
  };

  const onCloseModalEdit = () => {
    setFormData(null);
    setIsOpenEdit(false);
  };

  // delete modal
  const onCloseModalDelete = () => {
    setFormData(null);
    setIsOpenDelete(false);
  };
  const onOpenModalDelete = (items: any) => {
    setFormData(items);
    setIsOpenDelete(true);
  };

  const goToTask = (id: any) => {
    if (!id) return;
    return router.push({
      pathname: `/employee/tasks/settings/issue-category/${id}`,
    });
  };

  const columns = useMemo<ColumnDef<PropsData, any>[]>(
    () => [
      {
        accessorKey: "issueCategoryCode",
        header: (info) => <div className="uppercase">Code</div>,
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full text-left text-primary uppercase font-semibold">
              {getValue() || "-"}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 30,
      },
      {
        accessorKey: "issueCategoryName",
        header: (info) => <div className="uppercase">Title</div>,
        cell: (info) => {
          return <div className="w-full">{info.getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "issueCategoryDescription",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full text-left">
              {getValue().length > 20
                ? `${getValue().substring(20, 0)}...`
                : getValue()}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Description</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 350,
      },
      {
        accessorKey: "updatedAt",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full text-left">
              {getValue() ? dateFormat(getValue()) : "-"}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Date Added</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full flex items-center justify-center gap-2 text-gray-5">
              <button
                type="button"
                className=""
                onClick={() => onOpenModalEdit(row?.original)}>
                <MdEdit className="w-4 h-4" />
              </button>

              <button
                type="button"
                className=""
                onClick={() => onOpenModalDelete(row?.original)}>
                <MdDelete className="w-4 h-4" />
              </button>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-center uppercase">Actions</div>
        ),
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
          callback: () => router.push("/authentication?page=sign-in"),
        })
      );
    }
  }, [token]);

  // get issue type
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
            { issueCategoryName: { $contL: query?.search } },
            { issueCategoryDescription: { $contL: query?.search } },
            { issueCategoryCode: { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `updatedAt`,
        order: "DESC",
      });
    } else {
      qb.sortBy({
        field: `issueCategoryName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token)
      dispatch(getIssueCategories({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = issueCategories;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [issueCategories]);

  const issueData = useMemo(() => {
    let newArr: any[] = [];
    if (dataTable?.length > 0) {
      dataTable?.map((item: any) => {
        newArr.push(item);
      });
    }
    return newArr;
  }, [dataTable]);

  // delete
  const onDelete = (value: any) => {
    console.log(value, "form-delete");
    if (!value?.id) return;
    dispatch(
      deleteIssueCategory({
        token,
        id: value?.id,
        isSuccess() {
          toast.dark("Issue category has been deleted");
          dispatch(getIssueCategories({ token, params: filters.queryObject }));
          onCloseModalDelete();
        },
        isError() {
          console.log("Error delete");
        },
      })
    );
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Task Management"
      head="Issue Category"
      logo="../../../../image/logo/logo-icon.svg"
      images="../../../../image/logo/building-logo.svg"
      userDefault="../../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdWork,
        className: "w-8 h-8 text-meta-7",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          menus={menuTask}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 py-6 mb-3 w-full flex flex-col gap-2">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
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
                  <div className="flex flex-col gap-1 items-start">
                    <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                      Issue Category
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpenModalAdd}
                  variant="primary">
                  <span className="hidden lg:inline-block">New Category</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-4">
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
                dataTable={issueData}
                total={total}
                setIsSelected={setIsSelectedRow}
              />
            </div>
          </main>
        </div>
      </div>

      {/* modal add project type */}
      <Modal isOpen={isOpenAdd} onClose={onCloseModalAdd} size="small">
        <IssueCategoryForm
          isCloseModal={onCloseModalAdd}
          isOpen={isOpenAdd}
          token={token}
          getData={() =>
            dispatch(getIssueCategories({ token, params: filters.queryObject }))
          }
        />
      </Modal>

      {/* modal update project type */}
      <Modal isOpen={isOpenEdit} onClose={onCloseModalEdit} size="small">
        <IssueCategoryForm
          isCloseModal={onCloseModalEdit}
          isOpen={isOpenEdit}
          token={token}
          getData={() =>
            dispatch(getIssueCategories({ token, params: filters.queryObject }))
          }
          isUpdate
          items={formData}
        />
      </Modal>

      {/* delete modal */}
      <Modal size="small" onClose={onCloseModalDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalDelete}>
            <div className="w-full flex flex-col gap-1">
              <h3 className="text-base font-semibold">Delete Issue Category</h3>
              <p className="text-xs text-gray-5">
                Are you sure to delete issue category ?
              </p>
            </div>
          </ModalHeader>

          <div className="w-full flex justify-end gap-2 px-4 pb-4">
            <Button
              variant="secondary-outline"
              className="rounded-lg text-sm border border-gray-2 shadow-2"
              type="button"
              onClick={onCloseModalDelete}>
              <span className="text-xs">Discard</span>
            </Button>

            <Button
              variant="primary"
              className="rounded-lg text-xs border border-primary"
              type="button"
              onClick={() => onDelete(formData)}
              disabled={pending}>
              <span className="text-xs">Yes, Delete it!</span>
              {pending ? (
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              ) : null}
            </Button>
          </div>
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

export default IssueCategory;
