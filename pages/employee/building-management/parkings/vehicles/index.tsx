import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import {
  MdArrowRightAlt,
  MdChevronLeft,
  MdDelete,
  MdDownload,
  MdMuseum,
  MdOutlineFileCopy,
  MdUpload,
} from "react-icons/md";
import Button from "../../../../../components/Button/Button";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import Modal from "../../../../../components/Modal";

import { ModalHeader } from "../../../../../components/Modal/ModalComponent";
import { useRouter } from "next/router";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import { ColumnDef } from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../../redux/features/auth/authReducers";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import { IndeterminateCheckbox } from "../../../../../components/tables/components/TableComponent";
import Tabs from "../../../../../components/Layouts/Tabs";
import { menuBM, menuParkings } from "../../../../../utils/routes";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import {
  OptionProps,
  ParkingVehicleProps,
} from "../../../../../utils/useHooks/PropTypes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  getParkingLots,
  uploadParkingLot,
} from "../../../../../redux/features/building-management/parking/parkingLotReducers";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import {
  convertBytes,
  toBase64,
} from "../../../../../utils/useHooks/useFunction";
import {
  getParkingVehicles,
  selectParkingVehicleManagement,
  uploadParkingVehicle,
} from "../../../../../redux/features/building-management/parking/parkingVehicleReducers";
import moment from "moment";

type Props = {
  pageProps: any;
};

const sortOpt: OptionProps[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const statusOpt: OptionProps[] = [
  { value: "Reserved", label: "Reserved" },
  { value: "Occupied", label: "Occupied" },
  { value: "Vacant", label: "Vacant" },
];

const stylesSelect = {
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
    console.log(provided, "control");
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

const stylesSelects = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
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
    console.log(provided, "control");
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
    };
  },
  menuList: (provided: any) => provided,
};

