import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCheck,
  MdChevronLeft,
  MdMonetizationOn,
  MdMoreHoriz,
  MdSave,
  MdUpload,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuPayments } from "../../../../../utils/routes";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../../components/Modal/ModalComponent";
import moment from "moment";
import SidebarBody from "../../../../../components/Layouts/Sidebar/SidebarBody";
import SelectTables from "../../../../../components/tables/layouts/SelectTables";
import ManualForm from "../../../../../components/Forms/Billings/Invoices/ManualForm";
import Cards from "../../../../../components/Cards/Cards";
import { formatMoney } from "../../../../../utils/useHooks/useFunction";
import {
  getBillingById,
  getBillingUnitById,
  selectBillingManagement,
  updateStatusBilling,
} from "../../../../../redux/features/billing/billingReducers";
import {
  BillingProps,
  OptionProps,
} from "../../../../../utils/useHooks/PropTypes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import CardTablesRow from "../../../../../components/tables/layouts/server/CardTablesRow";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import {
  getTowers,
  selectTowerManagement,
} from "../../../../../redux/features/building-management/tower/towerReducers";
import {
  getFloors,
  selectFloorManagement,
} from "../../../../../redux/features/building-management/floor/floorReducers";

type Props = {
  pageProps: any;
};

const sortOpt = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

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
      padding: ".6rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 40,
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
      padding: ".6rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 40,
      // flexDirection: "row-reverse"
    };
  },
  menuList: (provided: any) => provided,
};

