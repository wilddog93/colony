import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  MdDelete,
  MdDocumentScanner,
  MdDownload,
  MdOutlineCalendarToday,
  MdUnarchive,
  MdUpload,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../../utils/routes";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import Modal from "../../../../../components/Modal";
import { ModalHeader } from "../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import {
  OptionProps,
  RequestOrderProps,
  StockBalanceProps,
} from "../../../../../utils/useHooks/PropTypes";
import { selectProductManagement } from "../../../../../redux/features/assets/products/productManagementReducers";
import {
  getRequests,
  selectRequestManagement,
} from "../../../../../redux/features/assets/stocks/requestReducers";
import DatePicker from "react-datepicker";
import {
  getStockBalances,
  selectStockBalanceManagement,
} from "../../../../../redux/features/assets/stocks/stockBalanceReducers";
import {
  convertBytes,
  toBase64,
} from "../../../../../utils/useHooks/useFunction";
import { FaCircleNotch } from "react-icons/fa";
import axios from "axios";

type Props = {
  pageProps: any;
};

const sortOpt: OptionProps[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const statusOpt: OptionProps[] = [
  { value: "Approved", label: "Approved" },
  { value: "Complete", label: "Complete" },
  { value: "Declined", label: "Declined" },
  { value: "Mark As Done", label: "Mark As Done" },
  { value: "On-Progress", label: "On-Progress" },
  { value: "Waiting", label: "Waiting" },
];

const typesOpt: OptionProps[] = [
  { value: "usage", label: "Request Usage" },
  { value: "move", label: "Request Move" },
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

const RequestStockTaking = ({ pageProps }: Props) => {
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
  const { stockBalances, pending } = useAppSelector(
    selectStockBalanceManagement
  );
  const { products } = useAppSelector(selectProductManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<OptionProps | any>(null);
  const [status, setStatus] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<StockBalanceProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(1);

  // modal
  const [files, setFiles] = useState<any[]>([]);
  const [isOpenFiles, setIsOpenFiles] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // description-read
  const [isArrayHidden, setIsArrayHidden] = useState<any[]>([]);
  const onReadDescription = (val: any) => {
    const idx = isArrayHidden.indexOf(val);

    if (idx > -1) {
      // console.log("pus nihss");
      const _selected = [...isArrayHidden];
      _selected.splice(idx, 1);
      setIsArrayHidden(_selected);
    } else {
      // console.log("push ini");
      const _selected = [...isArrayHidden];
      _selected.push(val);
      setIsArrayHidden(_selected);
    }
  };

  // document modal
  const onOpenFiles = () => {
    setIsOpenFiles(true);
  };

  const onCloseFiles = () => {
    setIsOpenFiles(false);
  };

  // date
  const now = new Date();
  const [start, setStart] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [end, setEnd] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
  );
  const [dateRange, setDateRange] = useState<Date[]>([start, end]);
  const [startDate, endDate] = dateRange;

  // date
  const dateTimeFormat = (value: any) => {
    if (!value) return "-";
    const date = moment(new Date(value)).format("MMMM Do YYYY, h:mm");
    return date;
  };

  // select type modal

  const generateColorStatus = (value: any) => {
    let color = "#333";
    switch (value) {
      case "Approve":
        color = "#5F59F7";
        break;
      case "Rejected":
        color = "#FF1E00";
        break;
      case "Declined":
        color = "#FF1E00";
        break;
      case "Cancel":
        color = "#FF1E00";
        break;
      case "Done":
        color = "#8758FF";
        break;
      case "Waiting":
        color = "#FFDE00";
        break;
      case "On-Progress":
        color = "#31E1F7";
        break;
      case "Complete":
        color = "#3CCF4E";
        break;
      case "Mark As Complete":
        color = "#3CCF4E";
        break;
      default:
        return color;
    }
    return color;
  };

  const columns = useMemo<ColumnDef<StockBalanceProps, any>[]>(
    () => [
      {
        accessorKey: "stockBalanceNumber",
        header: (info) => <div className="uppercase">Stock No.</div>,
        cell: ({ row, getValue }) => {
          const { id } = row?.original;
          return (
            <button
              onClick={() =>
                router.push({
                  pathname: `/employee/assets-management/stocks/stock-taking/${id}`,
                })
              }
              type="button"
              className="w-full text-left font-semibold text-primary hover:underline active:scale-95 uppercase">
              {getValue() || "-"}
            </button>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
      {
        accessorKey: "stockBalanceDescription",
        header: (info) => <div className="uppercase">Notes</div>,
        cell: ({ row, getValue }) => {
          const { id } = row.original;
          let value =
            getValue()?.length > 70 && !isArrayHidden.includes(id)
              ? `${getValue().substring(70, 0)} ...`
              : getValue() || "-";
          return (
            <div className="flex flex-col">
              <p>{value}</p>
              <button
                onClick={() => onReadDescription(id)}
                className={`text-primary focus:outline-none font-bold mt-2 underline w-full max-w-max ${
                  getValue()?.length > 70 ? "" : "hidden"
                }`}>
                {isArrayHidden.includes(id) ? "Hide" : "Show"}
              </button>
            </div>
          );
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 250,
        minSize: 250,
      },
      {
        accessorKey: "createdAt",
        header: (info) => (
          <div className="uppercase w-full text-left">Created Date</div>
        ),
        cell: ({ row, getValue }) => {
          const value = dateTimeFormat(getValue());
          return <div className="w-full text-left">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "stockBalanceStatus",
        cell: ({ row, getValue }) => {
          const value = getValue();
          return (
            <div className="w-full text-center flex items-center justify-center">
              <span
                style={{ backgroundColor: generateColorStatus(value) }}
                className="text-white p-1 text-xs text-center rounded-lg">
                {value}
              </span>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-center uppercase">Status</div>
        ),
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedAt",
        header: (info) => (
          <div className="uppercase w-full text-left">Recent Date</div>
        ),
        cell: ({ row, getValue }) => {
          const value = dateTimeFormat(getValue());
          return <div className="w-full text-left">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [isArrayHidden]
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

  // get Products
  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search || "");
    if (query?.sort) {
      if (query?.sort == "ASC") {
        setSort({ value: query?.sort, label: "A-Z" });
      } else {
        setSort({ value: query?.sort, label: "Z-A" });
      }
    }
    if (query?.status) {
      setStatus({ value: query?.status, label: query?.status });
    }
    if (query?.startDate) {
      setStart(new Date(query?.startDate as any));
    }
    if (query?.endDate) {
      setEnd(new Date(query?.endDate as any));
    }
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.status,
    query?.startDate,
    query?.endDate,
  ]);

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit,
    };

    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    if (status) qr = { ...qr, status: status?.value };
    if (startDate)
      qr = {
        ...qr,
        startDate: moment(startDate).format("YYYY-MM-DD"),
      };
    if (endDate)
      qr = {
        ...qr,
        endDate: moment(endDate).format("YYYY-MM-DD"),
      };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort, status, startDate, endDate]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          createdAt: {
            $gte:
              moment(
                query?.startDate
                  ? query?.startDate
                  : new Date(now.getFullYear(), now.getMonth(), 1)
              ).format("YYYY-MM-DD") + "T00:00:00.000Z",
            $lte:
              moment(
                query?.endDate
                  ? query?.endDate
                  : new Date(now.getFullYear(), now.getMonth() + 1, 0)
              ).format("YYYY-MM-DD") + "T23:59:59.000Z",
          },
        },
        { stockBalanceStatus: { $contL: query?.status } },
        {
          $or: [
            { stockBalanceNumber: { $contL: query?.search } },
            { stockBalanceDescription: { $contL: query?.search } },
            { stockBalanceStatus: { $contL: query?.search } },
            {
              "stockBalanceProductLocations.productLocation.product.productName":
                {
                  $contL: query?.search,
                },
            },
            {
              "stockBalanceProductLocations.productLocation.location.locationName":
                {
                  $contL: query?.search,
                },
            },
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
        field: `stockBalanceNumber`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.status,
    query?.startDate,
    query?.endDate,
  ]);

  useEffect(() => {
    if (token)
      dispatch(getStockBalances({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = stockBalances;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [stockBalances]);

  // handle-upload-docs
  const onSelectMultiImage = (e: ChangeEvent<HTMLInputElement>) => {
    const filePathsPromises: any[] = [];
    const fileObj = e.target.files;
    const preview = async () => {
      if (fileObj) {
        const totalFiles = e?.target?.files?.length;
        if (totalFiles) {
          for (let i = 0; i < totalFiles; i++) {
            const img = fileObj[i];
            // console.log(img, 'image obj')
            filePathsPromises.push(toBase64(img));
            const filePaths = await Promise.all(filePathsPromises);
            const mappedFiles = filePaths.map((base64File) => ({
              stockNumber: "",
              fileName: base64File?.name,
              fileSize: base64File?.size,
              fileSource: base64File?.images,
            }));
            setFiles(mappedFiles);
          }
        }
      }
    };
    if (!fileObj) {
      return null;
    } else {
      preview();
    }
  };

  const calculateStockBalance = async (params: any) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    setLoading(true);
    try {
      const res = await axios.post(
        "stockBalance/calculate",
        params.data,
        config
      );
      const { data, status } = res;
      if (status == 200) {
        console.log(data, "result-calculate");
        localStorage.setItem("excelFile", JSON.stringify(data));
        localStorage.setItem("base64", files[0]?.fileSource);
        localStorage.setItem("stockNumber", files[0]?.stockNumber);
        router.push({
          pathname:
            "/employee/assets-management/stocks/stock-taking/form/upload",
        });
        onCloseFiles();
      } else {
        throw res;
      }
    } catch (error: any) {
      setLoading(false);
      const { data } = error?.response;
      if (data) toast.dark(data?.message[0]);
      // console.log(data?.message[0], "error-generate");
    }
  };

  // upload-docs
  const onUploadStockFile = (value: any) => {
    if (!value) {
      return;
    }
    let newObj = value?.excelFiles?.length > 0 ? value?.excelFiles[0] : "";
    console.log(newObj, "document");

    calculateStockBalance({
      token,
      data: {
        excelFile: newObj?.fileSource,
      },
    });

    // dispatch(
    //   createRequestDocumentById({
    //     token,
    //     id: value?.id,
    //     data: newObj,
    //     isSuccess: () => {
    //       toast.dark("Document has been uploaded");
    //       dispatch(getRequestById({ token, id: query?.id }));
    //       onCloseFiles();
    //     },
    //     isError: () => {
    //       console.log("Something went wrong!");
    //     },
    //   })
    // );
  };

  // delete-file-docs
  const onDeleteFiles = (id: any) => {
    if (fileRef.current) {
      fileRef.current.value = "";
      setFiles(files.splice(id, 0));
    }
  };

  const onChangeFileHandler = (name: any, index: any) => (event: any) => {
    let newArr = files.map((item, i) => {
      if (index == i) {
        return { ...item, [name]: event.target.value };
      } else {
        return item;
      }
    });
    // console.log({ name, index }, "select-handle");
    setFiles(newArr);
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Stock Taking"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
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
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3 border-0 gap-2.5"
                  onClick={() => router.back()}
                  variant="secondary-outline"
                  key={"1"}>
                  <div className="flex flex-col gap-1 items-start">
                    <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                      Stocking Taking
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold py-3 px-4 active:scale-90 border-2 border-gray-4 text-gray-6 shadow-2"
                  onClick={() => {
                    router.push({
                      pathname:
                        "/employee/assets-management/stocks/stock-taking/form/generate",
                    });
                  }}>
                  <span className="hidden lg:inline-block">Generate</span>
                  <MdDownload className="w-4 h-4" />
                </button>

                <Button
                  variant="primary"
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold py-3 px-4 active:scale-90 border-2 border-primary shadow-2"
                  onClick={onOpenFiles}>
                  <span className="hidden lg:inline-block">Upload</span>
                  <MdUpload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <main className="relative h-full tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-2.5 p-4 items-center">
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
                  <div className="w-full">
                    <label className="w-full text-gray-5 overflow-hidden">
                      <div className="relative">
                        <DatePicker
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update: any) => {
                            setDateRange(update);
                          }}
                          isClearable={false}
                          placeholderText={"Select date"}
                          todayButton
                          dropdownMode="select"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          disabled={false}
                          clearButtonClassName="after:w-10 after:h-10 h-10 w-10"
                          className="text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <MdOutlineCalendarToday className="absolute left-4 top-4 h-6 w-6 text-gray-5" />
                      </div>
                    </label>
                  </div>
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
                    value={status}
                    onChange={setStatus}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="status"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="All Status..."
                    options={statusOpt}
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
              />
              <div className="text-xs text-gray-5 px-6">
                {dataTable?.length == 0 && "Data not found..."}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* upload modal */}
      <Modal size="medium" onClose={onCloseFiles} isOpen={isOpenFiles}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray"
            isClose={true}
            onClick={onCloseFiles}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <p className="text-gray-5 text-sm">
                Fill your document information.
              </p>
            </div>
          </ModalHeader>

          <div className="w-full p-4 border-b-2 border-gray overflow-hidden">
            {files && files?.length > 0
              ? files?.map((file, id) => {
                  return (
                    <div className="w-full flex gap-2">
                      <div className="w-1/2 flex flex-col gap-2">
                        <div className="font-semibold">File Name</div>
                        <div className="w-full grid grid-cols-6 gap-2">
                          <div className="w-full flex max-w-[50px] h-[50px] min-h-[50px] border border-gray shadow-card rounded-lg justify-center items-center">
                            <MdDocumentScanner className="w-6 h-6" />
                          </div>
                          <div className="w-full col-span-5 text-sm">
                            <p>{file?.fileName}</p>
                            <p>
                              {file?.fileSize
                                ? convertBytes({ bytes: file?.fileSize })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-1/2 flex flex-col gap-2">
                        <label htmlFor="stockNumber">
                          Stock No. <span className="text-primary">*</span>
                        </label>
                        <div className="w-full flex gap-1">
                          <input
                            type="text"
                            value={file?.stockNumber || ""}
                            onChange={onChangeFileHandler("stockNumber", id)}
                            placeholder="Document No."
                            className="w-full text-sm rounded-lg border border-stroke bg-transparent py-1.5 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent"
                          />
                          <div className="w-full max-w-max flex justify-center items-center">
                            <Button
                              type="button"
                              variant="danger"
                              className={`rounded-lg text-sm py-1 px-2 shadow-card hover:opacity-90 active:scale-95 ml-auto`}
                              onClick={() => onDeleteFiles(id)}>
                              <MdDelete className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            <input
              type="file"
              id="document"
              placeholder="Upload Document"
              autoFocus
              className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100 ${
                files?.length > 0 ? "hidden" : ""
              }`}
              onChange={onSelectMultiImage}
              ref={fileRef}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>

          <div className="w-full flex items-center p-4 justify-end gap-2">
            <Button
              type="button"
              variant="primary"
              className="w-full rounded-lg border-2 border-primary active:scale-90 uppercase font-semibold"
              onClick={() =>
                onUploadStockFile({ excelFiles: files, id: query?.id })
              }
              disabled={loading}>
              {!loading ? (
                <span className="text-xs">Save</span>
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

export default RequestStockTaking;
