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
  MdDelete,
  MdEdit,
  MdMonetizationOn,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuPayments } from "../../../../../utils/routes";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import Modal from "../../../../../components/Modal";
import { ModalHeader } from "../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { toast } from "react-toastify";
import {
  BillingTaxProps,
  OptionProps,
} from "../../../../../utils/useHooks/PropTypes";
import { FaCircleNotch } from "react-icons/fa";
import {
  deleteBillingTax,
  getBillingTax,
  selectBillingTaxManagement,
} from "../../../../../redux/features/billing/tax/billingTaxReducers";
import TaxForm from "../../../../../components/Forms/Billings/settings/taxes/TaxForm";
import { formatMoney } from "../../../../../utils/useHooks/useFunction";

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

const BillingTax = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  // billing
  const { billingTaxs, pending } = useAppSelector(selectBillingTaxManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [types, setTypes] = useState<Options | any>(null);
  const [category, setCategory] = useState<OptionProps | any>(null);
  const [categoryOpt, setCategoryOpt] = useState<OptionProps[] | any[]>([]);
  const [unitOpt, setUnitOpt] = useState<OptionProps[] | any[]>([]);
  const [brandOpt, setBrandOpt] = useState<OptionProps[] | any[]>([]);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<BillingTaxProps[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState<any[] | any>(null);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  // modal
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<BillingTaxProps | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // modal add
  const onOpenModalAdd = () => {
    setIsOpenAdd(true);
  };

  const onCloseModalAdd = () => {
    setFormData(null);
    setIsOpenAdd(false);
  };

  // modal update
  const onOpenModalEdit = (items: any) => {
    let newData: BillingTaxProps | any = {
      ...items,
      billingTaxType: items?.billingTaxType
        ? { value: items?.billingTaxType, label: items?.billingTaxType }
        : null,
    };
    setFormData(newData);
    setIsOpenEdit(true);
  };

  const onCloseModalEdit = () => {
    setFormData(null);
    setIsOpenEdit(false);
  };

  // delete modal
  const onCloseModalDelete = () => {
    setFormData(null);
    setIsOpenDelete(false);
  };

  const onOpenModalDelete = (items: any) => {
    setFormData(items);
    setIsOpenDelete(true);
  };

  const columns = useMemo<ColumnDef<BillingTaxProps, any>[]>(
    () => [
      {
        accessorKey: "billingTaxId",
        header: (info) => <div className="uppercase">Taxes No.</div>,
        cell: ({ row, getValue }) => {
          let value = getValue() || "-";
          return (
            <div className="w-full flex items-center gap-2 text-left uppercase font-semibold">
              <span>{value}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        size: 50,
        maxSize: 50,
      },
      {
        accessorKey: "billingTaxName",
        header: (info) => <div className="uppercase">Taxes Name</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "billingTaxType",
        header: (info) => <div className="uppercase">Type</div>,
        cell: ({ row, getValue }) => {
          const value = getValue();
          return <div className="w-full">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
      {
        accessorKey: "billingTaxTotal",
        header: (info) => (
          <div className="uppercase w-full text-center">Total</div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          const { billingTaxType } = row?.original;
          return (
            <div className="w-full text-center">
              {billingTaxType === "Percent"
                ? `${value} %`
                : `Rp.${formatMoney({ amount: value })}`}
            </div>
          );
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
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
    if (query?.types) {
      setTypes({ value: query?.types, label: query?.types });
    }
    if (query?.category) {
      setCategory({ value: query?.category, label: query?.category });
    }
  }, [
    query?.page,
    query?.limit,
    query?.search,
    query?.sort,
    query?.types,
    query?.category,
  ]);

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
            { billingTaxName: { $contL: query?.search } },
            // { billingTemplateNotes: { $contL: query?.search } },s
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
        field: `billingTaxName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) dispatch(getBillingTax({ token, params: filters.queryObject }));
  }, [token, filters]);

  console.log(billingTaxs, "billingTaxs");

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = billingTaxs;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [billingTaxs]);

  // delete
  const onDelete = (value: any) => {
    if (!value?.id) return;
    dispatch(
      deleteBillingTax({
        token,
        id: value?.id,
        isSuccess() {
          toast.dark("Taxes has been deleted");
          dispatch(getBillingTax({ token, params: filters.queryObject }));
          onCloseModalDelete();
        },
        isError() {
          console.log("Error delete");
        },
      })
    );
  };

  return (
    <DefaultLayout
      title="Colony"
      header="Billings & Payments"
      head="Taxes"
      logo="../../../../image/logo/logo-icon.svg"
      images="../../../../image/logo/building-logo.svg"
      userDefault="../../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdMonetizationOn,
        className: "w-8 h-8 text-meta-3",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
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
                    Taxes
                  </h3>
                </div>
              </div>

              <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
                <Button
                  type="button"
                  className="rounded-lg text-sm font-semibold py-3"
                  onClick={onOpenModalAdd}
                  variant="primary">
                  <span className="hidden lg:inline-block">New Taxes</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col gap-2.5 lg:gap-6">
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

      {/* delete modal */}
      <Modal size="small" onClose={onCloseModalDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalDelete}>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">Delete Taxes</h3>
              <p className="text-gray-5 text-sm">{`Are you sure to delete ${
                formData?.billingTaxName || "-"
              } ?`}</p>
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

      {/* tax-form - create */}
      <Modal size="small" onClose={onCloseModalAdd} isOpen={isOpenAdd}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalAdd}>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">New Taxes</h3>
              <p className="text-gray-5 text-sm">
                Fill your information taxes data
              </p>
            </div>
          </ModalHeader>

          <TaxForm
            token={token}
            items={formData}
            isOpen={isOpenAdd}
            onClose={onCloseModalAdd}
            getData={() =>
              dispatch(getBillingTax({ token, params: filters.queryObject }))
            }
          />
        </Fragment>
      </Modal>

      {/* tax-form - update */}
      <Modal size="small" onClose={onCloseModalEdit} isOpen={isOpenEdit}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseModalEdit}>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">New Taxes</h3>
              <p className="text-gray-5 text-sm">
                Fill your information taxes data
              </p>
            </div>
          </ModalHeader>

          <TaxForm
            token={token}
            items={formData}
            isOpen={isOpenAdd}
            onClose={onCloseModalEdit}
            getData={() =>
              dispatch(getBillingTax({ token, params: filters.queryObject }))
            }
            isUpdate
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

export default BillingTax;
