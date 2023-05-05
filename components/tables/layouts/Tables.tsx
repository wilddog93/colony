import React, { Fragment, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    FilterFns,
} from '@tanstack/react-table'

import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'

import { makeData, Person } from '../components/makeData'
import { DebouncedInput, Filter, fuzzyFilter, fuzzySort } from '../components/TableComponent';
import { MdArrowDownward, MdArrowDropDown, MdArrowDropUp, MdArrowUpward, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { NextRouter, useRouter } from 'next/router';
import Button from '../../Button/Button';

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

function Tables(props: any) {
    const {
        divided,
        loading,
        setLoading,
        setIsSelected,
        totalPages,
        total
    } = props;

    const router: NextRouter = useRouter();
    const { pathname, query }: { pathname: string, query: any } = router;
    const [pageIndex, setPageIndex] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const rerender = useReducer(() => ({}), {})[1]

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo<ColumnDef<Person, any>[]>(
        () => [
            {
                id: 'name',
                header: () => <div className='w-full text-center px-6 py-4'>Name</div>,
                footer: props => props.column.id,
                columns: [
                    {
                        accessorKey: 'firstName',
                        cell: info => {
                            return info.getValue()
                        },
                        footer: props => props.column.id,
                        // enableSorting: false,
                        enableColumnFilter: false,
                        size: 10,
                        minSize: 10
                    },
                    {
                        accessorFn: (row) => {
                            return (row.lastName)
                        },
                        id: 'lastName',
                        cell: info => info.getValue(),
                        header: () => <span>Last Name</span>,
                        footer: props => props.column.id,
                        enableColumnFilter: false
                    },
                    {
                        accessorFn: row => `${row.firstName} ${row.lastName}`,
                        id: 'fullName',
                        header: 'Full Name',
                        cell: info => info.getValue(),
                        footer: props => props.column.id,
                        // filterFn: 'fuzzy',
                        // sortingFn: fuzzySort,
                        enableColumnFilter: false
                    },
                ],
            },
            {
                id: 'info',
                header: () => <div className='w-full text-center px-6 py-4'>Info</div>,
                footer: props => props.column.id,
                columns: [
                    {
                        accessorKey: 'age',
                        header: () => 'Age',
                        footer: props => props.column.id,
                        size: 50,
                        enableColumnFilter: false
                    },
                    {
                        id: 'moreInfo',
                        header: () => <div className='w-full text-center px-6 py-4'>More Info</div>,
                        columns: [
                            {
                                accessorKey: 'visits',
                                header: () => <span>Visits</span>,
                                footer: props => props.column.id,
                            },
                            {
                                accessorKey: 'status',
                                header: 'Status',
                                footer: props => props.column.id,
                            },
                            {
                                accessorKey: 'progress',
                                header: 'Profile Progress',
                                footer: props => props.column.id,
                            },
                        ],
                    },
                ],
            },
        ],
        []
    )

    // const columnsTable = useMemo(() =>
    //     loading
    //         ? columns.map((column) => ({
    //             ...column,
    //             Cell: () => {
    //                 return (
    //                     <div className="px-1 py-3 animate-pulse flex items-center justify-center">
    //                         <div className="h-2 w-20 bg-gray-200 rounded"></div>
    //                     </div>
    //                 );
    //             },
    //         }))
    //         : columns,
    //     [columns, loading]
    // );

    const [data, setData] = React.useState<Person[]>(() => makeData(50000))
    const refreshData = () => setData(old => makeData(50000))

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
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
    })

    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    // Custom Pagination
    const filterPages = useCallback((visiblePages: any, totalPages: any) => {
        // console.log(visiblePages, "filter pages", totalPages)
        return visiblePages.filter((page: any) => page <= totalPages);
    }, [])

    const getVisiblePages = useCallback((page: any, total: any) => {
        // console.log(page, "visible", total)
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
    }, [filterPages])

    const [visiblePages, setVisiblePages] = useState(getVisiblePages(pageIndex, pageCount));

    console.log(visiblePages, 'page visi')

    const changePage = useCallback((p: any) => {
        setLoading(true);
        console.log(p, activePage, 'cek')
        // if (p === activePage) {
        //     return;
        // }
        const vps = getVisiblePages(p, pageCount);
        setVisiblePages(filterPages(vps, pageCount));
        // onPageChange(p - 1);
        // gotoPage(p - 1)
        table.setPageIndex(p - 1)
        // console.log(p, 'arg p')
    }, [pageCount])

    useEffect(() => {
        // @ts-ignore
        changePage(1)
    }, [changePage])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [loading]);

    // console.log(table.getPageCount(), 'page count')
    // console.log(table.getPageOptions(), 'page options')
    // console.log(table.getState().pagination.pageIndex, 'page options')
    // console.log(table.getPaginationRowModel(), 'page 1')
    console.log(table.getVisibleLeafColumns().length, 'page visible')

    useEffect(() => {
        setPageIndex(table.getState().pagination.pageIndex);
        setActivePage(table.getState().pagination.pageIndex + 1);
    }, [table.getState().pagination.pageIndex]);

    useEffect(() => {
        setPageCount(table.getPageCount())
    }, [table.getPageCount()])

    // console.log(pageIndex, activePage, 'page')

    return (
        <div className="grid grid-cols-1">
            <div className='col-span-1 overflow-x-auto p-4'>
                {/* <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div> */}
                <table className='w-full table-auto overflow-hidden border border-gray-5 rounded-lg'>
                    {/* <thead className='text-left divide-y dark:divide-gray-700 text-xs font-semibold tracking-wide text-gray-500 uppercase border-b dark:border-gray-700'> */}
                    <thead className='divide-y divide-gray-4 text-xs text-graydark bg-gray tracking-wide'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    // console.log(header.column.getIsSorted() as string, 'header')
                                    return (
                                        <th className='px-4 py-1.5' key={header.id} colSpan={header.colSpan} style={{
                                            width: header.getSize()
                                        }}>
                                            {header.isPlaceholder ? null : (
                                                <Fragment>
                                                    <div
                                                        {...{
                                                            className: `${header.column.getCanSort() ? 'cursor-pointer select-none ' : ''}flex -tems-center gap-2`,
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: <MdArrowDropDown className='w-5 h-4' />,
                                                            desc: <MdArrowDropUp className='w-5 h-4' />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} table={table} />
                                                        </div>
                                                    ) : null}
                                                </Fragment>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={`divide-y divide-gray-4 bg-white text-graydark text-xs`}>
                        {table.getRowModel().rows.map(row => {
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id} style={{ width: cell.column.columnDef.size }} className='px-4 py-4'>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="h-2" />
                {/* <div className="flex items-center gap-2">
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div className='w-full'>
                    <div className="py-4 px-4 my-4 w-full flex flex-row justify-between items-center leading-relaxed">
                        <div className="flex flex-row items-center text-xs">
                            {table.getPageCount() >= 1 ? (
                                <>
                                    <div className="mr-10 font-bold text-gray-500">
                                        Show <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()} </strong>
                                        Rows per page
                                    </div>

                                    <select
                                        className="focus:outline-none bg-transparent text-gray-500"
                                        value={table.getState().pagination.pageSize}
                                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                                    >
                                        {
                                            [5, 10, 20, 30].map((pageSize, idx) => (
                                                <option key={idx} value={pageSize}>Show {pageSize}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            ) : (
                                <div className="mr-10 text-sm">
                                    Search : data not found...
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="">
                                <Button
                                    variant="primary-outline"
                                    className={"px-1.5 py-1.5 rounded-sm border-0"}
                                    onClick={() => {
                                        if (activePage === 1) return;
                                        changePage(activePage - 1);
                                    }}
                                    disabled={table.getState().pagination.pageIndex + 1 === 1}
                                >
                                    <MdChevronLeft className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex text-gray-500 text-xs">
                                {visiblePages.map((p: any, index: any, array: any) => {
                                    return (
                                        <button
                                            key={index}
                                            className={`focus:outline-none px-1.5 py-1.5 flex justify-center items-center text-center rounded w-8 border mx-1 ${activePage === p
                                                ? "border-primary  bg-gray text-primary font-bold"
                                                : "border-gray bg-white"
                                                }`}
                                            onClick={() => changePage(p)}
                                        >
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
                                        // disabled={activePage === pageCount}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <MdChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
                <div>
                    <button onClick={() => rerender()}>Force Rerender</button>
                </div>
                <div>
                    <button onClick={() => refreshData()}>Refresh Data</button>
                </div>
                <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
            </div>
        </div>
    )
};

export default Tables;