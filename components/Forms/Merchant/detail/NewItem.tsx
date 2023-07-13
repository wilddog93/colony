import DropdownSelect from "../../../Dropdown/DropdownSelect";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { MdWarning } from "react-icons/md";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ModalFooter } from "../../../Modal/ModalComponent";
import { SubmitHandler } from "react-hook-form";
import Button from "../../../Button/Button";

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

const NewItem = ({ items, isOpen, onClose, token, filters }: Props) => {
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
        propertyName: null,
        propertyType: null,
        propertyDescription: null,
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
          {/* image input */}
          <div className="flex max-w-[310px] mb-3">
            {/* image */}
            <div className="flex justify-items-center w-1/2">
              <div className="relative">
                <label className="w-full text-center absolute text-xs top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-5 font-bold pb-5 pt-4 ">
                  <div>200x200</div>
                  <div className="font-semibold">Max 2MB</div>
                </label>
                <img
                  src="../../../../image/no-image.jpeg"
                  className="w-[120px] h-[120px] object-cover object-center rounded shadow"></img>
              </div>
            </div>
            {/* upload image button */}
            <div className="flex flex-col w-1/2 ml-0 justify-end">
              <div className="text-gray-5 text-base mt-5">
                There is no Picture
              </div>
              <div>
                <label className="flex justify-center rounded-md px-2 py-1 bg-primary border-1 cursor-pointer hover:shadow-md my-2 text-white text-sm font-bold">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    id="chooseFile"
                    accept="image/*"></input>
                </label>
              </div>
            </div>
          </div>
          {/* item code */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Item Code
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Item Code"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          {/* Item Name */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Item Name
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Item Name"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          {/* Item Type */}
          <div className="w-full mb-3">
            <label
              htmlFor="itemType"
              className="mb-2.5 block font-medium text-black dark:text-white">
              Item Type
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
                    placeholder="Type..."
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
          {/* Sub Category */}
          <div className="w-full mb-3">
            <label
              htmlFor="itemSubCategory"
              className="mb-2.5 block font-medium text-black dark:text-white">
              Sub Category
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
                    placeholder="Sub Category..."
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
          {/* Price */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Price
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="IDR"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
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

export default NewItem;
