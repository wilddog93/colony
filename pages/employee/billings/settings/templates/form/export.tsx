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
  MdCheck,
  MdChevronLeft,
  MdMonetizationOn,
  MdMoreHoriz,
  MdSave,
  MdUpload,
  MdWork,
} from "react-icons/md";
import SidebarComponent from "../../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuPayments } from "../../../../../../utils/routes";
import { SearchInput } from "../../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../../../components/Modal/ModalComponent";
import moment from "moment";
import SidebarBody from "../../../../../../components/Layouts/Sidebar/SidebarBody";
import SelectTables from "../../../../../../components/tables/layouts/server/SelectTables";
import {
  BillingProps,
  createBillingArr,
} from "../../../../../../components/tables/components/billingData";
import ManualForm from "../../../../../../components/Forms/Billings/Invoices/ManualForm";
import Cards from "../../../../../../components/Cards/Cards";
import { formatMoney } from "../../../../../../utils/useHooks/useFunction";
import ScrollCardTables from "../../../../../../components/tables/layouts/ScrollCardTables";
import {
  getUnits,
  getUnitsTenant,
  selectUnitManagement,
} from "../../../../../../redux/features/building-management/unit/unitReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { UnitProps } from "../../../../../../utils/useHooks/PropTypes";
import { IndeterminateCheckbox } from "../../../../../../components/tables/components/TableComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";

type Props = {
  pageProps: any;
};

