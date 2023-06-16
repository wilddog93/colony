import React, { useEffect, useMemo, useState } from 'react'
import DomainLayouts from '../../../../components/Layouts/DomainLayouts'
import { MdAdd, MdChevronLeft, MdDelete, MdEdit, MdMuseum, MdOutlineRemoveRedEye, MdPersonAddAlt } from 'react-icons/md';
import Button from '../../../../components/Button/Button';
import Cards from '../../../../components/Cards/Cards';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import Tabs from '../../../../components/Layouts/Tabs';
import { menuManageDomainOwner } from '../../../../utils/routes';
import { getDomainUser, selectDomainUser } from '../../../../redux/features/domain/domainUser';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { ColumnDef } from '@tanstack/react-table';
import { SearchInput } from '../../../../components/Forms/SearchInput';
import DropdownSelect from '../../../../components/Dropdown/DropdownSelect';
import SelectTables from '../../../../components/tables/layouts/SelectTables';
import { IndeterminateCheckbox } from '../../../../components/tables/components/TableComponent';

type Props = {
  pageProps: any
};

type Options = {
  value: any,
  label: any
}

type UserData = {
  id?: number | string,
  email?: string,
  firstName?: string,
  lastName?: string,
  nickName?: string,
  documentNumber?: number | string,
  documentSource?: string,
  profileImage?: string,
  phoneNumber?: number | string,
  birthday?: Date | string | any,
  gender?: string,
  userAddress?: string
}

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
];

const stylesSelectSort = {
  indicatorsContainer: (provided: any) => ({
    ...provided,
    flexDirection: "row-reverse"
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none'
  }),
  dropdownIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  clearIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  singleValue: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
    })
  },
  control: (provided: any, state: any) => {
    return ({
      ...provided,
      background: "",
      padding: '.6rem',
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7"
      },
      minHeight: 40,
      flexDirection: "row-reverse"
    })
  },
  menuList: (provided: any) => (provided)
};

const stylesSelect = {
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none'
  }),
  dropdownIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  clearIndicator: (provided: any) => {
    return ({
      ...provided,
      color: '#7B8C9E',
    })
  },
  singleValue: (provided: any) => {
    return ({
      ...provided,
      color: '#5F59F7',
    })
  },
  control: (provided: any, state: any) => {
    // console.log(provided, "control")
    return ({
      ...provided,
      background: "",
      padding: '.6rem',
      borderRadius: ".75rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7"
      },
      minHeight: 40,
      // flexDirection: "row-reverse"
    })
  },
  menuList: (provided: any) => (provided)
};

const RoleOptions = [
  { value: "Employee", label: "Employee" },
  { value: "Merchant", label: "Merchant" },
  { value: "Owner", label: "Owner" },
  { value: "Tenant", label: "Tenant" },
]

