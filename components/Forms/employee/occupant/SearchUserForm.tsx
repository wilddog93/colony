import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalFooter, ModalHeader } from "../../../Modal/ModalComponent";
import { MdCheck, MdClose, MdOutlinePlace, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "../../../Button/Button";
import { tokenToString } from "typescript";
import Link from "next/link";
import { FaCircleNotch } from "react-icons/fa";
import DropdownSelect from "../../../Dropdown/DropdownSelect";
import {
  createAmenities,
  selectAmenityManagement,
  updateAmenities,
} from "../../../../redux/features/building-management/amenity/amenityReducers";
import { selectUnitManagement } from "../../../../redux/features/building-management/unit/unitReducers";
import {
  getUsersProperty,
  selectUserPropertyManagement,
} from "../../../../redux/features/building-management/users/propertyUserReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { SearchInput } from "../../SearchInput";

type Options = {
  value?: any;
  label?: any;
};

type Props = {
  items?: any;
  token?: any;
  isOpen?: boolean;
  isCloseModal: () => void;
  isUpdate?: boolean;
  filters?: any;
  getData: () => void;
  isOwner?: boolean;
  isOccupant?: boolean;
};

type FormValues = {
  id?: number | any;
  firstName?: string | any;
  lastName?: string | any;
  email?: string | any;
  unit?: any;
  date?: string | any;
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

export default function SearchUserForm({
  isOpen,
  isCloseModal,
  items,
  isUpdate,
  filters,
  token,
  getData,
  isOwner,
  isOccupant,
}: Props) {
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending, error, message } = useAppSelector(selectUnitManagement);
  const { userProperties } = useAppSelector(selectUserPropertyManagement);

  // user-data
  const [userData, setUserData] = useState<any[]>([]);
  const [userOption, setUserOption] = useState<Options[]>([]);
  const [userSelected, setUserSelected] = useState<Options[]>([]);
  const [isSearch, setIsSearch] = useState<string | any>("");

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
        firstName: items?.firstName,
        lastName: items?.lastName,
        email: items?.email,
        unit: items?.unit,
        date: items?.date,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        id: items?.id,
        firstName: items?.firstName,
        lastName: items?.lastName,
        email: items?.email,
        unit: items?.unit,
        date: items?.date,
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

  // get-user
  const filterUser = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "user.firstName",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(getUsersProperty({ token, params: filterUser.queryObject }));
  }, [token, filterUser]);

  useEffect(() => {
    let arr: Options[] = [];
    let { data } = userProperties;
    return () => {
      if (data || data?.length > 0) {
        data?.map((item: any) => {
          arr.push({
            ...item?.user,
            value: item?.user?.id,
            label: `${item?.user?.firstName} ${item?.user?.lastName}`,
          });
        });
      }
      setUserData(arr);
      setUserOption(arr);
    };
  }, [userProperties]);

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
  };

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold">
            {isUpdate ? "Edit" : "Add"} Owner
          </h3>
          <p className="text-gray-5 text-sm">Fill your owner information.</p>
        </div>
      </ModalHeader>
      <div className="w-full">
        <div className={`w-full p-4`}>
          <div className="w-full mb-3">
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

          <div className="w-full">
            <label
              className="text-gray-500 font-semibold text-sm"
              htmlFor="email">
              Email
            </label>
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                autoFocus
                id="email"
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                {...register("email")}
              />
            </div>
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
