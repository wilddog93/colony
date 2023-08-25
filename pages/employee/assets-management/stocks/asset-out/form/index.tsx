import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdChevronLeft,
  MdDelete,
  MdEdit,
  MdOutlineCalendarToday,
  MdUnarchive,
  MdWarning,
} from "react-icons/md";
import SidebarComponent from "../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../../utils/routes";
import Modal from "../../../../../../components/Modal";
import { ModalHeader } from "../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import {
  OptionProps,
  ProductProps,
} from "../../../../../../utils/useHooks/PropTypes";
import {
  deleteProduct,
  getProducts,
  selectProductManagement,
} from "../../../../../../redux/features/assets/products/productManagementReducers";
import { FaCircleNotch } from "react-icons/fa";
import {
  createRequestMove,
  createRequestOrder,
  createRequestOut,
  createRequestUsage,
  getRequests,
  selectRequestManagement,
} from "../../../../../../redux/features/assets/stocks/requestReducers";
import DatePicker from "react-datepicker";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import FormProduct from "../../../../../../components/Forms/assets/FormProduct";
import DropdownSelect from "../../../../../../components/Dropdown/DropdownSelect";
import {
  getLocations,
  selectLocationManagement,
} from "../../../../../../redux/features/assets/locations/locationManagementReducers";
import CurrencyFormat from "react-currency-format";
import axios from "axios";
import FormProductAsset from "../../../../../../components/Forms/assets/FormProductAsset";
import { off } from "process";

interface PropsData {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  productImage?: string | any;
  productName?: string | any;
  productDescription?: string | any;
  productType?: any;
  productCategory?: any;
  unitMeasurement?: any;
  brand?: any;
  productMinimumStock?: number | any;
}

type AssetProps = {
  id?: number | string | any;
  assetName?: string | any;
  assetStatus?: any;
  assetValue?: number | string | any;
};

type FormValues = {
  id?: number | string;
  requestNumber?: number | string;
  requestDescription?: string;
  assets?: AssetProps[];
};

