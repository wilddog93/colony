import React from 'react'
import { useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import { BillingProps } from '../tables/components/billingData';
import SelectTables from '../tables/layouts/SelectTables';


const TransactionHistory = () => {

  const [loading, setLoading] = useState(true);
      // data-table
      const [dataTable, setDataTable] = useState<BillingProps[]>([]);
      const [isSelectedRow, setIsSelectedRow] = useState({});
      const [pages, setPages] = useState(1);
      const [limit, setLimit] = useState(10);
      const [pageCount, setPageCount] = useState(2000);
      const [total, setTotal] = useState(1000);
      const [details, setDetails] = useState<BillingProps>();

      const onOpenDetail = (items: any) => {
        setDetails(items)
    };

      const columns = useMemo<ColumnDef<BillingProps, any>[]>(() => [
        {
            accessorKey: 'billingDescription',
            header: (info) => ( 
                <div className='uppercase text-left'>Transaction Date</div>
            ),
            cell: ({ getValue, row }) => {
                let id = row?.original?.createdAt
                let desc = row?.original?.billingDescription;
                return (
                    <div onClick={() => onOpenDetail(row?.original)} className='w-full flex flex-col cursor-pointer p-4 hover:cursor-pointer text-left'>
                        <div className='text-lg font-semibold text-primary'>{desc}</div>
                        <div className='text-sm capitalize'>{getValue()}</div>
                    </div>
                )
            },
            footer: props => props.column.id,
            enableColumnFilter: false,
        },
        {
          accessorKey: 'totalPaidBill',
          header: (info) => (
              <div className='uppercase text-left'>Localshop Code</div>
          ),
          cell: ({ getValue, row }) => {
              let bill = row?.original?.totalPaidBill
              return (
                  <div onClick={() => onOpenDetail(row?.original)} className='w-full flex flex-col cursor-pointer p-4 hover:cursor-pointer text-left'>
                      <div className='text-lg font-semibold text-primary'>{bill}</div>
                      <div className='text-sm capitalize'>{getValue()}</div>
                  </div>
              )
          },
          footer: props => props.column.id,
          enableColumnFilter: false,
      },
      {
        accessorKey: 'totalPaidBill',
        header: (info) => (
            <div className='uppercase text-left'>LocalShopName</div>
        ),
        cell: ({ getValue, row }) => {
            let end = row?.original?.periodEnd
            return (
                <div onClick={() => onOpenDetail(row?.original)} className='w-full flex flex-col cursor-pointer p-4 hover:cursor-pointer text-left'>
                    <div className='text-lg font-semibold text-primary'>{end}</div>
                    <div className='text-sm capitalize'>{getValue()}</div>
                </div>
            )
        },
        footer: props => props.column.id,
        enableColumnFilter: false,
    },
    {
      accessorKey: 'totalPaidBill',
      header: (info) => (
          <div className='uppercase text-left'>TotalPrice</div>
      ),
      cell: ({ getValue, row }) => {
          let end = row?.original?.periodEnd
          return (
              <div onClick={() => onOpenDetail(row?.original)} className='w-full flex flex-col cursor-pointer p-4 hover:cursor-pointer text-left'>
                  <div className='text-lg font-semibold text-primary'>{end}</div>
                  <div className='text-sm capitalize'>{getValue()}</div>
              </div>
          )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
  },
    ], []);

  return (
    <div>
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
                                    // isInfiniteScroll
                                    classTable="bg-gray p-4"
                                />
    </div>
  )
}

export default TransactionHistory