const ReceiptPage = ({ pageProps }: Props) => {
  moment.locale("id");
  const router = useRouter();
  const { pathname, query } = router;
  const url = process.env.ENDPOINT_API;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { towers } = useAppSelector(selectTowerManagement);
  const { floors } = useAppSelector(selectFloorManagement);
  const { pending, billing, billingUnit } = useAppSelector(
    selectBillingManagement
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState<OptionProps | any>(null);
  const [tower, setTower] = useState<OptionProps | any>(null);
  const [floor, setFloor] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState(true);
  // side-body
  const [sidebar, setSidebar] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<BillingProps[] | any[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDiscard, setIsOpenDiscard] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [details, setDetails] = useState<BillingProps | any>(null);

  // date
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState<Date | null>(start);
  const [endDate, setEndDate] = useState<Date | null>(end);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MM/DD/YYYY");
  };

  // form modal
  const onClose = () => setIsOpenModal(false);
  const onOpen = () => setIsOpenModal(true);

  // detail modal
  const onCloseDetail = () => {
    setDetails(undefined);
    setSidebar(false);
  };
  const onOpenDetail = (items: any) => {
    setDetails(items);
    setSidebar(true);
  };

  // create
  const onCloseCreate = () => {
    setIsOpenCreate(false);
    !sidebar ? setDetails(undefined) : null;
  };
  const onOpenCreate = () => {
    // setDetails(items)
    setIsOpenCreate(true);
  };

  // discard modal
  const onCloseDiscard = () => {
    setDetails(undefined);
    setIsOpenDiscard(false);
  };
  const onOpenDiscard = () => {
    // setDetails(items)
    setIsOpenDiscard(true);
  };

  const columns = useMemo<ColumnDef<BillingProps, any>[]>(
    () => [
      {
        accessorKey: "unit.unitName",
        header: (info) => <div className="uppercase">Unit</div>,
        cell: ({ getValue, row }) => {
          let { id, unit } = row?.original;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full flex items-center cursor-pointer gap-1 hover:cursor-pointer">
              <img
                src={
                  unit?.unitImage
                    ? `${url}unit/unitImage/${unit?.unitImage}`
                    : "../../../../image/no-image.jpeg"
                }
                alt="images"
                className="w-8 h-8 rounded-lg"
              />
              <div className="text-sm font-semibold">{getValue()}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 250,
        maxSize: 250,
      },
      {
        accessorKey: "totalAmount",
        cell: ({ row, getValue }) => {
          let value = getValue() || 0;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-sm text-gray-5 text-left hover:cursor-pointer">
              <div className="">Rp.{formatMoney({ amount: value })}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Amount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "totalDiscount",
        cell: ({ row, getValue }) => {
          let value = getValue() || 0;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-sm text-gray-5 text-left hover:cursor-pointer">
              <div className="">Rp.{formatMoney({ amount: value })}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Amount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "totalTax",
        cell: ({ row, getValue }) => {
          let value = getValue() || 0;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-sm text-gray-5 text-left hover:cursor-pointer">
              <div className="">Rp.{formatMoney({ amount: value })}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Amount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "totalPayment",
        cell: ({ row, getValue }) => {
          const value = getValue() || 0;
          const { totalAmount, totalDiscount, totalTax } = row?.original;
          let result =
            Number(totalAmount || 0) +
            Number(totalTax || 0) -
            Number(totalDiscount);
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className={`w-full text-sm text-right hover:cursor-pointer ${
                value < result ? "text-danger" : "text-primary"
              }`}>
              {`Rp.${formatMoney({ amount: value })}`}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-right uppercase">Payment Amount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

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

  const Total = ({ detail }: any) => {
    // const {  } = detailVal;
    const subTotal = detail?.totalAmount || 0;
    const totalTax = detail?.totalTax || 0;
    const totalDiscount = detail?.totalDiscount || 0;

    const total =
      (Number(detail?.totalAmount) || 0) +
      (Number(detail?.totalTax) || 0) -
      (Number(detail?.totalDiscount) || 0);

    // console.log(detail, "data value");

    return (
      <Fragment>
        <div className="w-full border-b-2 border-gray p-4">
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 text-gray-5">
              <h3>Sub Total</h3>
              <h3>Tax</h3>
              <h3>Discount</h3>
            </div>
            <div className="flex flex-col gap-2">
              <p>{`IDR ${formatMoney({ amount: Number(subTotal) || 0 })}`}</p>
              <p>{`IDR ${formatMoney({ amount: Number(totalTax) || 0 })}`}</p>
              <p>{`IDR ${formatMoney({
                amount: Number(totalDiscount) || 0,
              })}`}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-2 p-4">
          <div className="flex flex-col gap-2 text-gray-5">
            <h3>Total</h3>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">{`IDR ${formatMoney({
              amount: Number(total) || 0,
            })}`}</p>
          </div>
        </div>
      </Fragment>
    );
  };

  // get billing by id
  useEffect(() => {
    if (token) {
      dispatch(getBillingById({ token, id: query?.id }));
    }
  }, [query?.id, token]);

  // data-table
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch((query?.search as any) || "");
    if (query?.sort) {
      if (query?.sort == "ASC") {
        setSort({ value: query?.sort, label: "A-Z" });
      } else {
        setSort({ value: query?.sort, label: "Z-A" });
      }
    }
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    let qr: any = {
      id: query?.id,
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          $or: [
            { "unit.unitName": { $contL: query?.search } },
            // { billingNotes: { $contL: query?.search } },
          ],
        },
      ],
    };

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.search(search);
    if (!query?.sort) {
      qb.sortBy({
        field: `updatedAt`,
        order: "DESC",
      });
    } else {
      qb.sortBy({
        field: `unit.unitName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) {
      dispatch(
        getBillingUnitById({
          token,
          id: query?.id,
          params: filters.queryObject,
        })
      );
    }
  }, [token, filters, query?.id]);

  useEffect(() => {
    let newArr: any[] = [];
    let newPageCount: number = 0;
    let newTotal: number = 0;
    const { data, pageCount, total }: any = billingUnit;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
      newPageCount = pageCount;
      newTotal = total;
    }
    setDataTable(newArr);
    setPageCount(newPageCount);
    setTotal(newTotal);
  }, [billingUnit]);

  const onChangeStatus = ({ value }: any) => {
    const newObj = {
      status: value,
    };
    dispatch(
      updateStatusBilling({
        token,
        id: query?.id,
        data: newObj,
        isSuccess: () => {
          if (value == "Approve") {
            toast.dark("Invoice has been created");
            onCloseCreate();
          } else {
            toast.dark("Receipt has been rejected");
            onCloseDiscard();
          }
          dispatch(getBillingById({ token, id: query?.id }));
        },
        isError: () => {
          toast.dark("Something went wrong");
        },
      })
    );
  };

  console.log(billing, "data-billing");

  return (
    <DefaultLayout
      title="Colony"
      header="Billings & Payments"
      head="Receipt"
      logo="../../../../image/logo/logo-icon.svg"
      images="../../../../image/logo/building-logo.svg"
      userDefault="../../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdMonetizationOn,
        className: "w-8 h-8 text-meta-3",
      }}>
      <div className="absolute inset-0 mt-20 z-20 bg-boxdark flex text-white">
        <SidebarComponent
          menus={menuPayments}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 lg:overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 py-6 w-full flex flex-col gap-2">
            {/* headers */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
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

              <div className="w-full max-w-max flex gap-2 items-center mx-auto lg:mx-0">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5"
                  onClick={() => router.back()}
                  variant="secondary-outline"
                  key={"1"}>
                  <MdChevronLeft className="w-5 h-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                      Receipt Details
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className={`rounded-lg text-sm font-semibold py-3 ${
                    billing?.billingStatus === "Rejected" ? "hidden" : ""
                  }`}
                  onClick={() => onOpenDiscard()}
                  variant="danger">
                  <span className="hidden lg:inline-block">
                    Discard Receipt
                  </span>
                </Button>

                <Button
                  type="button"
                  className={`rounded-lg text-sm font-semibold py-3 ${
                    billing?.billingStatus === "Approve" ? "hidden" : ""
                  }`}
                  onClick={() => onOpenCreate()}
                  variant="primary">
                  <span className="hidden lg:inline-block">Create Invoice</span>
                </Button>
              </div>
            </div>
          </div>

          <main className="relative h-full tracking-wide text-left text-boxdark-2 overflow-auto">
            <div className="w-full h-full flex overflow-auto">
              <div className="w-full flex flex-col lg:overflow-y-auto">
                <Cards className="w-full grid grid-cols-1 lg:grid-cols-4 p-4 gap-2 tracking-wide">
                  <div className="w-full lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4 p-4 bg-gray rounded-xl shadow-card">
                    <div className="w-full lg:col-span-2">
                      <div className="text-primary font-semibold">
                        #{billing?.billingId || "-"}
                      </div>
                      <div className="text-sm">
                        {billing?.billingName || "-"}
                      </div>
                    </div>
                    <div className="w-full lg:col-span-2">
                      <div className="text-gray-5 text-sm">Periode</div>
                      <div className="text-sm">
                        {`${
                          billing?.startPeriod
                            ? `${dateFormat(billing?.startPeriod)} -`
                            : ""
                        } ${
                          billing?.endPeriod
                            ? `${dateFormat(billing?.endPeriod)}`
                            : ""
                        }`}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-gray-5 text-sm">Release Date</div>
                      <div className="text-sm">
                        {billing?.releaseDate
                          ? dateFormat(billing?.releaseDate)
                          : "-"}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-gray-5 text-sm">Due Date</div>
                      <div className="text-sm">
                        {billing?.dueDate ? dateFormat(billing?.dueDate) : "-"}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-gray-5 text-sm">Total Item</div>
                      <div className="text-sm">
                        {billing?.totalPaymentItem || 0}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex px-4 items-center gap-2">
                    <div className="w-full lg:w-1/2 text-gray-5 text-sm">
                      Selected Unit
                    </div>
                    <div className="w-full h-full lg:w-1/2 flex text-sm p-2 border-2 border-gray-4 justify-end items-center rounded-lg">
                      <span className="text-center text-xl font-semibold text-primary">
                        {billing?.totalUnit}
                      </span>
                    </div>
                  </div>
                </Cards>
                {/* filters */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2.5 p-4 lg:items-center">
                  <div className="w-full lg:col-span-2">
                    <SearchInput
                      className="w-full text-sm rounded-xl"
                      classNamePrefix=""
                      filter={search}
                      setFilter={setSearch}
                      placeholder="Search..."
                    />
                  </div>
                  <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                    <DropdownSelect
                      customStyles={stylesSelectSort}
                      value={sort}
                      onChange={setSort}
                      error=""
                      className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                      classNamePrefix=""
                      formatOptionLabel=""
                      instanceId="1"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Sorts..."
                      options={sortOpt}
                      icon="MdSort"
                      isClearable
                    />
                  </div>
                </div>
                {/* table */}
                <CardTablesRow
                  loading={loading}
                  setLoading={setLoading}
                  pages={pages}
                  setPages={setPages}
                  limit={limit}
                  setLimit={setLimit}
                  pageCount={pageCount}
                  columns={columns}
                  dataTable={dataTable}
                  total={total}
                  setIsSelected={setIsSelectedRow}
                  // isInfiniteScroll
                  // classTable="bg-gray p-4"
                />
              </div>

              <SidebarBody sidebarOpen={sidebar} setSidebarOpen={setSidebar}>
                <div className="responsive w-full h-full bg-white shadow-card overflow-auto text-sm">
                  <ModalHeader
                    className="sticky top-0 bg-white border-b-2 border-gray p-4"
                    isClose
                    onClick={() => setSidebar(false)}>
                    <div className="flex flex-col tracking-wide">
                      <h3 className="font-semibold text-primary">
                        {details?.billing?.billingId}
                      </h3>
                      <p>{details?.billing?.billingName}</p>
                    </div>
                  </ModalHeader>
                  <div className="w-full border-b-2 border-gray p-4">
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="w-full flex flex-col gap-2">
                        <h3>Status:</h3>
                        <div className="w-full flex items-center justify-between">
                          <span
                            className={`px-4 py-2 rounded-lg font-semibold ${
                              details?.billingUnitStatus == "Unpaid"
                                ? "bg-red-300 text-red-500"
                                : ""
                            }`}>
                            {details?.billingUnitStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-b-2 border-gray p-4">
                    <div className="text-gray-5">Tagihan</div>
                    <div>
                      <span>{`${details?.billing?.billingId} - ${details?.billing?.billingName}`}</span>
                    </div>
                  </div>

                  <div className="w-full border-b-2 border-gray p-4">
                    <div className="text-gray-5">Periode</div>
                    <p>{`${dateFormat(
                      details?.billing?.startPeriod
                    )} - ${dateFormat(details?.billing?.endPeriod)}`}</p>
                  </div>

                  <div className="w-full border-b-2 border-gray p-4">
                    <div className="text-gray-5">Unit</div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">
                        {details?.unit?.unitName}
                      </h3>
                    </div>
                  </div>

                  <div className="w-full border-b-2 border-gray p-4">
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-gray-5">Release Date:</h3>
                        <p className="">
                          {dateFormat(details?.billing?.releaseDate)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-gray-5">Due Date:</h3>
                        <p className="">
                          {dateFormat(details?.billing?.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Total detail={details?.billing} />

                  {/* payment */}
                  {/* <div className="w-full flex flex-col gap-2 p-4">
                    <h3 className="mb-2">Payment</h3>
                    <Cards className="w-full bg-gray p-4 flex items-center justify-between gap-2 text-sm">
                      <div className="flex flex-col gap-2 text-gray-5">
                        <h3 className="text-primary">#333A48</h3>
                        <h3>Payment with Gopay</h3>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p>IDR 00.000.000</p>
                        <p>00/00/0000</p>
                      </div>
                    </Cards>

                    <Cards className="w-full bg-gray p-4 flex items-center justify-between gap-2 text-sm">
                      <div className="flex flex-col gap-2 text-gray-5">
                        <h3 className="text-primary">#333A48</h3>
                        <h3>Payment with Gopay</h3>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p>IDR 00.000.000</p>
                        <p>00/00/0000</p>
                      </div>
                    </Cards>
                  </div> */}
                </div>
              </SidebarBody>
            </div>
          </main>
        </div>
      </div>

      {/* Create modal */}
      <Modal size="small" onClose={onCloseCreate} isOpen={isOpenCreate}>
        <Fragment>
          <ModalHeader
            className="p-4 mb-3"
            isClose={true}
            onClick={onCloseCreate}>
            <h3 className="text-lg font-semibold">Create Invoice</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4 text-center">
            <h3>Are you sure to Create invoice ID {billing?.billingId} ?</h3>
          </div>

          <div className="w-full flex items-center justify-center p-4 border-t-2 border-gray gap-2">
            <Button
              variant="primary-outline"
              className="rounded-md text-sm"
              type="button"
              onClick={onCloseCreate}>
              Cancel
            </Button>

            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              disabled={pending}
              onClick={() => onChangeStatus({ value: "Approve" })}>
              {pending ? (
                <Fragment>
                  Loading
                  <FaCircleNotch className="w-5 h-5 animate-spin-1.5" />
                </Fragment>
              ) : (
                <Fragment>
                  Yes
                  <MdCheck className="w-5 h-5" />
                </Fragment>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>

      {/* Discard modal */}
      <Modal size="small" onClose={onCloseDiscard} isOpen={isOpenDiscard}>
        <Fragment>
          <ModalHeader
            className="p-4 mb-3"
            isClose={true}
            onClick={onCloseDiscard}>
            <h3 className="text-lg font-semibold">Discard Receipt</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4 text-center">
            <h3>Are you sure to discard receipt ?</h3>
          </div>

          <ModalFooter
            className="p-4 border-t-2 border-gray justify-center"
            isClose={true}
            onClick={onCloseDiscard}>
            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              disabled={pending}
              onClick={() => onChangeStatus({ value: "Rejected" })}>
              {pending ? (
                <Fragment>
                  Loading
                  <FaCircleNotch className="w-5 h-5 animate-spin-1.5" />
                </Fragment>
              ) : (
                <Fragment>Yes, Discard it!</Fragment>
              )}
            </Button>
          </ModalFooter>
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

export default ReceiptPage;
