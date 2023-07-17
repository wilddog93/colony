import MerchantLayouts from "../../../components/Layouts/MerchantLayouts";
import Cards from "../../../components/Cards/Cards";
import { MdOutlineLocationOn } from "react-icons/md";
import { TbBuildingCommunity } from "react-icons/tb";
import { AiOutlineStar } from "react-icons/ai";
import Tabs from "../../../components/Layouts/Tabs";
import { menuMerchant } from "../../../utils/routes";
import Button from "../../../components/Button/Button";
import { MdAdd } from "react-icons/md";
import { useState, useMemo, useEffect } from "react";
import { SearchInput } from "../../../components/Forms/SearchInput";
import DropdownSelect from "../../../components/Dropdown/DropdownSelect";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import ToggleSwitch from "../../../components/merchant/button/ToggleSwitch";
import {
  Items,
  itemData,
} from "../../../components/tables/components/itemData";
import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import ScrollCardTables from "../../../components/tables/layouts/ScrollCardTables";
import OverviewMenu from "../../../components/merchant/OverviewMenu";
import OverviewTabs from "../../../components/merchant/OverviewTabs";
import Modal from "../../../components/Modal";
import { ModalHeader } from "../../../components/Modal/ModalComponent";
import NewItem from "../../../components/Forms/Merchant/detail/NewItem";
import MerchantTables from "../../../components/tables/layouts/merchant/MerchantTable";

type Props = {
  pageProps: any;
};

const sortOpt = [
  { value: "A-Z", label: "A-Z" },
  { value: "Z-A", label: "Z-A" },
];

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

