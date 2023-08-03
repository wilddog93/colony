import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  createUnitBatch,
  createUnits,
  getUnits,
  selectUnitManagement,
  updateUnits,
} from "../../../redux/features/building-management/unit/unitReducers";
import {
  getUnitTypes,
  selectUnitTypeManagement,
} from "../../../redux/features/building-management/unitType/unitTypeReducers";
import {
  getAmenities,
  selectAmenityManagement,
} from "../../../redux/features/building-management/amenity/amenityReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

type OptionProps = {
  value: string | null;
  label: React.ReactNode;
};

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  amenityOpt?: OptionProps[] | any[];
  unitTypeOpt?: OptionProps[] | any[];
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

export default function UnitBatchForm({
  isOpen,
  isCloseModal,
  items,
  isUpdate,
  token,
  getData,
  amenityOpt,
  unitTypeOpt,
}: Props) {
  const router = useRouter();
  const { pathname, query } = router;
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // all amenity
  const [amenity, setAmenity] = useState<any | null>(null);
  const [dataAmenity, setDataAmenity] = useState<any[]>([]);
  const [totalAmenity, setTotalAmenity] = useState<number | string>(0);

  // redux
  const dispatch = useAppDispatch();
  const { units, unit, pending, error, message } =
    useAppSelector(selectUnitManagement);
  const { unitTypes } = useAppSelector(selectUnitTypeManagement);
  const { amenities } = useAppSelector(selectAmenityManagement);

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
      setDataAmenity(items?.amenity);
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

  // description
  const descriptionValue = useWatch({
    name: "unitDescription",
    control,
  });

  // all function amenity-start
  const amenityValue = useWatch({
    name: "amenity",
    control,
  });

  const onAddAmenity = ({ amenity, total }: any) => {
    console.log({ amenity, totalAmenity }, "add amenity");
    if (!amenity?.id || !totalAmenity) {
      toast.dark("Please input your amenities!");
      return;
    } else {
      let newObj = {
        ...amenity,
        totalAmenity,
      };

      let newArr: any[] = dataAmenity;

      const productArr = () => {
        if (newArr?.length === 0) {
          return [newObj];
        } else {
          if (newArr.some((obj) => obj.id == amenity?.id)) {
            return newArr.map((items) => ({
              ...items,
              id: items?.id,
              totalAmenity:
                items?.id == amenity?.id
                  ? items?.totalAmenity + totalAmenity
                  : items?.totalAmenity,
            }));
          } else {
            return [...newArr, newObj];
          }
        }
      };
      setDataAmenity(productArr());
      setAmenity(null);
      setTotalAmenity(0);
    }
  };

  const onDeleteAmenity = (id: any) => {
    setDataAmenity((item) => item.filter((e, i) => e?.id !== id));
  };

  useEffect(() => {
    if (dataAmenity?.length > 0) {
      setValue("amenity", dataAmenity);
      clearErrors("amenity");
    } else {
      setValue("amenity", []);
    }
  }, [dataAmenity]);
  // all function amenity-end

  // submit

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      floor: value?.floor?.id,
    };
    if (isUpdate) {
      console.log("this is update");
      newData = {
        unitName: value?.unitName,
        floor: value?.floor?.id,
        unitType: value?.unitType?.id,
        unitDescription: value?.unitDescription,
        unitSize: value?.unitSize ? Number(value?.unitSize) : 0,
        amenity:
          value?.amenity?.length > 0
            ? value?.amenity?.map((e: any) => ({
                id: e.id,
                totalAmenity: e.totalAmenity,
              }))
            : [],
        unitOrder: value?.unitOrder?.value,
      };
      dispatch(
        updateUnits({
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
      console.log("this is create", newData);
      if (!isChecked) {
        newData = {
          ...newData,
          unitName: value?.unitName,
          unitType: value?.unitType?.id,
          unitDescription: value?.unitDescription,
          unitSize: value?.unitSize ? Number(value?.unitSize) : 0,
          amenity:
            value?.amenity?.length > 0
              ? value?.amenity?.map((e: any) => ({
                  id: e.id,
                  totalAmenity: e.totalAmenity,
                }))
              : [],
          unitOrder: value?.unitOrder?.value,
        };
        dispatch(
          createUnits({
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
          unitType: value?.unitType?.value,
          startAt: Number(value?.startAt),
          length: Number(value?.length),
        };
        dispatch(
          createUnitBatch({
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

  console.log("result unit-type : ", unitTypes);

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
            <label htmlFor="check" className="switch">
              <input id="check" type="checkbox" {...register("isBulk")} />
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitNameType">
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
                    instanceId="unitNameType"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="startAt">
                Start At <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                placeholder="Start At"
                autoFocus
                id="startAt"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="addTextPosition">
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
                    instanceId="addTextPosition"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="addText">
                Add Text
              </label>
              <input
                type="text"
                placeholder="Add Text"
                autoFocus
                id="addText"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitOrder">
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
                    instanceId="unitOrder"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitType">
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
                    instanceId="unitType"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Unit Type"
                    options={unitTypeOpt}
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitName">
                Unit Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="Unit Name"
                autoFocus
                id="unitName"
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

            <div className="w-full mb-3">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitDescription">
                Unit Description
              </label>
              <textarea
                placeholder="Unit Description"
                maxLength={400}
                id="unitDescription"
                rows={3}
                cols={5}
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary  disabled:bg-gray-3`}
                {...register("unitDescription")}
              />
              <div className="w-full flex justify-end text-sm text-gray-5">
                {descriptionValue?.length || 0}/400
              </div>
            </div>

            <div className="w-full flex flex-col mb-3">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unitSize">
                Unit Size <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                placeholder="Unit Size"
                autoFocus
                id="unitSize"
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
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="amenity">
                Amenity <span className="text-primary">*</span>
              </label>
              <div className="w-full flex gap-1">
                <div className="w-2/4">
                  <DropdownSelect
                    customStyles={stylesSelect}
                    value={amenity}
                    onChange={setAmenity}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel={""}
                    instanceId="amenity"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="-Amenity-"
                    options={amenityOpt}
                    icon=""
                  />
                </div>

                <div className="w-[30%]">
                  <div className="w-full flex">
                    <input
                      type="number"
                      placeholder="00"
                      autoFocus
                      className={`w-full bg-white text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary  disabled:bg-transparent`}
                      value={totalAmenity || 0}
                      onChange={({ target }) =>
                        setTotalAmenity(Number(target.value))
                      }
                    />
                  </div>
                </div>

                <div className="w-[20%]">
                  <Button
                    type="button"
                    onClick={() => onAddAmenity({ amenity, totalAmenity })}
                    variant="primary"
                    className="w-full h-full rounded-lg py-1 px-1 border-primary"
                    disabled={!amenity?.id || !totalAmenity}>
                    <MdAdd className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full py-4 flex flex-col gap-2">
              {dataAmenity?.length > 0 ? (
                dataAmenity?.map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      className="w-full bg-gray-2 divide-x-2 divide-gray-4 flex items-center gap-2 border-2 border-gray-4 shadow-card rounded-lg text-gray-5 font-semibold">
                      <div className="w-[15%] flex p-2">
                        <span className="m-auto">{item?.totalAmenity}x</span>
                      </div>
                      <div className="w-[70%] p-2">
                        <h3>{item?.amenityName}</h3>
                      </div>
                      <div className="w-[15%] flex h-full p-2">
                        <button
                          type="button"
                          onClick={() => onDeleteAmenity(item?.id)}
                          className="py-[0.01rem] px-0.5 bg-gray rounded-lg shadow-card border border-gray">
                          <MdRemove className="w-5 h-5 m-auto" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full ">
                  <span className="text-gray-5 text-sm">
                    You do not have any data amenity!
                  </span>
                </div>
              )}

              {errors?.amenity && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.amenity.message as any}
                  </span>
                </div>
              )}
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
