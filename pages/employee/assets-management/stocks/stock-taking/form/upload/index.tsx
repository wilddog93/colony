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
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCheck,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdChevronLeft,
  MdClose,
  MdDelete,
  MdDownload,
  MdEdit,
  MdOutlineCalendarToday,
  MdUnarchive,
  MdWarning,
} from "react-icons/md";
import SidebarComponent from "../../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../../../utils/routes";
import Modal from "../../../../../../../components/Modal";
import { ModalHeader } from "../../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import {
  LocationProps,
  OptionProps,
  ProductLocationProps,
  ProductProps,
} from "../../../../../../../utils/useHooks/PropTypes";
import {
  deleteProduct,
  getProducts,
  selectProductManagement,
} from "../../../../../../../redux/features/assets/products/productManagementReducers";
import { FaCircleNotch } from "react-icons/fa";
import {
  createRequestMove,
  createRequestOrder,
  createRequestOut,
  createRequestUsage,
  getRequests,
  selectRequestManagement,
} from "../../../../../../../redux/features/assets/stocks/requestReducers";
import DatePicker from "react-datepicker";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import DropdownSelect from "../../../../../../../components/Dropdown/DropdownSelect";
import {
  getLocations,
  selectLocationManagement,
} from "../../../../../../../redux/features/assets/locations/locationManagementReducers";
import CurrencyFormat from "react-currency-format";
import axios from "axios";
import FormProductAsset from "../../../../../../../components/Forms/assets/FormProductAsset";
import {
  getProductLocations,
  resetProductLocations,
  selectProductLocationManagement,
} from "../../../../../../../redux/features/assets/locations/productLocationManagementReducers";
import SelectTables from "../../../../../../../components/tables/layouts/server/SelectTables";
import CardTablesRow from "../../../../../../../components/tables/layouts/server/CardTablesRow";
import {
  createStockBalance,
  selectStockBalanceManagement,
} from "../../../../../../../redux/features/assets/stocks/stockBalanceReducers";

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
  assetId?: number | string;
  brandName?: string | any;
  locationId?: number | string;
  productLocationId?: string | any;
  productName?: string | any;
  serialNumber?: string | any;
  status?: boolean | any;
  location?: LocationProps[] | any[];
};

type InventoryProps = {
  productLocationId?: number | string | any;
  locationId?: number | string | any;
  brandName?: string | any;
  productName?: string | any;
  actualQty?: string | any;
  systemQty?: boolean | any;
  location?: LocationProps[] | any[];
};

