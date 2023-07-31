import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdFiberManualRecord,
  MdOutlineSettings,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuTask } from "../../../../utils/routes";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import moment from "moment";
import { IssueProps, OptionProps } from "../../../../utils/useHooks/PropTypes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  getIssues,
  selectIssueManagement,
} from "../../../../redux/features/task-management/issue/issueManagementReducers";
import CardTables from "../../../../components/tables/layouts/server/CardTables";
import { BsWhatsapp } from "react-icons/bs";
import {
  getIssueTypes,
  selectIssueType,
} from "../../../../redux/features/task-management/settings/issueTypeReducers";

type Props = {
  pageProps: any;
};

const sortOpt: OptionProps[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const statusOpt: OptionProps[] = [
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
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
      minHeight: 38,
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
      minHeight: 38,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const Issues = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { issues } = useAppSelector(selectIssueManagement);
  const { issueTypes } = useAppSelector(selectIssueType);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<string | any>(false);
  const [status, setStatus] = useState<OptionProps | any>(null);
  const [typesOpt, setTypesOpt] = useState<OptionProps[]>([]);
  const [categoryOpt, setCategoryOpt] = useState<OptionProps[]>([]);
  const [types, setTypes] = useState<OptionProps | any>(null);
  const [category, setCategory] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // data-table
  const [dataTable, setDataTable] = useState<IssueProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState<any>({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<IssueProps | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MM/DD/YYYY, HH:mm");
  };

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

  // detail modal
  const onCloseDelete = () => {
    setDetails(undefined);
    setIsOpenDelete(false);
  };
  const onOpenDelete = (items: any) => {
    setDetails(items);
    setIsOpenDelete(true);
  };

  const goToTask = (id: any) => {
    if (!id) return;
    return router.push({ pathname: `/employee/tasks/issues/${id}` });
  };

  const genIssueStatus = (value: string) => {
    if (!value) return "-";
    if (value === "Open")
      return (
        <div className="leading-relaxed w-full max-w-max px-2 py-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200">
          {value}
        </div>
      );
    if (value === "On Progress")
      return (
        <div className="leading-relaxed w-full max-w-max px-2 py-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200">
          {value}
        </div>
      );
    if (value === "Closed")
      return (
        <div className="leading-relaxed w-full max-w-max px-2 py-1 rounded-lg text-xs text-center border border-green-600 text-green-600 bg-green-200">
          {value}
        </div>
      );
    if (value === "Overdue")
      return (
        <div className="leading-relaxed w-full max-w-max px-2 py-1 rounded-lg text-xs text-center border border-meta-1 text-meta-1 bg-red-200">
          {value}
        </div>
      );
  };

  const genColorProjectType = (value: any) => {
    // #333A48
    let color = "";
    if (!value) return "";
    if (value == "Project") color = "#5E59CE";
    if (value == "Complaint Handling") color = "#FF8859";
    if (value == "Regular Task") color = "#38B7E3";
    if (value == "Maintenance") color = "#EC286F";
    return color;
  };

  const columns = useMemo<ColumnDef<IssueProps, any>[]>(
    () => [
      {
        accessorKey: "occupant.user",
        header: (info) => <div className="uppercase">Title</div>,
        cell: ({ getValue, row }) => {
          const name = `${getValue()?.firstName} ${getValue()?.lastName}`;
          const date = row?.original?.createdAt
            ? dateFormat(row?.original?.createdAt)
            : "-";
          const image = getValue()?.profileImage
            ? `${url}user/profileImage/${getValue()?.profileImage}`
            : "../../image/no-image.jpeg";
          const status = row?.original?.issueStatus || "-";
          const type = row?.original?.issueType?.issueTypeName || "-";
          const category =
            row?.original?.issueCategory?.issueCategoryName || "-";
          return (
            <div className="w-full flex items-center justify-between cursor-pointer px-4 py-2">
              <div className="w-1/2 flex items-center gap-2 text-sm font-semibold">
                <img
                  src={image}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover object-center"
                />
                <h3>{name}</h3>
                <MdFiberManualRecord className="w-2 h-2 text-gray-5" />
                <div className="text-gray-5">{date}</div>
              </div>
              <div className="w-1/2 flex gap-2 justify-end">
                {genIssueStatus(status)}
                <div className="leading-relaxed border border-gray-5 text-gray-5 bg-gray px-2 py-1 rounded-lg">
                  {type}
                </div>
                <div className="leading-relaxed border border-gray-5 text-gray-5 bg-gray px-2 py-1 rounded-lg">
                  {category}
                </div>
              </div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "issueName",
        cell: ({ row, getValue }) => {
          const description = row?.original?.issueDescription;
          const source = row?.original?.complaintSource;
          return (
            <div className="w-full flex items-center justify-between cursor-pointer px-4 py-2">
              <div className="w-1/2 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-gray-6">
                  {getValue()}
                </h3>
                <p className="text-sm">
                  {description.length > 70
                    ? `${description.substring(70, 0)}...`
                    : description}
                </p>
              </div>

              <div className="w-1/2 flex items-center gap-2 justify-end">
                <BsWhatsapp
                  className={`w-5 h-5 text-green-500 ${
                    source == "Admin" ? "hidden" : ""
                  } `}
                />
                <h3 className="text-gray-5 font-semibold text-sm">
                  {source || "-"}
                </h3>
              </div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Description</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
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

  // get issue-data
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
    if (query?.status) {
      setStatus({ value: query?.status, label: query?.status });
    }
    if (query?.types) {
      setTypes({ value: query?.types, label: query?.types });
    }
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.status,
    query?.types,
  ]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    if (status) qr = { ...qr, status: status?.value };
    if (types) qr = { ...qr, types: types?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort, status, types]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        { issueStatus: { $contL: query?.status } },
        { "issueType.issueTypeName": { $contL: query?.types } },
        {
          $or: [
            // { complainantName: { $contL: query?.search } },
            // { complainantSource: { $contL: query?.search } },
            { issueName: { $contL: query?.search } },
            { issueDescription: { $contL: query?.search } },
            { "issueType.issueTypeName": { $contL: query?.search } },
            { issueStatus: { $contL: query?.search } },
            { "issueCreator.firstName": { $contL: query?.search } },
            { "issueCreator.lastName": { $contL: query?.search } },
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
        field: `issueName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.status,
    query?.types,
  ]);

  useEffect(() => {
    if (token) dispatch(getIssues({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = issues;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [issues]);
  // issues end

  // get issue type
  const filterType = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    qb.sortBy({
      field: `issueTypeName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(getIssueTypes({ token, params: filterType.queryObject }));
  }, [token, filterType]);

  useEffect(() => {
    let newArr: OptionProps[] = [];
    const { data, pageCount, total } = issueTypes;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          label: item?.issueTypeName,
          value: item?.issueTypeName,
        });
      });
    }
    setTypesOpt(newArr);
  }, [issues]);
  // issue type end

  return (
    <DefaultLayout
      title="Colony"
      header="Task Management"
      head="Issues"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
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
                      Issues
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                {/* <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpen}
                  variant="primary-outline">
                  <span className="hidden lg:inline-block">
                    Properties Settings
                  </span>
                  <MdOutlineSettings className="w-4 h-4" />
                </Button> */}
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpen}
                  variant="primary">
                  <span className="hidden lg:inline-block">New Issue</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-2.5 p-4">
                <div className="w-full lg:col-span-2">
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

                <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={status}
                    onChange={setStatus}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="2"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="All Status..."
                    options={statusOpt}
                    icon=""
                  />
                </div>

                <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={types}
                    onChange={setTypes}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="3"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="All Type..."
                    options={typesOpt}
                    icon=""
                  />
                </div>
              </div>

              {/* table */}
              {/* <ScrollCardTables
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
                isInfiniteScroll={false}
                isHideHeader={true}
                setIsSelected={setIsSelectedRow}
              /> */}

              <div className="w-full bg-gray rounded-lg">
                <CardTables
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
                  classTable="sm:grid-cols-1 gap-2"
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* modal example */}
      <Modal size="" onClose={onClose} isOpen={isOpenModal}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onClose}>
            <h3 className="text-lg font-semibold">Modal Header</h3>
          </ModalHeader>
          <div className="w-full px-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam,
            optio. Suscipit cupiditate voluptatibus et ut alias nostrum
            architecto ex explicabo quidem harum, porro error aliquid
            perferendis, totam iste corporis possimus nobis! Aperiam,
            necessitatibus libero! Sunt dolores possimus explicabo ducimus
            aperiam ipsam dolor nemo voluptate at tenetur, esse corrupti
            sapiente similique voluptatem, consequatur sequi dicta deserunt,
            iure saepe quasi eius! Eveniet provident modi at perferendis
            asperiores voluptas excepturi eius distinctio aliquam. Repellendus,
            libero modi eligendi nisi incidunt inventore perferendis qui
            corrupti similique id fuga sint molestias nihil expedita enim dolor
            aperiam, quam aspernatur in maiores deserunt, recusandae reiciendis
            velit. Expedita, fuga.
          </div>
          <ModalFooter
            className="p-4 border-t-2 border-gray mt-3"
            isClose={true}
            onClick={onClose}></ModalFooter>
        </Fragment>
      </Modal>

      {/* detail modal */}
      <Modal size="small" onClose={onCloseDetail} isOpen={isOpenDetail}>
        <Fragment>
          <ModalHeader
            className="p-6 mb-3"
            isClose={true}
            onClick={onCloseDetail}>
            <div className="flex-flex-col gap-2">
              <h3
                className="text-sm font-semibold py-1 px-2 rounded-md w-full max-w-max"
                style={{
                  backgroundColor: !details?.workType
                    ? "#FFFFFF"
                    : genColorProjectType(details.workType),
                  color: !details?.workType ? "#333A48" : "#FFFFFF",
                }}>
                {details?.workType || ""}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-5">{details?.workName || ""}</p>
              </div>
            </div>
          </ModalHeader>
          <div className="w-full flex flex-col divide-y-2 divide-gray shadow-3 text-sm text-gray-5">
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <div className="text-sm text-graydark">Start Date</div>
              <p>{dateFormat(details?.scheduleStart)}</p>
            </div>
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <div className="text-sm text-graydark">End Date</div>
              <p>{dateFormat(details?.scheduleEnd)}</p>
            </div>
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2 mb-2">
              <div className="text-sm text-graydark">Total Task</div>
              <p>{details?.totalTask}</p>
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

export default Issues;