const merchant = ({ pageProps }: Props) => {
  const { token, accessToken, firebaseToken } = pageProps;

  const router = useRouter();
  const { pathname, query } = router;

  const onOpenDetail = (items: any) => {
    // setDetails(items)
    // setSidebar(true)
    if (!items?.id) {
      router.replace({ pathname });
    }
    router.push({ pathname: `/property/billings/receipt/${items.id}` });
  };

  // form
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  //modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  //datatable
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(2000);
  const [total, setTotal] = useState(1000);
  const [dataTable, setDataTable] = useState<Items[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [details, setDetails] = useState<Items>();

  const onCloseDelete = () => {
    setDetails(undefined);
    setIsOpenDelete(false);
  };
  const onOpenDelete = (items: any) => {
    setDetails(items);
    setIsOpenDelete(true);
  };

  const columns = useMemo<ColumnDef<Items, any>[]>(
    () => [
      {
        accessorKey: "images",
        header: (info) => <div className="uppercase">Product Image</div>,
        cell: (info) => {
          const images = info.getValue();
          return (
            <div className="flex justify-center items-center">
              <img src={images} className="h-12 w-12 lg:w-15 lg:h-15"></img>
            </div>
          );
        },
        footer: (props) => props.column.id,
        // enableSorting: false,
        enableColumnFilter: false,
        size: 200,
        minSize: 10,
      },
      {
        accessorKey: "code",
        cell: (info) => {
          // let productName = info?.row?.original?.productName;
          return (
            <div className="flex flex-col">
              <span className="text-primary font-bold w-full">
                {"IT - 0" + info.getValue()}
              </span>
              <p className="w-full">{info.row.original.productName}</p>
            </div>
          );
        },
        header: "Name",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "category",
        cell: (info) => {
          let category = info.row.original.category;

          return (
            <div className="flex justify-center items-center">
              <div className="bg-slate-300 rounded-sm p-1 text-white flex justify-center text-center items-center">
                <span>{category}</span>
              </div>
            </div>
          );
        },
        header: "Category",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      },
      {
        accessorKey: "price",
        cell: (info) => {
          const price = info.getValue();
          return (
            <div>
              <span className="font-bold">{"IDR " + price}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        cell: (info) => {
          return <ToggleSwitch />;
        },
      },
      {
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          // console.log(row.original, "info")
          return (
            <div className="w-full text-center flex items-center justify-center cursor-pointer px-4 py-6">
              <Button
                onClick={() => onOpenDetail(row?.original)}
                className="px-0 py-0"
                type="button"
                variant="primary-outline-none">
                <MdOutlineEdit className="w-5 h-5 text-gray-5" />
              </Button>
              <Button
                onClick={() => onOpenDelete(row?.original)}
                className="px-0 py-0"
                type="button"
                variant="danger-outline-none">
                <MdOutlineDelete className="w-5 h-5 text-gray-5" />
              </Button>
            </div>
          );
        },
        header: (props) => {
          return <div>Actions</div>;
        },
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
    setDataTable(itemData(100));
  }, [itemData]);

  return (
    <MerchantLayouts
      title="Colony"
      header="Merchant"
      head="Detail"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      token={token}>
      <div className="w-full absolute inset-0 mt-16 z-99 bg-white flex">
        <div className="w-full flex flex-col lg:flex-row p-2">
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Profile Card */}
            <div className="w-full p-4">
              <Cards className="w-full bg-white border border-stroke shadow rounded-lg p-4 text-sm">
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start">
                    <div className="w-[250px] max-w-[250px] px-2 ">
                      <img
                        src="../../../image/empty-images.png"
                        className="rounded-full border-none w-[200px] lg:w-[180px] max-w-[250px] h-[200px] lg:h-[180px] object-cover object-center m-auto"></img>
                    </div>
                    <div className="w-full px-2">
                      <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                        <div className="w-full flex mb-3 lg:mb-0 items-center justify-between">
                          <h3 className="text-lg uppercase text-primary font-bold mx-1">
                            Colony
                          </h3>
                          <div className="px-2 py-1 rounded border capitalize bg-purple-100 text-primary border-primary">
                            Active
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center w-full mt-2 text-gray-5">
                        <div className="w-5 mr-1">
                          <MdOutlineLocationOn />
                        </div>
                        <div className="text-left font-bold uppercase">
                          Graha Sumartadinata
                        </div>
                      </div>
                      <div className="flex items-center w-full mt-2 text-gray-5">
                        <div className="w-5 mr-1">
                          <TbBuildingCommunity />
                        </div>
                        <div className="text-left text-xs font-bold capitalize">
                          COLONY
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2 my-3">
                        <h3 className="text-left text-lg font-semibold text-gray-5">
                          Colony
                        </h3>
                        <div className="w-full flex items-center justify-between lg:justify-start">
                          <div className="w-full max-w-max flex items-center text-yellow-300 mb-3">
                            <AiOutlineStar className="lg:w-6 lg:h-6 text-gray-5" />
                            <AiOutlineStar className="lg:w-6 lg:h-6 text-gray-5" />
                            <AiOutlineStar className="lg:w-6 lg:h-6 text-gray-5" />
                            <AiOutlineStar className="lg:w-6 lg:h-6 text-gray-5" />
                            <AiOutlineStar className="lg:w-6 lg:h-6 text-gray-5" />
                          </div>
                          <div className="w-full max-w-max text-gray-5 text-sm mb-3 text-left lg:ml-3">
                            <span>0 / 5 from</span>
                            <span> 0 user</span>
                          </div>
                        </div>
                        <div className="w-full flex flex-col text-gray-5">
                          <p className="text-xs lg:text-sm text-justify">
                            colony
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Cards>
            </div>

            {/* Menu */}
            <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center my-4 px-4">
              <div className="lg:w-full">
                <Tabs menus={menuMerchant} />
              </div>
              <div className="w-full lg:w-1/4 flex justify-start lg:justify-end">
                <Button
                  type="button"
                  onClick={isOpenForm}
                  className="rounded-lg text-sm font-semibold py-4"
                  variant="primary">
                  <span>New Item</span>
                  <MdAdd />
                </Button>
              </div>
            </div>
            {/* item details content */}
            <div className="w-full flex flex-wrap items-center justify-between p-4">
              {/* search bar */}
              <div className="w-full md:w-2/6">
                <SearchInput
                  className="w-full text-sm rounded-xl"
                  classNamePrefix=""
                  filter={search}
                  setFilter={setSearch}
                  placeholder="Search..."
                />
              </div>
              {/* filter */}
              <div className="w-full md:w-4/6 flex flex-col md:flex-row justify-between mt-2 md:mt-0">
                <div className="w-full md:w-1/3 flex justify-start items-center mb-2 md:mb-0 mx-0 md:mx-2">
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
                    placeholder="Type..."
                    options={sortOpt}
                    icon=""
                  />
                </div>
                <div className="w-full md:w-1/3 flex justify-start items-center mb-2 md:mb-0 mx-0 md:mx-2">
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
                    placeholder="Category..."
                    options={sortOpt}
                    icon=""
                  />
                </div>
                <div className="w-full md:w-1/3 flex justify-start items-center mb-2 md:mb-0 mx-0 md:mx-2">
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
                    placeholder="Sub-Category..."
                    options={sortOpt}
                    icon=""
                  />
                </div>
              </div>
            </div>
            {/* Table data */}
            <MerchantTables
              columns={columns}
              dataTable={dataTable}
              loading={loading}
              setLoading={setLoading}
              pages={pages}
              setPages={setPages}
              limit={limit}
              setLimit={setLimit}
              pageCount={pageCount}
              total={total}
              isInfiniteScroll={false}
              isHideHeader
            />
          </div>
          {/* sisi kanan */}
          <div className="responsive w-full lg:w-2/5 p-4 lg:overflow-auto lg:h-screen">
            {/* overview menu */}
            {/* <OverviewMenu /> */}
            <OverviewTabs />
          </div>
        </div>
      </div>
      <Modal isOpen={isForm} onClose={isCloseForm} size="medium">
        <div>
          <ModalHeader
            className="border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full flex">
              <h3>New Item</h3>
            </div>
          </ModalHeader>
          <div className="w-full">
            <NewItem token={token} onClose={isCloseForm} isOpen={isForm} />
          </div>
        </div>
      </Modal>
    </MerchantLayouts>
  );
};

export default merchant;
