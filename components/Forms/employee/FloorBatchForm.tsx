import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalFooter, ModalHeader } from "../../Modal/ModalComponent";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  createTowers,
  getTowers,
  selectTowerManagement,
  updateTowers,
} from "../../../redux/features/building-management/tower/towerReducers";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../Button/Button";
import { tokenToString } from "typescript";
import Link from "next/link";
import { FaCircleNotch } from "react-icons/fa";
import {
  createFloorBatch,
  createFloors,
  selectFloorManagement,
  updateFloors,
} from "../../../redux/features/building-management/floor/floorReducers";
import DropdownSelect from "../../Dropdown/DropdownSelect";

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  filters?: any;
  getData: () => void;
};

type FormValues = {
  id?: any;
  floorName?: string | any;
  tower?: any;
  floorType?: any;
  startAt?: number | any;
  length?: number | any;
  addText?: string | any;
  addTextPosition?: any;
  floorOrder?: any;
  isBulk?: boolean;
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

const floorTypeOpt: Options[] = [
  {
    value: 1,
    label: "01",
  },
  {
    value: 2,
    label: "02",
  },
  {
    value: 3,
    label: "03",
  },
];

const positionOption: Options[] = [
  {
    value: "Before",
    label: "Before",
  },
  {
    value: "After",
    label: "After",
  },
];

const orderOption: Options[] = [
  {
    value: "Automatic",
    label: "Automatic",
  },
  {
    value: "Manual",
    label: "Manual",
  },
  {
    value: "By ID Floor",
    label: "By ID Floor",
  },
];

export default function FloorBatchForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, filters, token, getData } =
    props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { floors, floor, pending, error, message } = useAppSelector(
    selectFloorManagement
  );

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
        tower: items?.tower,
        floorType: items?.floorType,
        startAt: items?.startAt,
        length: items?.length,
        addText: items?.addText,
        addTextPosition: items?.addTextPosition,
        floorName: items?.floorName,
        floorOrder: { value: "Automatic", label: "Automatic" },
        isBulk: false,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        tower: items?.tower,
        floorType: items?.floorType,
        startAt: items?.startAt,
        length: items?.length,
        addText: items?.addText,
        addTextPosition: items?.addTextPosition,
        floorName: items?.floorName,
        floorOrder: items?.floorOrder,
        isBulk: items?.isBulk,
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

  const isChecked = useWatch({
    name: "isBulk",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      floorOrder: value?.floorOrder?.value,
      tower: value?.tower?.id,
    };
    if (isUpdate) {
      newData = {
        floorName: value?.floorName,
        tower: value?.tower?.id,
      };
      dispatch(
        updateFloors({
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
    } else {
      if (!isChecked) {
        newData = {
          ...newData,
          floorName: value?.floorName,
        };
        dispatch(
          createFloors({
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
      } else {
        newData = {
          ...newData,
          addTextPosition: value?.addTextPosition?.value,
          addText: value?.addText,
          floorType: value?.floorType?.value,
          startAt: Number(value?.startAt),
          length: Number(value?.length),
        };
        dispatch(
          createFloorBatch({
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
    }
  };

  useEffect(() => {
    if (isChecked) {
      register("length", {
        required: {
          value: true,
          message: "Total floor is required.",
        },
      });

      register("addTextPosition");

      register("startAt", {
        required: {
          value: true,
          message: "Start At is required.",
        },
      });

      register("floorType");

      register("addText");

      // floorname unregister
      unregister("floorName");
    } else {
      unregister("length");
      unregister("addTextPosition");
      unregister("startAt");
      unregister("floorType");
      unregister("addText");
    }
  }, [register, unregister, isChecked]);

  useEffect(() => {
    if (watchChange?.name === "isBulk" && !isUpdate) {
      reset({
        id: items?.id,
        tower: items?.tower,
        floorType: undefined,
        startAt: null,
        length: null,
        addText: null,
        addTextPosition: undefined,
        floorName: null,
        floorOrder: { value: "Automatic", label: "Automatic" },
      });
    }
  }, [watchChange, items, isUpdate]);

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex gap-2 items-center justify-between px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Floor
          </h3>
          <div
            className={`flex items-center gap-1 ${isUpdate ? "hidden" : ""}`}>
            <label className="switch">
              <input type="checkbox" {...register("isBulk")} />
              <div className="slider">
                <div className="circle">
                  <MdClose className="cross" />
                  <MdCheck className="checkmark" />
                </div>
              </div>
            </label>
            <span className="font-semibold">Bulk Add</span>
          </div>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4 bg-gray ${isChecked ? "" : "hidden"}`}>
          <div className="w-full mb-3 flex gap-2">
            <div className="w-2/3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Select Format
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
                    instanceId="state"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Select Format"
                    options={floorTypeOpt}
                    icon=""
                  />
                )}
                name="floorType"
                control={control}
              />
              {errors?.floorType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.floorType.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-1/3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Start At <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                placeholder="Start At"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("startAt")}
              />
              {errors?.startAt && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.startAt.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-3 flex gap-2">
            <div className="w-1/3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Type
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
                    instanceId="state"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Type"
                    options={positionOption}
                    icon=""
                  />
                )}
                name="addTextPosition"
                control={control}
                // rules={{
                //   required: {
                //     value: true,
                //     message: "Position format is required.",
                //   },
                // }}
              />
              {errors?.addTextPosition && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.addTextPosition.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-2/3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Add Text
              </label>
              <input
                type="text"
                placeholder="Add Text"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("addText")}
              />
              {errors?.addText && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.addText.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full p-4">
          <div className="w-full mb-3 flex gap-2">
            <div className={`${isChecked ? "w-1/2" : "w-full"}`}>
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Floor Order <span className="text-primary">*</span>
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
                    instanceId="state"
                    isDisabled={isChecked == undefined ? false : isChecked}
                    isMulti={false}
                    placeholder="Floor Order"
                    options={orderOption}
                    icon=""
                  />
                )}
                name="floorOrder"
                control={control}
                // rules={{
                //   required: {
                //     value: true,
                //     message: "Floor order is required.",
                //   },
                // }}
              />
              {errors?.floorOrder && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.floorOrder.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className={`${isChecked ? "w-1/2" : "hidden"}`}>
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Total Floor <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                placeholder="Total"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("length")}
              />
              {errors?.length && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.length.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={`w-full mb-3 ${isChecked ? "hidden" : ""}`}>
            <label className="text-gray-500 font-semibold text-sm" htmlFor="">
              Floor Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Floor Name"
              autoFocus
              className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
              {...register("floorName")}
            />
            {errors?.floorName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.floorName.message as any}
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
    </Fragment>
  );
}
