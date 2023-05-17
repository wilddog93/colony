import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

//3 TanStack Libraries!!!
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import {
    QueryClient,
    QueryClientProvider,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { useVirtual } from '@tanstack/react-virtual'

import { fetchData, Person, PersonApiResponse } from '../components/infiniteData'
import { fuzzyFilter } from '../components/TableComponent'

const fetchSize = 25

const InfiniteScrollTables = () => {
    const rerender = useReducer(() => ({}), {})[1]

    //we need a reference to the scrolling element for logic down below
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState('')

    const columns = useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 60,
            },
            {
                accessorKey: 'firstName',
                cell: info => info.getValue(),
            },
            {
                accessorFn: row => row.lastName,
                id: 'lastName',
                cell: info => info.getValue(),
                header: () => <span>Last Name</span>,
            },
            {
                accessorKey: 'age',
                header: () => 'Age',
                size: 50,
            },
            {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                size: 50,
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
            {
                accessorKey: 'progress',
                header: 'Profile Progress',
                size: 80,
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: info => info.getValue<Date>().toLocaleString(),
            },
        ],
        []
    )

    //react-query has an useInfiniteQuery hook just for this situation!
    const { data, fetchNextPage, isFetching, isLoading } =
        useInfiniteQuery<PersonApiResponse>(
            ['table-data', sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
            async ({ pageParam = 0 }) => {
                const start = pageParam * fetchSize
                const fetchedData = fetchData(start, fetchSize, sorting) //pretend api call
                return fetchedData
            },
            {
                getNextPageParam: (_lastGroup, groups) => groups.length,
                keepPreviousData: true,
                refetchOnWindowFocus: true,
            }
        )

    //we must flatten the array of arrays from the useInfiniteQuery hook
    const flatData = useMemo(
        () => data?.pages?.flatMap(page => page.data) ?? [],
        [data]
    )
    const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
    const totalFetched = flatData.length

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement
                //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
                if (
                    scrollHeight - scrollTop - clientHeight < 300 &&
                    !isFetching &&
                    totalFetched < totalDBRowCount
                ) {
                    fetchNextPage()
                }
                console.log((scrollHeight - scrollTop - clientHeight), 'scroll')
            }
        },
        [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
    )

    //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current)
    }, [fetchMoreOnBottomReached])

    const table = useReactTable({
        data: flatData,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
            sorting
        },
        onSortingChange: setSorting,
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

    const { rows } = table.getRowModel()

    //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    })
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const paddingBottom =
        virtualRows.length > 0
            ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
            : 0

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className="p-2">
            <div className="grid grid-cols-1" />
            <div
                className="container col-span-1 p-4 overflow-y-auto h-[500px]"
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}
            >
                <table className='w-full table-auto rounded-xl shadow-md'>
                    <thead className='divide-y divide-gray-4 text-xs text-graydark bg-gray tracking-wide'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: header.getSize() }}
                                            className='px-4 py-6'
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} className='px-4 py-6' />
                            </tr>
                        )}
                        {virtualRows.map(virtualRow => {
                            const row = rows[virtualRow.index] as Row<Person>
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id} className='px-4 py-6'>
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
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div>
                Fetched {flatData.length} of {totalDBRowCount} Rows.
            </div>
            <div>
                <button onClick={() => rerender()}>Force Rerender</button>
            </div>
        </div>
    )
};

export default InfiniteScrollTables;
