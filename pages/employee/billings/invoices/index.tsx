import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../components/Button/Button";
import {
  MdArrowRightAlt,
  MdDelete,
  MdDocumentScanner,
  MdMonetizationOn,
  MdUpload,
} from "react-icons/md";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuPayments } from "../../../../utils/routes";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import moment from "moment";
import ManualForm from "../../../../components/Forms/Billings/Invoices/ManualForm";
import {
  convertBytes,
  formatMoney,
  toBase64,
} from "../../../../utils/useHooks/useFunction";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  InvoiceProps,
  OptionProps,
} from "../../../../utils/useHooks/PropTypes";
import {
  createBilling,
  getBilling,
  getBillingInvoice,
  selectBillingManagement,
} from "../../../../redux/features/billing/billingReducers";
import CardTablesRow from "../../../../components/tables/layouts/server/CardTablesRow";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import SidebarBody from "../../../../components/Layouts/Sidebar/SidebarBody";

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
      padding: ".5rem",
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7",
      },
      minHeight: 20,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => {
    return {
      ...provided,
    };
  },
  menu: (provided: any) => {
    return {
      ...provided,
      zIndex: 999,
    };
  },
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

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { invoices, pending } = useAppSelector(selectBillingManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState(true);
  // side-body
  const [sidebar, setSidebar] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<InvoiceProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // files
  const [formData, setFormData] = useState<any>(null);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<InvoiceProps | any>(null);

  // date
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState<Date | null>(start);
  const [endDate, setEndDate] = useState<Date | null>(end);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY");
  };

  // form modal
  const onOpen = (value: any) => {
    console.log(value, "detail-open");
    let sub =
      Number(value?.totalAmount || 0) -
      Number(value?.totalDiscount || 0) +
      Number(value?.totalTax);
    setFormData({
      billingUnit: value?.id,
      totalPayment: sub - Number(value?.totalPayment || 0),
    });
    setIsOpenModal(true);
  };

  const onClose = () => {
    setFormData(null);
    setSidebar(false);
    setDetails(null);
    setIsOpenModal(false);
  };

  // detail modal
  const onCloseDetail = () => {
    setDetails(undefined);
    setSidebar(false);
  };

  const onOpenDetail = (items: any) => {
    setDetails(items);
    setSidebar(true);
  };

  const columns = useMemo<ColumnDef<InvoiceProps, any>[]>(
    () => [
      {
        accessorKey: "billing.billingName",
        header: (info) => <div className="uppercase text-left">Invoice</div>,
        cell: ({ getValue, row }) => {
          const { id } = row?.original;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              <div className="text-xs capitalize">{getValue()}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "unit.unitName",
        header: (info) => <div className="uppercase text-left">Unit</div>,
        cell: ({ getValue, row }) => {
          const { id } = row?.original;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              <div className="text-xs capitalize">{getValue()}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "billingUnitStatus",
        header: (info) => <div className="uppercase">Status</div>,
        cell: ({ getValue, row }) => {
          let value = getValue();
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className={`w-full flex flex-col font-semibold hover:cursor-pointer ${
                value == "Unpaid"
                  ? "text-danger"
                  : value == "Paid"
                  ? "text-primary"
                  : ""
              }`}>
              <div className="text-xs">{value}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "totalDiscount",
        cell: ({ row, getValue }) => {
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              <div className="">Rp.{formatMoney({ amount: getValue() })}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Discount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "totalTax",
        cell: ({ row, getValue }) => {
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              <div className="">Rp.{formatMoney({ amount: getValue() })}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Tax</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "totalAmount",
        cell: ({ row, getValue }) => {
          const value = getValue() || 0;
          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              {`Rp. ${formatMoney({ amount: value })}`}
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Amount</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "billingStatus",
        cell: ({ row, getValue }) => {
          let discount = Number(row?.original?.totalDiscount || 0);
          let tax = Number(row?.original?.totalTax || 0);
          let amount = Number(row?.original?.totalAmount || 0);

          const result = Math.round(amount + tax - discount);

          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-left hover:cursor-pointer">
              <p>{`Rp. ${formatMoney({ amount: result })}`}</p>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Total Payment</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "totalPayment",
        cell: ({ row, getValue }) => {
          let discount = Number(row?.original?.totalDiscount || 0);
          let tax = Number(row?.original?.totalTax || 0);
          let amount = Number(row?.original?.totalAmount || 0);

          const result = Math.round(amount + tax - discount);

          return (
            <div
              onClick={() => onOpenDetail(row?.original)}
              className="w-full text-xs text-right hover:cursor-pointer font-semibold">
              <span
                className={
                  getValue() < result ? "text-danger" : "text-primary"
                }>{`Rp. ${formatMoney({ amount: getValue() })}`}</span>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-right uppercase">Already Paid</div>
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
        { "billing.billingStatus": { $notin: ["Waiting", "Rejected"] } },
        {
          $or: [
            { "billing.billingName": { $contL: query?.search } },
            { "billing.billingNotes": { $contL: query?.search } },
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
        field: `billing.billingName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) {
      dispatch(getBillingInvoice({ token, params: filters.queryObject }));
    }
  }, [token, filters]);

  useEffect(() => {
    let newArr: InvoiceProps[] | any[] = [];
    let newPageCount: number = 0;
    let newTotal: number = 0;
    const { data, pageCount, total } = invoices;
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
  }, [invoices]);

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

  // console.log("invoice-data :", invoices);
  // console.log("detail-data :", details);

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

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 py-6 mb-3 w-full flex flex-col gap-2">
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
                <div className="flex flex-col gap-1 items-start">
                  <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                    Invoices
                  </h3>
                  <div className="flex items-center gap-3 font-semibold text-gray-5 tracking-wide">
                    <div>322 Overdue</div>
                    <div>322 Ongoing</div>
                    <div>32 Posted</div>
                  </div>
                </div>
              </div>

              {/* <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpenFiles}
                  variant="primary">
                  <span className="hidden lg:inline-block">Import Receipt</span>
                  <MdUpload className="w-4 h-4" />
                </Button>
              </div> */}
            </div>
          </div>

          <main className="relative h-full tracking-wide text-left text-boxdark-2 overflow-auto">
            <div className="w-full h-full flex overflow-auto">
              <div className="w-full flex flex-col gap-2.5 lg:gap-6 lg:overflow-y-auto">
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
                                : "bg-gray text-gray-6"
                            }`}>
                            {details?.billingUnitStatus}
                          </span>

                          <Button
                            type="button"
                            className={`rounded-lg active:scale-90 ${
                              details?.billingUnitStatus == "Paid"
                                ? "hidden"
                                : ""
                            }`}
                            variant="primary"
                            onClick={() => onOpen(details)}>
                            <span>Manual Payment</span>
                          </Button>
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

                  <Total detail={details} />

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

      {/* modal example */}
      <Modal size="small" onClose={onClose} isOpen={isOpenModal}>
        <Fragment>
          <ModalHeader className="p-4 mb-3" isClose={true} onClick={onClose}>
            <h3 className="text-lg font-semibold">Manual Payment</h3>
          </ModalHeader>
          <ManualForm
            isOpen={isOpenModal}
            onClose={onClose}
            items={formData}
            token={token}
            getData={() =>
              dispatch(
                getBillingInvoice({ token, params: filters.queryObject })
              )
            }
          />
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
