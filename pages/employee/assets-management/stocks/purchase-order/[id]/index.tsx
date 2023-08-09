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
import { SearchInput } from "../../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../../../components/tables/layouts/server/SelectTables";
import Modal from "../../../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../../../components/Modal/ModalComponent";
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
  createRequestOrder,
  getRequests,
  selectRequestManagement,
} from "../../../../../../redux/features/assets/stocks/requestReducers";
import DatePicker from "react-datepicker";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import FormProduct from "../../../../../../components/Forms/assets/FormProduct";
import {
  getVendorById,
  selectVendorManagement,
} from "../../../../../../redux/features/assets/vendor/vendorManagementReducers";
import FormProductOrder from "../../../../../../components/Forms/assets/FormProductOrder";

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

type FormValues = {
  id?: number | string;
  requestNumber?: number | string;
  requestDescription?: string;
  products?: ProductProps[];
};

type Props = {
  pageProps: any;
};

const stylesSelectSort = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
    flexDirection: "row-reverse",
  }),
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
    return {
      ...provided,
      background: "",
      padding: ".5rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 38,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
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
      padding: ".5rem",
      borderRadius: ".75rem",
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

const RequestOrderDetail = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { products, product } = useAppSelector(selectProductManagement);
  const { requests } = useAppSelector(selectRequestManagement);
  const { vendor } = useAppSelector(selectVendorManagement);
  const { pending } = useAppSelector(selectRequestManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // data-table
  const [search, setSearch] = useState<string | any>(null);
  const [requestOrderOpt, setRequestOrderOpt] = useState<OptionProps[]>([]);
  const [requestOrderData, setRequestOrderData] = useState<any[]>([]);
  const [isOpenRequestOrder, setIsOpenRequestOrder] = useState<boolean>(false);

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

  // use-form
  const [watchValue, setWatchValue] = useState<FormValues | any>(null);
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // date
  const dateTimeFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY, h:mm");
    return date;
  };

  // description-read
  const [isHiddenDesc, setIsHiddenDesc] = useState<any[]>([]);
  const onReadDescription = (val: any) => {
    const idx = isHiddenDesc.indexOf(val);

    if (idx > -1) {
      // console.log("pus nihss");
      const _selected = [...isHiddenDesc];
      _selected.splice(idx, 1);
      setIsHiddenDesc(_selected);
    } else {
      // console.log("push ini");
      const _selected = [...isHiddenDesc];
      _selected.push(val);
      setIsHiddenDesc(_selected);
    }
  };

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
        products: product?.products,
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
        products: product?.products,
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
    name: "products",
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

  // product modal
  const onOpenProduct = (items: any) => {
    setRequestOrderData(items);
    setIsOpenRequestOrder(true);
  };

  const onCloseProduct = () => {
    setIsOpenRequestOrder(false);
  };

  // product
  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        { requestType: { $eq: "Order" } },
        { requestStatus: { $in: ["On-Progress", "Approve"] } },
      ],
    };

    qb.search(search);
    qb.sortBy({
      field: `createdAt`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, [search]);

  useEffect(() => {
    if (token) dispatch(getRequests({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data } = requests;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        item?.requestProducts?.map((x: any) => {
          newArr.push({
            ...x,
            requestNumber: item?.requestNumber,
            currentQty: (x?.requestQty || 0) - (x?.requestQtyCompleted || 0),
            value: x?.id,
            label: x?.product?.productName,
          });
        });
      });
    }
    setRequestOrderOpt(newArr);
  }, [requests]);

  console.log(requestOrderOpt, "options");

  const qtyHandler = ({ value, index }: any) => {
    if (!value) {
      delete requestOrderData[index]?.qty;
    }
    let items = [...requestOrderData];
    // items[index].productOrderQty = parseInt(`${value}`);
    items[index].qty = parseInt(`${value}`);
    setRequestOrderData([...items]);
  };

  const onDeleteProduct = (id: any) => {
    if (!id) return;
    let filter = requestOrderData?.filter((e) => e?.id !== id);
    setRequestOrderData(filter);
  };

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    let newObj: FormValues = {
      requestNumber: value.requestNumber,
      requestDescription: value.requestDescription,
      products:
        value?.products && value?.products?.length > 0
          ? value?.products?.map(({ id, qty }) => ({
              id,
              qty,
            }))
          : [],
    };
    if (value?.products && value?.products?.length > 0) {
      dispatch(
        createRequestOrder({
          token,
          data: newObj,
          isSuccess: () => {
            toast.dark("Create Request Order Success");
            setTimeout(() => {
              router.back();
            }, 2500);
          },
          isError: () => {
            toast.dark("Create Request Order Failed");
          },
        })
      );
    } else {
      toast.dark("Please add products to request order!");
    }

    console.log(newObj, "form");
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
    if (requestOrderData?.length > 0) {
      setValue("products", requestOrderData);
    } else {
      setValue("products", []);
    }
  }, [requestOrderData]);

  useEffect(() => {
    if (requestOrderData?.length > 0) {
      requestOrderData.map((item, idx) => {
        const qty = item["qty"];
        if (!qty || qty == 0) {
          setError(`products.${idx}.qty`, {
            type: "required",
            message: "Qty is required",
          });
        } else {
          clearErrors(`products.${idx}.qty`);
        }
      });
    }
  }, [requestOrderData]);

  const onDiscardRequest = () => {
    setLoading(true);
    router.back();
  };

  useEffect(() => {
    if (token && query?.id) {
      dispatch(getVendorById({ token, id: query?.id }));
    }
  }, [query?.id, token]);

  console.log(vendor, "vendor-data");

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Form Purchase Order"
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

          <div className="sticky bg-white top-0 z-50 mb-3 w-full flex flex-col gap-2 border border-gray mt-5 rounded-xl shadow-card px-4 text-gray-6">
            {/* headers */}
            <div className="w-full flex flex-col divide-y-2 divide-gray">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 py-6">
                <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                  <button
                    type="button"
                    className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                    onClick={() => onOpenDiscard()}
                    key={"1"}>
                    <div className="flex gap-1 items-center">
                      <MdChevronLeft className="w-6 h-6" />
                      <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                        <span className="hidden lg:inline-block">
                          Purchase Order
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
                        <span className="hidden lg:inline-block">
                          Loading...
                        </span>
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

              <div className="w-full grid grid-cols-2 lg:flex-row items-start divide-x-2 divide-gray">
                <div className="w-full flex flex-col p-4 text-sm">
                  <div className="w-full flex items-center gap-2">
                    <div className="font-semibold">Vendor :</div>
                    <p className="">{vendor?.vendorName || "-"}</p>
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <div className="font-semibold">Purchase date :</div>
                    <p className="">{dateTimeFormat(query?.date)}</p>
                  </div>
                </div>

                <div className="w-full flex flex-col p-4 text-sm">
                  <div className="font-semibold">Description :</div>
                  <p className="">
                    {vendor?.vendorDescription?.length > 70 &&
                    !isHiddenDesc.includes(vendor?.id)
                      ? `${vendor?.vendorDescription.substring(70, 0)} ...`
                      : vendor?.vendorDescription || "-"}
                  </p>
                  <button
                    onClick={() => onReadDescription(vendor?.id)}
                    className={`text-primary focus:outline-none font-bold mt-2 underline w-full max-w-max ${
                      vendor?.vendorDescription?.length > 70 ? "" : "hidden"
                    }`}>
                    {isHiddenDesc.includes(vendor?.id) ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6">
            <div className="grid grid-cols-1 text-gray-6">
              <div className="col-span-1 rounded-lg">
                <table className="w-full rounded-lg">
                  <thead className="text-lefttext-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
                    <tr>
                      <th
                        scope="col"
                        className="w-[250px] font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                        Product Name
                      </th>
                      <th
                        scope="col"
                        className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                        Product Type
                      </th>
                      <th
                        scope="col"
                        className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                        Current Stock
                      </th>
                      <th
                        scope="col"
                        className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                        Min Stock
                      </th>
                      <th
                        scope="col"
                        className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                        Request Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                    {requestOrderData?.length > 0 ? (
                      requestOrderData?.map((e: any, idx: any) => {
                        return (
                          <tr
                            key={idx}
                            className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                            <td className="w-[250px]">
                              <div className="w-full flex items-center border border-gray rounded-lg bg-gray p-2">
                                <img
                                  src={
                                    e?.productImages
                                      ? `${url}product/files/${e?.productImages}`
                                      : "../../../../image/no-image.jpeg"
                                  }
                                  alt="img-product"
                                  className="object cover object-center w-6 h-6 rounded mr-1"
                                />
                                <div>{e.productName}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>{e?.productType}</div>
                            </td>
                            <td className="p-4">
                              <div>{e?.productQty}</div>
                            </td>
                            <td className="p-4">
                              <div>{e?.productMinimumStock || 0}</div>
                            </td>
                            <td className="p-4">
                              <input
                                min={0}
                                onChange={({ target }) => {
                                  if (!!!target?.value) {
                                    setError(`products.${idx}.qty`, {
                                      type: "required",
                                      message: "Qty is required",
                                    });
                                  } else {
                                    clearErrors(`products.${idx}.qty`);
                                  }
                                  qtyHandler({
                                    value: target.value,
                                    index: idx,
                                  });
                                }}
                                value={requestOrderData[idx]?.qty}
                                type="number"
                                className={`w-14 max-w-max py-1 px-2 bg-gray border rounded focus:outline-none focus:ring-1 disabled:bg-transparent disabled:border-0 ${
                                  errors?.products?.[idx]?.qty
                                    ? "border-danger focus:ring-danger"
                                    : "border-gray focus:ring-primary"
                                }`}
                              />

                              {/* {errors?.products?.[idx]?.qty && (
                                <div className="mt-1 text-xs flex items-center text-red-300">
                                  <span className="text-red-300">
                                    {
                                      errors?.products?.[idx]?.qty
                                        ?.message as any
                                    }
                                  </span>
                                </div>
                              )} */}
                            </td>
                            <td className="p-4">
                              <button
                                className="flex items-center px-2 py-2 rounded-lg border-2 border-gray shadow-1 active:scale-90"
                                type="button"
                                onClick={() => onDeleteProduct(e?.id)}>
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
                            There is no product data.
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
              onClick={() => onOpenProduct(requestOrderData)}>
              <span className="text-xs">Add Product</span>
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
      <Modal isOpen={isOpenRequestOrder} onClose={onCloseProduct} size="small">
        <FormProductOrder
          closeModal={onCloseProduct}
          options={requestOrderOpt}
          items={requestOrderData}
          setItems={setRequestOrderData}
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
              <h3 className="text-lg font-semibold">Back to Order</h3>
              <p className="text-gray-5">{`Are you sure to go back to order product ?`}</p>
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

export default RequestOrderDetail;