const sortOpt = [
  { value: "A-Z", label: "A-Z" },
  { value: "Z-A", label: "Z-A" },
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
      minHeight: 20,
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
  const { units } = useAppSelector(selectUnitManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(true);
  // side-body
  const [sidebar, setSidebar] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<UnitProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState<any[]>([]);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDiscard, setIsOpenDiscard] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [details, setDetails] = useState<UnitProps>();
  const [loadingExport, setLoadingExport] = useState(false);

  // date
  const [formData, setFormData] = useState<any>(null);

  // local-storage
  const getFromLocalStorage = (key: string) => {
    if (!key || typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(key);
  };

  const initiaLocalStorage: any = {
    data: getFromLocalStorage("data-export")
      ? JSON.parse(getFromLocalStorage("data-export") || "{}")
      : [],
  };

  useEffect(() => {
    setFormData(initiaLocalStorage?.data);
  }, []);

  console.log(formData, "formData");

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MM/DD/YYYY");
  };

  // form modal
  const onOpen = (value: any) => {
    let newObj = {
      ...formData,
      payments: formData?.payments?.map((x: any) => ({
        ...x,
        billingTemplateDetailAmount: Number(x?.billingTemplateDetailAmount),
        billingDiscount: x?.billingDiscount?.id,
        billingTax: x?.billingDiscount?.id,
      })),
      units:
        value?.units?.length > 0
          ? value?.units?.map((item: any) => item.id)
          : [],
    };
    setFormData(newObj);
    setIsOpenModal(true);
  };
  const onClose = () => setIsOpenModal(false);

  // create

  // discard modal
  const onCloseDiscard = () => {
    setDetails(undefined);
    setIsOpenDiscard(false);
  };

  const onOpenDiscard = () => {
    setIsOpenDiscard(true);
  };

  const columns = useMemo<ColumnDef<UnitProps, any>[]>(
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
        accessorKey: "unitName",
        header: (info) => <div className="uppercase text-left">Unit</div>,
        cell: ({ getValue, row }) => {
          const { id } = row?.original;
          return (
            <div className="w-full flex flex-col text-left">
              {/* <div className="text-lg font-semibold text-primary">{code}</div> */}
              <div className="text-xs capitalize ">{getValue()}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "tenant.user.firstName",
        header: (info) => <div className="uppercase">Owner</div>,
        cell: ({ getValue, row }) => {
          const { id } = row?.original;
          const { user } = row?.original?.tenant;
          return (
            <div className="w-full flex flex-col">
              <div className="text-xs">
                {`${user?.firstName || "-"} ${user?.lastName || "-"}`}
              </div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "occupant.user.firstName",
        header: (info) => <div className="uppercase">Occupant</div>,
        cell: ({ getValue, row }) => {
          const { id } = row?.original;
          const user = row?.original?.occupant?.user;
          const fullName = `${
            user?.firstName ? `${user?.firstName} ${user?.lastName}` : "-"
          }`;
          return (
            <div className="w-full flex flex-col">
              <div className="text-xs">{fullName}</div>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "unitType",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full text-xs text-gray-5 text-left">
              <div className="text-xs">{getValue()?.unitTypeName}</div>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-left uppercase">Type</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "floor.tower.towerName",
        cell: ({ row, getValue }) => {
          const { id } = row?.original;
          return <div className="w-full text-xs">{getValue()}</div>;
        },
        header: (props) => <div className="w-full uppercase">Tower</div>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "floor.floorName",
        cell: ({ row, getValue }) => {
          const { id } = row?.original;
          return <div className="w-full text-xs">{getValue()}</div>;
        },
        header: (props) => <div className="w-full uppercase">Floor</div>,
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
    const subTotal = detail?.reduce(
      (acc: any, current: any) => acc + (Number(current?.amount) || 0),
      0
    );
    const totalTax = detail?.reduce(
      (acc: any, current: any) => acc + (Number(current?.tax) || 0),
      0
    );
    const totalDiscount = detail?.reduce(
      (acc: any, current: any) => acc + (Number(current?.discount) || 0),
      0
    );
    const total = detail?.reduce(
      (acc: any, current: any) =>
        acc +
        (Number(current?.amount) || 0) +
        (Number(current?.tax) || 0) -
        (Number(current?.discount) || 0),
      0
    );

    console.log(detail, "data value");

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

  const filterUnit = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [{ "tenant.id": { $notnull: true } }],
    };

    qb.search(search);
    qb.sortBy({ field: "unitName", order: "ASC" });

    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(getUnitsTenant({ token, params: filterUnit.queryObject }));
  }, [token, filterUnit]);

  useEffect(() => {
    let newArr: UnitProps[] | any[] = [];
    let newPageCount: number = 0;
    let newTotal: number = 0;

    const { data, pageCount, total } = units;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
      console.log({ data, pageCount, total }, "cek");
      newPageCount = pageCount;
      newTotal = total;
    }
    setDataTable(newArr);
    setPageCount(newPageCount);
    setTotal(newTotal);
  }, [units]);

  const onDiscard = () => {
    router.back();
    localStorage.removeItem("data-export");
  };

  const onExport = async (params: any) => {
    setLoadingExport(true);
    try {
      let date = moment(new Date()).format("MM/DD/YYYY");
      axios({
        url: "billingTemplate/generate",
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
        link.setAttribute("download", `template-${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setLoadingExport(false);
        onClose();
        toast.dark("Download file's successfully");
      });
    } catch (error: any) {
      let { data, status } = error?.response;
      if (data) toast.dark(data?.message[0]);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Billings & Payments"
      head="Export Billing Templates"
      logo="../../../../../image/logo/logo-icon.svg"
      images="../../../../../image/logo/building-logo.svg"
      userDefault="../../../../../image/user/user-01.png"
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

        <div className="relative w-full h-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 lg:overflow-y-auto">
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
                  onClick={onOpenDiscard}
                  variant="secondary-outline"
                  key={"1"}>
                  <MdChevronLeft className="w-5 h-5" />
                  <div className="flex flex-col gap-1 items-start">
                    <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                      Export Template
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={() => onOpen({ units: isSelectedRow })}
                  disabled={loadingExport || isSelectedRow?.length == 0}
                  variant="primary-outline">
                  {!loadingExport ? (
                    <Fragment>
                      <span className="hidden lg:inline-block">Export</span>
                      <MdSave className="w-4 h-4" />
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

          <main className="relative h-full tracking-wide text-left text-boxdark-2">
            <div className="w-full flex">
              <div className="w-full flex flex-col gap-2.5 lg:gap-6">
                <Cards className="w-full flex flex-col lg:flex-row p-4 gap-2 tracking-wide">
                  <div className="w-full lg:w-4/5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4 p-4 bg-gray rounded-xl shadow-card">
                    <div className="w-full lg:col-span-2">
                      <div className="text-primary font-semibold text-sm">
                        #{formData?.billingTemplateNumber}
                      </div>
                      <div className="text-xs">
                        {formData?.billingTemplateName || "-"}
                      </div>
                    </div>
                    <div className="w-full lg:col-span-2">
                      <div className="text-gray-5 text-sm">Periode</div>
                      <div className="text-xs">
                        {dateFormat(formData?.startPeriod)} -{" "}
                        {dateFormat(formData?.endPeriod)}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-gray-5 text-sm">Release Date</div>
                      <div className="text-xs">
                        {dateFormat(formData?.releaseDate)}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-gray-5 text-sm">Due Date</div>
                      <div className="text-xs">
                        {dateFormat(formData?.dueDate)}
                      </div>
                    </div>
                    <div className="w-full lg:text-center">
                      <div className="text-gray-5 text-sm">Total Item</div>
                      <div className="text-xs">
                        {formData?.payments?.length || 0}
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/5 p-4 text-center">
                    <div className="text-gray-5 text-sm">Selected Unit</div>
                    <div className="text-xs font-bold">
                      {isSelectedRow?.length}
                    </div>
                  </div>
                </Cards>
                {/* filters */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-2.5 p-4">
                  <div className="w-full lg:col-span-3">
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
                    />
                  </div>
                  <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                    <DropdownSelect
                      customStyles={stylesSelect}
                      value={sort}
                      onChange={setSort}
                      error=""
                      className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                      classNamePrefix=""
                      formatOptionLabel=""
                      instanceId="1"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Towers..."
                      options={sortOpt}
                      icon=""
                    />
                  </div>
                  <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                    <DropdownSelect
                      customStyles={stylesSelect}
                      value={sort}
                      onChange={setSort}
                      error=""
                      className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                      classNamePrefix=""
                      formatOptionLabel=""
                      instanceId="1"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="Floors..."
                      options={sortOpt}
                      icon=""
                    />
                  </div>
                </div>
                {/* table */}
                <SelectTables
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
                  isHideHeader
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Export modal */}
      <Modal size="small" onClose={onClose} isOpen={isOpenModal}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray"
            isClose={true}
            onClick={onClose}>
            <div className="w-full">
              <h3 className="text-base font-semibold">Export Template</h3>
              <p className="text-sm text-gray-5">
                Do you want to export template ?
              </p>
            </div>
          </ModalHeader>

          <div className="w-full flex items-center p-4 gap-2 justify-end">
            <Button
              variant="secondary-outline"
              className="rounded-md text-sm border-2 border-gray-4"
              type="button"
              onClick={onClose}>
              <span className="text-sm">Close</span>
            </Button>

            <Button
              variant="primary"
              className="rounded-md text-sm border-2 border-primary"
              type="button"
              onClick={() => onExport({ token, data: formData })}>
              <span className="text-sm">Yes, Export it!</span>
            </Button>
          </div>
        </Fragment>
      </Modal>

      {/* Discard modal */}
      <Modal size="small" onClose={onCloseDiscard} isOpen={isOpenDiscard}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray"
            isClose={true}
            onClick={onCloseDiscard}>
            <div className="w-full">
              <h3 className="text-base font-semibold">Go back</h3>
              <p className="text-sm text-gray-5">
                Are you sure to back to another page ?
              </p>
            </div>
          </ModalHeader>

          <div className="w-full flex items-center p-4 gap-2 justify-end">
            <Button
              variant="secondary-outline"
              className="rounded-md text-sm border-2 border-gray-4"
              type="button"
              onClick={onCloseDiscard}>
              <span className="text-sm">Close</span>
            </Button>

            <Button
              variant="primary"
              className="rounded-md text-sm border-2 border-primary"
              type="button"
              onClick={onDiscard}>
              <span className="text-sm">Yes, Cancel it!</span>
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

export default ReceiptPage;