const Vehicles = ({ pageProps }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { parkingVehicles, pending } = useAppSelector(
    selectParkingVehicleManagement
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [sort, setSort] = useState<OptionProps | any>(null);
  const [status, setStatus] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState(true);

  // data-table
  const [dataTable, setDataTable] = useState<ParkingVehicleProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);

  // file-upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [files, setFiles] = useState<any | any[]>([]);
  const [formData, setFormData] = useState<any>(null);

  // template & data
  const [loadingData, setLoadingData] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const dateTimeFormat = (value: any) => {
    if (!value) return;
    const date = moment(value).format("MMMM Do YYYY, h:mm");
    return date;
  };

  // upload modal
  const onOpenUpload = () => {
    setIsOpenUpload(true);
  };
  const onCloseUpload = () => {
    setFiles([]);
    setIsOpenUpload(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication/sign-in"),
        })
      );
    }
  }, [token]);

  // get parking-vehicle
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
        {
          $or: [
            { ownerName: { $contL: query?.search } },
            { vehicleNumber: { $contL: query?.search } },
            { passNumber: { $contL: query?.search } },
            { "unit.unitName": { $contL: query?.search } },
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
        field: `vehicleNumber`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token)
      dispatch(getParkingVehicles({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = parkingVehicles;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [parkingVehicles]);

  // column
  const columns = useMemo<ColumnDef<ParkingVehicleProps, any>[]>(
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
        minSize: 10,
      },
      {
        accessorKey: "vehicleNumber",
        header: (info) => <div className="uppercase">Vehicle No.</div>,
        cell: ({ row, getValue }) => {
          return <div className="">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "ownerName",
        header: (info) => <div className="uppercase">Vehicle Owner</div>,
        cell: ({ row, getValue }) => {
          return <div className="">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "unit",
        header: (info) => <div className="uppercase">Unit Code</div>,
        cell: ({ getValue, row }) => {
          const value = getValue()?.unitCode || "-";
          return <div className="">{value}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "passNumber",
        header: (info) => <div className="uppercase">Pass No.</div>,
        cell: ({ row, getValue }) => {
          return <div className="">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "start",
        cell: ({ row, getValue }) => {
          const value = getValue() ? dateTimeFormat(getValue()) : "-";
          return <div className="">{value}</div>;
        },
        header: (props) => <div className="w-full uppercase">Start</div>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "end",
        cell: ({ row, getValue }) => {
          const value = getValue() ? dateTimeFormat(getValue()) : "-";
          return <div>{value}</div>;
        },
        header: (props) => (
          <div className="w-full text-center uppercase">End</div>
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
    ],
    []
  );

  // download data-format
  const onDownloadTemplate = async () => {
    setLoadingTemplate(true);
    await axios({
      url: `parkingLot/registered/template`,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ParkingLot-Template.xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log(response, 111);
        setLoadingTemplate(false);
      })
      .catch((err) => {
        toast.dark(err?.message);
      });
  };

  // download data
  const onDownload = async () => {
    setLoadingData(true);

    let date = new Date();
    await axios({
      url: `parkingLot/registered/download`,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
        console.log(response, 111);
        setLoadingData(false);
      })
      .catch((err) => {
        toast.error(err?.message);
      });
  };

  // upload-handler
  const onHandlerUpload = async (event: any) => {
    let data = [];
    // console.log(100, event.target.files.length);
    for (let index = 0; index < event.target.files.length; index++) {
      data.push(toBase64(event.target.files[index]));
    }
    let imgData = await Promise.all(data);
    setFiles(imgData);
  };

  const onDeleteImage = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
      setFiles(undefined);
    }
  };

  // upload
  const onUpload = (files: any) => {
    let newData = {
      excelFile:
        !files || files?.length == 0
          ? []
          : files.map((img: any) => img.images)?.toString(),
    };
    dispatch(
      uploadParkingVehicle({
        token,
        data: newData,
        isSuccess: () => {
          toast.dark("File has been uploaded");
          onCloseUpload();
          dispatch(getParkingLots({ token, params: filters.queryObject }));
        },
        isError: () => {
          console.log("error-upload-file");
        },
      })
    );
    // console.log(newData);
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Vehicle Registered"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          className=""
          menus={menuBM}
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
                  <MdChevronLeft className="w-6 h-6 text-gray-4" />
                  <div className="flex flex-col gap-1 items-start">
                    <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                      Parkings
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={() => onDownloadTemplate()}
                  variant="primary-outline">
                  {loadingTemplate ? (
                    <div className="flex items-center gap-2">
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="hidden lg:inline-block">Format</span>
                      <MdDownload className="w-4 h-4" />
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={() => onDownload()}
                  variant="primary-outline">
                  {loadingData ? (
                    <div className="flex items-center gap-2">
                      <span className="hidden lg:inline-block">Loading...</span>
                      <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="hidden lg:inline-block">Data</span>
                      <MdDownload className="w-4 h-4" />
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpenUpload}
                  variant="primary">
                  <span className="hidden lg:inline-block">Upload</span>
                  <MdUpload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* tabs */}
            <div className="w-full px-4">
              <Tabs menus={menuParkings} />
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2.5 p-4 items-center">
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
                    customStyles={stylesSelect}
                    value={sort}
                    onChange={setSort}
                    error=""
                    className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                    classNamePrefix=""
                    formatOptionLabel=""
                    instanceId="sort"
                    isDisabled={false}
                    isMulti={false}
                    placeholder="Sorts..."
                    options={sortOpt}
                    icon="MdSort"
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
            </div>
          </main>
        </div>
      </div>

      {/* modal upload */}
      <Modal size="small" onClose={onCloseUpload} isOpen={isOpenUpload}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray"
            isClose={true}
            onClick={onCloseUpload}>
            <h3 className="text-lg font-semibold">Upload files</h3>
          </ModalHeader>
          <div className="w-full p-4">
            <div className="w-full flex items-center justify-between gap-2">
              <input
                type="file"
                id="upload-file"
                placeholder="Upload files excel..."
                autoFocus
                className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100 ${
                  !files || files?.length == 0 ? "" : "hidden"
                }`}
                onChange={onHandlerUpload}
                ref={fileRef}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />

              {!files && files?.length == 0
                ? null
                : files?.map((img: any) => {
                    return (
                      <div
                        className="flex flex-col w-full text-gray-6"
                        key={img.size}>
                        <div className="flex w-full items-center">
                          <div className="">
                            <MdOutlineFileCopy className="h-16 w-16 text-gray-500" />
                          </div>
                          <div className="flex flex-col text-sm text-gray-500">
                            <p className="font-bold overflow-hidden">
                              {img.name}
                            </p>
                            <p>
                              {img?.size
                                ? convertBytes({ bytes: img?.size })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

              <div
                className={`${
                  !files || files?.length == 0 ? "hidden " : ""
                }flex`}>
                <button
                  type="button"
                  className={`rounded-full bg-danger text-white text-sm p-2 shadow-card hover:opacity-90 active:scale-90`}
                  onClick={onDeleteImage}>
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex border-t-2 border-gray p-4 justify-end gap-2">
            <button
              type="button"
              onClick={onCloseUpload}
              className="inline-flex gap-1 px-4 py-2 rounded-lg border-2 border-gray shadow-2 focus:outline-none hover:opacity-90 active:scale-90">
              <span className="text-xs font-semibold">Discard</span>
            </button>

            <Button
              type="button"
              variant="primary"
              onClick={() => onUpload(files)}
              disabled={pending}
              className="rounded-lg border-2 border-primary active:scale-90 shadow-2">
              {pending ? (
                <div className="flex items-center gap-1 text-xs">
                  <span>loading...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </div>
              ) : (
                <span className="text-xs">Upload</span>
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
        destination: "/authentication/sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default Vehicles;
