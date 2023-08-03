import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
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
  MdAdd,
  MdArrowRightAlt,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdPhone,
  MdPlace,
  MdRemoveRedEye,
  MdUnarchive,
} from "react-icons/md";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets } from "../../../../utils/routes";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../components/tables/layouts/server/SelectTables";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import { OptionProps } from "../../../../utils/useHooks/PropTypes";
import { FaCircleNotch } from "react-icons/fa";
import {
  deleteVendor,
  getVendors,
  selectVendorManagement,
} from "../../../../redux/features/assets/vendor/vendorManagementReducers";
import CardTables from "../../../../components/tables/layouts/CardTables";
import CardTablesRow from "../../../../components/tables/layouts/server/CardTablesRow";
import {
  formatPhone,
  getWebString,
} from "../../../../utils/useHooks/useFunction";
import VendorForm from "../../../../components/Forms/employee/assets-inventories/vendor/VendorForm";

interface PropsData {
  id?: number | any;
  createdAt?: string | any;
  updatedAt?: string | any;
  vendorName?: string | any;
  vendorDescription?: string | any;
  vendorLogo?: string | any;
  vendorWebsite?: any;
  vendorPhone?: string | any;
  vendorEmail?: string | any;
  vendorLegalName?: string | any;
  vendorLegalAddress?: string | any;
  webUrl?: string | any;
}

interface Options {
  value: string | any;
  label: string | any;
}