const DomainAccessManagement = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { users, user, pending, error, message } = useAppSelector(selectDomainUser);
  const { data } = useAppSelector(selectAuth);

  // params
  const [search, setSearch] = useState<any>("");
  const [sort, setSort] = useState<Options>();
  const [roles, setRoles] = useState<Options>();

  // table
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState<UserData[]>();
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // form
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({})

  const isOpenForm = () => {
    setIsForm(true)
  }
  const isCloseForm = () => {
    setIsForm(false)
  }

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  const columns = useMemo<ColumnDef<UserData, any>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: table?.getIsAllRowsSelected(),
              indeterminate: table?.getIsSomeRowsSelected(),
              onChange: table?.getToggleAllRowsSelectedHandler()
            }}
          />
        )
      },
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        </div>
      ),
      size: 10,
      minSize: 10
    },
    {
      accessorKey: 'user.firstName',
      header: (info) => (
        <div className='uppercase'>Name</div>
      ),
      cell: ({ getValue, row }) => {
        let image = row?.original?.profileImage;
        let firstName = row?.original?.firstName;
        let lastName = row?.original?.lastName;
        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider items-center text-center lg:text-left'>
            <img
              src={image ? `${url}images/${image}` : "../../image/user/user-01.png"}
              alt="avatar"
              className='object-cover object-center w-10 h-10'
            />
            <span>{`${firstName || " "} ${lastName || " "}`}</span>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'email',
      header: (info) => (
        <div className='uppercase'>Email</div>
      ),
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider'>
            <span>{getValue()}</span>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'phoneNumber',
      header: (info) => (
        <div className='uppercase'>Phone Number</div>
      ),
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider'>
            <span>{getValue() || "-"}</span>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'gender',
      header: (info) => (
        <div className='uppercase'>Gender</div>
      ),
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider'>
            <span>{getValue()}</span>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'id',
      header: (info) => (
        <div className='w-full uppercase text-center'>Actions</div>
      ),
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 p-4 tracking-wider text-center justify-center'>
            <Button
              type="button"
              variant="secondary-outline-none"
              className="py-0 px-0 text-center"
              onClick={() => console.log("details")}
            >
              <MdOutlineRemoveRedEye className='w-5 h-5' />
            </Button>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    },
  ], []);

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1)
    if (query?.limit) setLimit(Number(query?.limit) || 10)
    if (query?.search) setSearch(query?.search)
    if (query?.sort) setSort({ value: query?.sort, label: query?.sort == "ASC" ? "A-Z" : "Z-A" })
  }, [])

  useEffect(() => {
    let qr: any = {
      page: pages,
      limit: limit
    };
    if (search) qr = { ...qr, search: search }
    if (sort?.value) qr = { ...qr, sort: sort?.value }
    if (roles?.value) qr = { ...qr, roles: roles?.value }

    router.replace({ pathname, query: qr })
  }, [search, sort, roles])


  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search: any = {
      $and: [
        {
          $or: [
            { "user.email": { $contL: query?.search } },
            { "user.firstName": { $contL: query?.search } },
            { "user.lastName": { $contL: query?.search } },
            { "user.nickName": { $contL: query?.search } },
            { "user.gender": { $contL: query?.search } },
          ],
        },
      ],
    };
    query?.roles && search["$and"].push({ "domainStructure.domainStructureName": query?.roles });

    qb.search(search);

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    if (query?.sort) qb.sortBy({ field: "user.firstName", order: !query?.status ? "ASC" : "DESC" })
    qb.query();
    return qb;
  }, [query])

  useEffect(() => {
    if (token) dispatch(getDomainUser({ params: filters.queryObject, token }))
  }, [token, filters]);


  useEffect(() => {
    let arr: UserData[] = [];
    const { data, pageCount, total } = users;
    if (data || data?.length > 0) {
      data?.map((item: UserData) => {
        arr.push(item)
      })
      setDataTable(data)
      setPageCount(pageCount)
      setTotal(total)
    } else {
      setDataTable([])
      setPageCount(1)
      setTotal(0)
    }
  }, [users.data]);

  // console.log(isSelectedRow, 'selected')

  return (
    <DomainLayouts
      title="Colony"
      header="Access Group Management"
      head="Home"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5"
      }}
    >
      <div className='w-full absolute inset-0 z-99 bg-boxdark flex text-white'>
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <div className='w-full relative tracking-wide text-left text-boxdark-2 mt-20 overflow-hidden'>
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className='static z-40 top-0 w-full mt-6 px-8 bg-gray'>
                  <div className='w-full mb-5'>
                    <button
                      className='focus:outline-none flex items-center gap-2'
                      onClick={() => router.push("/owner/home")}
                    >
                      <MdChevronLeft className='w-5 h-5' />
                      <h3 className='text-lg lg:text-title-lg font-semibold'>Manage Domain</h3>
                    </button>
                  </div>

                  <div className='w-full mb-5'>
                    <Tabs menus={menuManageDomainOwner} />
                  </div>
                </div>

                <div className='sticky z-40 top-0 w-full px-8'>
                  <div className='w-full flex items-center gap-4 justify-between bg-white px-4 py-5 rounded-lg shadow-card'>
                    <h3 className='text-base lg:text-title-md font-semibold'>Access Group</h3>
                  </div>
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                  <div className='w-full'>

                  </div>
                  <div className='px-2'>
                    <Cards
                      className='w-full bg-white shadow-card rounded-xl'
                    >
                      <div className="w-full grid grid-cols-1 lg:grid-cols-7 gap-2.5 p-4">
                        <div className='w-full lg:col-span-3'>
                          <SearchInput
                            className='w-full text-sm rounded-xl'
                            classNamePrefix=''
                            filter={search}
                            setFilter={setSearch}
                            placeholder='Search...'
                          />
                        </div>
                        <div className='w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2'>
                          <DropdownSelect
                            customStyles={stylesSelectSort}
                            value={sort}
                            onChange={setSort}
                            error=""
                            className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                            classNamePrefix=""
                            formatOptionLabel=""
                            instanceId='1'
                            isDisabled={false}
                            isMulti={false}
                            placeholder='Sorts...'
                            options={sortOpt}
                            icon='MdSort'
                          />
                        </div>
                        <div className='w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2'>
                          <Button
                            className="rounded-lg text-sm border-1 lg:ml-auto"
                            type="button"
                            variant="primary-outline"
                            disabled={!isSelectedRow || isSelectedRow?.length == 0}
                          >
                            <MdDelete className='w-4 h-4' />
                            <span>Delete</span>
                          </Button>
                          <Button
                            className="rounded-lg text-sm"
                            type="button"
                            variant="primary"
                          >
                            <span>Add</span>
                            <MdAdd className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </Cards>
                  </div>

                  <div className="px-2">
                    <Cards className="w-full bg-white shadow-card rounded-xl tracking-wider">
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
                        classTable=""
                      />
                    </Cards>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DomainLayouts>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context)

  // Access cookies using the cookie name
  const token = cookies['accessToken'] || null;
  const access = cookies['access'] || null;
  const accessId = cookies['accessId'] || null;
  const firebaseToken = cookies['firebaseToken'] || null;

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false
      },
    };
  }

  return {
    props: { token, access, accessId, firebaseToken },
  };
};

export default DomainAccessManagement;