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
  MdCheckCircleOutline,
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdOutlineCalendarToday,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuTask } from "../../../../../utils/routes";
import Modal from "../../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../../components/Modal/ModalComponent";
import {
  UserProps,
  WorkProps,
} from "../../../../../components/tables/components/taskData";
import moment from "moment";
import DatePicker from "react-datepicker";
import { createTask } from "../../../../../components/tables/components/taskData";
import Teams from "../../../../../components/Task/Teams";
import Kanban from "../../../../../components/DragComponent/tasks/Kanban";
import {
  OptionProps,
  ProjectProps,
  TaskProps,
} from "../../../../../utils/useHooks/PropTypes";
import {
  getProjectById,
  selectProjectManagement,
} from "../../../../../redux/features/task-management/project/projectManagementReducers";
import Members from "../../../../../components/Task/Members";
import UsersForm from "../../../../../components/Forms/employee/tasks/project/UsersForm";
import ProjectForm from "../../../../../components/Forms/employee/tasks/project/ProjectForm";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  getProjectTypes,
  selectProjectType,
} from "../../../../../redux/features/task-management/settings/projectTypeReducers";
import {
  getTasksByIdProject,
  selectTaskManagement,
} from "../../../../../redux/features/task-management/project/task/taskManagementReducers";

type Props = {
  pageProps: any;
};

const sortOpt = [
  { value: "A-Z", label: "A-Z" },
  { value: "Z-A", label: "Z-A" },
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
  menuList: (provided: any) => provided,
};

