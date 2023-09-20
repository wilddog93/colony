import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../../../redux/features/auth/authReducers";
import Button from "../../../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdChevronLeft,
  MdDelete,
  MdShuffle,
  MdSubdirectoryArrowRight,
  MdUnarchive,
  MdWarning,
} from "react-icons/md";
import SidebarComponent from "../../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../../../utils/routes";
import DropdownSelect from "../../../../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../../../../components/Modal";
import { ModalHeader } from "../../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import {
  OptionProps,
  ProductProps,
  RequestAssetProps,
} from "../../../../../../../utils/useHooks/PropTypes";
import { FaCircleNotch } from "react-icons/fa";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  createTransactionOut,
  createTransactionUsage,
  selectTransactionManagement,
} from "../../../../../../../redux/features/assets/stocks/transactionReducers";
import {
  getRequests,
  selectRequestManagement,
} from "../../../../../../../redux/features/assets/stocks/requestReducers";
import SelectProductRequest from "../../../../../../../components/Forms/assets/transaction/SelectProductRequest";
import {
  getProductLocations,
  selectProductLocationManagement,
} from "../../../../../../../redux/features/assets/locations/productLocationManagementReducers";
import TransactionAssetTables from "../../../../../../../components/tables/layouts/server/TransactionAssetTables";
import { ColumnDef } from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../../../../../../../components/tables/components/TableComponent";
import { formatMoney } from "../../../../../../../utils/useHooks/useFunction";
import TransactionTables from "../../../../../../../components/tables/layouts/TransactionTables";

type AssetProps = {
  id?: number | string | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  requestQty?: number | string | any;
  requestQtyCompleted?: number | string | any;
  asset?: any;
  product?: any;
  location?: any;
};

