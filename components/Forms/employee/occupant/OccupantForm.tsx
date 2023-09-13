import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ModalHeader } from "../../../Modal/ModalComponent";
import { MdAdd, MdCheck, MdWarning } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../../Button/Button";
import { selectUnitManagement } from "../../../../redux/features/building-management/unit/unitReducers";
import {
  getUsersProperty,
  registerUsersProperty,
  selectUserPropertyManagement,
  usersPropertyAddOccupant,
  usersPropertyAddTenant,
} from "../../../../redux/features/building-management/users/propertyUserReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { SearchInput } from "../../SearchInput";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";

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

export default function OccupantForm({
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
  const [userSelected, setUserSelected] = useState<Options | any>(null);
  const [isSearch, setIsSearch] = useState<string | any>("");
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // new user function
  const onOpenNewUser = () => {
    if (!items?.propertyStructures) {
      toast.dark("Property structure not found!");
      return;
    }
    setUserSelected({
      id: items?.propertyStructures,
      email: "",
    });
    setIsNewUser(true);
  };

  const onCloseNewUser = () => {
    setUserSelected(null);
    setIsNewUser(false);
  };

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
        unit: items?.id,
        date: new Date(),
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
        unit: items?.id,
        date: new Date(),
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

    const search = {
      $and: [
        {
          $or: [
            { "user.firstName": { $contL: isSearch } },
            { "user.lastName": { $contL: isSearch } },
            { "user.email": { $contL: isSearch } },
          ],
        },
      ],
    };

    qb.search(search);

    qb.sortBy({
      field: "user.firstName",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [isSearch]);

  useEffect(() => {
    if (token)
      dispatch(getUsersProperty({ token, params: filterUser.queryObject }));
  }, [token, filterUser]);

  useEffect(() => {
    let arr: Options[] = [];
    let { data } = userProperties;
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
  }, [userProperties]);

  useEffect(() => {
    if (userSelected?.id) {
      setValue("id", userSelected.id);
      setValue("firstName", userSelected.firstName);
      setValue("lastName", userSelected.lastName);
      setValue("email", userSelected.email);
    } else {
      reset({
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        unit: items?.id,
        date: new Date(),
      });
    }
  }, [userSelected, items]);

  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    console.log(value, "form");
    let newData: any = {
      user: value?.id,
      unit: value?.unit,
      date: value?.date?.toISOString(),
    };
    if (isOwner && !isNewUser) {
      console.log(newData, "form-data-owner");
      dispatch(
        usersPropertyAddTenant({
          token,
          data: newData,
          isSuccess() {
            getData();
            toast.dark("Owner has been added");
            isCloseModal();
          },
        })
      );
    } else if (isOccupant && !isNewUser) {
      console.log(newData, "form-data-occupant");
      dispatch(
        usersPropertyAddOccupant({
          token,
          data: newData,
          isSuccess() {
            getData();
            toast.dark("Occupant has been added");
            isCloseModal();
          },
        })
      );
    } else {
      newData = {
        firstName: value?.firstName,
        lastName: value?.lastName,
        email: value?.email,
        propertyStructure: value?.id,
      };
      dispatch(
        registerUsersProperty({
          token,
          data: newData,
          isSuccess() {
            dispatch(
              getUsersProperty({ token, params: filterUser.queryObject })
            );
            getData();
            toast.dark("New user has been added");
            onCloseNewUser();
          },
        })
      );
      console.log(newData, "form-new-user");
    }
  };

  console.log("unit :", items);
  console.log("new-user :", { isNewUser, userSelected, userData });

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-2 bg-white rounded-t-xl border-b-2 border-gray">
        <Fragment>
          <div className={`w-full ${userSelected?.id ? "hidden" : ""}`}>
            <SearchInput
              className="py-0 text-sm border-0"
              classNamePrefix="w-5 h-5"
              placeholder="Search"
              filter={isSearch}
              setFilter={setIsSearch}
            />
          </div>
          <div
            className={`w-full flex flex-col gap-1 px-2 ${
              userSelected?.id ? "" : "hidden"
            }`}>
            <h3 className="text-lg font-semibold">
              {isUpdate ? "Edit" : "Add"}{" "}
              {isOccupant && !isNewUser
                ? "Occupant"
                : !isOccupant && !isNewUser
                ? "Owner"
                : "User"}
            </h3>
            <p className="text-gray-5 text-sm">
              Fill your{" "}
              {isOccupant && !isNewUser
                ? "occupant"
                : !isOccupant && !isNewUser
                ? "owner"
                : "user"}{" "}
              information.
            </p>
          </div>
        </Fragment>
      </ModalHeader>

      {/* step-1 */}
      <div className={`w-full ${userSelected?.id ? "hidden" : ""}`}>
        <div
          className={`w-full max-h-[250px] overflow-y-auto overflow-x-hidden`}>
          <div className="w-full ">
            {userOption?.length > 0 ? (
              userOption?.map((user: any) => (
                <button
                  key={user?.id}
                  type="button"
                  onClick={() => setUserSelected(user)}
                  className="w-full py-4 px-4 hover:bg-gray hover:rounded-lg text-sm text-gray-5">
                  <p className="w-full flex gap-2 font-semibold">
                    {user?.firstName} - {user?.email}
                  </p>
                </button>
              ))
            ) : (
              <div className="py-2 px-4 text-sm text-gray-5">
                <p>User data not found</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2 justify-between p-4 border-t-2 border-gray">
          <button
            className="flex items-center text-primary rounded-md text-sm border py-2 px-4 border-gray shadow-card"
            onClick={onOpenNewUser}>
            <MdAdd className="w-4 h-4" />
            <span className="font-semibold capitalize">New Email</span>
          </button>

          <button
            type="button"
            className="rounded-md text-sm border py-2 px-4 border-gray shadow-card"
            onClick={isCloseModal}>
            <span className="font-semibold">Discard</span>
          </button>
        </div>
      </div>

      {/* step-2 */}
      <div className={`w-full ${userSelected?.id ? "" : "hidden"}`}>
        <div className={`w-full p-4`}>
          <div className={`w-full mb-3`}>
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
                className={`bg-white w-1/2 text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
                {...register("firstName")}
              />
              <input
                type="text"
                placeholder="Last Name"
                autoFocus
                id="fullName"
                className={`bg-white w-1/2 text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
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
                className={`bg-white w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none disabled:border-0 disabled:bg-transparent`}
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
            onClick={onCloseNewUser}>
            <span className="font-semibold">Cancel</span>
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