type FormValues = {
  id?: number | string;
  stockBalanceNumber?: number | string;
  stockBalanceDescription?: string;
  stockBalanceCheckerName?: string | any;
  stockBalanceCheckerEmail?: string | any;
  stockBalanceApprovalName?: string | any;
  stockBalanceApprovalEmail?: string | any;
  stockBalanceAuditorName?: string | any;
  stockBalanceAuditorEmail?: string | any;
  excelFile?: string | any;
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
      padding: "0.3rem",
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
  const { pending } = useAppSelector(selectStockBalanceManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // data-table
  const [assetData, setAssetData] = useState<AssetProps[] | any[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryProps[] | any[]>(
    []
  );
  const [pages, setPages] = useState<number>(1);
  const [pagesAsset, setPagesAsset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [limitAsset, setLimitAsset] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageCountAsset, setPageCountAsset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [totalAsset, setTotalAsset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<ProductLocationProps[]>(
    []
  );
  const [tabs, setTabs] = useState<any>("asset");
  const [saveStatus, setSaveStatus] = useState<boolean>(false);

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

  // use-form

  // local-storage
  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(key);
  };

  const initiaLocalStorage: any = {
    data: getFromLocalStorage("excelFile")
      ? JSON.parse(getFromLocalStorage("excelFile") || "{}")
      : [],
    excelFile: getFromLocalStorage("base64")
      ? getFromLocalStorage("base64")
      : "",
    stockBalanceNumber: getFromLocalStorage("stockNumber")
      ? getFromLocalStorage("stockNumber")
      : "",
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
        id: "",
        stockBalanceNumber: initiaLocalStorage?.stockBalanceNumber,
        stockBalanceDescription: "",
        stockBalanceCheckerName: "",
        stockBalanceCheckerEmail: "",
        stockBalanceApprovalName: "",
        stockBalanceApprovalEmail: "",
        stockBalanceAuditorName: "",
        stockBalanceAuditorEmail: "",
        excelFile: initiaLocalStorage?.excelFile,
      }),
      []
    ),
  });

  useEffect(() => {
    reset({
      id: "",
      stockBalanceNumber: initiaLocalStorage?.stockBalanceNumber,
      stockBalanceDescription: "",
      stockBalanceCheckerName: "",
      stockBalanceCheckerEmail: "",
      stockBalanceApprovalName: "",
      stockBalanceApprovalEmail: "",
      stockBalanceAuditorName: "",
      stockBalanceAuditorEmail: "",
      excelFile: initiaLocalStorage?.excelFile,
    });
  }, []);

  // set storage
  useEffect(() => {
    let asset: AssetProps[] = [];
    let totalAsset: number = 0;
    let totalPageAsset: number = 1;
    let inventory: InventoryProps[] = [];
    let total: number = 0;
    let totalPage: number = 1;
    let location: any[] = [];
    let status = initiaLocalStorage?.data?.saveStatus;
    console.log(initiaLocalStorage, "storage");
    if (initiaLocalStorage?.data?.asset?.length > 0) {
      console.log(initiaLocalStorage?.data, "asset-data");
      initiaLocalStorage?.data?.asset?.map((item: any) => {
        asset.push({
          ...item,
          location: location,
        });
      });

      initiaLocalStorage?.data?.location?.map((item: any) => {
        location.push(item);
      });

      initiaLocalStorage?.data?.inventory?.map((item: any) => {
        inventory.push({
          ...item,
          location: location,
        });
      });

      totalAsset = initiaLocalStorage?.data?.asset?.length || 0;
      totalPageAsset =
        totalAsset >= limit
          ? Math.round(initiaLocalStorage?.data?.asset?.length / limit)
          : 1;

      total = initiaLocalStorage?.data?.inventory?.length || 0;
      totalPage =
        total >= limit
          ? Math.round(initiaLocalStorage?.data?.asset?.length / limit)
          : 1;
    }
    setAssetData(asset);
    setInventoryData(inventory);
    setPageCount(totalPage);
    setTotal(total);
    setPageCountAsset(totalPageAsset);
    setTotalAsset(totalAsset);
    setSaveStatus(status);
  }, [limit]);

  // description
  const descValue = useWatch({
    name: "stockBalanceDescription",
    control,
  });

  // discard modal
  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const onCloseDiscard = () => {
    setIsOpenDiscard(false);
  };

  // date
  const dateTimeFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY, h:mm");
    return date;
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

  const onDiscardStock = () => {
    setLoading(true);
    router.push({
      pathname: "/employee/assets-management/stocks/stock-taking/",
      query: {
        page: 1,
        limit: 10,
      },
    });
    localStorage.removeItem("base64");
    localStorage.removeItem("excelFile");
    localStorage.removeItem("stockNumber");
  };

  const columnInventory = useMemo<ColumnDef<InventoryProps, any>[]>(
    () => [
      {
        accessorKey: "productName",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "brandName",
        header: (info) => <div className="uppercase">Brand</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "locationId",
        header: (info) => <div className="uppercase">Location</div>,
        cell: ({ row, getValue }) => {
          const { location } = row?.original;
          return (
            <div className="w-full text-left">
              {location && location?.length > 0
                ? location?.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="w-full max-w-max px-2 py-1 rounded-md border-2 border-gray-4">
                      {item.locationName}
                    </div>
                  ))
                : "-"}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "systemQty",
        header: (info) => (
          <div className="w-full uppercase text-center">System</div>
        ),
        cell: ({ row, getValue }) => {
          return <div className="w-full text-center">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "actualQty",
        header: (info) => (
          <div className="w-full uppercase text-center">Actual</div>
        ),
        cell: ({ row, getValue }) => {
          return <div className="w-full text-center">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "productLocationId",
        header: (info) => (
          <div className="w-full uppercase text-center">Diff</div>
        ),
        cell: ({ row, getValue }) => {
          const { actualQty, systemQty } = row?.original;
          const result = systemQty - actualQty;
          return (
            <div
              className={`w-full text-center font-semibold ${
                result < 0 ? "text-danger" : "text-primary"
              }`}>
              {result}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const columnAsset = useMemo<ColumnDef<AssetProps, any>[]>(
    () => [
      {
        accessorKey: "productName",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "brandName",
        header: (info) => <div className="uppercase">Brand</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "locationId",
        header: (info) => <div className="uppercase">Location</div>,
        cell: ({ row, getValue }) => {
          const { location } = row?.original;
          return (
            <div className="w-full text-left">
              {location && location?.length > 0
                ? location?.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="w-full max-w-max px-2 py-1 rounded-md border-2 border-gray-4">
                      {item.locationName}
                    </div>
                  ))
                : "-"}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "serialNumber",
        header: (info) => (
          <div className="w-full uppercase text-center">Serial No.</div>
        ),
        cell: ({ row, getValue }) => {
          return <div className="w-full text-center">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: (info) => (
          <div className="w-full uppercase text-center">Status</div>
        ),
        cell: ({ row, getValue }) => {
          return (
            <div
              className={`w-full text-center font-semibold uppercase ${
                getValue() ? "text-primary" : "text-danger"
              }`}>
              {getValue() ? "Pass" : "Loss"}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    console.log(value, "form-data");
    if (!saveStatus) {
      toast.dark(
        "Stock data storage failed, there is no change in the excel file"
      );
      return;
    }
    let newObj = {
      stockBalanceNumber: value?.stockBalanceNumber,
      stockBalanceDescription: value?.stockBalanceDescription,
      stockBalanceCheckerName: value?.stockBalanceCheckerName,
      stockBalanceCheckerEmail: value?.stockBalanceCheckerEmail,
      stockBalanceApprovalName: value?.stockBalanceApprovalName,
      stockBalanceApprovalEmail: value?.stockBalanceApprovalEmail,
      stockBalanceAuditorName: value?.stockBalanceAuditorName,
      stockBalanceAuditorEmail: value?.stockBalanceAuditorEmail,
      excelFile: initiaLocalStorage?.excelFile,
    };
    dispatch(
      createStockBalance({
        token,
        data: newObj,
        isSuccess: () => {
          toast.dark(`Stock data has been uploaded`);
          onDiscardStock();
        },
        isError: () => {
          console.log("error-upload-data");
        },
      })
    );
  };

  console.log(
    {
      assetData,
      inventoryData,
      storage: initiaLocalStorage?.data?.saveStatus,
    },
    "data-product"
  );

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Upload Stock Taking"
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

          <div className="sticky tracking-wide bg-white top-0 z-50 mb-3 w-full flex flex-col border border-gray mt-5 rounded-xl shadow-card divide-y-2 divided-gray">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 p-4">
              <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                  onClick={onOpenDiscard}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                      <span className="hidden lg:inline-block capitalize">
                        Upload Data Stock
                      </span>
                    </h3>
                  </div>
                </button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold py-3 px-4 active:scale-90 border-2 border-gray-4 text-gray-6 shadow-2"
                  onClick={onOpenDiscard}>
                  <span className="hidden lg:inline-block">Cancel</span>
                  <MdClose className="w-4 h-4" />
                </button>

                <Button
                  variant="primary"
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold py-3 px-4 active:scale-90 border-2 border-primary shadow-2"
                  onClick={handleSubmit(onSubmit)}
                  disabled={pending || !isValid}>
                  {!pending ? (
                    <Fragment>
                      <span className="hidden lg:inline-block">Submit</span>
                      <MdCheckCircleOutline className="w-4 h-4" />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </Fragment>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full grid col-span-1 lg:grid-cols-3 gap-4">
            <div className="w-full lg:col-span-2 border border-gray rounded-xl text-gray-6">
              <div className="w-full flex flex-col lg:flex-row gap-2 p-4">
                <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                  <h3 className="font-semibold text-sm lg:text-lg tracking-wider">
                    Data Comparasion
                  </h3>
                </div>
              </div>

              {/* tabs */}
              <div className="w-full flex items-center px-4">
                <ul
                  role=""
                  className="w-full flex items-center gap-2 border-b-2 border-gray">
                  {Array("asset", "inventory").map((item: any, index: any) => {
                    return (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => setTabs(item)}
                          className={`inline-block py-4 px-2 text-sm uppercase font-semibold focus:outline-none ${
                            item == tabs
                              ? "border-b-2 border-primary text-primary"
                              : ""
                          }`}>
                          <span>{item}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <CardTablesRow
                loading={loading}
                setLoading={setLoading}
                pages={tabs == "asset" ? pagesAsset : pages}
                setPages={tabs == "asset" ? setPagesAsset : setPages}
                limit={tabs == "asset" ? limitAsset : limit}
                setLimit={tabs == "asset" ? setLimitAsset : setLimit}
                columns={tabs == "asset" ? columnAsset : columnInventory}
                dataTable={tabs == "asset" ? assetData : inventoryData}
                pageCount={tabs == "asset" ? pageCountAsset : pageCount}
                total={tabs == "asset" ? totalAsset : total}
                setIsSelected={setIsSelectedRow}
                headerColor="bg-white"
              />
              {tabs == "asset" && assetData?.length == 0 ? (
                <div className="px-6 text-xs text-gray-5">Data not found.</div>
              ) : null}

              {tabs == "inventory" && inventoryData?.length == 0 ? (
                <div className="px-6 text-xs text-gray-5">Data not found.</div>
              ) : null}

              <div className="w-full mb-3 px-6">
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
                      {...register("stockBalanceDescription")}
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

            {/* data */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full border border-gray rounded-xl text-gray-6 divide-y-2 divide-gray">
                <div className="w-full flex items-center gap-2 p-4">
                  <div className="w-full tracking-wider">
                    <h3 className="font-semibold text-sm lg:text-lg">
                      Stock Checker
                    </h3>
                    <p className="text-xs text-gray-5">
                      Please, fill your data
                    </p>
                  </div>
                </div>

                <div className={`w-full p-4`}>
                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceCheckerName">
                      Name <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceCheckerName"
                        placeholder="Input checker name"
                        {...register("stockBalanceCheckerName", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                        })}
                      />
                      {errors?.stockBalanceCheckerName && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceCheckerName.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceCheckerEmail">
                      Email <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceCheckerEmail"
                        placeholder="Input checker email"
                        {...register("stockBalanceCheckerEmail", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email is invalid.",
                          },
                        })}
                      />
                      {errors?.stockBalanceCheckerEmail && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceCheckerEmail.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border border-gray rounded-xl text-gray-6 divide-y-2 divide-gray">
                <div className="w-full flex items-center gap-2 p-4">
                  <div className="w-full tracking-wider">
                    <h3 className="font-semibold text-sm lg:text-lg">
                      Stock Approval
                    </h3>
                    <p className="text-xs text-gray-5">
                      Please, fill your data
                    </p>
                  </div>
                </div>

                <div className={`w-full p-4`}>
                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceApprovalName">
                      Name <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceApprovalName"
                        placeholder="Input checker name"
                        {...register("stockBalanceApprovalName", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                        })}
                      />
                      {errors?.stockBalanceApprovalName && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceApprovalName.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceApprovalEmail">
                      Email <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceApprovalEmail"
                        placeholder="Input checker email"
                        {...register("stockBalanceApprovalEmail", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email is invalid.",
                          },
                        })}
                      />
                      {errors?.stockBalanceApprovalEmail && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceApprovalEmail.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border border-gray rounded-xl text-gray-6 divide-y-2 divide-gray">
                <div className="w-full flex items-center gap-2 p-4">
                  <div className="w-full tracking-wider">
                    <h3 className="font-semibold text-sm lg:text-lg">
                      Stock Auditor
                    </h3>
                    <p className="text-xs text-gray-5">
                      Please, fill your data
                    </p>
                  </div>
                </div>

                <div className={`w-full p-4`}>
                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceAuditorName">
                      Name <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceAuditorName"
                        placeholder="Input checker name"
                        {...register("stockBalanceAuditorName", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                        })}
                      />
                      {errors?.stockBalanceAuditorName && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceAuditorName.message as any}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-3 text-sm">
                    <label
                      className="font-semibold"
                      htmlFor="stockBalanceAuditorEmail">
                      Email <span className="text-primary">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        className="text-xs w-full border-2 border-gray-5 px-2 py-1.5 focus:outline-none focus:border-primary rounded-lg"
                        type="text"
                        id="stockBalanceAuditorEmail"
                        placeholder="Input checker email"
                        {...register("stockBalanceAuditorEmail", {
                          required: {
                            value: true,
                            message: "This fill is required.",
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email is invalid.",
                          },
                        })}
                      />
                      {errors?.stockBalanceAuditorEmail && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                          <MdWarning className="w-4 h-4 mr-1" />
                          <span className="text-red-300">
                            {errors.stockBalanceAuditorEmail.message as any}
                          </span>
                        </div>
                      )}
                    </div>
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
              <h3 className="font-semibold text-base">Back to Stock Taking</h3>
              <p className="text-gray-5 text-sm">{`Are you sure to go back to stock taking ?`}</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <button
              type="button"
              className="inline-flex rounded-lg border-2 px-4 py-2 border-gray-5 shadow-2 active:scale-90 focus:outline-none"
              onClick={onCloseDiscard}>
              <span className="text-xs font-semibold">No</span>
            </button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary active:scale-90"
              onClick={() => onDiscardStock()}
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
