import React, { useEffect, useMemo, useState } from "react";
import DropdownSelect from "../../../Dropdown/DropdownSelect";
import { Controller, EventType, SubmitHandler, useForm } from "react-hook-form";
import { MdWarning } from "react-icons/md";
import { ModalFooter } from "../../../Modal/ModalComponent";
import Button from "../../../Button/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import { FaCircleNotch } from "react-icons/fa";
import {
  createDomainAccessGroup,
  getDomainAccessGroup,
  selectDomainAccessGroup,
  updateDomainAccessGroup,
} from "../../../../redux/features/domain/user-management/domainAccessGroupReducers";
import { toast } from "react-toastify";
import axios from "axios";
import { getDomainUser } from "../../../../redux/features/domain/domainUser";

type Options = {
  value?: any;
  label?: any;
};

type Props = {
  items?: any;
  isOpen?: boolean;
  onClose: () => void;
  token?: any;
  options?: Options[];
  filters?: any;
};

type FormValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  domainStructure?: any;
};

type WatchProps = {
  value?: any | null;
};

type WatchChangeProps = {
  name?: any | null;
  type?: EventType | any;
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

const DomainInviteForm = ({
  items,
  isOpen,
  onClose,
  token,
  options,
  filters,
}: Props) => {
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

  const [isLoading, setIsLoading] = useState(false);

  // redux
  const dispatch = useAppDispatch();

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
        email: items.email,
        firstName: items?.firstName,
        lastName: items?.lastName,
        domainStructure: items.domainStructure,
      }),
      [items]
    ),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChangeValue({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    reset({
      email: items?.email,
      firstName: items?.firstName,
      lastName: items?.lastName,
      domainStructure: items?.domainStructure,
    });
  }, [items]);

  const onInviteUserRegister = async ({ formData, token, isSuccess }: any) => {
    setIsLoading(true);
    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.post(
        "user/domain/invite/register",
        formData,
        config
      );
      const { data, status } = res;
      if (status == 201) {
        toast.dark(`${formData.email} has been invited!`);
        isSuccess();
      } else {
        throw res;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(newError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onInviteUser = async ({ formData, token, isSuccess }: any) => {
    setIsLoading(true);
    let config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.post("user/domain/invite", formData, config);
      const { data, status } = res;
      if (status == 201) {
        toast.dark(`${formData.email} has been invited!`);
        isSuccess();
      } else {
        throw res;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      if (error.response && error.response.status === 404) {
        // toast.error('User not found');
        onInviteUserRegister({
          token,
          formData,
          isSuccess: () => {
            reset({ email: "", domainStructure: undefined });
            dispatch(getDomainUser({ params: filters, token }));
            onClose();
          },
        });
      } else {
        toast.error(newError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    let formData: FormValues = {
      email: value.email,
      domainStructure: value?.domainStructure?.id,
    };
    console.log({ value, formData }, "form values");

    onInviteUser({
      token,
      formData,
      isSuccess: () => {
        reset({ email: "", domainStructure: undefined });
        dispatch(getDomainUser({ params: filters, token }));
        onClose();
      },
    });
  };

  return (
    <form className="w-full p-4 text-sm" onSubmit={handleSubmit(onSubmit)}>
      <div className={`w-full px-4 mb-3`}>
        <label
          className="text-gray-500 font-semibold text-sm"
          htmlFor="fullName">
          Full Name <span className="text-primary">*</span>
        </label>
        <div className="w-full flex gap-2">
          <input
            type="text"
            placeholder="First Name"
            autoFocus
            id="fullName"
            className={`bg-white w-1/2 text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
            {...register("firstName")}
          />
          <input
            type="text"
            placeholder="Last Name"
            autoFocus
            id="fullName"
            className={`bg-white w-1/2 text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
            {...register("lastName")}
          />
        </div>
        {errors?.firstName && (
          <div className="mt-1 text-xs flex items-center text-red-300">
            <MdWarning className="w-4 h-4 mr-1" />
            <span className="text-red-300">
              {errors.firstName.message as any}
            </span>
          </div>
        )}
        {errors?.lastName && (
          <div className="mt-1 text-xs flex items-center text-red-300">
            <MdWarning className="w-4 h-4 mr-1" />
            <span className="text-red-300">
              {errors.lastName.message as any}
            </span>
          </div>
        )}
      </div>

      <div className="w-full px-4 mb-3">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-black dark:text-white">
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="text"
            placeholder="Email..."
            className="w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email is invalid",
              },
            })}
          />
          {errors?.email && (
            <div className="mt-1 text-xs flex items-center text-red-300">
              <MdWarning className="w-4 h-4 mr-1" />
              <span className="text-red-300">
                {errors.email.message as any}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-4 mb-3">
        <label
          htmlFor="domainStructure"
          className="mb-2.5 block font-medium text-black dark:text-white">
          Roles
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
                instanceId="domainStructure"
                isDisabled={false}
                isMulti={false}
                placeholder="Roles..."
                options={options}
                icon=""
              />
            )}
            name={`domainStructure`}
            control={control}
          />
          {errors?.domainStructure && (
            <div className="mt-1 text-xs flex items-center text-red-300">
              <MdWarning className="w-4 h-4 mr-1" />
              <span className="text-red-300">
                {errors?.domainStructure?.message as any}
              </span>
            </div>
          )}
        </div>
      </div>

      <ModalFooter className="px-4" isClose onClick={onClose}>
        <div className="">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="primary"
            className="text-sm rounded-lg"
            disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span>Loading...</span>
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              </div>
            ) : (
              "Invite"
            )}
          </Button>
        </div>
      </ModalFooter>
    </form>
  );
};

export default DomainInviteForm;
