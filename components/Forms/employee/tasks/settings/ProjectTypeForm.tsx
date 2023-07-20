import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalFooter, ModalHeader } from "../../../../Modal/ModalComponent";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import {
  createProjectTypes,
  selectProjectType,
  updateProjectTypes,
} from "../../../../../redux/features/task-management/settings/projectTypeReducers";
import { toast } from "react-toastify";

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
};

type FormValues = {
  id?: any;
  projectTypeName?: string | any;
  projectTypeDescription?: string | any;
  projectTypePriority?: string | any;
};

type Options = {
  value?: any;
  label?: any;
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

const priorityOption: Options[] = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];

export default function ProjectTypeForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, token, getData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectProjectType);

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
        projectTypeName: items?.projectTypeName,
        projectTypeDescription: items?.projectTypeDescription,
        projectTypePriority: items?.projectTypePriority,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        projectTypeName: items?.projectTypeName,
        projectTypeDescription: items?.projectTypeDescription,
        projectTypePriority: items?.projectTypePriority,
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
    name: "projectTypeDescription",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      projectTypeName: value?.projectTypeName,
      projectTypeDescription: value?.projectTypeDescription,
      projectTypePriority: value?.projectTypePriority?.value,
    };
    if (!isUpdate) {
      dispatch(
        createProjectTypes({
          token,
          data: newData,
          isSuccess() {
            toast.dark("Project type has been created");
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
        updateProjectTypes({
          id: value?.id,
          token,
          data: newData,
          isSuccess() {
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

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Project Type
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your project type information.
          </p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectTypeName">
              Project Type Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="projectTypeName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("projectTypeName", {
                  required: {
                    value: true,
                    message: "Project type name is required.",
                  },
                })}
              />
            </div>
            {errors?.projectTypeName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.projectTypeName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label className="text-gray-500 font-semibold text-sm" htmlFor="">
              Priority
            </label>
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
                  instanceId="projectTypePriority"
                  isDisabled={false}
                  isMulti={false}
                  placeholder="Select Priority"
                  options={priorityOption}
                  icon=""
                />
              )}
              name="projectTypePriority"
              control={control}
            />
            {errors?.projectTypePriority && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.projectTypePriority.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectTypeDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="projectTypeDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("projectTypeDescription")}
              />
            </div>
            <div className={`w-full flex text-xs text-gray-5 justify-end`}>
              {descValue?.length || 0}/400 Characters
            </div>
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
    </Fragment>
  );
}
