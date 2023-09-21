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
  createRequestUsage,
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
import DropdownSelect from "../../../../../../components/Dropdown/DropdownSelect";
import {
  getLocations,
  selectLocationManagement,
} from "../../../../../../redux/features/assets/locations/locationManagementReducers";

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

const NewRequestOrder = ({ pageProps }: Props) => {
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
    setProductData(items);
    setIsOpenProduct(true);
  };

  const onCloseProduct = () => {
    setIsOpenProduct(false);
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

    // const searchObj = {
    //   $and: [
    //     {
    //       $or: [
    //         { productName: { $contL: search } },
    //         { productType: { $contL: search } },
    //       ],
    //     },
    //   ],
    // };

    // qb.search(searchObj);

    qb.sortBy({
      field: `productName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, [search]);

  useEffect(() => {
    if (token) dispatch(getProducts({ token, params: filters.queryObject }));
  }, [token, filters]);

  const onSelectChange = (name: any, index: any) => (event: any) => {
    let newArr = productData.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event };
      } else {
        return item;
      }
    });
    // console.log({ name, index }, "select-handle");
    setProductData(newArr);
  };

  useEffect(() => {
    let newArr: any[] = [];
    const { data } = products;
    if (data && data?.length > 0) {
      let filterUsage = data?.filter(
        (item: any) => item.productType == "Inventory"
      );
      if (type == "usage") {
        filterUsage?.map((item: any) => {
          newArr.push({
            ...item,
            value: item?.id,
            label: item?.productName,
          });
        });
      } else {
        data?.map((item: any) => {
          newArr.push({
            ...item,
            value: item?.id,
            label: item?.productName,
          });
        });
      }
    }
    setProductOpt(newArr);
  }, [products, type]);

  const qtyHandler = ({ value, index }: any) => {
    if (!value) {
      delete productData[index]?.qty;
    }
    let items = [...productData];
    // items[index].productOrderQty = parseInt(`${value}`);
    items[index].qty = parseInt(`${value}`);
    setProductData([...items]);
  };

  const onDeleteProduct = (id: any) => {
    if (!id) return;
    let filter = productData?.filter((e) => e?.id !== id);
    setProductData(filter);
  };

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const grouped: any = {};

    if (value?.products && value?.products?.length > 0) {
      value?.products?.map((item) => {
        const productKey = item.id;
        const locationKey = item?.location?.id;

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: item.id,
            locations: [],
          };
        }

        let location = grouped[productKey].locations.find(
          (o: any) => o.id === productKey
        );
        if (!location) {
          location = {
            id: locationKey,
            qty: item?.qty,
          };
          grouped[productKey].locations.push(location);
        }
      });
    }

    let productMove = Object.values(grouped);

    let newObj: any = {
      requestNumber: value.requestNumber,
      requestDescription: value.requestDescription,
      products:
        query?.type == "move" && value?.products && value?.products?.length > 0
          ? productMove
          : query?.type == "usage" &&
            value?.products &&
            value?.products?.length > 0
          ? value?.products?.map(({ id, qty }) => ({
              id,
              qty,
            }))
          : [],
    };

    if (!newObj?.products || newObj?.products?.length == 0) {
      toast.dark("Please add products to request order!");
    } else {
      if (type == "move") {
        dispatch(
          createRequestMove({
            token,
            data: newObj,
            isSuccess: () => {
              toast.dark("Create Request Move Success");
              setTimeout(() => {
                router.back();
              }, 500);
            },
            isError: () => {
              toast.dark("Create Request Move Failed");
            },
          })
        );
      } else if (type == "usage") {
        dispatch(
          createRequestUsage({
            token,
            data: newObj,
            isSuccess: () => {
              toast.dark("Create Request Usage Success");
              setTimeout(() => {
                router.back();
              }, 500);
            },
            isError: () => {
              toast.dark("Create Request Usage Failed");
            },
          })
        );
      }
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

  console.log(productData, "product-data");

  useEffect(() => {
    if (productData?.length > 0) {
      setValue("products", productData);
    } else {
      setValue("products", []);
    }
  }, [productData]);

  useEffect(() => {
    if (productData?.length > 0) {
      productData.map((item, idx) => {
        const productQty = item["productQty"];
        const location = item["location"];
        const qty = item["qty"];
        if (!qty || qty == 0) {
          setError(`products.${idx}.qty`, {
            type: "required",
            message: "Request qty is required",
          });
        }
        if (qty > productQty) {
          setError(`products.${idx}.qty`, {
            type: "required",
            message: "Request qty must be less than current stock",
          });
        } else {
          clearErrors(`products.${idx}.qty`);
        }
        if (type == "move") {
          if (!location) {
            setError(`products.${idx}.location`, {
              type: "required",
              message: "Request qty is required",
            });
          } else {
            clearErrors(`products.${idx}.location`);
          }
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

  console.log(options, "locations");

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Request Order"
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
                        Request {query?.type}
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

            <div className="w-full grid col-span-1 lg:grid-cols-2 text-gray-6 divide-x-2 divide-gray text-sm">
              <div className="w-full p-4 flex items-center gap-2">
                <h3 className="font-semibold">Type:</h3>
                <p> {query?.type}</p>
              </div>

              <div className="w-full p-4 flex items-center gap-2">
                <h3 className="font-semibold">Date:</h3>
                <p> {dateTimeFormat(new Date())}</p>
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
                        Product Name
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                        Product Type
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-center">
                        Current Stock
                      </th>
                      <th
                        scope="col"
                        className={`font-semibold px-2 py-4 text-sm text-wide capitalize text-left ${
                          query?.type !== "move" ? "hidden" : ""
                        }`}>
                        Move To
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-center">
                        Request Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                    {productData?.length > 0 ? (
                      productData?.map((e: any, idx: any) => {
                        console.log(e, "product");
                        return (
                          <tr
                            key={idx}
                            className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                            <td className="w-[350px]">
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
                            <td className="p-4 text-center">
                              <div>{e?.productQty}</div>
                            </td>
                            <td
                              className={`p-4 ${
                                type !== "move" ? "hidden" : ""
                              }`}>
                              <div className="w-[100px] flex">
                                <DropdownSelect
                                  customStyles={stylesSelect}
                                  value={productData[idx].location || null}
                                  onChange={onSelectChange("location", idx)}
                                  error={
                                    productData[idx].location == null
                                      ? "true"
                                      : ""
                                  }
                                  className={`text-xs font-normal text-gray-5 w-[90px] focus:outline-none ${
                                    errors?.products?.[idx]?.location
                                      ? "border border-danger focus:border-danger rounded-lg"
                                      : "focus:border-primary"
                                  }`}
                                  classNamePrefix=""
                                  instanceId="user"
                                  isDisabled={false}
                                  isMulti={false}
                                  placeholder="Choose"
                                  options={
                                    e.productType === "Asset"
                                      ? options.locations
                                      : options.locationInventory
                                  }
                                  formatOptionLabel={""}
                                  isClearable={true}
                                  icon=""
                                />
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input
                                min={0}
                                max={e?.productQty}
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
                                value={productData[idx]?.qty}
                                type="number"
                                className={`w-14 max-w-max py-1.5 px-2 bg-gray border rounded focus:outline-none focus:ring-1 disabled:bg-transparent disabled:border-0 ${
                                  errors?.products?.[idx]?.qty
                                    ? "border-danger focus:ring-danger"
                                    : "border-gray focus:ring-primary"
                                }`}
                              />
                            </td>
                            <td className="p-4 w-20">
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
              onClick={() => onOpenProduct(productData)}>
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
      <Modal isOpen={isOpenProduct} onClose={onCloseProduct} size="small">
        <FormProduct
          closeModal={onCloseProduct}
          options={productOpt}
          items={productData}
          setItems={setProductData}
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

export default NewRequestOrder;
