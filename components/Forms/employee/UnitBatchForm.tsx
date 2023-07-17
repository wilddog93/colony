import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalFooter, ModalHeader } from "../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdClose,
  MdMinimize,
  MdOutlinePlace,
  MdRemove,
  MdWarning,
} from "react-icons/md";
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
};

type floorProps = {
  id?: any;
  floorName?: string | any;
  tower?: any;
  floorType?: any;
  startAt?: number | any;
  length?: number | any;
  addText?: string | any;
  addTextPosition?: any;
  floorOrder?: any;
};

type FormValues = {
  id?: any;
  floor?: floorProps | any;
  unitName?: string | any;
  unitNameType?: any;
  unitType?: any;
  unitDescription?: string | any;
  unitSize?: number | string | any;
  amenity?: any | any[];
  startAt?: number | any;
  length?: number | any;
  addText?: string | any;
  addTextPosition?: any;
  unitOrder?: any;
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

const unitNameType: Options[] = [
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
    value: "By ID Unit",
    label: "By ID Unit",
  },
];

export default function UnitBatchForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, filters, token } = props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  const [amenities, setAmenities] = useState<any>({});
  const [totalAdd, setTotalAdd] = useState<number | string>(0);

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
        floor: items?.floor,
        unitName: items?.unitName,
        unitNameType: items?.unitnameType,
        unitType: items?.unitType,
        unitDescription: items?.unitDescription,
        unitSize: items?.unitSize,
        amenity: items?.amenity,
        startAt: items?.startAt,
        length: items?.length,
        addText: items?.addText,
        addTextPosition: items?.addTextPosition,
        unitOrder: { value: "Automatic", label: "Automatic" },
        isBulk: false,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        floor: items?.floor,
        unitName: items?.unitName,
        unitNameType: items?.unitnameType,
        unitType: items?.unitType,
        unitDescription: items?.unitDescription,
        unitSize: items?.unitSize,
        amenity: items?.amenity,
        startAt: items?.startAt,
        length: items?.length,
        addText: items?.addText,
        addTextPosition: items?.addTextPosition,
        unitOrder: items?.floorOrder,
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
  };

  useEffect(() => {
    if (isChecked) {
      register("length", {
        required: {
          value: true,
          message: "Total unit is required.",
        },
      });

      register("addTextPosition");

      register("startAt", {
        required: {
          value: true,
          message: "Start At is required.",
        },
      });

      register("unitType");

      register("addText");

      // floorname unregister
      unregister("unitName");
    } else {
      unregister("length");
      unregister("addTextPosition");
      unregister("startAt");
      unregister("unitType");
      unregister("addText");
    }
  }, [register, unregister, isChecked]);

  console.log(watchValue, "result");

  useEffect(() => {
    if (watchChange?.name === "isBulk" && !isUpdate) {
      reset({
        id: items?.id,
        floor: items?.floor,
        unitName: null,
        unitNameType: null,
        unitType: null,
        unitDescription: null,
        unitSize: 0,
        amenity: null,
        startAt: 0,
        length: 0,
        addText: null,
        addTextPosition: null,
        unitOrder: { value: "Automatic", label: "Automatic" },
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
            {isUpdate ? "Edit" : "Add"} Unit
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
        <div
          className={`w-full flex px-4 bg-gray divide-x divide-gray-4 shadow-2 ${
            isChecked ? "" : "hidden"
          }`}>
          <div className="w-full lg:1/2 flex gap-2 py-2 px-4">
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
                    options={unitNameType}
                    icon=""
                  />
                )}
                name="unitNameType"
                control={control}
              />
              {errors?.unitNameType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unitNameType.message as any}
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

          <div className="w-full lg:1/2 flex gap-2 py-2 px-4">
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

        <div className="w-full flex px-4 divide-x divide-gray-4 shadow-2">
          <div className="w-full lg:w-1/2 px-4 py-2 gap-2">
            <div className="w-full mb-3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Unit Order <span className="text-primary">*</span>
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
                    placeholder="Unit Order"
                    options={orderOption}
                    icon=""
                  />
                )}
                name="unitOrder"
                control={control}
              />
              {errors?.unitOrder && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unitOrder.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mb-3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Unit Type <span className="text-primary">*</span>
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
                    placeholder="Unit Type"
                    options={orderOption}
                    icon=""
                  />
                )}
                name="unitType"
                control={control}
              />
              {errors?.unitType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unitType.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mb-3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Unit Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="Unit Name"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary  disabled:bg-gray-3`}
                {...register("unitName")}
                disabled={isChecked ? true : false}
              />
              {errors?.unitName && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unitName.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col mb-3">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Unit Size <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                placeholder="Unit Size"
                autoFocus
                className={`bg-white w-1/2 text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary  disabled:bg-transparent`}
                {...register("unitSize")}
              />
              {errors?.unitSize && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unitSize.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4 py-2 gap-2 divide-y divide-gray-4">
            <div className="w-full mb-5">
              <label className="text-gray-500 font-semibold text-sm" htmlFor="">
                Amenity <span className="text-primary">*</span>
              </label>
              <div className="w-full flex gap-1">
                <div className="w-2/4">
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
                        placeholder="-Amenity-"
                        options={orderOption}
                        icon=""
                      />
                    )}
                    name="unitType"
                    control={control}
                  />
                  {errors?.unitType && (
                    <div className="mt-1 text-xs flex items-center text-red-300">
                      <MdWarning className="w-4 h-4 mr-1" />
                      <span className="text-red-300">
                        {errors.unitType.message as any}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-[30%]">
                  <div className="w-full flex">
                    <input
                      type="number"
                      placeholder="00"
                      autoFocus
                      className={`w-full bg-white text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary  disabled:bg-transparent`}
                      value={totalAdd || 0}
                      onChange={({ target }) =>
                        setTotalAdd(Number(target?.value))
                      }
                    />
                  </div>
                </div>

                <div className="w-[20%]">
                  <Button
                    type="button"
                    onClick={() => console.log("add amenity")}
                    variant="primary"
                    className="w-full h-full rounded-lg py-1 px-1 border-primary">
                    <MdAdd className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full py-4 flex flex-col gap-2">
              <div className="w-full bg-gray-2 divide-x-2 divide-gray-4 flex items-center gap-2 border-2 border-gray-4 shadow-card rounded-lg text-gray-5 font-semibold">
                <div className="w-[15%] flex p-2">
                  <span className="m-auto">2x</span>
                </div>
                <div className="w-[70%] p-2">
                  <h3>Lorem ipsum dolor</h3>
                </div>
                <div className="w-[15%] flex h-full p-2">
                  <button className="py-[0.01rem] px-0.5 bg-gray rounded-lg shadow-card border border-gray">
                    <MdRemove className="w-5 h-5 m-auto" />
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-2 divide-x-2 divide-gray-4 flex items-center gap-2 border-2 border-gray-4 shadow-card rounded-lg text-gray-5 font-semibold">
                <div className="w-[15%] flex p-2">
                  <span className="m-auto">2x</span>
                </div>
                <div className="w-[70%] p-2">
                  <h3>Lorem ipsum dolor</h3>
                </div>
                <div className="w-[15%] flex h-full p-2">
                  <button className="py-[0.01rem] px-0.5 bg-gray rounded-lg shadow-card border border-gray">
                    <MdRemove className="w-5 h-5 m-auto" />
                  </button>
                </div>
              </div>
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
