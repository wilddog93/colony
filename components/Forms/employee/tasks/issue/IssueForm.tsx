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
  createProject,
  selectProjectManagement,
  updateProject,
} from "../../../../../redux/features/task-management/project/projectManagementReducers";
import DatePicker from "react-datepicker";
import Members from "../../../../Task/Members";
import Modal from "../../../../Modal";
// import UsersForm from "./UsersForm";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import moment from "moment";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import {
  createIssue,
  updateIssue,
} from "../../../../../redux/features/task-management/issue/issueManagementReducers";

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  projectOption?: any | any[];
  categoryOpt?: OptionProps[] | any[];
  typeOpt?: OptionProps[] | any[];
};

type FormValues = {
  id?: any;
  issueName?: string | any;
  issueDescription?: string | any;
  issueType?: any;
  issueCategory?: any;
  complainantName?: string | any;
  phoneNumber?: string | any;
  occupant?: any | any[];
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

export default function IssueForm(props: Props) {
  const {
    isOpen,
    isCloseModal,
    items,
    isUpdate,
    token,
    getData,
    projectOption,
    categoryOpt,
    typeOpt,
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
  const [isOpenAddOccupant, setIsOpenAddOccupant] = useState(false);
  const [occupants, setOccupants] = useState<any | any[]>([]);

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
        issueName: items?.issueName,
        issueDescription: items?.issueDescription,
        issueType: items?.issueType,
        issueCategory: items?.issueCategory,
        complainantName: items?.complainantName,
        phoneNumber: items?.phoneNumber,
        occupant: items?.occupant,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        issueName: items?.issueName,
        issueDescription: items?.issueDescription,
        issueType: items?.issueType,
        issueCategory: items?.issueCategory,
        complainantName: items?.complainantName,
        phoneNumber: items?.phoneNumber,
        occupant: items?.occupant,
      });

      // user
      setOccupants(items?.occupant);
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
    name: "issueDescription",
    control,
  });

  const userValue = useWatch({
    name: "occupant",
    control,
  });

  // getUser
  const getMembers = useMemo(() => {
    let arr: any[] = userValue || [];

    return arr;
  }, []);

  // modal add member
  const onOpenAddOccupants = (item: any) => {
    setOccupants(item);
    setIsOpenAddOccupant(true);
  };

  const onCloseAddOccupants = () => {
    setIsOpenAddOccupant(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      issueName: value?.issueName,
      issueType: value?.issueType?.id,
      issueDescription: value?.issueDescription,
      complainantName: value?.complainantName,
      phoneNumber: value?.phoneNumber,
    };
    if (!isUpdate) {
      newData = {
        ...newData,
        occupant: value?.occupant?.id,
      };
      dispatch(
        createIssue({
          token,
          data: newData,
          isSuccess() {
            toast.dark("New Issue has been created");
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
        updateIssue({
          id: value?.id,
          token,
          data: newData,
          isSuccess() {
            toast.dark("Issue has been updated");
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

  useEffect(() => {
    if (occupants?.length > 0) {
      setValue("occupant", occupants);
    }
  }, [occupants]);

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Issue
          </h3>
          <p className="text-gray-5 text-sm">Fill your issue information.</p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full flex gap-2">
            <div className="w-full mb-3">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="projectType">
                Issue Type<span className="text-primary">*</span>
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
                      instanceId="issueType"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Type"
                      options={typeOpt}
                      icon=""
                    />
                  )}
                  name="issueType"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Issue type is required.",
                    },
                  }}
                />
              </div>
              {errors?.issueType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.issueType.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mb-3">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="projectType">
                Issue Type<span className="text-primary">*</span>
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
                      instanceId="issueType"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Type"
                      options={typeOpt}
                      icon=""
                    />
                  )}
                  name="issueType"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Issue type is required.",
                    },
                  }}
                />
              </div>
              {errors?.issueType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.issueType.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="issueName">
              Issue Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="issueName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("issueName", {
                  required: {
                    value: true,
                    message: "Project name is required.",
                  },
                })}
              />
            </div>
            {errors?.issueName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.issueName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="issueDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="issueDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("issueDescription")}
              />
            </div>
            <div className={`w-full flex text-xs text-gray-5 justify-end`}>
              {descValue?.length || 0}/400 Characters
            </div>
          </div>

          <div className={`w-full mb-3 ${isUpdate ? "hidden" : ""}`}>
            <div className="w-full flex items-center gap-2">
              <div className="w-full max-w-max font-semibold text-sm">
                Occupant :<span className="text-red-300">*</span>
              </div>
              {occupants?.length > 0 ? (
                <Members
                  token={token}
                  items={occupants}
                  onClick={() => onOpenAddOccupants(occupants)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOpenAddOccupant(true)}
                  className="flex gap-1 items-center text-[0.6rem] font-semibold uppercase bg-primary text-white px-2 py-1 leading-relaxed rounded-lg shadow-1 hover:opacity-80">
                  <span>Assign User</span>
                  <MdAdd className="w-3 h-3" />
                </button>
              )}
            </div>
            {errors?.occupant && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors?.occupant?.message as string}
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
      {/* <Modal size="small" onClose={onCloseAddOccupants} isOpen={isOpenAddOccupant}>
        <div className="w-full text-sm">
          <UsersForm
            token={token}
            getData={() => console.log("get")}
            isOpen={isOpenAddOccupant}
            isCloseModal={onCloseAddOccupants}
            items={users}
            setItems={setUsers}
            isUpdate={false}
          />
        </div>
      </Modal> */}
    </Fragment>
  );
}
