import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import { MdCheck, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createTaskCategory,
  selectTaskCategory,
  updateTaskCategory,
} from "../../../../../redux/features/task-management/settings/taskCategoryReducers";

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
  taskCategoryName?: string | any;
  taskCategoryDescription?: string | any;
  taskCategoryFillColor?: string | any;
  taskCategoryTextColor?: string | any;
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

export default function TaskCategoryForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, token, getData } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  const [fillColor, setFillColor] = useState<string | any>("#5F59F7");
  const [textColor, setTextColor] = useState<string | any>("#FFFFFF");

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectTaskCategory);

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
        taskCategoryName: items?.taskCategoryName,
        taskCategoryDescription: items?.taskCategoryDescription,
        taskCategoryFillColor: items?.taskCategoryFillColor,
        taskCategoryTextColor: items?.taskCategoryTextColor,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        taskCategoryName: items?.taskCategoryName,
        taskCategoryDescription: items?.taskCategoryDescription,
        taskCategoryFillColor: items?.taskCategoryFillColor,
        taskCategoryTextColor: items?.taskCategoryTextColor,
      });
      setFillColor(items?.taskCategoryFillColor || "#5F59F7");
      setTextColor(items?.taskCategoryTextColor || "#FFFFFF");
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
    name: "taskCategoryDescription",
    control,
  });

  const fillColorValue = useWatch({
    name: "taskCategoryFillColor",
    control,
  });

  const textColorValue = useWatch({
    name: "taskCategoryTextColor",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      taskCategoryFillColor: value?.taskCategoryFillColor,
      taskCategoryTextColor: value?.taskCategoryTextColor,
      taskCategoryName: value?.taskCategoryName,
      taskCategoryDescription: value?.taskCategoryDescription,
    };
    if (!isUpdate) {
      dispatch(
        createTaskCategory({
          token,
          data: newData,
          isSuccess() {
            toast.dark("Task category has been created");
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
        updateTaskCategory({
          id: value?.id,
          token,
          data: newData,
          isSuccess() {
            toast.dark("Task category has been updated");
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

  console.log(fillColorValue, "bg-color");

  const ColorPreview = (props: any) => {
    const { textColor, fillColor } = props;
    return (
      <div
        className="text-center py-1 px-2 rounded text-sm"
        style={{ backgroundColor: fillColor, color: textColor }}>
        Repairments
      </div>
    );
  };

  useEffect(() => {
    setValue("taskCategoryFillColor", fillColor);
    setValue("taskCategoryTextColor", textColor);
  }, [fillColor, textColor]);

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Task Category
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your task category information.
          </p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="taskCategoryName">
              Task Category Name<span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="taskCategoryName"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("taskCategoryName", {
                  required: {
                    value: true,
                    message: "Task category name is required.",
                  },
                })}
              />
            </div>
            {errors?.taskCategoryName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.taskCategoryName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="mb-3 w-full flex gap-3 text-sm">
            <div className="flex flex-col w-1/2 gap-2">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="taskTagTextColor">
                Fill Color
              </label>
              <div className="w-full flex items-center">
                <div className="flex items-center justify-center w-[25%] h-10 rounded-l-lg border border-l-lg border-stroke bg-transparent px-2 py-1 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent">
                  <input
                    type="color"
                    className={`w-6 h-6`}
                    value={fillColor || ""}
                    onChange={(e) =>
                      setFillColor(e?.target.value?.toUpperCase())
                    }
                  />
                </div>
                <input
                  type="text"
                  className="bg-white w-[75%] h-10 text-sm rounded-r-lg border border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent"
                  value={fillColor || ""}
                  onChange={(e) => setFillColor(e?.target.value?.toUpperCase())}
                  placeholder="#CED4DA"
                />
              </div>
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="taskCategoryTextColor">
                Text Color
              </label>
              <div className="w-full flex items-center">
                <div className="flex items-center justify-center w-[25%] h-10 rounded-l-lg border border-l-lg border-stroke bg-transparent px-2 py-1 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent">
                  <input
                    type="color"
                    className={`w-6 h-6`}
                    value={textColor || ""}
                    onChange={(e) =>
                      setTextColor(e?.target.value?.toUpperCase())
                    }
                  />
                </div>
                <input
                  type="text"
                  className="bg-white w-[75%] h-10 text-sm rounded-r-lg border border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent"
                  value={textColor || ""}
                  onChange={(e) => setTextColor(e?.target.value?.toUpperCase())}
                  placeholder="#CED4DA"
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="taskCategoryDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="taskCategoryDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("taskCategoryDescription")}
              />
            </div>
            <div className={`w-full flex text-xs text-gray-5 justify-end`}>
              {descValue?.length || 0}/400 Characters
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center gap-2">
            <label className="text-sm text-gray-5" htmlFor="taskTagDescription">
              Preview
            </label>
            <div className="w-full max-w-max">
              <ColorPreview
                textColor={textColorValue}
                fillColor={fillColorValue}
              />
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
