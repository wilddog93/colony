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
import {
  createAmenities,
  selectAmenityManagement,
  updateAmenities,
} from "../../../redux/features/building-management/amenity/amenityReducers";

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
  amenityCode?: string | any;
  amenityName?: string | any;
  amenityDescription?: string | any;
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

export default function AmenityForm(props: Props) {
  const { isOpen, isCloseModal, items, isUpdate, filters, token, getData } =
    props;

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // checked
  // const [isChecked, setIsChecked] = useState(false);
  // let refChecked = useRef<HTMLInputElement>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectAmenityManagement);

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
        amenityCode: items?.amenityCode,
        amenityName: items?.amenityName,
        amenityDescription: items?.amenityDescription,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        amenityCode: items?.amenityCode,
        amenityName: items?.amenityName,
        amenityDescription: items?.amenityDescription,
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
    name: "amenityDescription",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: FormValues = {
      amenityCode: value?.amenityCode,
      amenityName: value?.amenityName,
      amenityDescription: value?.amenityDescription,
    };
    if (!isUpdate) {
      dispatch(
        createAmenities({
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
      dispatch(
        updateAmenities({
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
            {isUpdate ? "Edit" : "Add"} Amenity
          </h3>
          <p className="text-gray-5 text-sm">Fill your amenity information.</p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="amenityName">
              Amenity Name <span className="text-primary">*</span>
            </label>
            <div className="w-full flex">
              <input
                type="text"
                placeholder="Code"
                autoFocus
                className={`bg-white w-[25%] text-sm rounded-l-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("amenityCode")}
              />
              <input
                type="text"
                placeholder="Name"
                autoFocus
                id="amenityName"
                className={`bg-white w-[75%] text-sm rounded-r-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("amenityName", {
                  required: {
                    value: true,
                    message: "Amenity name is required.",
                  },
                })}
              />
            </div>
            {errors?.amenityName && (
              <div className="mt-1 text-xs flex items-center text-red-300">
                <MdWarning className="w-4 h-4 mr-1" />
                <span className="text-red-300">
                  {errors.amenityName.message as any}
                </span>
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="amenityDescription">
              Description
            </label>
            <div className="w-full">
              <textarea
                rows={3}
                cols={5}
                maxLength={400}
                placeholder="Description"
                id="amenityDescription"
                autoFocus
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("amenityDescription")}
              />
            </div>
            <div className={`text-sm text-gray-5`}>
              {descValue?.length || 0}/400
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