type Props = {
  pageProps: any;
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
      padding: 0,
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#7B8C9E",
      padding: 0,
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    return {
      ...provided,
      background: "",
      padding: "0rem",
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 20,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const actionOpt: OptionProps[] = [
  { label: "Sold", value: "Sold" },
  { label: "Disposed", value: "Disposed" },
];

const NewRequestAssetOut = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { type } = query;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { products, product } = useAppSelector(selectProductManagement);
  const { locations } = useAppSelector(selectLocationManagement);
  const { pending } = useAppSelector(selectRequestManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // data-table
  const [search, setSearch] = useState<string | any>(null);
  const [assetsOpt, setAssetsOpt] = useState<OptionProps[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [isOpenProductAsset, setIsOpenProductAsset] = useState<boolean>(false);
  const [productOpt, setProductOpt] = useState<OptionProps[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

  // use-form
  const [watchValue, setWatchValue] = useState<FormValues | any>(null);
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // form
  const {
    unregister,
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
        id: product?.id,
        requestNumber: product?.requestNumber,
        requestDescription: product?.requestDescription,
        assets: product?.products,
      }),
      [product]
    ),
  });

  useEffect(() => {
    if (product) {
      reset({
        id: product?.id,
        requestNumber: product?.requestNumber,
        requestDescription: product?.requestDescription,
        assets: product?.products,
      });
    }
  }, [product]);

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { fields, remove, replace } = useFieldArray({
    control,
    name: "assets",
  });

  // description
  const descValue = useWatch({
    name: "requestDescription",
    control,
  });

  // discard modal
  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const onCloseDiscard = () => {
    setIsOpenDiscard(false);
  };

  // asset modal
  const onOpenAsset = (items: any) => {
    setAssetData(items);
    setIsOpenProductAsset(true);
  };

  const onCloseAsset = () => {
    setIsOpenProductAsset(false);
  };

  // date
  const dateTimeFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY, h:mm");
    return date;
  };

  // product
  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const searchObj = {
      $and: [{ assetStatus: { $cont: "Active" } }],
    };

    qb.search(searchObj);

    qb.sortBy({
      field: `product.productName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, [search]);

  const getProductAsset = async (params: any) => {
    let config: any = {
      params: params.params,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    let newArr: any[] = [];
    try {
      const response = await axios.get("product/asset", config);
      const { data, status } = response;
      if (status == 200) {
        console.log(data, "result-data");
        data?.data?.map((item: any) => {
          newArr.push({
            ...item,
            assetStatus: null,
            value: item?.id,
            label: item?.product?.productName,
            assets: item,
          });
        });
        setAssetsOpt(newArr);
      } else {
        throw response;
      }
    } catch (error: any) {
      if (!error?.response?.data) {
        return;
      }
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      toast.dark(newError.message);
    }
  };

  useEffect(() => {
    if (token) getProductAsset({ token, params: filters.queryObject });
  }, [token, filters]);

  const onSelectChange = (name: any, index: any) => (event: any) => {
    let newArr = assetData.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event };
      } else {
        return item;
      }
    });
    // console.log({ name, index }, "select-handle");
    setAssetData(newArr);
  };

  const qtyHandler = ({ value, index }: any) => {
    if (!value) {
      delete productData[index]?.qty;
    }
    let items = [...productData];
    // items[index].productOrderQty = parseInt(`${value}`);
    items[index].qty = parseInt(`${value}`);
    setProductData([...items]);
  };

  const onDeleteAsset = (id: any) => {
    if (!id) return;
    let filter = assetData?.filter((e) => e?.id !== id);
    setAssetData(filter);
  };

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const assetArr: any[] = [];

    console.log(value, "form-data-1");
    if (value?.assets && value?.assets?.length > 0) {
      value?.assets?.map((item) => {
        if (item?.assetStatus?.value == "Sold") {
          assetArr.push({
            id: item.id,
            assetStatus: item.assetStatus?.value,
            assetValue: Number(item.assetValue),
          });
        } else {
          assetArr.push({
            id: item.id,
            assetStatus: item.assetStatus?.value,
          });
        }
      });
    }

    let newObj: any = {
      requestNumber: value.requestNumber,
      requestDescription: value.requestDescription,
      assets: assetArr,
    };

    if (!newObj?.assets || newObj?.assets?.length == 0) {
      toast.dark("Please add assets to request asset out!");
    } else {
      dispatch(
        createRequestOut({
          token,
          data: newObj,
          isSuccess: () => {
            toast.dark("Create Request Asset Out Success");
            setTimeout(() => {
              router.back();
            }, 500);
          },
          isError: () => {
            toast.dark("Create Request Asset Out Failed");
          },
        })
      );
    }

    console.log(newObj, "form-data");
  };

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication?page=sign-in"),
        })
      );
    }
  }, [token]);

  useEffect(() => {
    if (productData?.length > 0) {
      setValue("assets", productData);
    } else {
      setValue("assets", []);
    }
  }, [productData]);

  useEffect(() => {
    if (productData?.length > 0) {
      productData.map((item, idx) => {
        const assetStatus = item["assetStatus"];
        const value = item["assetValue"];

        if (!assetStatus) {
          setError(`assets.${idx}.assetStatus`, {
            type: "required",
            message: "Asset status is required",
          });
        } else {
          clearErrors(`assets.${idx}.assetStatus`);
        }

        if (assetStatus && !value) {
          setError(`assets.${idx}.assetValue`, {
            type: "required",
            message: "Asset value is required",
          });
        } else {
          clearErrors(`assets.${idx}.assetValue`);
        }
      });
    }
  }, [productData, type]);

  const onDiscardRequest = () => {
    setLoading(true);
    router.back();
  };

  // location-option
  const filterLoc = useMemo(() => {
    let qb = RequestQueryBuilder.create();

    qb.sortBy({ field: "locationName", order: "ASC" });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) dispatch(getLocations({ token, params: filterLoc.queryObject }));
  }, [token, filterLoc]);

  const options = useMemo(() => {
    let newLocation: any[] = [];
    let newLocationInventory: any[] = [];
    const { data } = locations;
    if (data && data?.length > 0) {
      let filter = data?.filter(
        (item: any) => item.locationType !== "Non-Storage"
      );
      data?.map((item: any) => {
        newLocation.push({
          ...item,
          value: item?.id,
          label: item?.locationName,
        });
      });

      filter?.map((item: any) => {
        newLocationInventory.push({
          ...item,
          value: item?.id,
          label: item?.locationName,
        });
      });
    }
    return { locations: newLocation, locationInventory: newLocationInventory };
  }, [locations]);
  // location-option end

  // register asset-value
  useEffect(() => {
    if (assetData?.length > 0) {
      setValue("assets", assetData);
      assetData.map((asset: any, index: any) => {
        if (!asset?.assetStatus) {
          setError(`assets.${index}.assetStatus`, {
            type: "required",
            message: "Asset Status is Required.",
          });
        } else {
          clearErrors(`assets.${index}.assetStatus`);
        }
        if (asset?.assetStatus?.value !== "Sold") {
          unregister(`assets.${index}.assetValue`);
        } else {
          register(`assets.${index}.assetValue`, {
            required: {
              value: true,
              message: `Asset Value is Required.`,
            },
          });
        }
      });
    } else {
      setValue("assets", []);
    }
  }, [assetData]);

  console.log(assetData, "asset-data");
  console.log(assetsOpt, "asset-opt");

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Request Asset Out"
      logo="../../../../image/logo/logo-icon.svg"
      images="../../../../image/logo/building-logo.svg"
      userDefault="../../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdUnarchive,
        className: "w-8 h-8 text-meta-6",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          menus={menuAssets}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="w-full flex items-center justify-between py-3 lg:hidden">
            <button
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden">
              <MdArrowRightAlt
                className={`w-5 h-5 delay-700 ease-in-out ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="sticky tracking-wide bg-white top-0 z-50 mb-3 w-full flex flex-col border border-gray mt-5 rounded-xl shadow-card divide-y-2 divided-gray">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 p-4">
              <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                  onClick={() => onOpenDiscard()}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                      <span className="hidden lg:inline-block capitalize">
                        Request Asset Out
                      </span>
                    </h3>
                  </div>
                </button>
                <div className="w-full max-w-[10rem] text-primary">
                  <input
                    type="text"
                    className={`w-full border-2 border-gray-5 px-2 py-1 focus:outline-none focus:border-primary text-lg rounded-lg ${
                      errors?.requestNumber
                        ? "border-danger focus:ring-danger"
                        : ""
                    }`}
                    {...register("requestNumber", {
                      required: {
                        value: true,
                        message: "Request No. is required",
                      },
                    })}
                  />
                  {errors?.requestNumber && (
                    <div className="mt-1 text-xs flex items-center text-red-300">
                      <MdWarning className="w-4 h-4 mr-1" />
                      <span className="text-red-300">
                        {errors.requestNumber.message as any}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold px-4 py-3 border-2 border-gray inline-flex text-gray-6 active:scale-90 shadow-1"
                  onClick={() => onOpenDiscard()}>
                  <MdDelete className="w-4 h-4 inline-block lg:hidden" />
                  <span className="hidden lg:inline-block">Cancel</span>
                </button>

                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border border-primary active:scale-90 shadow-2"
                  onClick={handleSubmit(onSubmit)}
                  disabled={pending}
                  variant="primary">
                  {pending ? (
                    <Fragment>
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span className="hidden lg:inline-block">
                        New Request
                      </span>
                      <MdAdd className="w-4 h-4" />
                    </Fragment>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full p-4 border border-gray rounded-xl text-gray-6">
            <div className="grid grid-cols-1 text-gray-6">
              <div className="w-full col-span-1">
                <table className="w-full table-auto">
                  <thead className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
                    <tr>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                        Asset Name
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                        Serial No.
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                        Action
                      </th>
                      <th
                        scope="col"
                        className={`font-semibold px-2 py-4 text-sm text-wide capitalize text-center`}>
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                    {assetData?.length > 0 ? (
                      assetData?.map((e: any, idx: any) => {
                        console.log(e, "asset");
                        return (
                          <tr
                            key={idx}
                            className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                            <td className="w-[350px]">
                              <div className="w-full flex items-center border border-gray rounded-lg bg-gray p-2">
                                <img
                                  src={
                                    e?.product?.productImages
                                      ? `${url}product/files/${e?.product?.productImages}`
                                      : "../../../../image/no-image.jpeg"
                                  }
                                  alt="img-product"
                                  className="object cover object-center w-6 h-6 rounded mr-1"
                                />
                                <div>{e.product?.productName}</div>
                              </div>
                            </td>
                            <td className="px-2 py-4">
                              <div className="font-semibold">
                                {e?.serialNumber}
                              </div>
                            </td>
                            <td className={`px-2 py-4`}>
                              <div className="w-[100px] flex">
                                <DropdownSelect
                                  customStyles={stylesSelect}
                                  value={e?.assetStatus}
                                  onChange={onSelectChange("assetStatus", idx)}
                                  error={""}
                                  className={`text-xs font-normal text-gray-5 w-[90px] focus:outline-none ${
                                    errors?.assets?.[idx]?.assetStatus
                                      ? "border border-danger focus:border-danger rounded-lg"
                                      : "focus:border-primary"
                                  }`}
                                  classNamePrefix=""
                                  instanceId="actionVal"
                                  isDisabled={false}
                                  isMulti={false}
                                  placeholder="Choose"
                                  options={actionOpt}
                                  formatOptionLabel={""}
                                  isClearable={true}
                                  icon=""
                                />
                              </div>
                            </td>
                            <td className="px-2 py-4 text-center">
                              <div
                                className={`w-full ${
                                  !e?.assetStatus ||
                                  e?.assetStatus?.value == "Disposed"
                                    ? "hidden"
                                    : ""
                                }`}>
                                <Controller
                                  render={({
                                    field: {
                                      onChange,
                                      onBlur,
                                      value,
                                      name,
                                      ref,
                                    },
                                    fieldState: {
                                      invalid,
                                      isTouched,
                                      isDirty,
                                      error,
                                    },
                                  }) => (
                                    <CurrencyFormat
                                      onValueChange={(values) => {
                                        const { value } = values;
                                        if (!!!value) {
                                          setError(`assets.${idx}.assetValue`, {
                                            type: "required",
                                            message: "Price is required",
                                          });
                                        } else {
                                          clearErrors(
                                            `assets.${idx}.assetValue`
                                          );
                                        }
                                        assetData[idx].assetValue = value;
                                        setValue(
                                          `assets.${idx}.assetValue`,
                                          value
                                        );
                                      }}
                                      id="price"
                                      value={assetData[idx].assetValue || ""}
                                      thousandSeparator={true}
                                      // placeholder="Price"
                                      prefix={"Rp. "}
                                      className={`bg-gray py-1 px-2 border rounded focus:outline-none focus:ring-1 disabled:bg-transparent disabled:border-0 w-[100px] ${
                                        errors?.assets?.[idx]?.assetValue
                                          ? "border-danger focus:ring-danger"
                                          : "border-gray focus:ring-primary"
                                      }`}
                                    />
                                  )}
                                  name={`assets.${idx}.assetValue`}
                                  control={control}
                                  // rules={{
                                  //   required: {
                                  //     value: true,
                                  //     message: "Value is required.",
                                  //   },
                                  // }}
                                />
                              </div>
                            </td>
                            <td className="px-2 py-4 w-20">
                              <button
                                className="flex items-center px-2 py-2 rounded-lg border-2 border-gray shadow-1 active:scale-90"
                                type="button"
                                onClick={() => onDeleteAsset(e?.id)}>
                                <MdDelete className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12} className="p-4">
                          <div className="text-sm italic text-gray-500 font-semibold">
                            There is no product asset data.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border border-primary active:scale-90"
              onClick={() => onOpenAsset(assetData)}>
              <span className="text-xs">Add Asset</span>
              <MdAdd className="w-4 h-4" />
            </Button>

            <div className="border-b-2 border-gray w-full h-2 my-3"></div>

            <div className="w-full mb-3">
              <label
                className="col-span-1 font-semibold"
                htmlFor="requestDescription">
                Notes
              </label>
              <div className="w-full col-span-4">
                <div className="relative">
                  <textarea
                    cols={0.5}
                    rows={5}
                    maxLength={400}
                    placeholder="Notes..."
                    className="w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    {...register("requestDescription")}
                  />
                  <div className="mt-1 text-xs flex items-center justify-end">
                    <span className="text-graydark">
                      {descValue?.length || 0} / 400 characters.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal isOpen={isOpenProductAsset} onClose={onCloseAsset} size="small">
        <FormProductAsset
          closeModal={onCloseAsset}
          options={assetsOpt}
          items={assetData}
          setItems={setAssetData}
          defaultImage="../../../../image/no-image.jpeg"
        />
      </Modal>

      {/* discard modal */}
      <Modal size="small" onClose={onCloseDiscard} isOpen={isOpenDiscard}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDiscard}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Back to Move & Usage</h3>
              <p className="text-gray-5">{`Are you sure to go back to move & usage product ?`}</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <button
              type="button"
              className="rounded-lg border-2 px-2 py-1 border-gray-5 shadow-2 active:scale-90 focus:outline-none"
              onClick={onCloseDiscard}>
              <span className="text-xs font-semibold">No</span>
            </button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary active:scale-90"
              onClick={() => onDiscardRequest()}
              disabled={loading}>
              {!loading ? (
                <span className="text-xs">Yes, go back</span>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs">loading...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </div>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default NewRequestAssetOut;