type Props = {
  pageProps: any;
};

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const typesOpt: Options[] = [
  { value: "Asset", label: "Asset" },
  { value: "Inventory", label: "Inventory" },
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

const Products = ({ pageProps }: Props) => {
  console.log("wkwkkwkwkwwkwkwkwkwkwkwkkwwwkwkk");

  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { vendors, pending } = useAppSelector(selectVendorManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [types, setTypes] = useState<Options | any>(null);
  const [category, setCategory] = useState<OptionProps | any>(null);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(1);

  // modal
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // hidden-desc-table
  const [isArrayHidden, setIsArrayHidden] = useState<any[]>([]);
  const [isHiddenDesc, setIsHiddenDesc] = useState<any[]>([]);

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

  const onReadDescriptionDetail = (val: any) => {
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

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // modal detail
  const onOpenModalDetail = (value: PropsData) => {
    setFormData(value);
    setIsOpenDetail(true);
  };

  const onCloseModalDetail = () => {
    setFormData(null);
    setIsOpenDetail(false);
  };

  // modal add
  const onOpenModalAdd = () => {
    setIsOpenAdd(true);
  };

  const onCloseModalAdd = () => {
    if (!isOpenDetail) setFormData(null);
    setIsOpenAdd(false);
  };

  // modal update
  const onOpenModalEdit = (items: any) => {
    let newData: PropsData = {
      ...items,
      webUrl: items?.vendorWebsite
        ? getWebString(items?.vendorWebsite).url
        : null,
      vendorWebsite: items?.vendorWebsite
        ? getWebString(items?.vendorWebsite).website
        : "",
    };
    setFormData(newData);
    setIsOpenEdit(true);
    // console.log(formData, "form-edit");
  };

  const onCloseModalEdit = () => {
    if (!isOpenDetail) setFormData(null);
    setIsOpenEdit(false);
  };

  // delete modal
  const onOpenModalDelete = (items: any) => {
    setFormData(items);
    setIsOpenDelete(true);
  };

  const onCloseModalDelete = () => {
    if (!isOpenDetail) setFormData(null);
    setIsOpenDelete(false);
  };

  const goToTask = (id: any) => {
    if (!id) return;
    return router.push({
      pathname: `/employee/assets-inventories/products/${id}`,
    });
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

  // get Vendors
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
    if (types) qr = { ...qr, types: types?.value };
    if (category) qr = { ...qr, category: category?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          $or: [
            { vendorName: { $contL: query?.search } },
            { vendorDescription: { $contL: query?.search } },
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
        field: `vendorName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) dispatch(getVendors({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = vendors;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [vendors]);

  // delete
  const onDelete = (value: any) => {
    // console.log(value, "form-delete");
    if (!value?.id) return;
    dispatch(
      deleteVendor({
        token,
        id: value?.id,
        isSuccess() {
          toast.dark("Vendor has been deleted");
          dispatch(getVendors({ token, params: filters.queryObject }));
          // if (isOpenDetail) onCloseModalDetail();
          onCloseModalDelete();
        },
        isError() {
          console.log("Error delete");
        },
      })
    );
  };

  console.log(isArrayHidden, "data-hidden");

  // column
  const columns = useMemo<ColumnDef<PropsData, any>[]>(
    () => [
      {
        accessorKey: "vendorName",
        header: (info) => <div className="uppercase">Vendor Name</div>,
        cell: ({ row, getValue }) => {
          const name = getValue() || "-";
          const image = row?.original?.vendorLogo
            ? `${url}vendor/vendorLogo/${row?.original?.vendorLogo}`
            : "../../image/no-image.jpeg";
          return (
            <div className="w-full flex items-center gap-2 text-left uppercase font-semibold">
              <img
                src={image}
                alt="vendor-logo"
                className="w-8 h-8 rounded-full object-cover object-center"
              />
              <span>{name}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "vendorLegalName",
        header: (info) => <div className="uppercase">Legal Name</div>,
        cell: ({ row, getValue }) => {
          const value = getValue() || "-";
          return <div className="w-full font-semibold">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "vendorDescription",
        header: (info) => <div className="uppercase">Description</div>,
        cell: ({ row, getValue }) => {
          let isRead = getValue()?.length > 70 ? true : false;
          let value =
            getValue()?.length > 70 &&
            !isArrayHidden.includes(row?.original?.id)
              ? `${getValue().substring(70, 0)} ...`
              : getValue();

          return (
            <div className="flex flex-col">
              {value}
              <button
                onClick={() => onReadDescription(row?.original?.id)}
                className={`text-primary focus:outline-none font-bold mt-2 underline w-full max-w-max ${
                  getValue()?.length > 70 ? "" : "hidden"
                }`}>
                {isArrayHidden.includes(row?.original?.id) ? "Hide" : "Show"}
              </button>
            </div>
          );
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 300,
        minSize: 300,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          return (
            <div className="w-full text-center flex items-center justify-center">
              <button
                onClick={() => onOpenModalEdit(row?.original)}
                className="px-1 py-1"
                type="button">
                <MdEdit className="text-gray-5 w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenModalDetail(row?.original)}
                className="px-1 py-1"
                type="button">
                <MdRemoveRedEye className="text-gray-5 w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenModalDelete(row?.original)}
                className="px-1 py-1"
                type="button">
                <MdDelete className="text-danger w-4 h-4" />
              </button>
            </div>
          );
        },
        header: (props) => (
          <div className="w-full text-center uppercase">Actions</div>
        ),
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
    ],
    [isArrayHidden]
  );

  return (
    <DefaultLayout
      title="Colony"
      header="Assets & Inventories"
      head="Vendor"
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

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] overflow-y-auto">
          <div className="lg:sticky bg-white top-0 z-50 py-6 w-full flex flex-col gap-2 p-8 2xl:p-10 shadow-card">
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
                      Vendor
                    </h3>
                  </div>
                </Button>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpenModalAdd}
                  variant="primary">
                  <span className="hidden lg:inline-block">New Vendor</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative w-full h-full flex overflow-x-hidden">
            <main className="w-full relative tracking-wide text-left text-boxdark-2 p-6 transform duration-300 ease-in-out">
              <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
                {/* content */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5 p-4 items-center">
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
                </div>

                {/* table */}
                <div className={`w-full ${isOpenDetail ? "hidden" : ""}`}>
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

                <div className={`w-full ${!isOpenDetail ? "hidden" : ""}`}>
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
                    isHideHeader
                  />
                </div>
              </div>
            </main>

            {/* side detail */}
            <aside
              className={`w-full max-w-md fixed top-20 lg:top-0.5 bottom-0 right-0 z-9999 lg:z-9 overflow-y-auto transform duration-300 ease-in-out bg-white shadow-card ${
                isOpenDetail ? "lg:sticky translate-x-0" : "translate-x-full"
              }`}>
              <div className="w-full text-gray-6">
                <div className="sticky top-0 w-full grid grid-cols-2 p-4 text-sm border-b-2 border-gray bg-white">
                  <div className="w-full flex items-center">
                    <button
                      type="button"
                      onClick={onCloseModalDetail}
                      className="inline-flex items-center gap-1 focus:outline-none hover:opacity-90 active:scale-90 p-1 bg-white rounded-lg border-2 border-gray shadow-card">
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-full flex item-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenModalDelete(formData)}
                      className="inline-flex items-center gap-1 focus:outline-none hover:opacity-90 active:scale-90 py-1 px-2 bg-white rounded-lg border-2 border-gray shadow-card">
                      <MdDelete className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenModalEdit(formData)}
                      className="inline-flex items-center gap-1 focus:outline-none hover:opacity-90 active:scale-90 py-1 px-2 bg-white rounded-lg border-2 border-gray shadow-card">
                      <MdEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                <div className="w-full p-4 border-b-2 border-gray">
                  <div className="w full flex gap-2">
                    <img
                      src={
                        formData?.vendorLogo
                          ? `${url}vendor/vendorLogo/${formData?.vendorLogo}`
                          : "../../../image/no-image.jpeg"
                      }
                      alt="vendor-logo-detail"
                      className="w-full max-w-[100px] h-full max-h-[100px] object-center object-cover rounded"
                    />

                    <div className="flex flex-col gap-2 text-gray-6 leading-relaxed text-sm">
                      <h3 className="font-semibold">{formData?.vendorName}</h3>
                      <p>{formData?.vendorLegalName}</p>
                      <div className="w-full flex flex-col gap-1 text-xs">
                        {formData?.vendorDescription?.length > 70 &&
                        !isHiddenDesc.includes(formData?.id)
                          ? `${formData?.vendorDescription?.substring(
                              70,
                              0
                            )} ...`
                          : formData?.vendorDescription}
                        <button
                          onClick={() => onReadDescriptionDetail(formData?.id)}
                          className={`text-primary focus:outline-none font-bold mt-2 underline w-full max-w-max ${
                            formData?.vendorDescription?.length > 70
                              ? ""
                              : "hidden"
                          }`}>
                          {isHiddenDesc.includes(formData?.id)
                            ? "Hide"
                            : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4 p-4 text-sm">
                  <h3 className="font-semibold text-lg mb-3">Information</h3>
                  <div className="w-full grid grid-cols-3 items-start gap-2">
                    <div className="w-full flex items-center gap-2">
                      <span>
                        <MdPlace className="w-5 h-5" />
                      </span>
                      <span>Website</span>
                      <span className="ml-auto">:</span>
                    </div>
                    <div className="col-span-2">
                      {formData?.vendorWebsite || "-"}
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-3 items-start gap-2">
                    <div className="w-full flex items-center gap-2">
                      <span>
                        <MdPhone className="w-5 h-5" />
                      </span>
                      <span>Phone No.</span>
                      <span className="ml-auto">:</span>
                    </div>
                    <div className="col-span-2">
                      {formData?.vendorPhone
                        ? formatPhone("+", formData?.vendorPhone)
                        : "-"}
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-3 items-start gap-2">
                    <div className="w-full flex items-center gap-2">
                      <span>
                        <MdEmail className="w-5 h-5" />
                      </span>
                      <span>Email</span>
                      <span className="ml-auto">:</span>
                    </div>
                    <div className="col-span-2">
                      {formData?.vendorEmail || "-"}
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-3 items-start gap-2">
                    <div className="w-full flex items-center gap-2">
                      <span>
                        <MdPlace className="w-5 h-5" />
                      </span>
                      <span>Address</span>
                      <span className="ml-auto">:</span>
                    </div>
                    <div className="col-span-2">
                      {formData?.vendorLegalAddress || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <button
              onClick={() => onCloseModalDetail()}
              aria-controls="sidebar-component"
              aria-expanded={isOpenDetail}
              className={`lg:static ${
                isOpenDetail &&
                "fixed z-999 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100"
              }`}></button>
          </div>
        </div>
      </div>

      {/* add modal */}
      <VendorForm
        isCloseModal={onCloseModalAdd}
        isOpen={isOpenAdd}
        token={token}
        getData={() =>
          dispatch(getVendors({ token, params: filters.queryObject }))
        }
        items={formData}
        defaultImage="../../image/no-image.jpeg"
      />

      {/* edit modal */}
      <VendorForm
        isCloseModal={onCloseModalEdit}
        isOpen={isOpenEdit}
        token={token}
        getData={() => {
          if (isOpenDetail) onCloseModalDetail();
          dispatch(getVendors({ token, params: filters.queryObject }));
        }}
        items={formData}
        defaultImage="../../image/no-image.jpeg"
        isUpdate
      />

      {/* delete modal */}
      <Modal size="small" onClose={onCloseModalDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalDelete}>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Delete Vendor</h3>
              <p className="text-gray-5">{`Are you sure to delete ${formData?.vendorName} ?`}</p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2"
              onClick={onCloseModalDelete}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary"
              onClick={() => onDelete(formData)}
              disabled={pending}>
              {pending ? (
                <Fragment>
                  <span className="text-xs">Deleting...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </Fragment>
              ) : (
                <span className="text-xs">Yes, Delete it!</span>
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

export default Products;
