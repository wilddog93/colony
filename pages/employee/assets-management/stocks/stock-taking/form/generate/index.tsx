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
  const url = process.env.API_ENDPOINT + "api/";
  const router = useRouter();
  const { pathname, query } = router;
  const { type } = query;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { productLocations, pending } = useAppSelector(
    selectProductLocationManagement
  );
  const { locations } = useAppSelector(selectLocationManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // data-table
  const [productData, setProductData] = useState<ProductLocationProps[]>([]);
  const [pages, setPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelectedRow, setIsSelectedRow] = useState<ProductLocationProps[]>(
    []
  );

  // modal
  const [isOpenDiscard, setIsOpenDiscard] = useState<boolean>(false);

  // use-form
  const [watchValue, setWatchValue] = useState<FormValues | any>(null);
  const [watchChange, setWatchChange] = useState<any | null>(null);

  // location
  const [locationData, setLocationData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionProps[] | any[]>(
    []
  );
  const [selected, setSelected] = useState<any>(null);
  const [locationSelected, setLocationSelected] = useState<any[] | any>([]);

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

  // on-submit
  const onSubmit: SubmitHandler<FormValues> = (value) => {};

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
    router.push({
      pathname: "/employee/assets-management/stocks/stock-taking/",
      query: {
        page: 1,
        limit: 10,
      },
    });
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
    const { data } = locations;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newLocation.push({
          ...item,
          value: item?.id,
          label: item?.locationName,
        });
      });
    }
    return newLocation;
  }, [locations]);
  // location-option end

  // function location
  const onAddLocation = (location: any) => {
    if (!location) return;
    let dataLocations =
      !locationSelected || locationSelected?.length == 0
        ? [location]
        : [...locationSelected, location];
    let filterOpt = selectedOption?.filter((e) => e?.value != location?.id);

    const filters = Array.from(new Set(dataLocations.map((a) => a.id))).map(
      (id) => {
        return dataLocations.find((a) => a.id === id);
      }
    );

    setLocationSelected(filters);
    setSelectedOption(filterOpt);
    setSelected(null);
  };

  const onDeleteLocationHandler = (value: any) => {
    let filter = locationSelected?.filter((e: any) => e?.id != value?.id);

    setLocationSelected(filter);
    setSelectedOption([...selectedOption, value]);
  };

  useEffect(() => {
    let locations: any[] = [];
    if (locationData?.length > 0) {
      locationData.map((item: any) => {
        locations.push(item);
      });
      setLocationSelected(locations);
    }
  }, [locationData]);

  useEffect(() => {
    let newArr: any[] = [];
    if (options?.length > 0) {
      options?.forEach((e) => {
        newArr.push(e);
      });
      let filters = options.filter(
        (e) => !locationSelected?.find((item: any) => e.id === item?.id)
      );
      setSelectedOption(filters);
    }
  }, [options, locationSelected]);

  // component
  function LocationComponent(props: any) {
    const { location } = props;
    return (
      <div className="w-full flex gap-2 border-2 border-gray rounded-lg px-4 py-2 text-xs">
        <div className="w-full flex items-center gap-1">
          <div className="w-full flex items-center justify-between">
            <span>{location?.locationName}</span>
            <span>{location?.id}</span>
          </div>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => onDeleteLocationHandler(location)}
            className="inline-flex items-center ml-auto text-gray-5 focus:outline-none focus:ring-1 focus:ring-primary rounded-lg p-1 border border-gray">
            <MdClose className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const generateLocation = async (params: any) => {
    const date = new Date();
    setLoading(true);
    try {
      let date = new Date();
      axios({
        url: "api/stockBalance/generate",
        method: "POST",
        data: params.data,
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        toast.dark("Download file's successfully");
      });
    } catch (error: any) {
      let { data, status } = error?.response;
      if (data) toast.dark(data?.message[0]);
      setLoading(false);
    }
  };

  // product
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
  }, [query?.page, query?.limit]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    router.replace({ pathname, query: qr });
  }, [pages, limit]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          "location.id": {
            $in:
              locationSelected?.length > 0
                ? locationSelected?.map((item: any) => item?.id)
                : [],
          },
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);

    qb.sortBy({
      field: `product.productName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, [locationSelected, query?.page, query?.limit]);

  useEffect(() => {
    if (locationSelected?.length > 0) {
      dispatch(getProductLocations({ token, params: filters.queryObject }));
    } else {
      dispatch(resetProductLocations());
    }
  }, [token, locationSelected, filters]);

  const columns = useMemo<ColumnDef<ProductLocationProps, any>[]>(
    () => [
      {
        accessorKey: "product.productName",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          const { id, product } = row?.original;
          const images = product?.images;
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "product.productType",
        header: (info) => <div className="uppercase">Type</div>,
        cell: ({ row, getValue }) => {
          const { id, product } = row?.original;
          const images = product?.images;
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "location.locationName",
        header: (info) => <div className="uppercase">Location Name</div>,
        cell: ({ row, getValue }) => {
          const { id, product } = row?.original;
          const images = product?.images;
          return <div className="w-full text-left">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "productQty",
        header: (info) => (
          <div className="w-full uppercase text-center">Stock</div>
        ),
        cell: ({ row, getValue }) => {
          const { id, product } = row?.original;
          const images = product?.images;
          return <div className="w-full text-center">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  useEffect(() => {
    const newArr: ProductLocationProps[] = [];
    let totalPage = 1;
    let totalData = 0;
    const { data, pageCount, total } = productLocations;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
      totalPage = pageCount;
      totalData = total;
    }
    setProductData(newArr);
    setPageCount(totalPage);
    setTotal(totalData);
  }, [productLocations]);

  // console.log(assetsOpt, "asset-opt");
  console.log(productLocations, "productLocations");

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Request Stock Taking"
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
                  onClick={() => onOpenDiscard()}
                  key={"1"}>
                  <div className="flex gap-1 items-center">
                    <MdChevronLeft className="w-6 h-6" />
                    <h3 className="w-full lg:max-w-max text-center text-xl font-semibold text-graydark">
                      <span className="hidden lg:inline-block capitalize">
                        Generate Data Stock
                      </span>
                    </h3>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full grid col-span-1 lg:grid-cols-3 gap-4">
            {/* search */}
            <div className="w-full">
              <div className="w-full border border-gray rounded-xl text-gray-6 divide-y-2 divide-gray">
                <div className="w-full flex items-center gap-2 p-4">
                  <div className="w-full tracking-wider">
                    <h3 className="font-semibold text-sm lg:text-lg">
                      Locations
                    </h3>
                    <p className="text-xs text-gray-5">
                      Please, fill your location data
                    </p>
                  </div>
                </div>

                <div className={`w-full p-4`}>
                  <div className="w-full mb-3">
                    {/* <label htmlFor="user">Search :</label> */}
                    <div className="w-full flex gap-1">
                      <div className="w-[85%]">
                        <DropdownSelect
                          customStyles={stylesSelect}
                          value={selected}
                          onChange={setSelected}
                          error=""
                          className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                          classNamePrefix=""
                          instanceId="user"
                          isDisabled={false}
                          isMulti={false}
                          placeholder="Choose location"
                          options={selectedOption}
                          formatOptionLabel={""}
                          icon=""
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddLocation(selected)}
                        disabled={!selected || selected === null ? true : false}
                        className="w-[15%] bg-primary focus:outline-none text-white p-1 rounded-lg inline-flex gap-1 items-center justify-center text-xs active:scale-95 disabled:opacity-70">
                        <MdAdd className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* user data */}
                  <div className="w-full max-h-[250px] flex flex-col gap-2 overflow-x-hidden overflow-y-auto">
                    {locationSelected?.length > 0 ? (
                      locationSelected?.map((item: any, idx: any) => {
                        return <LocationComponent key={idx} location={item} />;
                      })
                    ) : (
                      <div className="text-xs text-gray-5">
                        There is no location added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-2 border border-gray rounded-xl text-gray-6">
              <div className="w-full flex flex-col lg:flex-row gap-2 p-4">
                <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                  <h3 className="font-semibold text-sm lg:text-lg tracking-wider">
                    Product Reviews
                  </h3>
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
                    onClick={() =>
                      generateLocation({
                        data: {
                          locations:
                            locationSelected?.map((item: any) => item.id) || [],
                        },
                        token: token,
                      })
                    }
                    disabled={loading || productData?.length == 0}
                    variant="primary">
                    {loading ? (
                      <Fragment>
                        <span className="hidden lg:inline-block">
                          Loading...
                        </span>
                        <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <span className="hidden lg:inline-block">Download</span>
                        <MdDownload className="w-4 h-4" />
                      </Fragment>
                    )}
                  </Button>
                </div>
              </div>

              {!productData || productData?.length == 0 ? (
                <div className="px-6 text-xs text-gray-5">Data not found.</div>
              ) : null}
              <CardTablesRow
                loading={loading}
                setLoading={setLoading}
                pages={pages}
                setPages={setPages}
                limit={limit}
                setLimit={setLimit}
                pageCount={pageCount}
                columns={columns}
                dataTable={productData}
                total={total}
                setIsSelected={setIsSelectedRow}
                headerColor="bg-white"
              />
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
