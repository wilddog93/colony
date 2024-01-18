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
import { ColumnItems } from "../../../../../components/tables/components/makeData";
import { makeData } from "../../../../../components/tables/components/makeData";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdDelete,
  MdEdit,
  MdUnarchive,
} from "react-icons/md";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuAssets, menuTabLocations } from "../../../../../utils/routes";
import Tabs from "../../../../../components/Layouts/Tabs";
import { SearchInput } from "../../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../../components/Dropdown/DropdownSelect";
import Modal from "../../../../../components/Modal";
import { ModalHeader } from "../../../../../components/Modal/ModalComponent";
import moment from "moment";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { selectProjectManagement } from "../../../../../redux/features/task-management/project/projectManagementReducers";
import { toast } from "react-toastify";
import { OptionProps } from "../../../../../utils/useHooks/PropTypes";
import {
  getProductCategories,
  selectProductCategoryManagement,
} from "../../../../../redux/features/assets/products/category/productCategoryReducers";
import {
  deleteProduct,
  getProducts,
  selectProductManagement,
} from "../../../../../redux/features/assets/products/productManagementReducers";
import ProductForm from "../../../../../components/Forms/employee/assets-inventories/product/ProductForm";
import {
  getProductUnits,
  selectProductUnitManagement,
} from "../../../../../redux/features/assets/products/unit-measurement/productUnitReducers";
import {
  getProductBrands,
  selectProductBrandManagement,
} from "../../../../../redux/features/assets/products/brand/productBrandReducers";
import { FaCircleNotch } from "react-icons/fa";
import CardTablesRow from "../../../../../components/tables/layouts/server/CardTablesRow";
import {
  deleteLocation,
  getLocations,
  selectLocationManagement,
} from "../../../../../redux/features/assets/locations/locationManagementReducers";
import SelectTables from "../../../../../components/tables/layouts/server/SelectTables";
import LocationForm from "../../../../../components/Forms/employee/assets-inventories/location/LocationForm";

interface PropsData {
  id?: 2;
  createdAt?: string | any;
  updatedAt?: string | any;
  locationName?: string | any;
  locationDescription?: string | any;
  locationType?: string | any;
  locationTo?: string | any;
  tower?: any;
  floor?: any;
  unit?: any;
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
  { value: "Storage", label: "Storage" },
  { value: "Non-Storage", label: "Non-Storage" },
];

