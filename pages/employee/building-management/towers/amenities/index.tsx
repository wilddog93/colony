import React, {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import SidebarBM from "../../../../../components/Layouts/Sidebar/Building-Management";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCalendarToday,
  MdChevronLeft,
  MdCleaningServices,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdFemale,
  MdLocalHotel,
  MdMale,
  MdPhone,
} from "react-icons/md";
import Button from "../../../../../components/Button/Button";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import Modal from "../../../../../components/Modal";

import {
  ModalFooter,
  ModalHeader,
} from "../../../../../components/Modal/ModalComponent";
import { useRouter } from "next/router";
import Tables from "../../../../../components/tables/layouts/Tables";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnItems } from "../../../../../components/tables/components/makeData";
import { makeData } from "../../../../../components/tables/components/makeData";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuBM } from "../../../../../utils/routes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  deleteAmenities,
  getAmenities,
  selectAmenityManagement,
} from "../../../../../redux/features/building-management/amenity/amenityReducers";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import AmenityForm from "../../../../../components/Forms/employee/AmenityForm";
import { getAuthMe } from "../../../../../redux/features/auth/authReducers";
import { FaCircleNotch, FaQrcode } from "react-icons/fa";
import { toast } from "react-toastify";

type FormProps = {
  id?: string | number | any;
  amenityCode?: string | any;
  amenityName?: string | any;
  amenityDescription?: string | any;
};

const sortOpt = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
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

type Props = {
  pageProps: any;
};

