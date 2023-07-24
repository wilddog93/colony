import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { ColumnItems } from "../../../../components/tables/components/makeData";
import { makeData } from "../../../../components/tables/components/makeData";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../../../../components/tables/components/TableComponent";
import Button from "../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCalendarToday,
  MdChevronLeft,
  MdDelete,
  MdEdit,
  MdEmail,
  MdFemale,
  MdMale,
  MdPhone,
  MdUpload,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuParkings, menuProjects, menuTask } from "../../../../utils/routes";
import Tabs from "../../../../components/Layouts/Tabs";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../components/tables/layouts/SelectTables";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import moment from "moment";
import { Calendar } from "../../../../components/Timeline";
import {
  WorkProps,
  createDataTask,
} from "../../../../components/tables/components/taskData";
import {
  getProjects,
  selectProjectManagement,
} from "../../../../redux/features/task-management/project/projectManagementReducers";
import {
  getProjectTypes,
  selectProjectType,
} from "../../../../redux/features/task-management/settings/projectTypeReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import ProjectForm from "../../../../components/Forms/employee/tasks/project/ProjectForm";

interface ProjectTypeProps {
  id: number | any;
  createdAt: string | any;
  updatedAt: string | any;
  projectTypeName: string | any;
  projectTypeDescription: string | any;
  projectTypePriority: string | any;
}

interface PropsData {
  id: 2;
  createdAt: string | any;
  updatedAt: string | any;
  projectCode: null;
  projectName: string | any;
  projectDescription: string | any;
  scheduleStart: string | any;
  scheduleEnd: string | any;
  executionStart: string | any;
  executionEnd: string | any;
  projectStatus: string | any;
  totalTask: number | any;
  totalTaskCompleted: number | any;
  projectType: ProjectTypeProps | any;
  issue: any | null;
  projectMembers: any | any[];
}

interface Options {
  value: string | any;
  label: string | any;
}

type Props = {
  pageProps: any;
};

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const statusOpt: Options[] = [
  { value: "Not Started", label: "Not Started" },
  { value: "Open", label: "Open" },
  { value: "On Progress", label: "On Progress" },
  { value: "Closed", label: "Closed" },
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
  menu: (provided: any) => {
    return {
      ...provided,
      zIndex: 999,
    };
  },
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
      zIndex: 99999,
    };
  },
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
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
      // flexDirection: "row-reverse"
    };
  },
  menu: (provided: any) => {
    return {
      ...provided,
      zIndex: 999,
    };
  },
};

