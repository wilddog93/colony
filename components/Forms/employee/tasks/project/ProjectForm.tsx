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
import {
  selectTaskCategory,
  updateTaskCategory,
} from "../../../../../redux/features/task-management/settings/taskCategoryReducers";
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

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  projectOption?: any | any[];
};

type FormValues = {
  id?: any;
  projectName?: string | any;
  projectDescription?: string | any;
  projectType?: any;
  scheduleStart?: string | any;
  scheduleEnd?: string | any;
  user?: any | any[];
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

export default function ProjectForm(props: Props) {
  const {
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    getData,
    projectOption,
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
  const { pending, error, message } = useAppSelector(selectProjectManagement);

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
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        id: items?.id,
        projectName: items?.projectName,
        projectDescription: items?.projectDescription,
        projectType: items?.projectType,
        scheduleStart: items?.scheduleStart,
        scheduleEnd: items?.scheduleEnd,
        user: items?.user,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        projectName: items?.projectName,
        projectDescription: items?.projectDescription,
        projectType: items?.projectType,
        scheduleStart: items?.scheduleStart,
        scheduleEnd: items?.scheduleEnd,
        user: items?.user,
      });
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
    name: "projectDescription",
    control,
  });

  const userValue = useWatch({
    name: "user",
    control,
  });

  // getUser
  const getMembers = useMemo(() => {
    let arr: any[] = userValue || [];

    return arr;
  }, []);

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
      projectName: value?.projectName,
      projectType: value?.projectType?.id,
      projectDescription: value?.projectDescription,
      scheduleStart: value?.scheduleStart,
      scheduleEnd: value?.scheduleEnd,
      user: value?.user?.length > 0 ? value?.user?.map((x: any) => x.id) : [],
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
          createProject({
            token,
            data: newData,
            isSuccess() {
              toast.dark("New Project has been created");
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
          updateProject({
            id: value?.id,
            token,
            data: newData,
            isSuccess() {
              toast.dark("Project has been updated");
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
      clearErrors("scheduleStart");

      setValue("scheduleEnd", end);
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

  useEffect(() => {
    if (users?.length > 0) {
      setValue("user", users);
    }
  }, [users]);

  console.log(watchValue, "value");

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Project
          </h3>
          <p className="text-gray-5 text-sm">Fill your project information.</p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectType">
              Project Type<span className="text-primary">*</span>
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
                    instanceId="projectType"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Type"
                    options={projectOption}
                    icon=""
                  />
                )}
                name="projectType"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Project type is required.",
                  },
                }}
              />
            </div>
            {errors?.projectType && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.projectType.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectName">
              Project Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="projectName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("projectName", {
                  required: {
                    value: true,
                    message: "Task category name is required.",
                  },
                })}
              />
            </div>
            {errors?.projectName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.projectName.message as any}
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
                    setDateRange(update);
                    const [start, end] = update;
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
                {...register("projectDescription")}
              />
            </div>
            <div className={`w-full flex text-xs text-gray-5 justify-end`}>
              {descValue?.length || 0}/400 Characters
            </div>
          </div>

          <div className="w-full mb-3">
            <div className="w-full flex items-center gap-2">
              <div className="w-full max-w-max font-semibold text-sm">
                Users :<span className="text-red-300">*</span>
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
              {getMembers?.length > 0 ? (
                <button
                  type="button"
                  onClick={() => console.log("add members")}
                  className="group relative rounded-full text-gray-600 hover:text-red-300 focus:outline-none ml-2">
                  <span className="text-xs normal-case absolute hidden group-hover:flex -left-[1.4rem] -top-2 -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                    Clear Members
                  </span>
                  <MdOutlineCancel className="w-6 h-6" />
                </button>
              ) : null}
            </div>
            {errors?.user && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors?.user?.message as string}
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
            disabled={pending || !isValid}>
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
          />
        </div>
      </Modal>
    </Fragment>
  );
}
