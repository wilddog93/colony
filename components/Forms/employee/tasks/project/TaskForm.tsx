import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdOutlineCalendarToday,
  MdOutlineCancel,
  MdWarning,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import { selectTaskCategory } from "../../../../../redux/features/task-management/settings/taskCategoryReducers";
import {
  createProject,
  selectProjectManagement,
  updateProject,
} from "../../../../../redux/features/task-management/project/projectManagementReducers";
import DatePicker from "react-datepicker";
import Members from "../../../../Task/Members";
import Modal from "../../../../Modal";
import UsersForm from "./UsersForm";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import moment from "moment";
import {
  createTasks,
  selectTaskManagement,
  updateTasks,
} from "../../../../../redux/features/task-management/project/task/taskManagementReducers";

type Props = {
  id: number | any;
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  categoryOptions?: any | any[];
  projectMembers: any | any[];
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

export default function TaskForm(props: Props) {
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
  } = props;

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

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectTaskManagement);

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
    }
  }, [items]);

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

  const userValue = useWatch({
    name: "assignee",
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
      assignee:
        value?.assignee?.length > 0
          ? value?.assignee?.map((x: any) => x.id)
          : [],
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
      if (!isUpdate) {
        dispatch(
          createTasks({
            id: id,
            token,
            data: newData,
            isSuccess() {
              toast.dark("New Task has been created");
              getData();
              isCloseModal();
            },
            isError() {
              console.log("error");
            },
          })
        );
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

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "New"} Task
          </h3>
          <p className="text-gray-5 text-sm">Fill your task information.</p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="taskCategory">
              Task Category<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={value}
                    onChange={onChange}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel={""}
                    instanceId="taskCategory"
                    isDisabled={false}
                    isMulti={true}
                    placeholder="Type"
                    options={categoryOptions}
                    icon=""
                  />
                )}
                name="taskCategory"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Task Category is required.",
                  },
                }}
              />
            </div>
            {errors?.taskCategory && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.taskCategory.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="taskName">
              Task Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="taskName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("taskName", {
                  required: {
                    value: true,
                    message: "Task name is required.",
                  },
                })}
              />
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

          <div className="w-full">
            <label className="w-full text-gray-5 overflow-hidden">
              <div className="text-sm text-gray-6 font-semibold">Schedule</div>
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

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectDescription">
              Description
            </label>
            <div className="w-full">
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

          <div className={`w-full mb-3 ${isUpdate ? "hidden" : ""}`}>
            <div className="w-full flex items-center gap-2">
              <div className="w-full max-w-max font-semibold text-sm">
                Assignee :<span className="text-red-300">*</span>
              </div>
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

        <div className="w-full flex gap-2 justify-end p-4 border-t-2 border-gray">
          <button
            type="button"
            className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
            onClick={isCloseModal}>
            <span className="font-semibold">Discard</span>
          </button>

          <Button
            type="submit"
            variant="primary"
            className="rounded-md text-sm shadow-card border-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={pending}>
            <span className="font-semibold">
              {isUpdate ? "Update" : "Save"}
            </span>
            {pending ? (
              <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
            ) : (
              <MdCheck className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* modal add member */}
      <Modal size="small" onClose={onCloseAddUsers} isOpen={isOpenAddUsers}>
        <div className="w-full text-sm">
          <UsersForm
            token={token}
            getData={() => console.log("get")}
            isOpen={isOpenAddUsers}
            isCloseModal={onCloseAddUsers}
            items={users}
            setItems={setUsers}
            isUpdate={false}
            isTask
            projectMembers={projectMembers}
          />
        </div>
      </Modal>
    </Fragment>
  );
}