const CalendarBoard = ({ pageProps }: Props) => {
  moment.locale("id");
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { projects } = useAppSelector(selectProjectManagement);
  const { projectTypes } = useAppSelector(selectProjectType);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [status, setStatus] = useState<Options | any>(null);
  const [types, setTypes] = useState<Options | any>(null);
  const [typesOpt, setTypesOpt] = useState<Options | any>(null);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // timeline
  const [timelineHeader, setTimelineHeader] = useState<any | any[]>([]);
  const [timelineItem, setTimelineItem] = useState<any | any[]>([]);

  // modal
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // detail
  const onOpenModalDetail = (value: PropsData) => {
    setFormData(value);
    setIsOpenDetail(true);
  };

  const onCloseModalDetail = () => {
    setFormData(null);
    setIsOpenDetail(false);
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
    return router.push({ pathname: `/employee/tasks/projects/${id}` });
  };

  // color
  const genColorProjectType = (value: any) => {
    // #333A48
    let color = "#333A48";
    if (!value) return "";
    if (value == "Project") color = "#5E59CE";
    if (value == "Complaint Handling") color = "#FF8859";
    if (value == "Regular Task") color = "#38B7E3";
    if (value == "Maintenance") color = "#EC286F";
    return color;
  };

  // get Project
  useEffect(() => {
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
  }, [query?.search, query?.sort, query?.status, query?.types]);

  useEffect(() => {
    let qr: any = {};

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    if (status) qr = { ...qr, status: status?.value };
    if (types) qr = { ...qr, types: types?.value };

    router.replace({ pathname, query: qr });
  }, [search, sort, status, types]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        { projectStatus: { $contL: query?.status } },
        { "projectType.projectTypeName": { $contL: query?.types } },
        {
          $or: [
            { projectName: { $contL: query?.search } },
            { projectDescription: { $contL: query?.search } },
            { "projectType.projectTypeName": { $contL: query?.search } },
          ],
        },
      ],
    };

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `updatedAt`,
        order: "DESC",
      });
    } else {
      qb.sortBy({
        field: `projectName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.search, query?.sort, query?.status, query?.types]);

  useEffect(() => {
    if (token) dispatch(getProjects({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = projects;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [projects]);
  // get project end

  // get project type
  const filterProjectType = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `projectTypeName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(
        getProjectTypes({ token, params: filterProjectType.queryObject })
      );
  }, [token, filterProjectType]);

  useEffect(() => {
    let arr: Options[] = [];
    const { data } = projectTypes;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.projectTypeName,
          label: item?.projectTypeName,
        });
      });
      setTypesOpt(arr);
    }
  }, [projectTypes]);
  // get project type end

  // timeline function
  useEffect(() => {
    let header: any[] = [];
    if (dataTable?.length > 0) {
      dataTable?.map((val) =>
        header?.push({
          id: val?.id,
          title: val?.projectName,
          color: genColorProjectType(val?.projectType?.projectTypeName),
        })
      );
      setTimelineHeader(header);
    } else {
      setTimelineHeader([]);
    }
  }, [dataTable]);

  useEffect(() => {
    let item: any[] = [];
    if (dataTable?.length > 0) {
      dataTable?.map((val) =>
        item?.push({
          ...val,
          id: val?.id,
          title: val?.projectName,
          color: genColorProjectType(val?.projectType?.projectTypeName),
          start_time: moment(val?.scheduleStart).toDate(),
          end_time: moment(val?.scheduleEnd).toDate(),
          group: val?.id,
          itemProps: {
            "data-custom-attribute": "Random content",
            "aria-hidden": true,
            onDoubleClick: () => {
              console.log("You clicked double!");
            },
            className: "weekend",
            style: {
              background: "fuchsia",
            },
          },
        })
      );
      setTimelineItem(item);
    } else {
      setTimelineItem([]);
    }
  }, [dataTable]);

  const onItemMove = (params: any) => {
    const { groupId, dragTime, itemId } = params;
    console.log("project-move:", { groupId, dragTime, itemId });
  };

  const onCanvasClick = (params: any) => {
    const { groupId, time, e } = params;
    if (groupId > 0) {
      setIsOpenDetail(true);
      console.log("project-click:", groupId, time);
    }
  };

  const onItemContextMenu = (itemId: any, e: any, time: any) => {
    console.log("onItem", itemId);

    setIsOpenDetail(true);
    // setIsEditable(true);
  };

  const onItemDoubleClick = (itemId: any, event: any, time: any) => {
    console.log("project-double-click:", { itemId, time, event });
    const items = dataTable.filter((item) => item?.id == itemId);
    setIsOpenDetail(true);
    setFormData(items[0]);
  };

  const onItemSelect = (item: any) => {
    console.log("on item select :", { item });
    //, event:any setIsEditable(true);
  };

  const onSubmitProject = (task: any) => {
    console.log("on submit", task);
  };

  // console.log({ timelineHeader, timelineItem }, "timeline");

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
      header="Task Management"
      head="Tables"
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
                      Projects
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
                  <span className="hidden lg:inline-block">New Project</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* tabs */}
            <div className="w-full px-4">
              <Tabs menus={menuProjects} />
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
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
                    instanceId="1"
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
                    instanceId="1"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="All Type..."
                    options={typesOpt}
                    icon=""
                  />
                </div>
              </div>

              {/* Calendar timeline */}
              <div className="w-full relative">
                <Calendar
                  groups={timelineHeader}
                  items={timelineItem}
                  onItemMove={onItemMove}
                  onCanvasClick={onCanvasClick}
                  onItemContextMenu={onItemContextMenu}
                  onItemSelect={onItemSelect}
                  onItemDoubleClick={onItemDoubleClick}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* detail modal */}
      <Modal size="small" onClose={onCloseModalDetail} isOpen={isOpenDetail}>
        <Fragment>
          <ModalHeader
            className="p-6 mb-3"
            isClose={true}
            onClick={onCloseModalDetail}>
            <div className="flex-flex-col gap-2">
              <h3
                className="text-sm font-semibold py-1 px-2 rounded-md w-full max-w-max"
                style={{
                  backgroundColor: genColorProjectType(
                    formData?.projectType?.projectTypeName
                  ),
                  color: "#FFFFFF",
                }}>
                {formData?.projectType?.projectTypeName || ""}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-5">
                  {formData?.projectName || ""}
                </p>
              </div>
            </div>
          </ModalHeader>
          <div className="w-full flex flex-col divide-y-2 divide-gray shadow-3 text-sm text-gray-5">
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <div className="text-sm text-graydark">Start Date</div>
              <p>{dateFormat(formData?.scheduleStart)}</p>
            </div>
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2">
              <div className="text-sm text-graydark">End Date</div>
              <p>{dateFormat(formData?.scheduleEnd)}</p>
            </div>
            <div className="w-full flex flex-col px-6 lg:flex-row items-center justify-between py-2 mb-2">
              <div className="text-sm text-graydark">Total Task</div>
              <div>{formData?.totalTask}</div>
            </div>
          </div>
        </Fragment>
      </Modal>

      {/* add modal */}
      <Modal size="small" onClose={onCloseModalAdd} isOpen={isOpenAdd}>
        <ProjectForm
          isCloseModal={onCloseModalAdd}
          isOpen={isOpenAdd}
          token={token}
          getData={() =>
            dispatch(getProjects({ token, params: filters.queryObject }))
          }
          items={formData}
          projectOption={typesOpt}
        />
      </Modal>

      {/* delete modal */}
      <Modal size="small" onClose={onCloseModalDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalDelete}>
            <h3 className="text-lg font-semibold">Delete Tenant</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4">
            <h3>Are you sure to delete tenant data ?</h3>
          </div>

          <ModalFooter
            className="p-4 border-t-2 border-gray"
            isClose={true}
            onClick={onCloseModalDelete}>
            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              onClick={onCloseModalDelete}>
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

export default CalendarBoard;
