import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalHeader } from "../../../../Modal/ModalComponent";
import {
  MdAdd,
  MdCheck,
  MdDelete,
  MdHorizontalRule,
  MdWarning,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import DropdownSelect from "../../../../Dropdown/DropdownSelect";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import Modal from "../../../../Modal";
import {
  createLocation,
  selectLocationManagement,
  updateLocation,
} from "../../../../../redux/features/assets/locations/locationManagementReducers";
import {
  getTowers,
  selectTowerManagement,
} from "../../../../../redux/features/building-management/tower/towerReducers";
import {
  getFloors,
  selectFloorManagement,
} from "../../../../../redux/features/building-management/floor/floorReducers";
import {
  getUnits,
  selectUnitManagement,
} from "../../../../../redux/features/building-management/unit/unitReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";

type Props = {
  items?: any;
  token?: any;
  isOpen: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  getData: () => void;
  typesOpt?: OptionProps[] | any[];
  locationOpt?: OptionProps[] | any[];
};

type FormValues = {
  id?: any;
  locationName?: string | any;
  locationDescription?: string | any;
  locationType?: any;
  locationTo?: any;
  tower?: any;
  floor?: any;
  unit?: any;
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

export default function LocationForm({
  isOpen,
  isCloseModal,
  items,
  isUpdate,
  token,
  getData,
  typesOpt,
  locationOpt,
}: Props) {
  const url = process.env.API_ENDPOINT;
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  const [towerOpt, setTowerOpt] = useState<OptionProps[] | any[]>([]);
  const [floorOpt, setFloorOpt] = useState<OptionProps[] | any[]>([]);
  const [unitOpt, setUnitOpt] = useState<OptionProps[] | any[]>([]);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectLocationManagement);
  const { towers } = useAppSelector(selectTowerManagement);
  const { floors } = useAppSelector(selectFloorManagement);
  const { units } = useAppSelector(selectUnitManagement);

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
        locationName: items?.locationName,
        locationDescription: items?.locationDescription,
        locationType: items?.locationType,
        locationTo: items?.locationTo,
        tower: items?.tower,
        floor: items?.floor,
        unit: items?.unit,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (isOpen && items) {
      reset({
        id: items?.id,
        locationName: items?.locationName,
        locationDescription: items?.locationDescription,
        locationType: items?.locationType,
        locationTo: items?.locationTo,
        tower: items?.tower,
        floor: items?.floor,
        unit: items?.unit,
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
    name: "locationDescription",
    control,
  });

  const locationToValue = useWatch({
    name: "locationTo",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    let newData: FormValues = {
      locationName: value?.locationName,
      locationDescription: value?.locationDescription,
      locationType: value?.locationType?.value,
      tower: value?.tower?.id || null,
      floor: value?.floor?.id || null,
      unit: value?.unit?.id || null,
    };

    if (!isUpdate) {
      dispatch(
        createLocation({
          token,
          data: newData,
          isSuccess: () => {
            toast.dark("Location has been created");
            getData();
            isCloseModal();
          },
          isError: () => {
            console.log("error-create-location");
          },
        })
      );
    } else {
      dispatch(
        updateLocation({
          token,
          id: value?.id,
          data: newData,
          isSuccess: () => {
            toast.dark("Product has been updated");
            getData();
            isCloseModal();
          },
          isError: () => {
            console.log("error-update-location");
          },
        })
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset({
        id: null,
        locationName: null,
        locationDescription: null,
        locationType: null,
        locationTo: null,
        tower: null,
        floor: null,
        unit: null,
      });
    }
  }, [!isOpen]);

  useEffect(() => {
    if (watchChange?.name === "locationTo" && watchChange?.type == "change") {
      setValue("tower", null);
      setValue("floor", null);
      setValue("unit", null);
    }
  }, [watchChange]);

  // get tower, floor unit data options
  const filterTower = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `towerName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  const filterFloor = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `floorName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  const filterUnit = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `unitName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (!locationToValue) {
      return;
    }
    if (locationToValue?.value == "Tower") {
      dispatch(getTowers({ token, params: filterTower?.queryObject }));
    }
    if (locationToValue?.value == "Floor") {
      dispatch(getFloors({ token, params: filterFloor?.queryObject }));
    }
    if (locationToValue?.value == "Unit") {
      dispatch(getUnits({ token, params: filterUnit?.queryObject }));
    }
  }, [locationToValue]);

  useEffect(() => {
    let newArr: OptionProps[] = [];
    const { data } = towers;
    if (locationToValue?.value == "Tower" && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.towerName,
          label: item?.towerName,
        });
      });
    }
    setTowerOpt(newArr);
  }, [towers, locationToValue]);

  useEffect(() => {
    let newArr: OptionProps[] = [];
    const { data } = floors;
    if (locationToValue?.value == "Floor" && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.floorName,
          label: item?.floorName,
        });
      });
    }
    setFloorOpt(newArr);
  }, [floors, locationToValue]);

  useEffect(() => {
    let newArr: OptionProps[] = [];
    const { data } = units;
    if (locationToValue?.value == "Unit" && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.unitName,
          label: item?.unitName,
        });
      });
    }
    setUnitOpt(newArr);
  }, [units, locationToValue]);
  // end get tower, floor unit data options

  return (
    <Modal size={"small"} onClose={isCloseModal} isOpen={isOpen}>
      <Fragment>
        <ModalHeader
          onClick={isCloseModal}
          isClose={true}
          className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
          <div className="w-full flex flex-col gap-1 px-2">
            <h3 className="text-lg font-semibold">
              {isUpdate ? "Edit" : "Add"} Location
            </h3>
            <p className="text-gray-5 text-sm">
              Fill your location information.
            </p>
          </div>
        </ModalHeader>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2 py-2">
            <div className="w-full px-4">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="locationName">
                Location Name<span className="text-primary">*</span>
              </label>
              <div className="w-full flex">
                <input
                  type="text"
                  placeholder="Name"
                  autoFocus
                  id="locationName"
                  className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                  {...register("locationName", {
                    required: {
                      value: true,
                      message: "Location name is required.",
                    },
                  })}
                />
              </div>
              {errors?.locationName && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.locationName.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full px-4">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="locationDescription">
                Description
              </label>
              <div className="w-full">
                <textarea
                  rows={3}
                  cols={5}
                  maxLength={400}
                  placeholder="Description"
                  id="locationDescription"
                  autoFocus
                  className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                  {...register("locationDescription")}
                />
              </div>
              <div className={`w-full flex text-xs text-gray-5 justify-end`}>
                {descValue?.length || 0}/400 Characters
              </div>
            </div>

            <div className="w-full px-4">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="locationType">
                Type<span className="text-primary">*</span>
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
                      instanceId="locationType"
                      isDisabled
                      isMulti={false}
                      placeholder="Type"
                      options={typesOpt}
                      icon=""
                    />
                  )}
                  name="locationType"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Location type is required.",
                    },
                  }}
                />
              </div>
              {errors?.locationType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.locationType.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full px-4">
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="locationTo">
                Location to :
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
                      instanceId="locationTo"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="location to.."
                      options={locationOpt}
                      icon=""
                    />
                  )}
                  name="locationTo"
                  control={control}
                />
              </div>
              {errors?.locationTo && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.locationTo.message as any}
                  </span>
                </div>
              )}
            </div>

            <div
              className={`w-full px-4 ${
                !locationToValue || locationToValue?.value !== "Tower"
                  ? "hidden"
                  : ""
              }`}>
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="tower">
                Tower
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
                      instanceId="tower"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Tower"
                      options={towerOpt}
                      icon=""
                    />
                  )}
                  name="tower"
                  control={control}
                />
              </div>
              {errors?.tower && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.tower.message as any}
                  </span>
                </div>
              )}
            </div>

            <div
              className={`w-full px-4 ${
                !locationToValue || locationToValue?.value !== "Floor"
                  ? "hidden"
                  : ""
              }`}>
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="floor">
                Floor
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
                      instanceId="floor"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Floor"
                      options={floorOpt}
                      icon=""
                    />
                  )}
                  name="floor"
                  control={control}
                />
              </div>
              {errors?.floor && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.floor.message as any}
                  </span>
                </div>
              )}
            </div>

            <div
              className={`w-full px-4 ${
                !locationToValue || locationToValue?.value !== "Unit"
                  ? "hidden"
                  : ""
              }`}>
              <label
                className="text-gray-500 font-semibold text-sm"
                htmlFor="unit">
                Unit
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
                      instanceId="unit"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Unit"
                      options={unitOpt}
                      icon=""
                    />
                  )}
                  name="unit"
                  control={control}
                />
              </div>
              {errors?.unit && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors.unit.message as any}
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
      </Fragment>
    </Modal>
  );
}
