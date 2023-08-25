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

const NewRequestOrder = ({ pageProps }: Props) => {
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
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

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

  useEffect(() => {
    let newArr: any[] = [];
    const { data } = products;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.id,
          label: item?.productName,
        });
      });
    }
    setProductOpt(newArr);
  }, [products]);

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
            }, 1000);
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
    if (productData?.length > 0) {
      setValue("products", productData);
    } else {
      setValue("products", []);
    }
  }, [productData]);

  useEffect(() => {
    if (productData?.length > 0) {
      productData.map((item, idx) => {
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
  }, [productData]);

  const onDiscardRequest = () => {
    setLoading(true);
    router.back();
  };

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

          <div className="sticky bg-white top-0 z-50 py-6 mb-3 w-full flex flex-col gap-2 border border-gray mt-5 rounded-xl shadow-card px-4">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                  onClick={() => onOpenDiscard()}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                      New{" "}
                      <span className="hidden lg:inline-block">
                        Request Order
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

          <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6">
            <div className="grid grid-cols-1 text-gray-6">
              <div className="col-span-1 overflow-x-auto">
                <table className="w-full table-auto overflow-hidden rounded-xl shadow-md">
                  <thead className="text-lefttext-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
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
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-center">
                        Min Stock
                      </th>
                      <th
                        scope="col"
                        className="font-semibold px-2 py-4 text-sm text-wide capitalize text-left">
                        Request Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                    {productData?.length > 0 ? (
                      productData?.map((e: any, idx: any) => {
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
                            <td className="p-4 text-center">
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
                                value={productData[idx]?.qty}
                                type="number"
                                className={`w-14 max-w-max py-1.5 px-2 bg-gray border rounded focus:outline-none focus:ring-1 disabled:bg-transparent disabled:border-0 ${
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

export default NewRequestOrder;
