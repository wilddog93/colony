import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
} from "@tanstack/react-table";

import { RankingInfo } from "@tanstack/match-sorter-utils";

import { makeData, ColumnItems } from "../../components/makeData";
import { Filter, fuzzyFilter } from "../../components/TableComponent";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowUpward,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { NextRouter, useRouter } from "next/router";
import Button from "../../../Button/Button";
import { FaCircleNotch } from "react-icons/fa";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

function CardTables(props: any) {
  const {
    divided,
    dataTable,
    columns,
    loading,
    setLoading,
    setIsSelected,
    pageCount,
    pages,
    setPages,
    limit,
    setLimit,
    total,
    isInfiniteScroll,
    classTable,
  } = props;

  const router: NextRouter = useRouter();
  const { pathname, query }: { pathname: string; query: any } = router;
  const [pageIndex, setPageIndex] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [isLoadingInfinite, setIsLoadingInfinite] = useState(true);

  const rerender = useReducer(() => ({}), {})[1];

  let refTable = useRef<HTMLDivElement>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const [data, setData] = React.useState<ColumnItems[]>(() => makeData(50000));
  const refreshData = () => setData((old) => makeData(50000));

  // @ts-ignore
  const table = useReactTable({
    data: dataTable,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection: rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  // Custom Pagination
  const filterPages = useCallback(
    (visiblePages: number[], totalPages: number) => {
      // console.log(visiblePages, "filter pages", totalPages)
      return visiblePages.filter((page) => page <= totalPages);
    },
    []
  );

  const getVisiblePages = useCallback(
    (page: number, total: number) => {
      if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
      } else {
        if (page % 5 >= 0 && page > 4 && page + 2 < total) {
          return [1, page - 1, page, page + 1, total];
        } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        }
      }
    },
    [filterPages]
  );

  const [visiblePages, setVisiblePages] = useState(
    getVisiblePages(pages, pageCount)
  );

  useEffect(() => {
    setVisiblePages(getVisiblePages(pages, pageCount));
  }, [getVisiblePages, pages, pageCount]);

  const changePage = useCallback(
    (p: number | any) => {
      setLoading(true);

      if (p === pages) {
        return;
      }
      const vps = getVisiblePages(p, pageCount);
      setVisiblePages(filterPages(vps, pageCount));
      setPages(p);
    },
    [pageCount, pages]
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setIsLoadingInfinite(false);
    }, 3000);
  }, [loading, isLoadingInfinite]);

  useEffect(() => {
    if (!limit) {
      return;
    }
    table.setPageSize(limit);
  }, [limit]);

  useEffect(() => {
    if (!pages) {
      setPageIndex(1 - 1);
      setActivePage(1);
    }
    setPageIndex(pages - 1);
    setActivePage(pages);
  }, [pages]);

  // console.log("pages", { pages, limit, activePage, pageIndex, index: table.getState().pagination.pageIndex, pageCount, visiblePages })

  // scroll function
  const loadHandler = () => {
    // setLimit(limit => limit + 10);
    if (isInfiniteScroll) {
      setLoading(true);
      setIsLoadingInfinite(true);
      if (limit >= total) {
        return;
      }
      setTimeout(() => {
        setLimit((limit: number) => limit + 10);
      }, 3000);
    }
  };

  const handleScroll = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // console.log((scrollHeight - scrollTop - clientHeight), 'result')
        if (scrollHeight - scrollTop - clientHeight < 10) {
          loadHandler();
        }
        if (scrollTop == 0) {
          setLimit(10);
        }
      }
    },
    [loadHandler]
  );

  useEffect(() => {
    handleScroll(refTable.current);
  }, [handleScroll]);

  useEffect(() => {
    setIsSelected(
      table.getFilteredSelectedRowModel().flatRows.map((d) => d.original)
    );
  }, [table.getFilteredSelectedRowModel()]);

  useEffect(() => {
    if (dataTable?.length == 0) setPages(1);
  }, [dataTable]);

  return (
    <div className="grid grid-cols-1">
      <div className="col-span-1 p-4 overflow-x-auto">
        <div className="w-full overflow-hidden rounded-xl">
          <div
            className={`w-full grid col-span-1 gap-4 text-graydark text-xs mb-5 ${classTable}`}>
            {table.getRowModel().rows.map((row) => {
              return (
                <div
                  key={row.id}
                  className="w-full h-full min-h-[120px] max-h-[400px] overflow-hidden flex flex-col justify-between bg-white rounded-xl shadow-card border border-gray">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <div key={cell.id} className="w-full flex flex-col gap-2">
                        {loading && !isInfiniteScroll ? (
                          <div className="px-1 py-1 animate-pulse flex items-center justify-center">
                            <div className="h-2 w-20 bg-gray rounded"></div>
                          </div>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {isLoadingInfinite && isInfiniteScroll ? (
              <div className="w-full flex items-center">
                <div className="px-4 py-4">
                  <div className="w-full flex items-center gap-2 text-base font-semibold">
                    Loading...
                    <FaCircleNotch className="w-4 h-4 animate-spin-2" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div
            className={`border-t border-gray-4 text-gray-5 font-normal ${
              isInfiniteScroll ? "hidden" : ""
            }`}>
            <div className="w-full">
              <div>
                <div className="py-4 px-4 my-4 w-full flex flex-col lg:flex-row lg:justify-between items-center leading-relaxed">
                  <div className="flex flex-row items-center text-xs">
                    {pageCount >= 1 ? (
                      <>
                        <div className="mr-10 text-gray-500 font-normal">
                          Rows per page
                        </div>

                        <select
                          className="focus:outline-none bg-transparent text-gray-500 font-normal"
                          value={limit}
                          onChange={(e) => setLimit(Number(e.target.value))}>
                          {[5, 10, 20, 30].map((pageSize, idx) => (
                            <option key={idx} value={pageSize}>
                              {pageSize}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <div className="mr-10 text-sm">
                        Search : data not found...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-normal">
                      <strong>{pages}</strong> of <strong>{pageCount} </strong>{" "}
                      pages
                    </div>
                    <div className="">
                      <Button
                        variant="primary-outline"
                        className={"px-1.5 py-1.5 rounded-sm border-0"}
                        onClick={() => {
                          if (activePage === 1) return;
                          changePage(activePage - 1);
                        }}
                        disabled={pageIndex == 0}>
                        <MdChevronLeft className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex text-gray-500 text-xs">
                      {visiblePages.map((p: any, index: any, array: any) => {
                        return (
                          <button
                            key={index}
                            className={`focus:outline-none px-1.5 py-1.5 flex justify-center items-center text-center rounded w-8 border mx-1 ${
                              activePage === p
                                ? "border-primary  bg-gray text-primary font-bold"
                                : "border-gray bg-white"
                            }`}
                            onClick={() => changePage(p)}>
                            {array[index - 1] + 2 < p ? `${p}` : p}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end items-center">
                      <div className="">
                        <Button
                          variant="primary-outline"
                          className={"px-1.5 py-1.5 rounded-sm border-0"}
                          onClick={() => {
                            if (activePage === pageCount) return;
                            changePage(activePage + 1);
                          }}
                          disabled={activePage === pageCount}>
                          <MdChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardTables;
