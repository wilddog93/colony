import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdCheckCircleOutline,
  MdClose,
  MdDelete,
  MdEdit,
  MdLabelOutline,
  MdOutlineCalendarToday,
  MdPeople,
  MdWarning,
} from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import { selectTaskCategory } from "../../../../../redux/features/task-management/settings/taskCategoryReducers";
import DatePicker from "react-datepicker";
import Members from "../../../../Task/Members";
import Modal from "../../../../Modal";
import UsersForm from "./UsersForm";
import moment from "moment";
import {
  getTasksByIdProject,
  selectTaskManagement,
  updateTasks,
} from "../../../../../redux/features/task-management/project/task/taskManagementReducers";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import axios from "axios";
import TaskCategoryForm from "./TaskCategoryForm";
import { useRouter } from "next/router";
import { selectAuth } from "../../../../../redux/features/auth/authReducers";
import TaskComment from "./TaskComment";
import TabsComponent from "../../../../Button/TabsComponent";
import Todos from "./Todos";

type Props = {
  id: number | any;
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  categoryOptions?: any | any[];
  projectMembers?: any | any[];
  tabsMenu: string | any;
};

type FormValues = {
  id?: any;
  taskName?: string | any;
  taskDescription?: string | any;
  taskCategory?: any | any[];
  assignee?: any | any[];
  scheduleStart?: string | any;
  scheduleEnd?: string | any;
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
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
    return {
      ...provided,
      background: "",
      padding: ".2rem",
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 33,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

export default function TaskFormUpdate(props: Props) {
  const {
    id,
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    getData,
    categoryOptions,
    projectMembers,
    tabsMenu,
  } = props;

  const { data } = useAppSelector(selectAuth);

  const router = useRouter();
  const { pathname, query } = router;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // date
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [dateRange, setDateRange] = useState<Date[] | any[]>([null, null]);
  const [startDate, endDate] = dateRange;

  // teams
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);
  const [users, setUsers] = useState<any | any[]>([]);

  // tabs
  const [tabs, setTabs] = useState<string | any>("To Do");
  useEffect(() => {
    if (tabsMenu) {
      setTabs(tabsMenu);
    }
  }, [tabsMenu]);

  // data-item-task
  const [subTasks, setSubTasks] = useState<any | any>([]);
  const [comments, setComments] = useState<any | any[]>([]);
  const [attachments, setAttachments] = useState<any | any[]>([]);
  const [taskCategoryData, setTaskCategoryData] = useState<any | any[]>([]);
  // option
  const { taskCategories } = useAppSelector(selectTaskCategory);
  const [taskCategoryOpt, setTaskCategoryOpt] = useState<OptionProps[]>([]);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectTaskManagement);

  const [loading, setLoading] = useState(false);

  // modal task-category
  const [isOpenModalCategory, setIsOpenModalCategory] = useState(false);
  const onOpenModalCategory = () => {
    setIsOpenModalCategory(true);
  };
  const onCloseModalCategory = () => {
    setIsOpenModalCategory(false);
  };

  // form
  const {
    register,
    unregister,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: {
      errors,
      isValid,
      isDirty,
      dirtyFields,
      isSubmitted,
      isLoading,
    },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        id: items?.id,
        taskName: items?.taskName,
        taskDescription: items?.taskDescription,
        taskCategory: items?.taskCategory,
        assignee: items?.assignee,
        scheduleStart: items?.scheduleStart,
        scheduleEnd: items?.scheduleEnd,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        taskName: items?.taskName,
        taskDescription: items?.taskDescription,
        taskCategory: items?.taskCategory,
        assignee: items?.assignee,
        scheduleStart: items?.scheduleStart,
        scheduleEnd: items?.scheduleEnd,
      });
      // date-range
      let result = [items?.scheduleStart, items?.scheduleEnd];
      if (!result[0]) delete result[0], null;
      else result[0] = moment(result[0]).toDate();

      if (!result[1]) delete result[1], null;
      else result[1] = moment(result[1]).toDate();

      setDateRange(result);

      // user
      setUsers(items?.assignee);
      setTaskCategoryData(items?.taskCategory);
    }
  }, [items]);

  console.log(users, "data-user");

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const descValue = useWatch({
    name: "taskDescription",
    control,
  });

  const taskNameValue = useWatch({
    name: "taskName",
    control,
  });

  // modal add member
  const onOpenAddUsers = (user: any) => {
    setUsers(user);
    setIsOpenAddUsers(true);
  };

  const onCloseAddUsers = () => {
    setIsOpenAddUsers(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      taskName: value?.taskName,
      taskCategory:
        value?.taskCategory?.length > 0
          ? value?.taskCategory?.map((item: any) => item?.id)
          : [],
      taskDescription: value?.taskDescription,
      scheduleStart: value?.scheduleStart,
      scheduleEnd: value?.scheduleEnd,
    };
    if (!value.scheduleStart) {
      setError("scheduleStart", {
        type: "required",
        message: "schedule start is required",
      });
    } else if (!value.scheduleEnd) {
      setError("scheduleEnd", {
        type: "required",
        message: "schedule end is required",
      });
    } else {
      dispatch(
        updateTasks({
          id: id,
          taskId: value?.id,
          token,
          data: newData,
          isSuccess() {
            toast.dark("Task has been updated");
            getData();
            isCloseModal();
          },
          isError() {
            console.log("error");
          },
        })
      );
    }
  };

  const handleChangeSchedules = ({ start, end }: any) => {
    if (!!start || !!end) {
      setValue("scheduleStart", start);
      setValue("scheduleEnd", end);
      clearErrors("scheduleStart");
      clearErrors("scheduleEnd");
    }
    if (!start) {
      setValue("scheduleStart", null);
      setError("scheduleStart", {
        type: "required",
        message: "schedule start is required",
      });
    } else if (!end) {
      setValue("scheduleEnd", null);
      setError("scheduleEnd", {
        type: "required",
        message: "schedule end is required",
      });
    }
  };

  const startValue = useWatch({
    name: "scheduleStart",
    control,
  });

  const endValue = useWatch({
    name: "scheduleEnd",
    control,
  });

  useEffect(() => {
    if (users?.length > 0) {
      setValue("assignee", users);
    }
  }, [users]);

  // task-category
  useEffect(() => {
    let arr: OptionProps[] = [];
    const { data } = taskCategories;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.taskCategoryName,
          label: item?.taskCategoryName,
        });
      });
      setTaskCategoryOpt(arr);
    }
  }, [taskCategories]);

  // subtask
  const filterSubTask = useMemo(() => {
    let qb = RequestQueryBuilder.create();

    qb.sortBy({ field: "updatedAt", order: "DESC" });

    qb.query();
    return qb;
  }, []);

  const getSubTask = async ({ token, params, id, taskId }: any) => {
    const config = {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    try {
      const res = await axios.get(`/project/${id}/${taskId}/subTask`, config);
      const { status, data } = res;
      if (status == 200) {
        setSubTasks(data?.data);
      } else {
        toast("Something went wrong!", { type: "error" });
        throw res;
      }
    } catch (error) {
      console.log(error, "error-response-subtask");
    }
  };

  useEffect(() => {
    if (token && items?.id) {
      getSubTask({
        token,
        params: filterSubTask.queryObject,
        id: items?.project?.id,
        taskId: items?.id,
      });
    }
  }, [token, items]);

  const generateStatusColor = (value: any) => {
    console.log(value, "value-data");
    let color = "#333333";
    switch (value) {
      case "To Do":
        color = "#F7D6C8";
        break;
      case "In Progress":
        color = "#FFE17B";
        break;
      case "Solved":
        color = "#79E0EE";
        break;
      case "Done":
        color = "#5F59F7";
    }
    return color;
  };

  // delete task-category
  const onDeleteTaskCategory = (id: any) => {
    const filter = taskCategoryData?.filter((e: any) => e?.id !== id);
    if (id) {
      setTaskCategoryData(filter);
    }
  };

  useEffect(() => {
    if (taskCategoryData?.length > 0) {
      setValue("taskCategory", taskCategoryData);
    } else {
      setValue("taskCategory", null);
    }
  }, [taskCategoryData]);

  const menuTabs = [
    { pathname: "To Do" },
    { pathname: "Comment" },
    { pathname: "Attachment" },
  ];

  //

  console.log(taskCategoryData, "items-task");

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex items-center justify-between gap-1 px-2">
          <h3 className="text-lg capitalize flex gap-1">
            <span>{items?.projectName || "-"}</span>/
            <span className="font-semibold">{taskNameValue || "-"}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="border border-primary text-white bg-primary rounded-lg p-1 focus:outline-none focus:border-white"
              disabled={pending}>
              {pending ? (
                <FaCircleNotch className="w-5 h-5 animate-spin-1.5" />
              ) : (
                <MdCheck className="w-5 h-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => console.log("save")}
              className="border border-danger text-white bg-danger rounded-lg p-1 focus:outline-none focus:border-white">
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className="w-full flex flex-col lg:flex-row gap-2 divide-x-2 divide-gray">
          <div className="w-full lg:w-1/2 flex flex-col gap-2 p-6 text-gray-6">
            <div
              className={`inline-flex w-full max-w-max px-4 py-2 text-xl rounded-lg shadow-2 mb-3 ${
                !items?.taskStatus ? "hidden" : ""
              }`}
              style={{
                backgroundColor: generateStatusColor(items?.taskStatus),
                color: "#FFF",
              }}>
              {items?.taskStatus}
            </div>

            <div className="w-full mb-3">
              <div className="w-full flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Name"
                  autoFocus
                  id="taskName"
                  className={`bg-white w-full text-title-xl border-b-2 border-stroke bg-transparent outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                  {...register("taskName", {
                    required: {
                      value: true,
                      message: "Task name is required.",
                    },
                  })}
                />
                <span className="">
                  <MdEdit className="w-5 h-5 text-gray-5" />
                </span>
              </div>
              {errors?.taskName && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.taskName.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col lg:flex-row item-center gap-2 mb-3">
              <div className="w-full my-auto lg:w-1/3 text-lg font-semibold">
                Schedule
              </div>
              <div className="w-full lg:w-2/3">
                <label className="w-full text-gray-5 overflow-hidden">
                  <div className="relative">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update: any) => {
                        const [start, end] = update;
                        setDateRange(update);
                        handleChangeSchedules({ start, end });
                      }}
                      isClearable={true}
                      placeholderText={"Select Schedule"}
                      todayButton
                      dropdownMode="select"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      clearButtonClassName="after:w-10 after:h-10 h-10 w-10"
                      className="text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <MdOutlineCalendarToday className="absolute left-4 top-4 h-6 w-6 text-gray-5" />
                  </div>
                </label>
                {errors?.scheduleStart && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.scheduleStart.message as any}
                    </span>
                  </div>
                )}
                {errors?.scheduleEnd && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors.scheduleEnd.message as any}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              {/* <label
                className="text-gray-500 text-lg font-semibold"
                htmlFor="projectDescription">
                Description
              </label> */}
              <div className="w-full mt-2">
                <textarea
                  rows={3}
                  cols={5}
                  maxLength={400}
                  placeholder="Description"
                  id="projectDescription"
                  autoFocus
                  className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                  {...register("taskDescription")}
                />
              </div>
              <div className={`w-full flex text-xs text-gray-5 justify-end`}>
                {descValue?.length || 0}/400 Characters
              </div>
            </div>

            <div className={`w-full mb-3`}>
              <div className="w-full flex items-center gap-2 mb-3">
                <MdPeople className="w-6 h-6" />
                <span className="text-title-md">Assignee</span>
              </div>
              <div className="w-full flex items-center gap-2">
                {users?.length > 0 ? (
                  <Members
                    token={token}
                    items={users}
                    onClick={() => onOpenAddUsers(users)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOpenAddUsers(true)}
                    className="flex gap-1 items-center text-[0.6rem] font-semibold uppercase bg-primary text-white px-2 py-1 leading-relaxed rounded-lg shadow-1 hover:opacity-80">
                    <span>Assign User</span>
                    <MdAdd className="w-3 h-3" />
                  </button>
                )}
              </div>
              {errors?.assignee && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.assignee?.message as string}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-6">
            <div className="w-full">
              <div className="flex gap-2 items-center">
                <MdLabelOutline className="w-6 h-6" />
                <span className="text-lg font-semibold">Task Category</span>
              </div>
              <div className="flex flex-row flex-wrap gap-2 p-2 items-center text-gray-700 text-sm font-semibold my-3 max-h-24 overflow-auto">
                {taskCategoryData?.length > 0
                  ? taskCategoryData?.map((cat: any) => (
                      <div
                        key={cat?.id}
                        style={{
                          backgroundColor: cat?.taskCategoryFillColor,
                          color: cat?.taskCategoryTextColor,
                        }}
                        className="px-4 py-2 rounded-2xl cursor-pointer flex items-center justify-between shadow-2 gap-1">
                        <span className="text-xs">{cat?.taskCategoryName}</span>
                        <button
                          onClick={() => onDeleteTaskCategory(cat?.id)}
                          className="">
                          <MdClose className="h-3 w-3 font-bold text-gray-700 hover:text-white hover:bg-red-400 rounded-full" />
                        </button>
                      </div>
                    ))
                  : null}

                <button
                  onClick={onOpenModalCategory}
                  type="button"
                  className="flex items-center bg-primary text-white shadow-md font-bold text-[10px] px-1 py-1 uppercase hover:opacity-75 focus:outline-none duration-300 transition transform hover:shadow-offset-black focus:shadow-offset-black border border-primary hover:border-primary rounded-xl">
                  <MdAdd className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="w-full">
              <TabsComponent
                value={tabs}
                setValue={setTabs}
                menus={menuTabs}
                className="text-sm"
              />

              <div
                className={`w-full py-5 ${tabs !== "To Do" ? "hidden" : ""}`}>
                <Todos
                  id={id}
                  member={projectMembers}
                  user={data?.user}
                  item={items}
                  token={token}
                />
              </div>

              <div
                className={`w-full py-5 ${tabs !== "Comment" ? "hidden" : ""}`}>
                <div>
                  <TaskComment
                    id={id}
                    member={projectMembers}
                    user={data.user}
                    item={items}
                    token={token}
                  />
                </div>
              </div>

              <div
                className={`w-full py-5 ${
                  tabs !== "Attachment" ? "hidden" : ""
                }`}>
                Attachment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal add member */}
      <Modal size="small" onClose={onCloseAddUsers} isOpen={isOpenAddUsers}>
        <div className="w-full text-sm">
          <UsersForm
            id={id}
            taskId={items?.id}
            token={token}
            getData={() =>
              dispatch(getTasksByIdProject({ token, id: query?.id }))
            }
            isOpen={isOpenAddUsers}
            isCloseModal={onCloseAddUsers}
            items={users}
            setItems={setUsers}
            isUpdate={true}
            isTask
            projectMembers={projectMembers}
          />
        </div>
      </Modal>

      {/* task-category modal */}
      <Modal
        size="small"
        onClose={onCloseModalCategory}
        isOpen={isOpenModalCategory}>
        <TaskCategoryForm
          taskCategory={taskCategoryData}
          setTaskCategory={setTaskCategoryData}
          options={taskCategoryOpt}
          onCloseModal={onCloseModalCategory}
        />
      </Modal>
    </Fragment>
  );
}