const locationOpt: Options[] = [
  // { value: "Command Area", label: "Command Area" },
  { value: "Tower", label: "Tower / Area" },
  { value: "Floor", label: "Floor" },
  { value: "Unit", label: "Unit" },
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
      minHeight: 40,
      flexDirection: "row-reverse",
    };
  },
  menuList: (provided: any) => provided,
  menu: (provide: any) => {
    return {
      ...provide,
      zIndex: 99,
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
  menu: (provide: any) => {
    return {
      ...provide,
      zIndex: 99,
    };
  },
};

const Storages = ({ pageProps }: Props) => {
  moment.locale("id");
  const url = process.env.API_ENDPOINT + "api/";
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { locations, pending } = useAppSelector(selectLocationManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string | any>(null);
  const [sort, setSort] = useState<Options | any>(null);
  const [loading, setLoading] = useState(false);

  // data-table
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(1);

  // modal
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // modal add
  const onOpenModalAdd = () => {
    setFormData({
      locationType: { value: "Non-Storage", label: "Non-Storage" },
    });
    setIsOpenAdd(true);
  };

  const onCloseModalAdd = () => {
    setFormData(null);
    setIsOpenAdd(false);
  };

  // modal update
  const onOpenModalEdit = (items: any) => {
    let newData: PropsData = {
      ...items,
      locationType: items?.locationType
        ? { value: items?.locationType, label: items?.locationType }
        : null,
      tower: !items?.tower
        ? null
        : {
            ...items?.tower,
            value: items?.tower?.towerName,
            label: items?.tower?.towerName,
          },
      floor: !items?.floor
        ? null
        : {
            ...items?.floor,
            value: items?.floor?.floorName,
            label: items?.floor?.floorName,
          },
      unit: !items?.unit
        ? null
        : {
            ...items?.unit,
            value: items?.unit?.unitName,
            label: items?.unit?.unitName,
          },
      locationTo: items?.unit?.id
        ? { value: "Unit", label: "Unit" }
        : items?.floor?.id
        ? { value: "Floor", label: "Floor" }
        : items?.tower?.id
        ? { value: "Tower", label: "Tower" }
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

  const goToLocation = (id: any) => {
    if (!id) return;
    return router.push({
      pathname: `/employee/assets-management/locations/${id}`,
    });
  };

  const columns = useMemo<ColumnDef<PropsData, any>[]>(
    () => [
      {
        accessorKey: "locationName",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          const name = getValue() || "-";
          return (
            <div className="w-full flex items-center gap-2 text-left uppercase font-semibold">
              <span>{name}</span>
            </div>
          );
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "locationDescription",
        header: (info) => <div className="uppercase">Description</div>,
        cell: ({ row, getValue }) => {
          const value = getValue() || "-";
          return <div className="w-full">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "locationType",
        header: (info) => (
          <div className="uppercase w-full text-center">Type</div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          return <div className="w-full text-center">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "unit",
        header: (info) => <div className="uppercase w-full">Location</div>,
        cell: ({ row, getValue }) => {
          const unit = getValue()?.unitName;
          const floor =
            getValue()?.floor?.floorName || row?.original?.floor?.floorName;
          const tower =
            getValue()?.floor?.tower?.towerName ||
            row?.original?.floor?.tower?.towerName ||
            row?.original?.tower?.towerName;
          return (
            <div className="w-full text-left">
              <ul className="w-full flex flex-col gap-2">
                <li
                  className={`w-full block px-2 py-1 border-2 border-gray-5 bg-gray text-gray-6 rounded`}>
                  Tower : <span className="">{tower || "-"}</span>
                </li>
                <li
                  className={`w-full block px-2 py-1 border-2 border-gray-5 bg-gray text-gray-6 rounded`}>
                  Floor : <span className="">{floor || "-"}</span>
                </li>
                <li
                  className={`w-full block px-2 py-1 border-2 border-gray-5 bg-gray text-gray-6 rounded`}>
                  Unit : <span className="">{unit || "-"}</span>
                </li>
              </ul>
            </div>
          );
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 120,
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
        { locationType: { $eqL: "non-storage" } },
        {
          $or: [
            { locationName: { $contL: query?.search } },
            { locationDescription: { $contL: query?.search } },
            { locationType: { $contL: query?.search } },
            { "unit_tower.towerName": { $contL: query?.search } },
            { "floor_tower.towerName": { $contL: query?.search } },
            { "tower.towerName": { $contL: query?.search } },
            { "unit.unitName": { $contL: query?.search } },
            { "unit_floor.floorName": { $contL: query?.search } },
            { "floor.floorName": { $contL: query?.search } },
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
        field: `locationName`,
        order: !sort?.value ? "ASC" : sort.value,
      });
    }
    qb.query();
    return qb;
  }, [query?.page, query?.limit, query?.search, query?.sort]);

  useEffect(() => {
    if (token) dispatch(getLocations({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = locations;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [locations]);

  // delete
  const onDelete = (value: any) => {
    if (!value?.id) return;
    dispatch(
      deleteLocation({
        token,
        id: value?.id,
        isSuccess() {
          toast.dark("Location has been deleted");
          dispatch(getLocations({ token, params: filters.queryObject }));
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
      header="Assets & Inventories"
      head="Storages"
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
                      Locations
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
                  <span className="hidden lg:inline-block">New Location</span>
                  <MdAdd className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* tabs */}
            <div className="w-full px-4">
              <Tabs menus={menuTabLocations} />
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
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
                isInfiniteScroll={false}
              />
            </div>
          </main>
        </div>
      </div>

      {/* add modal */}
      <LocationForm
        isCloseModal={onCloseModalAdd}
        isOpen={isOpenAdd}
        token={token}
        getData={() =>
          dispatch(getLocations({ token, params: filters.queryObject }))
        }
        items={formData}
        typesOpt={typesOpt}
        locationOpt={locationOpt}
      />

      {/* edit modal */}
      <LocationForm
        isCloseModal={onCloseModalEdit}
        isOpen={isOpenEdit}
        token={token}
        getData={() =>
          dispatch(getLocations({ token, params: filters.queryObject }))
        }
        items={formData}
        typesOpt={typesOpt}
        locationOpt={locationOpt}
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
              <h3 className="text-lg font-semibold">Delete Location</h3>
              <p className="text-gray-5">{`Are you sure to delete ${formData?.locationName} ?`}</p>
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

export default Storages;