const TaskDetail = ({ pageProps }: Props) => {
  moment.locale("id");
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { project } = useAppSelector(selectProjectManagement);
  const { projectTypes } = useAppSelector(selectProjectType);
  const { tasks } = useAppSelector(selectTaskManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<WorkProps>();
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(2000);
  const [total, setTotal] = useState(1000);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<TaskProps | any>(null);
  const [formData, setFormData] = useState<ProjectProps | any>(null);
  const [formTask, setFormTask] = useState<TaskProps | any>(null);

  // edit-project
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [projectTypeOpt, setProjectTypeOpt] = useState<OptionProps[] | any[]>(
    []
  );

  // members
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);
  const [members, setMembers] = useState<UserProps[] | any[]>([]);

  // date
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [dateRange, setDateRange] = useState<Date[]>([start, end]);
  const [startDate, endDate] = dateRange;

  // modal edit project
  const onOpenModalEdit = (items: any) => {
    setFormData(items);
    setIsOpenEdit(true);
  };

  const onCloseModalEdit = () => {
    setFormData(null);
    setIsOpenEdit(false);
  };

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
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

  useEffect(() => {
    setDataTable(() => createTask());
  }, []);

  const genProjectStatus = (value: string) => {
    if (!value) return "-";
    if (value === "Open")
      return (
        <div className="w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200">
          {value}
        </div>
      );
    if (value === "On Progress")
      return (
        <div className="w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-8 text-meta-8 bg-orange-200">
          {value}
        </div>
      );
    if (value === "Closed")
      return (
        <div className="w-full max-w-max p-1 rounded-lg text-xs text-center border border-green-600 text-green-600 bg-green-200">
          {value}
        </div>
      );
    if (value === "Overdue")
      return (
        <div className="w-full max-w-max p-1 rounded-lg text-xs text-center border border-meta-1 text-meta-1 bg-red-200">
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

  // get project detail
  useEffect(() => {
    if (token && query?.id) {
      dispatch(getProjectById({ token, id: query?.id }));
    }
  }, [token, query?.id]);

  // project-data
  const projectData = useMemo(() => {
    let result: ProjectProps = {};

    result = {
      ...project,
      projectMembers:
        project?.projectMembers?.length > 0
          ? project?.projectMembers?.map((member: any) => ({
              ...member?.userStructure?.user,
            }))
          : [],
      user:
        project?.projectMembers?.length > 0
          ? project?.projectMembers?.map((member: any) => ({
              ...member?.userStructure?.user,
            }))
          : [],
      projectType: !project?.projectType
        ? null
        : {
            ...project?.projectType,
            value: project?.projectType?.projectTypeName,
            label: project?.projectType?.projectTypeName,
          },
    };

    return result;
  }, [project]);

  useEffect(() => {
    let newData: UserProps[] = projectData.projectMembers || [];
    setMembers(newData);
  }, [projectData]);

  // modal add member
  const onOpenAddUsers = (user: any) => {
    setMembers(user);
    setIsOpenAddUsers(true);
  };

  const onCloseAddUsers = () => {
    setIsOpenAddUsers(false);
  };

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
    let arr: OptionProps[] = [];
    const { data } = projectTypes;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.projectTypeName,
          label: item?.projectTypeName,
        });
      });
      setProjectTypeOpt(arr);
    }
  }, [projectTypes]);
  // project type end

  // date-range
  useEffect(() => {
    let result = [projectData?.scheduleStart, projectData?.scheduleEnd];
    if (!result[0]) delete result[0], null;
    else result[0] = moment(result[0]).toDate();

    if (!result[1]) delete result[1], null;
    else result[1] = moment(result[1]).toDate();

    setDateRange(result);
  }, [projectData?.scheduleEnd, projectData?.scheduleStart]);

  // get task
  useEffect(() => {
    if (token && query?.id) {
      dispatch(getTasksByIdProject({ token, id: query?.id }));
    }
  }, [query?.id, token]);

  const taskData = useMemo(() => {
    let newArr: any[] = [];
    const { data } = tasks;
    if (data && data?.length > 0) {
      data?.map((e: any) => {
        newArr.push({
          ...e,
          taskAssignees:
            e?.taskAssignees?.length > 0
              ? e?.taskAssignees?.map((user: any) => ({
                  ...user.user,
                }))
              : [],
          taskCategories:
            e?.taskCategories?.length > 0
              ? e?.taskCategories?.map((category: any) => ({
                  ...category.taskCategory,
                }))
              : [],
        });
      });
    }
    return newArr;
  }, [tasks]);

  console.log(projectData, "detail-project");
  console.log(dataTable, "data-table");
  console.log({ tasks: tasks?.data, dataTable }, "task-data");

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
          {/* header */}
          <div className="sticky bg-white top-0 z-99 py-6">
            <div className="w-full flex flex-col gap-2 bg-gray rounded-xl shadow-card">
              {/* button sidebar */}
              <div className="w-full px-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
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
              </div>
              {/* header task */}
              <div className="w-full flex flex-col lg:flex-row gap-2 border-0 lg:border-b-2 border-gray lg:shadow-1 py-2 items-center justify-center">
                <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-2 items-center jus mx-auto lg:mx-0">
                  <Button
                    type="button"
                    className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5"
                    onClick={() => router.back()}
                    variant="secondary-outline"
                    key={"1"}>
                    <MdChevronLeft className="w-5 h-5" />
                    <div className="flex flex-col gap-1 items-start">
                      <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                        <div className="w-full flex items-center gap-2">
                          <h3>{projectData?.projectName}</h3>
                          <p
                            className={`${
                              !projectData?.projectCode ? "hidden" : ""
                            }`}>
                            {" - "}
                            {projectData?.projectCode}
                          </p>
                        </div>
                      </h3>
                    </div>
                  </Button>

                  <div
                    className={`w-full lg:max-w-max flex gap-2 items-center justify-center mx-auto lg:mx-0 ${
                      !projectData?.projectType ? "hidden" : ""
                    }`}>
                    <div
                      className={`w-full max-w-max text-center bg-primary px-4 py-2 rounded-xl`}>
                      {projectData?.projectType?.projectTypeName}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end gap-2 lg:ml-auto px-4">
                  <Button
                    type="button"
                    className="rounded-lg text-sm font-semibold py-3"
                    onClick={() => onOpenModalEdit(projectData)}
                    variant="primary-outline">
                    <span className="hidden lg:inline-block">Edit Project</span>
                    <MdEdit className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    className="rounded-lg text-sm font-semibold py-3"
                    onClick={onOpen}
                    variant="primary">
                    <span className="hidden lg:inline-block">New Task</span>
                    <MdAdd className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* tabs */}
              <div className="w-full max-w-max hidden lg:flex items-start text-graydark gap-2 p-4">
                <h3 className="font-semibold">Description:</h3>
                <p className="w-full">
                  {!projectData?.projectDescription
                    ? "-"
                    : projectData?.projectDescription?.length > 50
                    ? `${!projectData?.projectDescription?.substring(50, 0)}...`
                    : projectData?.projectDescription}
                </p>
              </div>
            </div>
          </div>

          <main className="relative w-full tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col gap-2.5 lg:gap-6">
              {/* content */}
              <div className="lg:sticky bg-white top-40 z-50 w-full flex flex-col lg:flex-row py-4 lg:divide-x-2 divide-gray-4 items-center">
                <div className="w-full max-w-max flex items-center gap-2 px-4 lg:ml-auto">
                  <h3 className="w-full font-semibold">Manage members :</h3>
                  <div className="w-full max-w-max">
                    <Members
                      items={members}
                      onClick={() => onOpenAddUsers(members)}
                    />
                  </div>
                </div>

                <div className="w-full max-w-[300px] px-4">
                  <label className="w-full text-gray-5 overflow-hidden">
                    <div className="relative">
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update: any) => {
                          setDateRange(update);
                        }}
                        isClearable={false}
                        placeholderText={"Select date"}
                        todayButton
                        dropdownMode="select"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        disabled
                        clearButtonClassName="after:w-10 after:h-10 h-10 w-10"
                        className="text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                      <MdOutlineCalendarToday className="absolute left-4 top-4 h-6 w-6 text-gray-5" />
                    </div>
                  </label>
                </div>

                <div className="w-full max-w-max flex items-center gap-2 px-4 py-2 text-sm">
                  <span className="font-semibold">Project Status:</span>
                  <div className="bg-red-200 border-500 text-500 rounded-lg px-4 py-2 text-red-500 font-semibold">
                    {projectData?.projectStatus}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col">
                <Kanban
                  item={projectData}
                  taskData={taskData}
                  loading={loading}
                  token={token}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* add modal */}
      <Modal size="small" onClose={onCloseModalEdit} isOpen={isOpenEdit}>
        <ProjectForm
          isCloseModal={onCloseModalEdit}
          isOpen={isOpenEdit}
          token={token}
          getData={() => dispatch(getProjectById({ token, id: query?.id }))}
          items={formData}
          projectOption={projectTypeOpt}
          isUpdate
        />
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

      {/* add members */}
      <Modal size="small" onClose={onCloseAddUsers} isOpen={isOpenAddUsers}>
        <div className="w-full text-sm">
          <UsersForm
            token={token}
            getData={() => dispatch(getProjectById({ token, id: query?.id }))}
            isOpen={isOpenAddUsers}
            isCloseModal={onCloseAddUsers}
            items={members}
            setItems={setMembers}
            isUpdate
            id={query?.id}
          />
        </div>
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

export default TaskDetail;
