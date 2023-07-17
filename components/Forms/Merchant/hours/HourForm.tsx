import { useForm, useWatch } from "react-hook-form";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import DropdownSelect from "../../../Dropdown/DropdownSelect";
import { MdWarning } from "react-icons/md";
import { ModalFooter } from "../../../Modal/ModalComponent";
import Button from "../../../Button/Button";
import TimeInput from "../../../merchant/form/TimeInput";
import { MdAlarm } from "react-icons/md";

type Props = {
  items?: any;
  isOpen?: boolean;
  onClose: () => void;
  token?: any;
  filters?: any;
};

type FormValues = {
  id?: any;
  scheduleCode?: string | any;
  scheduleType?: any;
  Description?: any | string;
  openTime?: any;
  closeTime?: any;
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

const HourForm = ({ items, isOpen, onClose, token, filters }: Props) => {
  const [scheduleTypeOption, setscheduleTypeOption] = useState<Options[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
  };

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
    name: "Description",
    control,
  });

  return (
    <div>
      <form className="p-4 w-full text-sm">
        <div className="w-full p-2">
          {/* schedule code */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Schedule Code
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Schedule Code"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          {/* category Name */}
          <div className="w-full mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Schedule Name
              <span>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Schedule Name"
                className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            {/* Category Description */}
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
                  {...register("Description")}
                />
                <div className="mt-1 text-xs flex items-center">
                  <span className="text-graydark">
                    {descriptionValue?.length || 0} / 400 characters.
                  </span>
                </div>
              </div>
            </div>
            {/* Item Category */}
            <div className="w-full mb-3">
              <label
                htmlFor="itemSubCategory"
                className="mb-2.5 block font-medium text-black dark:text-white">
                Schedule Type
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
                      instanceId="itemCategory"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Schedule Type..."
                      options={scheduleTypeOption}
                      icon=""
                    />
                  )}
                  name={`scheduleType`}
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Category is required.",
                    },
                  }}
                />
                {errors?.scheduleType && (
                  <div className="mt-1 text-xs flex items-center text-red-300">
                    <MdWarning className="w-4 h-4 mr-1" />
                    <span className="text-red-300">
                      {errors?.scheduleType?.message as any}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Time picker */}
            <div className="mb-3 w-full flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 pr-0 md:pr-1">
                <label className="overflow-hidden ">
                  <div className="flex flex-row">
                    <span className="mb-2.5 block font-medium text-black dark:text-white">
                      Open Time
                    </span>
                    <span>*</span>
                  </div>
                  <div className="w-full flex flex-row items-center gap-2 rounded-xl border border-stroke bg-transparent py-3 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    <MdAlarm className="w-6 h-6" />
                    <TimeInput
                      selectedTime={selectedTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </label>
              </div>
              <div className="w-full md:w-1/2 pr-0 md:pr-1">
                <label className="overflow-hidden ">
                  <div className="flex flex-row">
                    <span className="mb-2.5 block font-medium text-black dark:text-white">
                      Close Time
                    </span>
                    <span>*</span>
                  </div>
                  <div className="w-full flex flex-row items-center gap-2 rounded-xl border border-stroke bg-transparent py-3 pl-4 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    <MdAlarm className="w-6 h-6" />
                    <TimeInput
                      selectedTime={selectedTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </label>
              </div>
            </div>
            {/* Footer */}
            <ModalFooter
              className="w-full flex border-t-2 border-gray py-2 px-4"
              isClose
              onClick={onClose}>
              <Button
                type="button"
                variant="primary"
                className="rounded-lg text-sm">
                Save
              </Button>
            </ModalFooter>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HourForm;
