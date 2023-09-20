import React, { Fragment, useEffect, useMemo, useState } from "react";
import { MdCheck, MdWarning } from "react-icons/md";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { ModalHeader } from "../../../Modal/ModalComponent";
import { OptionProps } from "../../../../utils/useHooks/PropTypes";
import Button from "../../../Button/Button";
import {
  getAmenities,
  selectAmenityManagement,
} from "../../../../redux/features/building-management/amenity/amenityReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { Props, FormValues } from "./FormTenantAmenity";
import axios from "axios";
import { useRouter } from "next/router";

export default function FormTenantAmenity(props: Props) {
  const { isCloseModal, items, isUpdate, token } = props;
  const router = useRouter();

  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // all amenity
  const [amenity, setAmenity] = useState<any | null>(null);
  const [dataAmenity, setDataAmenity] = useState<any[]>([]);
  const [totalAmenity, setTotalAmenity] = useState<number | string>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // data-checked
  const [isChecked, setIsChecked] = useState<OptionProps[] | any[]>([]);
  const [searchBox, setSearchBox] = useState<string | any>(null);

  // redux
  const dispatch = useAppDispatch();
  const { pending } = useAppSelector(selectAuth);
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
        amenity: items,
      }),
      [items]
    ),
  });

  useEffect(() => {
    if (items) {
      reset({
        amenity: items,
      });
    }
  }, [items]);

  useEffect(() => {
    let arr: any[] = isChecked;
    let newArr: any[] = [];

    const filterAmenity = items?.map((x: any) => {
      let filter = arr?.find((a: any) => {
        if (a?.id === x.id) {
          return { ...x, totalAmenity: x.totalAmenity, checked: x.checked };
        }
      });

      return filter;
    });

    // newArr = items?.concat(filterAmenity);

    console.log(filterAmenity, "result");
  }, [items, isChecked]);

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // amenity
  const filterAmenity = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "amenityName",
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getAmenities({ token, params: filterAmenity.queryObject }));
    }
  }, [token, filterAmenity]);

  useEffect(() => {
    let arr: any[] = [];
    const { data } = amenities;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        let _selected = items?.find((a: any) => a.id === item.id);
        if (items?.some((x: any) => x.id === item.id)) {
          arr.push(_selected);
        } else {
          arr.push({
            id: item?.id,
            label: item?.amenityName,
            amenity: item,
            totalAmenity: 1,
            checked: false,
          });
        }
        console.log(_selected, "data-selected");
        // arr = [...arr, _selected];
      });
    }
    setIsChecked(arr);
  }, [amenities]);
  // end

  // checked function
  const handleCheckboxChange = (id: any) => {
    setIsChecked((prevChecked) =>
      prevChecked.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };

  // amenity-checked
  const filterAmenities = useMemo(() => {
    const result: any[] =
      isChecked?.length > 0
        ? isChecked?.filter((item: any) => item?.checked)
        : [];
    return result;
  }, [isChecked]);

  // onchange total anenity array
  // const onChangeArray = (index: any) => (e: any) => {
  //   const newArray = isChecked?.map((item: any, i: any) => {
  //     if (index === i) {
  //       return { ...item, [e.target.name]: e.target.value };
  //     } else {
  //       return item;
  //     }
  //   });
  //   setIsChecked(newArray);
  // };

  const handleQty = (e: any, id: any) => {
    const editedArray = isChecked.map((item: any) => {
      if (item.id === id) {
        return { ...item, totalAmenity: e.target.value };
      }
      return item;
    });
    setIsChecked(editedArray);
  };

  // add isChecked to formValue
  useEffect(() => {
    let newArr: any[] = [];
    if (filterAmenities?.length > 0) {
      filterAmenities?.map((item: any) => {
        newArr.push(item);
      });
    }
    let newObj: any = {
      amenity: newArr,
    };
    setValue("amenity", newObj);
  }, [filterAmenities]);

  const amenitiesValue = useWatch({
    control,
    name: "amenity",
  });

  // all function amenity-end
  const onSubmit: SubmitHandler<FormValues> = async (value) => {
    const newObj: any = {
      amenity:
        value.amenity?.amenity?.length > 0
          ? value.amenity.amenity?.map((item: any) => ({
              id: item.id,
              totalAmenity: parseInt(item.totalAmenity),
            }))
          : [],
    };
    setLoading(true);
    let config: any = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put("myUnit/detail", newObj, config);
      const { data, status } = response;
      if (status == 200) {
        toast.dark("Update amenities is successfully");
        setLoading(false);
        isCloseModal();
        dispatch(
          getAuthMe({
            token,
            callback: () => router.push("/authentication?page=sign-in"),
          })
        );
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      toast.dark(newError.message);
      setLoading(false);
    }
    console.log(newObj, "form-data");
  };

  console.log(amenitiesValue, "amenitiesValue");

  return (
    <Fragment>
      <ModalHeader
        onClick={isCloseModal}
        isClose={true}
        className="p-4 bg-white rounded-t-xl border-b-2 border-gray">
        <div className="w-full flex flex-col gap-1 px-2">
          <h3 className="text-lg font-semibold text-gray-6">
            {isUpdate ? "Edit" : "New"} Amenity
          </h3>
          <p className="text-gray-5 text-sm">
            Fill your task amenity information.
          </p>
        </div>
      </ModalHeader>
      <div className="w-full text-gray-6">
        <div className="relative w-full flex gap-2 divide-x divide-gray-4">
          <div className="w-full lg:w-1/2 overflow-y-auto max-h-[350px]">
            <div className="w-full sticky top-0 z-999 bg-white text-gray-500 font-semibold text-sm border-b-2 border-gray p-4">
              List of Amenity
            </div>

            <div className="w-full flex gap-1 text-sm p-4">
              <div className="w-full flex flex-col gap-2">
                {isChecked?.length > 0 ? (
                  isChecked.map((checkbox: any, index: any) => (
                    <div
                      key={index}
                      className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                      <input
                        id={`checkbox-${checkbox?.id}`}
                        className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        checked={checkbox?.checked}
                        onChange={() => handleCheckboxChange(checkbox?.id)}
                      />
                      <label
                        htmlFor={`checkbox-${checkbox?.id}`}
                        className="inline-block pl-[0.15rem] hover:cursor-pointer">
                        {checkbox?.label}
                      </label>
                    </div>
                  ))
                ) : (
                  <div>Amenities not found</div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-4 flex flex-col gap-2 overflow-y-auto max-h-[350px]">
            {filterAmenities?.length > 0 ? (
              filterAmenities?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="w-full bg-gray-2 divide-x-2 divide-gray-4 flex items-center gap-2 border-2 border-gray-4 shadow-card rounded-lg text-gray-5 font-semibold">
                    <div className="w-[65%] p-2">
                      <h3>{item?.label}</h3>
                    </div>
                    <div className="w-[35%] flex items-center text-gray-6 px-2">
                      <input
                        className="w-full px-2 rounded border-2 border-gray"
                        type="number"
                        // onChange={onChangeArray(index)}
                        onChange={(e) => handleQty(e, item.id)}
                        name="totalAmenity"
                        value={item?.totalAmenity || ""}
                      />
                      <span className="m-auto">x</span>
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
            disabled={loading}>
            <span className="font-semibold">
              {isUpdate ? "Update" : "Save"}
            </span>
            {loading ? (
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
