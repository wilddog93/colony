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
  createTransactionOrder,
  selectTransactionManagement,
} from "../../../../../../../redux/features/assets/stocks/transactionReducers";
import SelectProductOrder from "../../../../../../../components/Forms/assets/transaction/SelectProductOrder";
import {
  getLocations,
  selectLocationManagement,
} from "../../../../../../../redux/features/assets/locations/locationManagementReducers";

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

const TransactionOrderDetails = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { transaction } = useAppSelector(selectTransactionManagement);
  const { orders, order } = useAppSelector(selectOrderManagement);
  const { locations } = useAppSelector(selectLocationManagement);
  const { pending } = useAppSelector(selectTransactionManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // main-data
  const [orderData, setOrderData] = useState<OptionProps[] | any[]>([]);
  const [orderOpt, setOrderOpt] = useState<OptionProps[] | any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [assetData, setAssetData] = useState<any[]>([]);

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

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

  // discard modal
  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const onCloseDiscard = () => {
    setIsOpenDiscard(false);
  };

  // PO - Options
  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [{ orderStatus: { $in: ["On-Progress", "Approve"] } }],
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
    if (token) dispatch(getOrders({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data } = orders;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push({
          ...item,
          value: item?.id,
          label: item?.orderNumber,
        });
      });
    }
    setOrderOpt(newArr);
  }, [orders]);

  // inventory-function
  const qtyHandlerInventory = ({ value, index, locationIdx }: any) => {
    if (!value) {
      delete inventoryData[index]?.location[locationIdx]?.qty;
    }
    let items = [...inventoryData];
    if (!items[index].location[locationIdx]) {
      items[index].location = [{ qty: Number(value) }];
    }
    for (const item of items) {
      const stock = item.stock;
      const locations = item.location;

      for (const loc of locations) {
        if (loc.qty > stock) {
          loc.qty = stock;
        }
      }
    }

    items[index].location[locationIdx].qty = parseInt(`${value}`);

    items[index].totalMove = items[index]?.location?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current.qty);
    },
    0);
    let totalQty = items[index].location?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current?.qty);
    },
    0);
    items[index].available = items[index].stock - totalQty;

    setInventoryData([...items]);
  };

  const onSelectInventory = ({ value, index, locIdx }: any) => {
    if (!value) delete inventoryData[index].location[locIdx].moveTo;
    let item = [...inventoryData];
    item[index].location[locIdx].moveTo = value;
    setInventoryData(item);
  };

  const onShuffleInventory = (index: any) => {
    let item: any[] = [...inventoryData];
    item[index].location.push({
      qty: 0,
    });
    setInventoryData(item);
  };

  const onDeleteInventory = ({ index, locationIdx }: any) => {
    let item: any[] = [...inventoryData];
    item[index].location.splice(locationIdx, 1);
    item[index].totalMove = item[index]?.location?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current.qty);
    },
    0);
    let totalQty = item[index].location?.reduce(function (
      sum: any,
      current: any
    ) {
      return sum + Number(current?.qty);
    },
    0);
    item[index].available = item[index].stock - totalQty;
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
    const productArr: any[] = orderData;
    if (productArr?.length > 0) {
      productArr.map((item: any) => {
        let inv = item["orderProducts"].filter(
          (o: any) => o.product?.productType == "Inventory"
        );

        inv.map((x: any) => {
          inventory.push({
            ...x,
            id: Date.now() + Math.random(),
            orderId: x.id,
            product: x?.product,
            orderNumber: item?.orderNumber,
            stock: x.orderQty || 0,
            available: (x.orderQty || 0) - (x.orderQtyCompleted || 0),
            totalMove: 0,
            location: [{ qty: 0 }],
            orders: item?.orderProducts?.filter(
              (e: any) => e?.product?.productType == "Inventory"
            ),
          });
        });
      });
    }

    setInventoryData(inventory);
  }, [orderData]);

  // first-manipulation-data-asset
  useEffect(() => {
    const asset: any[] = [];
    const productArr: any[] = orderData;
    if (productArr?.length > 0) {
      productArr.map((item: any) => {
        let ass = item["orderProducts"].filter(
          (o: any) => o.product?.productType == "Asset"
        );

        ass.map((x: any) => {
          let length = x?.orderQty - x?.orderQtyCompleted;
          let obj = {
            ...x,
            id: Date.now() + Math.random(),
            orderId: x.id,
            product: x?.product,
            serialNumber: null,
            price: x.orderPrice,
            orderNumber: item?.orderNumber,
            qty: 1,
            location: null,
            stock: x?.orderQty - x?.orderQtyCompleted,
            orders: item?.orderProducts?.filter(
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
  }, [orderData]);

  const transformedInventory = useMemo(() => {
    const grouped: any = {};

    if (inventoryData?.length > 0) {
      inventoryData.forEach((item, index) => {
        const productKey = item?.product?.id;
        const orderKey = item?.orderId;
        const locations: any[] = [];

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: item.product.id,
            // productName: item.product.productName,
            orders: [],
          };
        }

        let order = grouped[productKey].orders.find(
          (o: any) => o.id === orderKey
        );

        item.location.map((y: any, idx: any) => {
          if (y.moveTo || parseInt(y.qty) > 0) {
            locations.push({ id: y?.moveTo?.id, qty: y?.qty });
          }
        });

        const resultLoc = locations?.reduce((acc, curr) => {
          const existingItem = acc.find((item: any) => item.id === curr.id);

          if (existingItem) {
            existingItem.qty += curr.qty;
          } else {
            acc.push({ id: curr.id, qty: curr.qty });
          }

          return acc;
        }, []);

        if (!order) {
          order = {
            id: orderKey,
            locations: resultLoc,
          };
          grouped[productKey].orders.push(order);
        }
      });
    }
    return Object.values(grouped);
  }, [inventoryData]);

  const transformedAsset = useMemo(() => {
    const grouped: any = {};

    if (assetData?.length > 0) {
      assetData.map((item) => {
        const productKey = item?.product?.id;
        const orderKey = item?.orderId;
        const locationKey = item?.location?.id;

        if (!grouped[productKey]) {
          grouped[productKey] = {
            id: item.product.id,
            // productName: item.product.productName,
            orders: [],
          };
        }

        let order = grouped[productKey].orders.find(
          (o: any) => o.id === orderKey
        );
        if (!order) {
          order = {
            id: orderKey,
            locations: [],
          };
          grouped[productKey].orders.push(order);
        }

        let locations = order?.locations.find((l: any) => l.id === locationKey);
        if (!locations) {
          locations = {
            id: locationKey,
            assets: [],
            qty: 1,
          };
          order?.locations?.push(locations);
        }

        locations?.assets?.push({
          serialNumber: item?.serialNumber,
          value: Number(item?.orderPrice) || 0,
        });
        locations.qty = locations?.assets?.length || 1;
      });
    }

    return Object.values(grouped);
  }, [assetData]);

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Form Purchase Order"
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
                        <span className="inline-block">Transaction Order</span>
                      </h3>
                    </div>
                  </button>
                  <div className="w-full max-w-[10rem] text-primary">
                    {transaction?.transactionNumber}
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
                    onClick={() => console.log("data")}
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
                        <span className="hidden lg:inline-block">Apptove</span>
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
            <SelectProductOrder
              options={orderOpt}
              items={orderData}
              setItems={setOrderData}
              defaultImage=""
              isDetail
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
                          Order No.
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Stock
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Moved
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-left">
                          Available
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
                                <td className="p-4">
                                  <div>{e?.orderNumber}</div>
                                </td>
                                <td className="p-4">
                                  <div>{e?.stock || 0}</div>
                                </td>
                                <td className="p-4">
                                  <div>{e?.totalMove || 0}</div>
                                </td>
                                <td className="p-4">
                                  <div>{e?.available || 0}</div>
                                </td>
                                <td className="p-4">
                                  <div className="w-[100px] flex">select</div>
                                </td>
                                <td className="p-4">qty</td>
                              </tr>
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
                          Order No.
                        </th>
                        <th
                          scope="col"
                          className="w-42 font-normal px-2 py-4 text-sm text-wide capitalize text-center">
                          Serial No.
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
                                  <div>{e?.orderNumber}</div>
                                </td>
                                <td className="p-4">serial number</td>
                                <td className="p-4">
                                  <div className="w-32 flex">location</div>
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
                  />
                  <div className="mt-1 text-xs flex items-center">
                    <span className="text-graydark">
                      {/* {descValue?.length || 0} / 400 characters. */}
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

export default TransactionOrderDetails;
