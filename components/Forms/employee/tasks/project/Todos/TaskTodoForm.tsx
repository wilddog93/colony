import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ModalHeader } from "../../../../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdOutlineCalendarToday,
  MdOutlineCancel,
  MdWarning,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import Members from "../../../../../Task/Members";
import Modal from "../../../../../Modal";
import UsersForm from "../UsersForm";
import DropdownSelect from "../../../../../Dropdown/DropdownSelect";
import moment from "moment";
import {
  createTasks,
  selectTaskManagement,
  updateTasks,
} from "../../../../../../redux/features/task-management/project/task/taskManagementReducers";
import {
  createTaskTodo,
  getTaskTodos,
  selectTaskTodos,
  updateTaskTodo,
} from "../../../../../../redux/features/task-management/project/taskTodo/taskTodoReducers";

type Props = {
  id: number | any;
  taskId?: number | any;
  items?: any | any[];
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  getData: () => void;
  isUpdate?: boolean;
  taskAssignees: any | any[];
};

type FormValues = {
  id?: any;
  subTaskName?: string | any;
  subTaskDescription?: string | any;
  assignee?: any | any[];
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

export default function TaskTodoForm(props: Props) {
  const {
    id,
    taskId,
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    taskAssignees,
    getData,
  } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // teams
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);
  const [users, setUsers] = useState<any | any[]>([]);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectTaskTodos);

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
        subTaskName: items?.subTaskName,
        subTaskDescription: items?.subTaskDescription,
        assignee: items?.assignee,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        subTaskName: items?.subTaskName,
        subTaskDescription: items?.subTaskDescription,
        assignee: items?.assignee,
      });
      // user
      setUsers(items?.assignee);
    }
  }, [items]);

  console.log(items, "user");

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
    name: "subTaskDescription",
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
    // console.log(value, "form");
    let newData: FormValues = {
      subTaskName: value?.subTaskName,
      subTaskDescription: value?.subTaskDescription,
      assignee:
        value?.assignee?.length > 0
          ? value?.assignee?.map((x: any) => x.id)
          : [],
    };
    // console.log(taskId, "form-value");
    if (!isUpdate) {
      dispatch(
        createTaskTodo({
          token,
          id,
          taskId: taskId,
          data: newData,
          isSuccess() {
            toast.dark("Todo has been created");
            getData();
            isCloseModal();
          },
          isError() {
            console.log("error-add-todo");
          },
        })
      );
    } else {
      dispatch(
        updateTaskTodo({
          token,
          id,
          taskId: taskId,
          subTaskId: value?.id,
          data: newData,
          isSuccess() {
            toast.dark("Todo has been updated");
            getData();
            isCloseModal();
          },
          isError() {
            console.log("error-update-todo");
          },
        })
      );
    }
  };

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
            {isUpdate ? "Edit" : "New"} Todos
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your task todo information.
          </p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="subTaskName">
              Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="subTaskName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("subTaskName", {
                  required: {
                    value: true,
                    message: "Task name is required.",
                  },
                })}
              />
            </div>
            {errors?.subTaskName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.subTaskName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="subTaskDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="subTaskDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("subTaskDescription")}
              />
            </div>
            <div className={`w-full flex text-xs text-gray-5 justify-end`}>
              {descValue?.length || 0}/400 Characters
            </div>
          </div>

          <div className={`w-full mb-3`}>
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
            projectMembers={taskAssignees}
            isSubTask
          />
        </div>
      </Modal>
    </Fragment>
  );
}
