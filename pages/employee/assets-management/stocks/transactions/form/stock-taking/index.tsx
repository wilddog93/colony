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
  MdArrowRightAlt,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdChevronLeft,
  MdRemoveCircle,
  MdUnarchive,
  MdWarning,
} from "react-icons/md";
import SidebarComponent from "../../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../../../utils/routes";
import Modal from "../../../../../../../components/Modal";
import { ModalHeader } from "../../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { LocationProps } from "../../../../../../../utils/useHooks/PropTypes";
import { FaCircleNotch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getStockBalanceById,
  selectStockBalanceManagement,
} from "../../../../../../../redux/features/assets/stocks/stockBalanceReducers";
import { ColumnDef } from "@tanstack/react-table";
import CardTablesRow from "../../../../../../../components/tables/layouts/server/CardTablesRow";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { createTransactionStockBalance } from "../../../../../../../redux/features/assets/stocks/transactionReducers";

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
  transactionNumber?: number | string;
  transactionDescription?: string;
  stockBalance?: any[] | any;
};

type Props = {
  pageProps: any;
};

const TransactionFormStockTaking = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { stockBalance, pending } = useAppSelector(
    selectStockBalanceManagement
  );

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
  const [isSelectedRow, setIsSelectedRow] = useState<any[]>([]);
  const [tabs, setTabs] = useState("asset");

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

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
        transactionNumber: "",
        transactionDescription: "",
        stockBalance: query?.stocks ? [Number(query?.stocks) as number] : [],
      }),
      [query]
    ),
  });

  useEffect(() => {
    if (query?.stocks) {
      reset({
        transactionNumber: "",
        transactionDescription: "",
        stockBalance: [Number(query?.stocks) as number],
      });
    }
  }, [query?.stocks]);

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

  // get request-by-id
  useEffect(() => {
    if (token) dispatch(getStockBalanceById({ token, id: query?.stocks }));
  }, [token, query?.stocks]);

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

  const onDiscardTransaction = () => {
    setLoading(true);
    router.back();
  };

  // manipulate-data
  useEffect(() => {
    console.log(stockBalance, "stockBalance");
    let inventory: any[] = [];
    let asset: any[] = [];
    let totalPage: number = 1;
    let total: number = 0;
    let totalPageAsset: number = 1;
    let totalAsset: number = 0;
    const { stockBalanceProductLocations } = stockBalance;
    if (
      stockBalanceProductLocations &&
      stockBalanceProductLocations?.length > 0
    ) {
      stockBalanceProductLocations?.map((stock: any, index: any) => {
        if (stock?.productLocation) {
          inventory.push({
            id: stock?.id,
            productLocationId: stock?.productLocation?.id,
            location: [
              {
                ...stock?.productLocation?.location,
              },
            ],
            productName: stock?.productLocation.product?.productName,
            product: stock?.productLocation.product,
            systemQty: stock?.systemQty,
            actualQty:
              (stock?.systemQty || 0) -
              (stock?.losetQty || 0) +
              (stock?.unregisteredQty || 0),
          });
        }
        if (stock?.stockBalanceAssets?.length > 0) {
          stock?.stockBalanceAssets?.map((item: any) => {
            let filterLocation = item?.asset?.assetLocations?.filter(
              (x: any) => x.endTime == null
            );
            console.log(stock, "hasil");
            if (filterLocation.length > 0) {
              filterLocation.map((e: any) => {
                asset.push({
                  ...stock,
                  asset: item?.asset ?? {},
                  serialNumber: item?.asset?.serialNumber,
                  productLocationId: e?.productLocation?.id,
                  productId: item?.asset?.product?.id,
                  product: item?.asset?.product,
                  productName: item?.asset?.product?.productName,
                  location: [e?.productLocation?.location],
                  locationId: e?.productLocation?.location?.id,
                });
              });
            }
          });
        }
      });
    }
    totalAsset = asset?.length || 0;
    totalPageAsset =
      totalAsset >= limit ? Math.round(asset?.length / limitAsset) : 1;

    total = inventory?.length || 0;
    totalPage = total >= limit ? Math.round(asset?.length / limit) : 1;
    setInventoryData(inventory);
    setAssetData(asset);
    setPageCount(totalPage);
    setTotal(total);
    setPageCountAsset(totalPageAsset);
    setTotalAsset(totalAsset);
  }, [stockBalance, limit, limitAsset]);

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
      // {
      //   accessorKey: "status",
      //   header: (info) => (
      //     <div className="w-full uppercase text-center">Status</div>
      //   ),
      //   cell: ({ row, getValue }) => {
      //     return (
      //       <div
      //         className={`w-full text-center font-semibold uppercase ${
      //           getValue() ? "text-primary" : "text-danger"
      //         }`}>
      //         {getValue() ? "Pass" : "Loss"}
      //       </div>
      //     );
      //   },
      //   footer: (props) => props.column.id,
      //   enableColumnFilter: false,
      // },
    ],
    []
  );

  // submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    console.log(value, "form-data");
    if (value?.stockBalance?.length == 0) {
      toast.dark("You don't have any stock balance data.");
      return;
    }
    dispatch(
      createTransactionStockBalance({
        token,
        data: value,
        isSuccess: () => {
          toast.dark("Transaction stock taking has been created");
          router.push({
            pathname: "/employee/assets-management/stocks/transactions",
            query: {
              page: 1,
              limit: 10,
            },
          });
        },
        isError: () => {
          console.log("error-transaction-stock-taking");
        },
      })
    );
  };

  // console.log({ stockBalance }, "stock-data");

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Transaction Stock Taking"
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

          <div className="sticky bg-white top-0 z-50 py-6 mb-3 w-full flex flex-col gap-2 border border-gray mt-5 rounded-xl shadow-card px-4">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div className="w-full flex flex-col lg:flex-row gap-2 items-center mx-auto lg:mx-0">
                <button
                  type="button"
                  className="rounded-lg text-sm font-semibold border-0 gap-2.5 focus:outline-none flex items-center text-gray-6"
                  onClick={() => onOpenDiscard()}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full text-center text-xl font-semibold text-graydark capitalize">
                      <span className="inline-block">Stock Taking</span>
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
                  className={`rounded-lg text-sm font-semibold px-4 py-3 border-2 border-gray inline-flex text-gray-6 active:scale-90 shadow-1`}
                  onClick={() => onOpenDiscard()}
                  disabled={loading}>
                  {loading ? (
                    <Fragment>
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span className="hidden lg:inline-block">Discard</span>
                      <MdRemoveCircle className="w-4 h-4 inline-block lg:hidden" />
                    </Fragment>
                  )}
                </button>

                <button
                  type="button"
                  className={`inline-flex gap-2 items-center rounded-lg text-sm font-semibold px-4 py-3 active:scale-90 shadow-2 focus:outline-none border border-primary bg-primary disabled:opacity-30 disabled:active:scale-100
                      `}
                  onClick={handleSubmit(onSubmit)}
                  disabled={pending || !isValid}>
                  {pending ? (
                    <Fragment>
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span className="hidden lg:inline-block">Submit</span>
                      <MdCheckCircle className="w-4 h-4" />
                    </Fragment>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full grid col-span-1 lg:grid-cols-3 gap-2 py-4">
            <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6 lg:col-span-2">
              <div className="w-full grid grid-cols-2 items-center">
                <h3 className="text-lg font-bold tracking-widest">
                  Data Comparation
                </h3>
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
                      {...register("transactionDescription")}
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

            <div className="w-full flex flex-col gap-2">
              <div className="w-full border border-gray rounded-xl text-gray-6 divide-y-2 divide-gray tracking-wider">
                <div className="w-full flex items-center gap-2 p-4">
                  <div className="w-full tracking-wider">
                    <h3 className="font-bold text-sm lg:text-lg">
                      Responsible Users
                    </h3>
                  </div>
                </div>

                <div className={`w-full p-4 text-sm`}>
                  <div className="w-full flex flex-col mb-3 text-sm gap-2">
                    <h3 className="font-semibold">Checker</h3>
                    <div className="w-full flex items-center gap-2 justify-between p-2 bg-gray rounded-lg text-xs">
                      <div className="w-[80%]">
                        <p className="font-semibold capitalize">
                          {stockBalance?.stockBalanceCheckerName || "-"}
                        </p>
                        <p>{stockBalance?.stockBalanceCheckerEmail || "-"}</p>
                      </div>
                      <div className="w-[20%]">
                        <MdCheckCircleOutline className="text-primary w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-3 text-sm">
                    <h3 className="font-semibold">Approval</h3>
                    <div className="w-full flex items-center gap-2 justify-between p-2 bg-gray rounded-lg text-xs">
                      <div className="w-[80%]">
                        <p className="font-semibold capitalize">
                          {stockBalance?.stockBalanceApprovalName || "-"}
                        </p>
                        <p>{stockBalance?.stockBalanceApprovalEmail || "-"}</p>
                      </div>
                      <div className="w-[20%]">
                        <MdCheckCircleOutline className="text-primary w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-3 text-sm">
                    <h3 className="font-semibold">Auditor</h3>
                    <div className="w-full flex items-center gap-2 justify-between p-2 bg-gray rounded-lg text-xs">
                      <div className="w-[80%]">
                        <p className="font-semibold capitalize">
                          {stockBalance?.stockBalanceAuditorName || "-"}
                        </p>
                        <p>{stockBalance?.stockBalanceAuditorEmail || "-"}</p>
                      </div>
                      <div className="w-[20%]">
                        <MdCheckCircleOutline className="text-primary w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* notes */}
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
              <h3 className="text-base font-semibold">Back to Stock Taking</h3>
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
              onClick={() => onDiscardTransaction()}
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

export default TransactionFormStockTaking;