const Amenities = ({ pageProps }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, firebaseToken } = pageProps;

  // redux
  const dispatch = useAppDispatch();
  const { amenities, pending, error, message } = useAppSelector(
    selectAmenityManagement
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [sort, setSort] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // data-table
  const [dataTable, setDataTable] = useState<ColumnItems[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(2000);
  const [total, setTotal] = useState(1000);
  const [isSelected, setIsSelected] = useState<any>([]);

  // modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [details, setDetails] = useState<ColumnItems>();
  const [formData, setFormData] = useState<FormProps | any>(null);

  // form modal
  const onClose = () => setIsOpenModal(false);
  const onOpen = () => setIsOpenModal(true);

  // detail modal

  const onOpenDetail = (items: any) => {
    setFormData(items);
    setIsOpenDetail(true);
  };

  const onCloseDetail = () => {
    setFormData(null);
    setIsOpenDetail(false);
  };

  // edit modal
  const onOpenEdit = (items: any) => {
    setFormData(items);
    setIsOpenEditModal(true);
  };

  const onCloseEdit = () => {
    setFormData(null);
    setIsOpenEditModal(false);
  };

  // delete modal
  const onCloseDelete = () => {
    setDetails(undefined);
    setIsOpenDelete(false);
  };

  const onOpenDelete = (items: any) => {
    setFormData(items);
    setIsOpenDelete(true);
  };

  const onDeleteAmenity = (value: FormProps) => {
    console.log("delete", value);
    dispatch(
      deleteAmenities({
        token,
        id: value?.id,
        isError() {
          console.log("error");
        },
        isSuccess() {
          toast.dark("Deleted successfully");
          dispatch(getAmenities({ token, params: filters.queryObject }));
          onCloseDelete();
        },
      })
    );
  };
  // delete function end

  // function get data amenities
  useEffect(() => {
    let newSort: any = null;
    if (query?.page) setPage(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search || "");
    if (query?.sort) {
      query?.search == "ASC"
        ? (newSort = { value: "ASC", label: "A-Z" })
        : query?.search == "DESC"
        ? (newSort = { value: "DESC", label: "Z-A" })
        : (newSort = null);
    }
    setSort(newSort);
  }, []);

  useEffect(() => {
    let qr: any = {
      page: page,
      limit: limit,
    };
    if (search) qr = { ...qr, search: search };
    if (sort) qr = { ...qr, sort: sort?.value };
    router.replace({ pathname, query: qr });
  }, [search, page, limit, sort]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [
            { amenityName: { $contL: query?.search } },
            { amenityDescription: { $contL: query?.search } },
          ],
        },
      ],
    };

    qb.search(search);
    // query?.status && search["$and"].push({ "$or": [] });

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);
    if (query?.sort) {
      qb.sortBy({
        field: "amenityName",
        order: sort?.value ? sort.value : "DESC",
      });
    } else {
      qb.sortBy({
        field: "updatedAt",
        order: "DESC",
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) dispatch(getAmenities({ params: filters.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    const arr: any[] = [];
    const { data, pageCount, total } = amenities;

    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push(item);
      });
    }
    setDataTable(arr);
    setPageCount(pageCount);
    setTotal(total);
  }, [amenities]);
  // end get data

  // column
  const columns = useMemo<ColumnDef<FormProps, any>[]>(
    () => [
      {
        accessorKey: "amenityCode",
        header: (info) => <div className="uppercase">Code</div>,
        cell: ({ row, getValue }) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(row.original)}>
              {getValue() || "-"}
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
        accessorKey: "amenityName",
        header: (info) => <div className="uppercase">Amenity Name</div>,
        cell: (info) => {
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {info.getValue()}
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "amenityDescription",
        cell: (info) => {
          let value = info.getValue();
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {value ? value : ""}
            </div>
          );
        },
        header: (info) => <div className="uppercase">Description</div>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "updatedAt",
        cell: (info) => {
          let date = info.getValue();
          return (
            <div
              className="cursor-pointer"
              onClick={() => onOpenDetail(info.row.original)}>
              {date}
            </div>
          );
        },
        header: (info) => <div className="uppercase">Data Added</div>,
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          console.log(row.original, "info");
          return (
            <div className="w-full flex gap-2">
              <div
                onClick={() => onOpenEdit(row.original)}
                className="w-full text-center flex items-center justify-center cursor-pointer">
                <MdEdit className="text-gray-5 w-4 h-4" />
              </div>
              <div
                onClick={() => onOpenDelete(row.original)}
                className="w-full text-center flex items-center justify-center cursor-pointer">
                <MdDelete className="text-gray-5 w-4 h-4" />
              </div>
            </div>
          );
        },
        header: (info) => <div className="uppercase">Actions</div>,
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
    ],
    []
  );

  // auth
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

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Amenities"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
      description=""
      token={token}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          className=""
          menus={menuBM}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2">
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
                    Amenities/Facilities
                  </h3>
                  <span className="text-gray-4 font-semibold text-lg">
                    322 Registered User
                  </span>
                </div>
              </Button>
            </div>

            <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={onOpen}
                variant="primary"
                key={"3"}>
                <span className="hidden lg:inline-block">New Amenities</span>
                <MdAdd className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              <div className="w-full flex flex-col lg:flex-row gap-2.5 p-4">
                <div className="w-full lg:w-3/4">
                  <SearchInput
                    className="w-full text-sm rounded-xl"
                    classNamePrefix=""
                    filter={search}
                    setFilter={setSearch}
                    placeholder="Search..."
                  />
                </div>
                <div className="w-full lg:w-1/4 flex flex-col lg:flex-row items-center gap-2">
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
                pages={page}
                setPages={setPage}
                limit={limit}
                setLimit={setLimit}
                pageCount={pageCount}
                columns={columns}
                dataTable={dataTable}
                total={total}
                setIsSelected={setIsSelected}
              />
            </div>
          </main>
        </div>
      </div>

      {/* modal example */}
      <Modal size="small" onClose={onClose} isOpen={isOpenModal}>
        <AmenityForm
          isCloseModal={onClose}
          isOpen={isOpenModal}
          token={token}
          getData={() =>
            dispatch(getAmenities({ token, params: filters.queryObject }))
          }
        />
      </Modal>

      <Modal size="small" onClose={onCloseEdit} isOpen={isOpenEditModal}>
        <AmenityForm
          isCloseModal={onCloseEdit}
          isOpen={isOpenModal}
          token={token}
          getData={() =>
            dispatch(getAmenities({ token, params: filters.queryObject }))
          }
          items={formData}
          isUpdate
        />
      </Modal>

      {/* delete modal */}
      <Modal size="small" onClose={onCloseDelete} isOpen={isOpenDelete}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDelete}>
            <h3 className="text-lg font-semibold">Delete Amenities</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4">
            <h3>Are you sure to delete amenities data ?</h3>
          </div>

          <div className="w-full p-4 border-t-2 border-gray flex gap-2 justify-end">
            <Button
              variant="secondary-outline"
              className="rounded-md text-sm border-gray shadow-card"
              type="button"
              onClick={() => onCloseDelete()}>
              Discard
            </Button>

            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              onClick={() => onDeleteAmenity(formData)}
              disabled={pending}>
              <span>Yes, Delete it!</span>
              {pending ? (
                <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
              ) : null}
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

export default Amenities;