type FormValues = {
  id?: number | string;
  transactionNumber?: number | string;
  transactionDescription?: string;
  requestAssets?: AssetProps[] | any[];
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

const NewTransactionUsage = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { requests } = useAppSelector(selectRequestManagement);
  const { productLocations } = useAppSelector(selectProductLocationManagement);
  const { pending, transaction } = useAppSelector(selectTransactionManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // main-data
  const [requestData, setRequestData] = useState<OptionProps[] | any[]>([]);
  const [requestOpt, setRequestOpt] = useState<OptionProps[] | any[]>([]);
  const [orderData, setOrderData] = useState<OptionProps[] | any[]>([]);
  const [orderOpt, setOrderOpt] = useState<OptionProps[] | any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isSelectedRow, setIsSelectedRow] = useState<any[]>([]);

  // console.log("order-data", orderData);

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
        id: undefined,
        transactionNumber: "",
        transactionDescription: "",
        products: [],
      }),
      []
    ),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }): any => {
      if (value) {
        setWatchValue(value);
        setWatchChange({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // description
  const descValue = useWatch({
    name: "transactionDescription",
    control,
  });

  // discard modal
  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const onCloseDiscard = () => {
    setIsOpenDiscard(false);
  };

  // Request - Options
  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        { requestStatus: { $in: ["On-Progress", "Approve"] } },
        { requestType: { $in: ["Out"] } },
      ],
    };

    qb.search(search);
    qb.sortBy({
      field: `createdAt`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) dispatch(getRequests({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data } = requests;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.id,
          label: item?.requestNumber,
        });
      });
    }
    setRequestOpt(newArr);
  }, [requests]);
  // Request - Options end

  const onSelectInventory = (name: any, index: any) => (event: any) => {
    let newArr = inventoryData.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event };
      } else {
        return item;
      }
    });
    // console.log({ name, index }, "select-handle");
    setInventoryData(newArr);
  };
  // inventory-function-end

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

  const onDiscardRequest = () => {
    setLoading(true);
    router.back();
  };

  // first-manipulation-data-inventory
  useEffect(() => {
    const newAsset: any[] = [];
    const assetArr: any[] = requestData;
    if (assetArr?.length > 0) {
      assetArr.map((item: any) => {
        let assets = item["requestAssets"];

        assets.map((x: any) => {
          newAsset.push({
            ...x,
            product: x?.asset?.product,
          });
        });

        console.log(newAsset, "data-asset");
      });
    }

    setAssetData(newAsset);
  }, [requestData]);

  console.log(requestData, "requestData");

  // set inventory data to form-value
  useEffect(() => {
    if (isSelectedRow?.length > 0) {
      setValue(`requestAssets`, isSelectedRow);
    } else {
      setValue("requestAssets", []);
    }
  }, [isSelectedRow]);

  // location-option
  const filterLoc = useMemo(() => {
    let qb = RequestQueryBuilder.create();
    // qb.sortBy({ field: "location.locationName", order: "ASC" });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(getProductLocations({ token, params: filterLoc.queryObject }));
  }, [token, filterLoc]);

  const options = useMemo(() => {
    let locInventories: OptionProps[] = [];
    let filteredInventory = productLocations?.data?.filter(
      (x: any) => x?.productQty > 0 && x?.product?.productType == "Inventory"
    );

    const filteredAsset = productLocations?.data?.filter((item: any) => {
      return item?.assetLocations?.some((x: any) => x?.endTime === null);
    });

    const { data } = productLocations;
    if (data && data?.length > 0) {
      filteredInventory?.map((item: any) => {
        locInventories.push({
          ...item?.location,
          value: item?.location?.id,
          label: item?.location?.locationName,
          product: item?.product,

          available: item?.qty,
          total: item?.qty,
          qty: 0,
        });
      });
    }

    return { inventoryOption: locInventories };
  }, [productLocations]);
  // location-option end

  // column-table
  const columns = useMemo<ColumnDef<AssetProps, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          return (
            <IndeterminateCheckbox
              {...{
                checked: table?.getIsAllRowsSelected(),
                indeterminate: table?.getIsSomeRowsSelected(),
                onChange: table?.getToggleAllRowsSelectedHandler(),
              }}
            />
          );
        },
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 10,
        maxSize: 10,
      },
      {
        accessorKey: "product",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          const name = getValue()?.productName;
          const images = getValue()?.productImage;
          return (
            <div className="w-full flex items-center gap-1 text-left font-semibold">
              <img
                src={
                  images
                    ? `${url}product/productImage/${images}`
                    : "../../../../../image/no-image.jpeg"
                }
                alt="product-img"
                className="w-8 h-8 rounded object-cover object-center"
              />
              <div>{name || "-"}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 250,
        minSize: 250,
      },
      {
        accessorKey: "asset",
        header: (info) => <div className="uppercase">Serial No.</div>,
        cell: ({ row, getValue }) => {
          const serialNumber = getValue()?.serialNumber;
          return (
            <div className="w-full text-left font-semibold">
              {serialNumber || "-"}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "assetStatus",
        header: (info) => <div className="uppercase">Status</div>,
        cell: ({ row, getValue }) => {
          const value = getValue() || "-";
          return <div className="w-full text-left">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "assetValue",
        cell: ({ row, getValue }) => {
          const value = getValue();
          return (
            <div className="w-full text-left">
              Rp.{value ? formatMoney({ amount: value }) : "0"}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Value</div>
        ),
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    let newObj: FormValues = {
      transactionNumber: value.transactionNumber,
      transactionDescription: value.transactionDescription,
      requestAssets:
        value?.requestAssets && value?.requestAssets?.length > 0
          ? value?.requestAssets?.map((item: any) => item.id)
          : [],
    };

    if (!newObj?.requestAssets || newObj?.requestAssets?.length == 0) {
      toast.dark("Please select at least one Asset");
      return;
    }
    // console.log(newObj, "form-data");

    dispatch(
      createTransactionOut({
        token,
        data: newObj,
        isSuccess: () => {
          console.log(transaction, "transaction");
          toast.dark("Transaction usage has been created successfully.");
          router.back();
        },
        isError: () => {
          console.log("error-create-transaction-usage");
        },
      })
    );
  };

  // console.log("data-request :", requestData);
  // console.log("data-inventory :", inventoryData);
  // console.log("data-location :", { options, productLocations });
  // console.log("data-asset :", assetData);

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Form Transaction Usage"
      logo="../../../../../image/logo/logo-icon.svg"
      images="../../../../../image/logo/building-logo.svg"
      userDefault="../../../../../image/user/user-01.png"
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
                <div className="w-full max-w-max flex flex-col lg:flex-row gap-2 items-center mx-auto lg:mx-0">
                  <button
                    type="button"
                    className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                    onClick={() => onOpenDiscard()}
                    key={"1"}>
                    <div className="flex gap-1 items-center">
                      <MdChevronLeft className="w-6 h-6" />
                      <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                        <span className="inline-block">
                          Transaction Asset Out
                        </span>
                      </h3>
                    </div>
                  </button>
                  <div className="w-full max-w-[10rem] text-primary">
                    <input
                      type="text"
                      className={`w-full border-2  px-2 py-1 focus:outline-none text-lg rounded-lg ${
                        errors?.transactionNumber
                          ? "border-danger focus:border-danger"
                          : "border-gray-5 focus:border-primary"
                      }`}
                      {...register("transactionNumber", {
                        required: {
                          value: true,
                          message: "This fill is required",
                        },
                      })}
                    />
                    {errors?.transactionNumber && (
                      <div className="mt-1 text-xs flex items-center text-red-300">
                        <MdWarning className="w-4 h-4 mr-1" />
                        <span className="text-red-300">
                          {errors.transactionNumber.message as any}
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
                          New Transaction
                        </span>
                        <MdAdd className="w-4 h-4" />
                      </Fragment>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* PO */}
          <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6 mt-5">
            <div className={`w-full flex flex-col gap-1 mb-3`}>
              <h3 className="font-bold uppercase tracking-widest text-sm">
                Requested Asset Out
              </h3>
            </div>
            <SelectProductRequest
              options={requestOpt}
              items={requestData}
              setItems={setRequestData}
              defaultImage=""
            />
          </div>

          {/* inventory */}
          <div className="w-full grid grid-cols-1 gap-4 mt-5">
            <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6">
              <div className="w-full flex justify-between items-center border-b-2 border-gray pb-4">
                <h3 className="font-bold uppercase tracking-widest text-sm">
                  Asset Out
                </h3>
              </div>

              {/* table */}
              <TransactionTables
                loading={loading}
                setLoading={setLoading}
                pages={pages}
                setPages={setPages}
                limit={limit}
                setLimit={setLimit}
                pageCount={pageCount}
                columns={columns}
                dataTable={assetData}
                total={total}
                setIsSelected={setIsSelectedRow}
              />
            </div>
          </div>

          {/* description */}
          <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6 mt-5">
            <div className="w-full lg:w-1/2">
              <label
                className="col-span-1 font-bold uppercase tracking-widest"
                htmlFor="orderDescription">
                Additional Information
              </label>
              <div className="w-full col-span-4 mt-2">
                <div className="relative">
                  <textarea
                    cols={0.5}
                    rows={5}
                    maxLength={400}
                    placeholder="Notes..."
                    className="w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none "
                    {...register("transactionDescription")}
                  />
                  <div className="mt-1 text-xs flex items-center">
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

      {/* discard modal */}
      <Modal size="small" onClose={onCloseDiscard} isOpen={isOpenDiscard}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDiscard}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Back to Transactions</h3>
              <p className="text-gray-5">{`Are you sure to go back to transactions ?`}</p>
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

export default NewTransactionUsage;
