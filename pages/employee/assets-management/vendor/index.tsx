import React, { Fragment, useEffect, useMemo, useState } from "react";
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
import { selectProjectManagement } from "../../../../redux/features/task-management/project/projectManagementReducers";
import { toast } from "react-toastify";
import { OptionProps } from "../../../../utils/useHooks/PropTypes";
import {
  getProductCategories,
  selectProductCategoryManagement,
} from "../../../../redux/features/assets/products/category/productCategoryReducers";
import {
  deleteProduct,
  getProducts,
  selectProductManagement,
} from "../../../../redux/features/assets/products/productManagementReducers";
import ProductForm from "../../../../components/Forms/employee/assets-inventories/product/ProductForm";
import {
  getProductUnits,
  selectProductUnitManagement,
} from "../../../../redux/features/assets/products/unit-measurement/productUnitReducers";
import {
  getProductBrands,
  selectProductBrandManagement,
} from "../../../../redux/features/assets/products/brand/productBrandReducers";
import { FaCircleNotch } from "react-icons/fa";

// interface PropsData {
//   id?: number | any;
//   createdAt?: string | any;
//   updatedAt?: string | any;
//   vendorName?: string | any;
//   vendorDescription?: string | any;
//   vendorLogo?: string | any;
//   vendorWebsite?: any;
//   vendorPhone?: string | any;
//   vendorEmail?: string | any;
//   vendorLegalName?: string | any;
//   vendorLegalAddress?: string | any;
// }

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
  moment.locale("id");
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;

  // props
  const { token, access, firebaseToken } = pageProps;
  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { products, pending } = useAppSelector(selectProductManagement);
  const { productCategories } = useAppSelector(selectProductCategoryManagement);
  const { productUnits } = useAppSelector(selectProductUnitManagement);
  const { productBrands } = useAppSelector(selectProductBrandManagement);

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
  const [dataTable, setDataTable] = useState<PropsData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(1);

  // modal
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState<PropsData | any>(null);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [formData, setFormData] = useState<PropsData | any>(null);

  // date format
  const dateFormat = (value: string | any) => {
    if (!value) return "-";
    return moment(new Date(value)).format("MMM DD, YYYY, HH:mm");
  };

  // modal detail
  const onOpenModalDetail = (value: PropsData) => {
    setDetailData(value);
    setIsOpenDetail(true);
  };

  const onCloseModalDetail = () => {
    setDetailData(null);
    setIsOpenDetail(false);
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
    let newData: PropsData = {
      ...items,
      productType: items?.productType
        ? { value: items?.productType, label: items?.productType }
        : null,
      productCategory: !items?.productCategory
        ? null
        : {
            ...items?.productCategory,
            value: items?.productCategory?.productCategoryName,
            label: items?.productCategory?.productCategoryName,
          },
      unitMeasurement: !items?.unitMeasurement
        ? null
        : {
            ...items?.unitMeasurement,
            value: items?.unitMeasurement?.unitMeasurementName,
            label: items?.unitMeasurement?.unitMeasurementName,
          },
      brand: !items?.brand
        ? null
        : {
            ...items?.brand,
            value: items?.brand?.brandName,
            label: items?.brand?.brandName,
          },
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

  const goToTask = (id: any) => {
    if (!id) return;
    return router.push({
      pathname: `/employee/assets-inventories/products/${id}`,
    });
  };

  const columns = useMemo<ColumnDef<PropsData, any>[]>(
    () => [
      {
        accessorKey: "brand",
        header: (info) => <div className="uppercase">Brand</div>,
        cell: ({ row, getValue }) => {
          const name = getValue()?.brandName || "-";
          const image = row?.original?.productImage
            ? `${url}product/productImage/${row?.original?.productImage}`
            : "../../image/no-image.jpeg";
          return (
            <div className="w-full flex items-center gap-2 text-left uppercase font-semibold">
              <img
                src={image}
                alt="brand-logo"
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
        accessorKey: "productName",
        header: (info) => <div className="uppercase">Product Name</div>,
        cell: ({ row, getValue }) => {
          return <div className="w-full">{getValue() || "-"}</div>;
        },
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "productType",
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
        accessorKey: "productCategory.productCategoryName",
        header: (info) => <div className="uppercase">Category</div>,
        cell: ({ row, getValue }) => {
          const value = getValue() || "-";
          return <div className="w-full">{value}</div>;
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 10,
        minSize: 10,
      },
      {
        accessorKey: "productQty",
        header: (info) => (
          <div className="uppercase w-full text-center">Product Quantity</div>
        ),
        cell: ({ row, getValue }) => {
          const value = getValue();
          return <div className="w-full text-center">{value}</div>;
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
    if (types) qr = { ...qr, types: types?.value };
    if (category) qr = { ...qr, category: category?.value };

    router.replace({ pathname, query: qr });
  }, [pages, limit, search, sort, types, category]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        { productType: { $contL: query?.types } },
        { "productCategory.productCategoryName": { $contL: query?.category } },
        {
          $or: [
            { "brand.brandName": { $contL: query?.search } },
            { productName: { $contL: query?.search } },
            { productDescription: { $contL: query?.search } },
            { productType: { $contL: query?.search } },
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
        field: `productName`,
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
    query?.types,
    query?.category,
  ]);

  useEffect(() => {
    if (token) dispatch(getProducts({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = products;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
    setPageCount(pageCount);
    setTotal(total);
  }, [products]);

  // delete
  const onDelete = (value: any) => {
    console.log(value, "form-delete");
    if (!value?.id) return;
    dispatch(
      deleteProduct({
        token,
        id: value?.id,
        isSuccess() {
          toast.dark("Product has been deleted");
          dispatch(getProducts({ token, params: filters.queryObject }));
          onCloseModalDelete();
        },
        isError() {
          console.log("Error delete");
        },
      })
    );
  };

  // get product-category
  const filterProductCategory = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `productCategoryName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(
        getProductCategories({
          token,
          params: filterProductCategory.queryObject,
        })
      );
  }, [token, filterProductCategory]);

  useEffect(() => {
    let arr: Options[] = [];
    const { data } = productCategories;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.productCategoryName,
          label: item?.productCategoryName,
        });
      });
      setCategoryOpt(arr);
    }
  }, [productCategories]);
  // product-category end

  // get product-unit-measurement
  const filterProductUnit = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `unitMeasurementName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(
        getProductUnits({
          token,
          params: filterProductUnit.queryObject,
        })
      );
  }, [token, filterProductUnit]);

  useEffect(() => {
    let arr: Options[] = [];
    const { data } = productUnits;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.unitMeasurementName,
          label: item?.unitMeasurementName,
        });
      });
      setUnitOpt(arr);
    }
  }, [productUnits]);
  // product-unit-measurement end

  // get product-brand
  const filterProductBrand = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: `brandName`,
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token)
      dispatch(
        getProductBrands({
          token,
          params: filterProductBrand.queryObject,
        })
      );
  }, [token, filterProductBrand]);

  useEffect(() => {
    let arr: Options[] = [];
    const { data } = productBrands;
    if (data || data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.brandName,
          label: item?.brandName,
        });
      });
      setBrandOpt(arr);
    }
  }, [productBrands]);
  // product-brand end

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
                      value={types}
                      onChange={setTypes}
                      error=""
                      className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                      classNamePrefix=""
                      formatOptionLabel=""
                      instanceId="2"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="All Type..."
                      options={typesOpt}
                      icon=""
                    />
                  </div>

                  <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                    <DropdownSelect
                      customStyles={stylesSelect}
                      value={category}
                      onChange={setCategory}
                      error=""
                      className="text-sm font-normal text-gray-5 w-full lg:w-2/10"
                      classNamePrefix=""
                      formatOptionLabel=""
                      instanceId="3"
                      isDisabled={false}
                      isMulti={false}
                      placeholder="All Category..."
                      options={categoryOpt}
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
              </div>
            </main>

            {/* side detail */}
            <aside
              className={`w-full max-w-sm fixed top-20 lg:top-0.5 bottom-0 right-0 z-9999 lg:z-9 overflow-y-auto transform duration-300 ease-in-out bg-white shadow-card p-6 ${
                isOpenDetail ? "lg:sticky translate-x-0" : "translate-x-full"
              }`}>
              <div className="w-full text-gray-6">
                <div className="w-full flex">
                  <button
                    type="button"
                    onClick={onCloseModalDetail}
                    className="p-1 bg-white rounded-lg border-2 border-gray shadow-card">
                    <MdClose className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full px-4">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad
                  dolore quaerat earum laborum similique corporis quia ab
                  facere, sint, aut quod in suscipit fugiat cupiditate ipsam
                  deserunt iusto saepe assumenda dolorum voluptate! Quam,
                  asperiores excepturi non facilis nulla incidunt consequuntur
                  commodi consequatur id ex enim voluptatem exercitationem atque
                  omnis saepe laborum vero officiis debitis totam perferendis
                  nobis explicabo eligendi tempora! Corporis eligendi rerum vero
                  delectus at! Iusto, nesciunt officiis. Debitis, ipsum
                  laboriosam quas dignissimos nobis hic atque qui. Deleniti
                  quasi nesciunt laboriosam ipsam! Similique officia impedit
                  asperiores exercitationem nam beatae quae porro iusto sunt
                  enim, unde expedita, accusamus quia. Nulla ipsa repellat, aut,
                  quasi earum unde, optio quia ea quas beatae quod ab modi
                  quaerat tempore ipsum commodi incidunt voluptatem delectus
                  facilis quibusdam voluptatum dolore qui facere. Fugiat magnam
                  tempore, nesciunt corporis eum id. Ducimus, quos aut
                  laboriosam quis veniam deserunt molestiae iusto culpa. Est
                  pariatur explicabo quas vero velit nihil alias maiores magnam,
                  animi autem deserunt fugit unde quaerat, doloribus id nisi
                  sint exercitationem cum repellendus. Nihil odit sapiente
                  provident libero itaque exercitationem inventore accusamus,
                  aliquam molestias, reiciendis, beatae placeat enim ad. Hic
                  magnam sed tenetur reiciendis! Eligendi facilis dignissimos
                  asperiores, praesentium accusamus blanditiis neque.
                  Repellendus quas impedit libero commodi eius quibusdam, quo
                  odio corporis eum dignissimos laborum sunt labore ab quisquam
                  velit? Voluptatum, facere explicabo quibusdam animi culpa
                  deleniti ratione fugit voluptatibus ab possimus quae
                  dignissimos dolorum consequatur libero veniam magnam quia
                  esse. Quidem cum illo corporis adipisci, minus dolorem a sed,
                  earum sint animi in eius deserunt veritatis. Laudantium unde
                  laborum reprehenderit blanditiis, accusamus molestiae fuga
                  architecto modi aliquid dignissimos sit dolor, culpa quo
                  aperiam dicta corporis sapiente illum exercitationem sint,
                  nesciunt nisi nobis doloribus! Debitis possimus aliquam
                  aspernatur maxime cum dolore. Dolorem necessitatibus, aperiam
                  perferendis aliquam itaque veniam nam aut illo eius inventore
                  ipsa quis quisquam sit corporis consequatur, et culpa quos?
                  Illum omnis debitis obcaecati commodi repellendus accusamus
                  veniam vero recusandae expedita laboriosam maiores suscipit,
                  repellat quas quidem cupiditate inventore aut alias sint
                  aliquam nesciunt sequi ex animi enim? Dolor, distinctio
                  accusamus dolores commodi laborum nostrum quibusdam
                  repellendus deleniti amet maxime debitis quod laboriosam
                  corrupti, dignissimos impedit sapiente fugiat fugit? Ducimus
                  sunt omnis, optio veniam dolorem voluptates provident,
                  aspernatur animi minus reprehenderit quaerat. Ex possimus
                  libero odio, provident expedita praesentium hic suscipit
                  eaque! Debitis et aliquid vero incidunt rem eligendi
                  similique, ad, voluptatum obcaecati dolore voluptatem iste
                  nobis dignissimos laudantium eveniet? Velit, inventore quas
                  iure minima laboriosam tempore molestias culpa minus excepturi
                  tenetur ut quae quaerat rerum harum molestiae. Beatae, a alias
                  id facilis adipisci hic, eum iusto modi, cum natus quod
                  delectus sapiente totam quia. Deleniti nesciunt non voluptatem
                  eaque asperiores neque? Eveniet esse beatae soluta laudantium?
                  Sapiente veritatis quos architecto, ratione consequatur earum
                  minima autem sit maiores neque est amet dignissimos ex
                  reprehenderit doloribus aliquam enim. Quaerat soluta itaque,
                  ad illo sint laborum pariatur impedit, distinctio, neque quod
                  ipsum. Eum praesentium explicabo modi, atque fuga, reiciendis
                  cum repellendus distinctio laborum, aliquam unde consequuntur
                  dolor adipisci non nisi blanditiis omnis quasi velit ipsum
                  maiores iste et laudantium nesciunt. Itaque reiciendis
                  cupiditate perferendis doloremque rerum cumque eveniet
                  laboriosam ea, ipsam, maxime quae dolorum at cum laborum
                  quidem blanditiis totam beatae ut quis explicabo ab amet eius
                  expedita! Enim unde magni possimus, distinctio, quae quia
                  autem laborum veritatis, corrupti earum ad dicta tenetur
                  pariatur cumque voluptas doloribus quisquam necessitatibus
                  quaerat facilis culpa officiis assumenda porro! Odio
                  reprehenderit laudantium cupiditate hic velit veniam
                  repellendus aliquid quas explicabo accusamus odit, error
                  itaque enim dolore deserunt minus amet dolorum modi recusandae
                  placeat necessitatibus blanditiis, dolores voluptates. Rerum
                  adipisci sed, vero aperiam eius aspernatur, est obcaecati,
                  enim quaerat vitae ducimus exercitationem tenetur. Quisquam
                  maiores voluptatum incidunt minus eligendi inventore similique
                  cumque perferendis, repudiandae suscipit id placeat error
                  velit? Voluptatem deleniti harum quos blanditiis, amet sunt
                  enim vitae consequuntur consectetur tenetur, quisquam ratione.
                  Neque, omnis. Dolore tempore ullam dolores eligendi dicta
                  numquam voluptatem iusto corporis rerum culpa facere in ad
                  ipsam, tempora eius odit minima ducimus obcaecati omnis
                  nostrum perspiciatis. Porro possimus temporibus in quo,
                  beatae, veniam eius voluptatem, id molestias architecto nisi
                  ex. Iure error esse laudantium pariatur nam maxime autem
                  corrupti nihil facere ab accusamus laborum, dolores eaque
                  exercitationem ea consequuntur ipsum quod sunt incidunt nisi
                  fugit vero! In ducimus corrupti earum, neque nemo quisquam
                  delectus blanditiis accusamus, perspiciatis nisi temporibus
                  veniam culpa consequuntur quas nesciunt amet tempore optio
                  quia deleniti illum repellendus iusto eveniet voluptatum.
                  Corporis magnam ratione dicta esse ad repellendus,
                  necessitatibus voluptate dolores minima eius dolorem accusamus
                  repudiandae totam amet cumque quasi saepe, consequuntur
                  molestias labore at temporibus, dolor eum nulla. Accusamus,
                  similique odit sunt laborum repellat facere nemo tempora
                  obcaecati rerum, voluptatem, unde hic! Odit nesciunt vitae
                  rerum inventore laudantium fuga quis unde. Voluptate
                  voluptatum cumque impedit maiores sequi architecto quisquam
                  voluptas animi veniam omnis tempora dolorem illo, voluptates
                  aliquam expedita eos? A ipsum excepturi similique tenetur
                  nulla alias reprehenderit. Qui impedit similique recusandae
                  error? Adipisci, aliquam. Cumque autem nostrum magnam iure
                  culpa! Rem necessitatibus, corporis earum, in repudiandae nam
                  ducimus consequuntur ut illo quas, exercitationem eos unde
                  eligendi ratione quibusdam suscipit minus illum reprehenderit.
                  Iusto fuga placeat, itaque, minima fugit perferendis
                  voluptatibus cumque repellendus corporis tempora quisquam
                  esse, suscipit perspiciatis error quis quos accusantium! Illum
                  vero dicta ipsum deserunt. Debitis, veniam porro est ab
                  adipisci dolor deleniti, atque minus excepturi aspernatur
                  nihil odit quam. Reiciendis dolorem perspiciatis minus neque
                  hic, amet quaerat incidunt dicta numquam nobis assumenda
                  commodi asperiores aspernatur cupiditate velit alias facere.
                  Id, architecto veritatis incidunt quas excepturi eius porro
                  qui cum. Rerum laudantium saepe asperiores quaerat. Asperiores
                  eos nemo impedit nesciunt officia, voluptatum nam fugiat
                  minima accusantium. Qui maxime quis deleniti perferendis
                  voluptatum doloremque optio, ipsam neque doloribus voluptates.
                  Eos doloremque dolorem sed reiciendis rerum quaerat illo
                  deleniti illum! Nisi possimus nulla et ratione quisquam,
                  soluta facilis, at molestias consequatur hic id voluptates eos
                  ipsam qui animi laudantium. Ducimus, voluptatibus ex eligendi
                  quis culpa sapiente aut eius, quas doloremque molestias illo
                  incidunt! Expedita ratione blanditiis voluptatibus dicta
                  accusamus officiis tempore ipsam hic culpa non quo, delectus
                  ducimus maxime nesciunt dolorum dolores?
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
      <ProductForm
        isCloseModal={onCloseModalAdd}
        isOpen={isOpenAdd}
        token={token}
        getData={() =>
          dispatch(getProducts({ token, params: filters.queryObject }))
        }
        items={formData}
        typesOpt={typesOpt}
        categoryOpt={categoryOpt}
        unitOpt={unitOpt}
        brandOpt={brandOpt}
        defaultImage="../../image/no-image.jpeg"
      />

      {/* edit modal */}
      <ProductForm
        isCloseModal={onCloseModalEdit}
        isOpen={isOpenEdit}
        token={token}
        getData={() =>
          dispatch(getProducts({ token, params: filters.queryObject }))
        }
        items={formData}
        typesOpt={typesOpt}
        categoryOpt={categoryOpt}
        unitOpt={unitOpt}
        brandOpt={brandOpt}
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
              <h3 className="text-lg font-semibold">Delete Product</h3>
              <p className="text-gray-5">{`Are you sure to delete ${formData?.productName} ?`}</p>
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
