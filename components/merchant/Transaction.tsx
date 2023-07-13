import React, { useState, useMemo, useEffect } from "react";
import { Items, itemData } from "../tables/components/itemData";
import { ColumnDef } from "@tanstack/react-table";
import CardTables from "../tables/layouts/CardTables";
import SelectTables from "../tables/layouts/SelectTables";
import ScrollCardTables from "../tables/layouts/ScrollCardTables";
import { SearchInput } from "../Forms/SearchInput";
import DropdownSelect from "../Dropdown/DropdownSelect";

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

const Transaction = () => {
  //datatable
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(1);
  const [dataTable, setDataTable] = useState<Items[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});

  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(false);

  const columns = useMemo<ColumnDef<Items, any>[]>(
    () => [
      {
        accessorKey: "description",
        cell: (info) => {
          return (
            <div className="flex flex-col p-2">
              <h3 className="text-primary text-left text-2xl font-bold">-</h3>
              <p className="text-grey">13/04/2023, 15:48</p>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        cell: (info) => {
          let price = info?.row?.original?.price;
          return (
            <div className="flex flex-col p-2">
              <div className="flex  w-full justify-end">
                <div className="flex p-1 w-3/12 rounded-sm bg-primary text-white justify-center items-center">
                  <span>Order</span>
                </div>
              </div>
              <div className="flex justify-end text-left">
                <p className="text-black font-bold">{"IDR " + price}</p>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    setDataTable(itemData(1));
  }, [itemData]);

  const [search, setSearch] = useState(null);

  return (
    <div className="flex flex-col mt-2 p-4 space-y-2">
      <div className="w-full flex flex-wrap items-center justify-between ">
        <div className="w-full md:w-3/6">
          <div className="w-full">
            <form className="flex my-auto items-center relative w-full mr-6 text-gray-500 focus-within:text-primary">
              <SearchInput
                className="w-full text-sm rounded-xl"
                classNamePrefix=""
                filter={search}
                setFilter={setSearch}
                placeholder="Search..."
              />
            </form>
          </div>
        </div>
        <div className="w-full md:w-3/6 flex flex-col md:flex-row justify-between mt-2 md:mt-0">
          <div className="w-full flex justify-start items-center mb-2 md:mb-0 mx-0 md:mx-2">
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
        </div>
      </div>
      <ScrollCardTables
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
        classTable="bg-gray p-4"
        isHideHeader
      />
    </div>
  );
};

export default Transaction;
