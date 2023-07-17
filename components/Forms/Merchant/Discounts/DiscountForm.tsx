import DropdownSelect from "../../../Dropdown/DropdownSelect";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { MdWarning } from "react-icons/md";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ModalFooter } from "../../../Modal/ModalComponent";
import { SubmitHandler } from "react-hook-form";
import Button from "../../../Button/Button";
import TimeInput from "../../../merchant/form/TimeInput";
import { MdOutlineEditCalendar } from "react-icons/md";
import DateInput from "../../../merchant/form/DateInput";

type Props = {
  items?: any;
  isOpen?: boolean;
  onClose: () => void;
  token?: any;
  filters?: any;
};

type FormValues = {
  id?: any;
  itemName?: string | any;
  itemType?: any;
  itemCode?: any;
  itemSubCategory?: any;
  itemDescription?: any | string;
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
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
    return {
      ...provided,
      background: "",
      padding: "0",
      paddingTop: ".335rem",
      paddingBottom: ".335rem",
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 38,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const DiscountForm = ({ items, isOpen, onClose, token, filters }: Props) => {
  const [itemTypeOption, setItemTypeOption] = useState<Options[]>([]);
  const [itemSubCategoryOption, setItemSubCategoryOption] = useState<Options[]>(
    []
  );

  const {
    register,
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
        id: null,
        itemName: null,
        itemType: null,
        itemDescription: null,
      }),
      []
    ),
  });

  const descriptionValue = useWatch({
    name: "itemDescription",
    control,
  });

  return (
    <form className="w-full p-4 text-sm">
      <div className="w-full flex flex-col lg:flex-row">
        {/* sisi kiri */}
        <div className="w-full lg:w-1/2 p-2">
          {/* Discount ID */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Discount ID
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Discount ID"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          {/* Item Name */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Discount Name
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Discount Name"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          {/* Discount Type */}
          <div className="w-full mb-3">
            <label
              htmlFor="itemType"
              className="mb-2.5 block font-medium text-black dark:text-white">
              Discount Type
            </label>
            <div className="relative">
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
                    formatOptionLabel=""
                    instanceId="itemType"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Discount Type..."
                    options={itemTypeOption}
                    icon=""
                  />
                )}
                name={`itemType`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Type is required.",
                  },
                }}
              />
              {errors?.itemType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.itemType?.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* border abu */}
        <div className="border-0 lg:border-r-[2px] lg:mx-2 border-gray"></div>
        {/* sisi kanan */}
        <div className="w-full lg:w-1/2 p-2">
          {/* Items */}
          <div className="w-full mb-3">
            <label
              htmlFor="itemSubCategory"
              className="mb-2.5 block font-medium text-black dark:text-white">
              Items
            </label>
            <div className="relative">
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
                    formatOptionLabel=""
                    instanceId="itemSubCategory"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Select Items..."
                    options={itemSubCategoryOption}
                    icon=""
                  />
                )}
                name={`itemSubCategory`}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Sub Category is required.",
                  },
                }}
              />
              {errors?.itemType && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.itemType?.message as any}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Description */}
          <div className="w-full mb-3">
            <label
              htmlFor=""
              className="mb-2.5 block font-medium text-black dark:text-white">
              Description
            </label>
            <div className="relative">
              <textarea
                cols={0.5}
                rows={5}
                maxLength={400}
                autoFocus
                placeholder="Descriptions"
                className="w-full rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                {...register("itemDescription")}
              />
              <div className="mt-1 text-xs flex items-center">
                <span className="text-graydark">
                  {descriptionValue?.length || 0} / 400 characters.
                </span>
              </div>
            </div>
          </div>
          {/* Date */}
          <div className="mb-3 w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 pr-0 md:pr-1">
              <label className="overflow-hidden ">
                <div className="flex flex-row">
                  <span className="mb-2.5 block font-medium text-black dark:text-white">
                    Discount Start
                  </span>
                  <span>*</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2 rounded-xl border border-stroke bg-transparent py-3 pl-4 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  <MdOutlineEditCalendar className="w-6 h-6" />
                  <DateInput />
                </div>
              </label>
            </div>
            <div className="w-full md:w-1/2 pr-0 md:pr-1">
              <label className="overflow-hidden ">
                <div className="flex flex-row">
                  <span className="mb-2.5 block font-medium text-black dark:text-white">
                    Discount End
                  </span>
                  <span>*</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2 rounded-xl border border-stroke bg-transparent py-3 pl-4 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  <MdOutlineEditCalendar className="w-6 h-6" />
                  <DateInput />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <ModalFooter
        className="w-full flex border-t-2 border-gray py-2 px-4"
        isClose
        onClick={onClose}>
        <Button type="button" variant="primary" className="rounded-lg text-sm">
          Save
        </Button>
      </ModalFooter>
    </form>
  );
};

export default DiscountForm;
