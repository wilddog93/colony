import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import { MdCheck, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createIssueTypes,
  selectIssueType,
  updateIssueTypes,
} from "../../../../../redux/features/task-management/settings/issueTypeReducers";

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
  issueTypeCode?: string | any;
  issueTypeName?: string | any;
  issueTypeDescription?: string | any;
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

export default function IssueTypeForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, token, getData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectIssueType);

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
        issueTypeCode: items?.issueTypeCode,
        issueTypeName: items?.issueTypeName,
        issueTypeDescription: items?.issueTypeDescription,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        issueTypeCode: items?.issueTypeCode,
        issueTypeName: items?.issueTypeName,
        issueTypeDescription: items?.issueTypeDescription,
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
    name: "issueTypeDescription",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      issueTypeCode: value?.issueTypeCode,
      issueTypeName: value?.issueTypeName,
      issueTypeDescription: value?.issueTypeDescription,
    };
    if (!isUpdate) {
      dispatch(
        createIssueTypes({
          token,
          data: newData,
          isSuccess() {
            toast.dark("Issue type has been created");
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
        updateIssueTypes({
          id: value?.id,
          token,
          data: newData,
          isSuccess() {
            toast.dark("Issue type has been updated");
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
            {isUpdate ? "Edit" : "Add"} Issue Type
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your Issue type information.
          </p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="projectTypeName">
              Issue Type<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Code"
                autoFocus
                id="projectTypeName"
                className={`bg-white w-[25%] text-sm rounded-l-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("issueTypeCode")}
              />
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="projectTypeName"
                className={`bg-white w-[75%] text-sm rounded-r-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("issueTypeName", {
                  required: {
                    value: true,
                    message: "Issue type name is required.",
                  },
                })}
              />
            </div>
            {errors?.issueTypeName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.issueTypeName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="issueTypeDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="issueTypeDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("issueTypeDescription")}
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
