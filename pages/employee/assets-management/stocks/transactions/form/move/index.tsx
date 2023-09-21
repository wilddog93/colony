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
} from "../../../../../../../utils/useHooks/PropTypes";
import { FaCircleNotch } from "react-icons/fa";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  getOrders,
  selectOrderManagement,
} from "../../../../../../../redux/features/assets/stocks/orderReducers";
import {
  createTransactionMove,
  createTransactionOrder,
  selectTransactionManagement,
} from "../../../../../../../redux/features/assets/stocks/transactionReducers";
import SelectProductOrder from "../../../../../../../components/Forms/assets/transaction/SelectProductOrder";
import {
  getLocations,
  selectLocationManagement,
} from "../../../../../../../redux/features/assets/locations/locationManagementReducers";
import {
  getRequests,
  selectRequestManagement,
} from "../../../../../../../redux/features/assets/stocks/requestReducers";
import SelectProductRequest from "../../../../../../../components/Forms/assets/transaction/SelectProductRequest";
import {
  getProductLocations,
  selectProductLocationManagement,
} from "../../../../../../../redux/features/assets/locations/productLocationManagementReducers";

type FormValues = {
  id?: number | string;
  transactionNumber?: number | string;
  transactionDescription?: string;
  products?: ProductProps[] | any[];
  inventories?: ProductProps[] | any[];
  assets?: ProductProps[] | any[];
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

const NewTransactionMove = ({ pageProps }: Props) => {
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

  const inventories = useFieldArray({
    control,
    name: "inventories",
  });
  // { fields, remove, replace }

  const assets = useFieldArray({
    control,
    name: "assets",
  });

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
        { requestType: { $in: ["Move"] } },
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

  // inventory-function
  const qtyHandlerInventory = ({ value, index, locationIdx }: any) => {
    if (!value) {
      delete inventoryData[index]?.selectedLocation[locationIdx]?.qty;
    }
    let items = [...inventoryData];
    if (!items[index].selectedLocation[locationIdx]) {
      items[index].selectedLocation = [{ qty: Number(value) }];
    }
    // for (const item of items) {
    //   const moved = item.totalMove;
    //   const locations = item.selectedLocation;

    //   for (const loc of locations) {
    //     if (loc.qty > moved) {
    //       loc.qty = moved;
    //     }
    //   }
    // }

    items[index].selectedLocation[locationIdx].qty = parseInt(`${value}`);
    let totalQty = items[index].selectedLocation?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current?.qty);
    },
    0);
    items[index].totalMove = totalQty;
    setInventoryData([...items]);
  };

  const onSelectInventory = ({ value, index, locIdx }: any) => {
    if (!value) delete inventoryData[index].selectedLocation[locIdx].moveTo;
    let item = [...inventoryData];
    item[index].selectedLocation[locIdx].moveTo = value;
    setInventoryData(item);
  };

  const onShuffleInventory = (index: any) => {
    let item: any[] = [...inventoryData];
    item[index].selectedLocation.push({
      qty: 0,
    });
    setInventoryData(item);
  };

  const onDeleteInventory = ({ index, locationIdx }: any) => {
    let item: any[] = [...inventoryData];
    item[index].selectedLocation.splice(locationIdx, 1);
    let totalQty = item[index].selectedLocation?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current?.qty);
    },
    0);
    item[index].totalMove = totalQty;
    setInventoryData(item);
  };
  // inventory-function-end

  // asset-fuction
  const updateFieldChanged = (name: any, index: any) => (event: any) => {
    let newArr = assetData.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event.target.value };
      } else {
        return item;
      }
    });
    setAssetData(newArr);
  };

  const onSelectAsset = (name: any, index: any) => (event: any) => {
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
  // asset function-end

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
    const inventory: any[] = [];
    const productArr: any[] = requestData;
    if (productArr?.length > 0) {
      productArr.map((item: any) => {
        let inv = item["requestProducts"].filter(
          (o: any) => o.product?.productType == "Inventory"
        );

        inv.map((x: any) => {
          inventory.push({
            ...x,
            id: Date.now() + Math.random(),
            requestId: x.id,
            product: x?.product,
            requestNumber: item?.requestNumber,
            stock: x?.requestQty - x?.requestQtyCompleted,
            available: x?.requestQty - x?.requestQtyCompleted,
            totalMove: 0,
            location: [
              {
                moveTo: {
                  ...x?.location,
                  value: x.location.id,
                  label: x.location.locationName,
                },
                qty: x.requestQty,
              },
            ],
            selectedLocation: [],
            requests: item?.requestProducts?.filter(
              (e: any) => e?.product?.productType == "Inventory"
            ),
          });
        });

        console.log(inv, "data-inventory");
      });
    }

    setInventoryData(inventory);
  }, [requestData]);

  // first-manipulation-data-asset
  useEffect(() => {
    const asset: any[] = [];
    const productArr: any[] = requestData;
    if (productArr?.length > 0) {
      productArr.map((item: any) => {
        let ass = item["requestProducts"].filter(
          (o: any) => o.product?.productType == "Asset"
        );

        ass.map((x: any) => {
          let length = x?.requestQty;
          let obj = {
            ...x,
            id: Date.now() + Math.random(),
            requestId: x.id,
            product: x?.product,
            requestNumber: item?.requestNumber,
            stock: x?.requestQty - x?.requestQtyCompleted,
            qty: x?.requestQty - x?.requestQtyCompleted,
            location: {
              ...x?.location,
              qty: x?.requestQty - x?.requestQtyCompleted,
            },
            selectedLocation: null,
            requests: item?.requestProducts?.filter(
              (e: any) => e?.product?.productType == "Asset"
            ),
          };
          let newAssets = new Array(length);
          newAssets.fill(obj);
          asset.push(...newAssets);
        });
      });
    }
    setAssetData(asset);
  }, [requestData]);

  const transformedInventory = useMemo(() => {
    const grouped: any = {};

    if (inventoryData?.length > 0) {
      inventoryData.forEach((item, index) => {
        const productKey = item?.product?.id;
        const requestKey = item?.requestId;
        const locations: any[] = [];

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: item.product.id,
            // productName: item.product.productName,
            requests: [],
          };
        }

        let request = grouped[productKey].requests.find(
          (o: any) => o.id === requestKey
        );

        if (item.selectedLocation?.length > 0) {
          item?.selectedLocation?.map((y: any, idx: any) => {
            if (y?.moveTo?.id || parseInt(y?.qty) > 0) {
              locations.push({ id: y?.moveTo?.id, qty: y?.qty });
            }
          });
        } else {
          item?.location?.map((y: any, idx: any) => {
            if (y.moveTo.id || parseInt(y.qty) > 0) {
              locations.push({ id: y?.moveTo?.id, qty: y?.qty });
            }
          });
        }
        const resultLoc = locations?.reduce((acc, curr) => {
          const existingItem = acc.find((item: any) => item.id === curr.id);

          if (existingItem) {
            existingItem.qty += curr.qty;
          } else {
            acc.push({ id: curr?.id, qty: curr.qty });
          }

          return acc;
        }, []);

        if (!request) {
          request = {
            id: requestKey,
            locations: resultLoc,
          };
          grouped[productKey].requests.push(request);
        }
      });
    }
    return Object.values(grouped);
  }, [inventoryData]);

  console.log(inventoryData, "data-inven");

  const transformedAsset = useMemo(() => {
    const grouped: any = {};

    if (assetData?.length > 0) {
      assetData.map((item) => {
        const productKey = item?.product?.id;
        const requestKey = item?.requestId;
        const locationKey = item?.selectedLocation?.id;

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: item.product.id,
            // productName: item.product.productName,
            requests: [],
          };
        }

        let request = grouped[productKey].requests?.find(
          (o: any) => o.id === requestKey
        );
        if (!request) {
          request = {
            id: requestKey,
            qty: item?.qty,
            locations: [],
          };
          grouped[productKey]?.requests?.push(request);
        }

        let locations = request?.locations.find(
          (l: any) => l.id === locationKey
        );
        if (!locations) {
          locations = {
            id: locationKey,
            assets: [],
            qty: 1,
          };
          request?.locations?.push(locations);
        }

        locations?.assets?.push(item?.selectedLocation?.assets?.id);
        locations.qty = locations?.assets?.length || 1;
      });
    }

    return Object.values(grouped);
  }, [assetData]);

  // error-inventory
  const errorInventory = useMemo(() => {
    let newErr = {
      available: false,
      locations: false,
      qty: false,
    };
    if (inventoryData?.length > 0) {
      inventoryData?.map((item, index) => {
        let totalQty = item?.selectedLocation?.reduce(function (
          sum: any,
          current: any
        ) {
          return sum + Number(current?.qty);
        },
        0);
        item?.selectedLocation.map((o: any, i: any) => {
          if (o.moveTo == null) {
            newErr.locations = true;
          } else {
            newErr.locations = false;
          }
          if (!o.qty || o.qty == 0) {
            newErr.qty = true;
          } else {
            newErr.qty = false;
          }
        });
        if (item?.available < totalQty) {
          newErr.available = true;
        } else {
          newErr.available = false;
        }
      });
    }
    return newErr;
  }, [inventoryData]);

  // error-asset
  const errorAsset = useMemo(() => {
    let newErr = {
      locations: false,
    };
    if (assetData?.length > 0) {
      assetData?.map((item, index) => {
        if (!item.selectedLocation || item.selectedLocation == null) {
          newErr.locations = true;
        } else {
          newErr.locations = false;
        }
      });
    }
    return newErr;
  }, [assetData]);

  // set inventory data to form-value
  useEffect(() => {
    if (inventoryData?.length > 0) {
      setValue(`inventories`, transformedInventory);
    } else {
      setValue("inventories", []);
    }
  }, [transformedInventory]);

  // set asset data to form-valu
  useEffect(() => {
    if (assetData?.length > 0) {
      setValue(`assets`, transformedAsset);
    } else {
      setValue("assets", []);
    }
  }, [transformedAsset]);

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
    let locAssets: OptionProps[] = [];
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
      filteredAsset?.map((item: any) => {
        if (item?.assetLocations?.length > 0) {
          item?.assetLocations?.map((x: any) => {
            locAssets.push({
              ...item,
              productQty: item?.productQty,
              assets: x?.asset,
              value: x?.asset?.serialNumber,
              label: x?.asset?.serialNumber,
            });
          });
        }
      });
    }

    return { inventoryOption: locInventories, assetOption: locAssets };
  }, [productLocations]);

  const formatOptionLabelLocation = (props: any) => {
    return (
      <div className="w-full flex flex-row items-center justify-between text-xs">
        <div className="text-gray-500">
          <span>From :</span>
          <span className="font-bold ml-1">{props?.label}</span>
        </div>
        <div className="text-gray-500">
          <span>Available :</span>
          <span className="font-bold ml-1">{props?.productQty}</span>
        </div>
      </div>
    );
  };

  const filterredLocation = ({ productId, locationId }: any) => {
    const newLocation: Array<any> = [];
    let locationOptions: Array<any> = options.inventoryOption;
  };
  // location-option end

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const concatenatedArraySpread: any[] = [
      ...(value.inventories || []),
      ...(value?.assets || []),
    ];
    let newObj: FormValues = {
      transactionNumber: value.transactionNumber,
      transactionDescription: value.transactionDescription,
      products: concatenatedArraySpread,
    };

    if (!newObj?.products || newObj?.products?.length == 0) {
      toast.dark("Please, fill your transaction move");
      return;
    }
    if (
      errorInventory.available ||
      errorInventory.locations ||
      errorInventory.qty ||
      errorAsset.locations
    ) {
      toast.dark("Please, fill your transaction order correctly");
      return;
    }
    console.log(newObj, "form-data");

    dispatch(
      createTransactionMove({
        token,
        data: newObj,
        isSuccess: () => {
          console.log(transaction, "transaction");
          toast.dark("Transaction move has been created successfully.");
          router.back();
        },
        isError: () => {
          console.log("error-create-transaction-move");
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
      head="Form Transaction Move"
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
                        <span className="inline-block">Transaction Move</span>
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
                Requested Move
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
                  Inventory
                </h3>
              </div>

              <div className="grid grid-cols-1 text-gray-6">
                <div className="col-span-1 rounded-lg">
                  <table className="w-full rounded-lg">
                    <thead className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
                      <tr>
                        <th
                          scope="col"
                          className="w-[250px] font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Product
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Request No.
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Move To
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-center">
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Split
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                      {inventoryData?.length > 0 ? (
                        inventoryData?.map((e: any, idx: any) => {
                          return (
                            <Fragment key={idx}>
                              <tr className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                                <td className="w-[250px]">
                                  <div className="w-full flex items-center border border-gray rounded-lg bg-gray p-2">
                                    <img
                                      src={
                                        e?.product?.productImages
                                          ? `${url}product/files/${e?.product?.productImages}`
                                          : "../../../../../image/no-image.jpeg"
                                      }
                                      alt="img-product"
                                      className="object cover object-center w-6 h-6 rounded mr-1"
                                    />
                                    <div>{e?.product?.productName}</div>
                                  </div>
                                </td>
                                <td className="py-4 px-2">
                                  <div>{e?.requestNumber}</div>
                                </td>
                                <td className="py-4 px-2">
                                  <div className="w-42 flex">
                                    {e.location?.map?.((loc: any) =>
                                      loc?.moveTo?.locationName?.split("")
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-4">
                                  {e.available || 0}
                                </td>
                                <td className="py-2 px-4">
                                  <button
                                    className="flex items-center px-2 py-2 rounded-lg border-2 border-primary bg-primary text-white shadow-1 active:scale-90 disabled:opacity-50 disabled:active:scale-100"
                                    type="button"
                                    disabled={
                                      e.totalMove == e.available ||
                                      options.inventoryOption?.length == 0
                                    }
                                    onClick={() => onShuffleInventory(idx)}>
                                    <MdShuffle className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                              {e?.selectedLocation?.length > 0 &&
                                e?.selectedLocation?.map(
                                  (loc: any, locIdx: any) => {
                                    let totalQty = e?.selectedLocation?.reduce(
                                      function (sum: any, current: any) {
                                        return sum + Number(current?.qty);
                                      },
                                      0
                                    );
                                    return (
                                      <tr
                                        key={locIdx}
                                        className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                                        <td className="py-2 px-4">
                                          <div className="w-full flex items-center">
                                            <MdSubdirectoryArrowRight className="w-5 h-5 mr-5" />
                                            <img
                                              src={
                                                e?.product?.productImages
                                                  ? `${url}product/productImage/${e?.product?.productImages}`
                                                  : "../../../../../image/no-image.jpeg"
                                              }
                                              alt="img-product"
                                              className="object cover object-center w-10 h-10 rounded mr-1"
                                            />
                                            <span>
                                              {e?.product?.productName}
                                            </span>
                                          </div>
                                        </td>
                                        <td colSpan={3} className="py-2 px-4">
                                          <div className="w-full flex">
                                            <DropdownSelect
                                              customStyles={stylesSelect}
                                              value={
                                                inventoryData[idx]
                                                  .selectedLocation[locIdx]
                                                  .moveTo || null
                                              }
                                              onChange={(value: any) => {
                                                onSelectInventory({
                                                  value,
                                                  index: idx,
                                                  locIdx,
                                                });
                                              }}
                                              error=""
                                              className={`text-xs font-normal text-gray-5 w-[90px] focus:outline-none ${
                                                inventoryData[idx]
                                                  .selectedLocation[locIdx]
                                                  .moveTo == null
                                                  ? "border border-danger focus:border-danger rounded-lg"
                                                  : "focus:border-primary"
                                              }`}
                                              classNamePrefix=""
                                              instanceId="user"
                                              isDisabled={false}
                                              isMulti={false}
                                              placeholder="Choose"
                                              options={options?.inventoryOption?.filter(
                                                (item: any) =>
                                                  item?.product?.id ==
                                                    e?.product?.id &&
                                                  item?.location?.id !==
                                                    e?.location[idx]?.moveTo?.id
                                              )}
                                              formatOptionLabel={""}
                                              isClearable={true}
                                              icon=""
                                            />
                                          </div>
                                        </td>
                                        <td className="py-2 px-4">
                                          <input
                                            min={0}
                                            max={
                                              e?.available - e?.totalMove == 0
                                                ? 0
                                                : e?.available
                                            }
                                            value={loc?.qty || ""}
                                            onChange={({ target }) => {
                                              qtyHandlerInventory({
                                                value: target.value,
                                                index: idx,
                                                locationIdx: locIdx,
                                              });
                                            }}
                                            type="number"
                                            className={`w-14 max-w-max py-1.5 px-2 bg-white border rounded-lg focus:outline-none disabled:bg-transparent disabled:border-0
                                        ${
                                          !inventoryData[idx].selectedLocation[
                                            locIdx
                                          ]?.qty ||
                                          inventoryData[idx].selectedLocation[
                                            locIdx
                                          ]?.qty == 0 ||
                                          e.available < totalQty
                                            ? "border-danger focus:border-danger"
                                            : "border-gray focus:border-primary"
                                        }
                                      `}
                                          />
                                        </td>
                                        <td className="p-4">
                                          <button
                                            className="flex items-center px-2 py-2 rounded-lg border-2 border-gray shadow-1 active:scale-90"
                                            type="button"
                                            onClick={() =>
                                              onDeleteInventory({
                                                index: idx,
                                                locationIdx: locIdx,
                                              })
                                            }>
                                            <MdDelete className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                            </Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12} className="p-4">
                            <div className="text-sm italic text-gray-500 font-semibold">
                              There is no inventory data.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* assets */}
          <div className="w-full grid grid-cols-1 gap-4 mt-5">
            <div className="w-full p-4 border border-gray rounded-xl shadow-card text-gray-6">
              <div className="w-full flex justify-between items-center border-b-2 border-gray pb-4">
                <h3 className="font-bold uppercase tracking-widest text-sm">
                  Asset
                </h3>
              </div>

              <div className="grid grid-cols-1 text-gray-6">
                <div className="col-span-1 rounded-lg">
                  <table className="w-full rounded-lg">
                    <thead className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase border-b-2 border-gray">
                      <tr>
                        <th
                          scope="col"
                          className="w-[250px] font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Product
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Request No.
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          From
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Asset ID
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Move To
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y-0 divide-gray-5 text-gray-6 text-xs">
                      {assetData?.length > 0 ? (
                        assetData?.map((e: any, idx: any) => {
                          return (
                            <Fragment key={idx}>
                              <tr className="w-full bg-white p-4 rounded-lg mb-2 text-xs">
                                <td className="w-[250px]">
                                  <div className="w-full flex items-center border border-gray rounded-lg bg-gray p-2">
                                    <img
                                      src={
                                        e?.product?.productImages
                                          ? `${url}product/files/${e?.product?.productImages}`
                                          : "../../../../../image/no-image.jpeg"
                                      }
                                      alt="img-product"
                                      className="object cover object-center w-6 h-6 rounded mr-1"
                                    />
                                    <div>{e?.product?.productName}</div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div>{e?.requestNumber}</div>
                                </td>
                                <td className="p-4">
                                  <div>{e?.location?.locationName}</div>
                                </td>
                                <td className="p-4">
                                  <div className="w-full flex">
                                    <DropdownSelect
                                      customStyles={stylesSelect}
                                      value={e.selectedLocation || null}
                                      onChange={onSelectAsset(
                                        "selectedLocation",
                                        idx
                                      )}
                                      error=""
                                      className={`text-xs font-normal text-gray-5 w-[90px] rounded-lg
                                        ${
                                          !e.selectedLocation ||
                                          e.selectedLocation == null
                                            ? "border border-danger focus:border-danger"
                                            : "focus:border-primary"
                                        }}
                                      `}
                                      classNamePrefix=""
                                      instanceId="user"
                                      isDisabled={false}
                                      isMulti={false}
                                      placeholder="Choose"
                                      options={options?.assetOption?.filter(
                                        (x: any) =>
                                          x?.product?.id == e?.product.id
                                      )}
                                      formatOptionLabel={
                                        formatOptionLabelLocation
                                      }
                                      isClearable={true}
                                      icon=""
                                    />
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div>
                                    {
                                      e?.selectedLocation?.location
                                        ?.locationName
                                    }
                                  </div>
                                </td>
                              </tr>
                            </Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={12} className="p-4">
                            <div className="text-sm italic text-gray-500 font-semibold">
                              There is no asset data.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
                    className="w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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

export default NewTransactionMove;
