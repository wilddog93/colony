import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import DomainLayouts from '../../../components/Layouts/DomainLayouts'
import { MdAdd, MdEdit, MdHome, MdMailOutline, MdMapsHomeWork, MdMuseum, MdOutlineHome, MdOutlinePeople, MdOutlinePhone, MdOutlinePlace, MdOutlinePublic, MdOutlineWarning, MdPhone, MdPlace } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import Cards from '../../../components/Cards/Cards';
import Barcharts from '../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import SidebarBody from '../../../components/Layouts/Sidebar/SidebarBody';
import DomainSidebar from '../../../components/Layouts/Sidebar/Domain';
import { SearchInput } from '../../../components/Forms/SearchInput';
import DropdownSelect from '../../../components/Dropdown/DropdownSelect';
import CardTables from '../../../components/tables/layouts/CardTables';
import { DivisionProps, createDivisionArr } from '../../../components/tables/components/taskData';
import { ColumnDef } from '@tanstack/react-table';
import Teams from '../../../components/Task/Teams';
import { getDomainProperty, selectDomainProperty } from '../../../redux/features/domain/domainProperty';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { getDomainId, selectDomainAccess } from '../../../redux/features/domainAccess/domainAccessReducers';
import { formatPhone } from '../../../utils/useHooks/useFunction';
import Modal from '../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../components/Modal/ModalComponent';
import PropertyForm from '../../../components/Forms/owner/PropertyForm';

type Props = {
  pageProps: any
};

type PropertyData = {
  id?: number | string,
  createdAt?: Date | string,
  updatedAt?: Date | string,
  propertyName?: string,
  propertyDescription?: string,
  propertyLogo?: string,
  totalAdmin?: number,
  totalUnit?: number,
  totalUnitTenant?: number,
  totalOngoingComplaint?: number,
  website?: string,
  email?: string,
  phoneNumber?: number | string,
  street?: string,
  aditionalInfo?: string,
  postCode?: string,
  city?: string,
  province?: string,
  country?: string,
  gpsLocation?: string,
  legalEntityName?: string,
  legalEntityDescription?: string,
  legalEntityLogo?: string | any,
  status?: string,
  legalEntity?: PropertyData
}

type Options = {
  value: any,
  label: any
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

const DomainProperty = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // state
  const [search, setSearch] = useState<string | any>('');
  const [sort, setSort] = useState<Options>();
  // table
  const [dataTable, setDataTable] = useState<PropertyData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
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

  // redux
  const dispatch = useAppDispatch();
  const { properties, pending, error } = useAppSelector(selectDomainProperty);
  const { domain } = useAppSelector(selectDomainAccess);

  const columns = useMemo<ColumnDef<PropertyData, any>[]>(() => [
    {
      accessorKey: 'id',
      header: (info) => (
        <div className='uppercase'>Title</div>
      ),
      cell: ({ getValue, row }) => {
        let property = row?.original?.propertyName;
        let address = row?.original?.gpsLocation;
        let status = row?.original?.status;
        let totalUnit = row?.original?.totalUnit;
        let totalUnitTenant = row?.original?.totalUnitTenant;
        let totalAdmin = row?.original?.totalAdmin;
        let totalOngoingComplaint = row?.original?.totalOngoingComplaint;
        let logo = row?.original?.propertyLogo;

        return (
          <div className='w-full flex flex-col lg:flex-row gap-4 cursor-pointer p-4 tracking-wider'>
            <div className='w-full lg:w-1/5 text-lg font-semibold'>
              <img src={logo ? `${url}property/propertyLogo/${logo}` : "../image/logo/logo-icon.svg"} alt="" className='w-full max-w-[150px] object-cover object-center m-auto' />
            </div>
            <div className='w-full lg:w-4/5 flex flex-col gap-2 justify-around text-lg font-semibold '>
              <div className='w-full flex flex-col gap-2'>
                <div className='w-full flex items-center gap-2 justify-between'>
                  <div>{property || "-"}</div>
                  <div className={!status ? "hidden" : "p-1.5 bg-boxdark text-white text-sm rounded-lg"}>{status}</div>
                </div>
                <div className='w-full flex gap-2 text-sm font-normal'>
                  <div className='w-auto'>
                    <MdPlace className='w-5 h-5' />
                  </div>
                  <p className='w-4/5'>{address || "-"}</p>
                </div>
              </div>

              <div className='border-b-2 border-gray w-full'></div>

              <div className="w-full flex items-center gap-4">
                <div className='flex items-center gap-2 text-base'>
                  <div>
                    <MdOutlineHome className='w-6 h-6' />
                  </div>
                  <p className=''>{totalUnitTenant || 0}/<span className='text-gray-5 font-normal'>{totalUnit || 0}</span></p>
                </div>

                <div className='flex items-center gap-2 text-base'>
                  <div>
                    <MdOutlinePeople className='w-6 h-6' />
                  </div>
                  <p className=''>{totalAdmin || 0}</p>
                </div>

                <div className='flex items-center gap-2 text-base'>
                  <div>
                    <MdOutlineWarning className='w-6 h-6' />
                  </div>
                  <p className=''>{totalOngoingComplaint || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      footer: props => props.column.id,
      enableColumnFilter: false,
    }
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

    router.replace({ pathname, query: qr })
  }, [search, sort])


  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [
            { "propertyName": { $contL: query?.search } },
            { "propertyDescription": { $contL: query?.search } }
          ],
        },
      ],
    };
    // query?.status && search["$and"].push({ status: query?.status });

    qb.search(search);

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    if (query?.status) qb.sortBy({ field: "propertyName" || "propertyDescription", order: !query?.status ? "ASC" : "DESC" })
    qb.query();
    return qb;
  }, [query])

  useEffect(() => {
    if (token) dispatch(getDomainProperty({ params: filters.queryObject, token }))
  }, [token, filters]);

  useEffect(() => {
    if (accessId) {
      dispatch(getDomainId({ id: accessId, token }))
    }
  }, [accessId])


  useEffect(() => {
    let arr: PropertyData[] = [];
    const { data, pageCount, total } = properties;
    if (data || data?.length > 0) {
      data?.map((item: PropertyData) => {
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
  }, [properties.data])

  console.log(dataTable, 'data')
  console.log(domain, "data domain")

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Properties"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5"
      }}
    >
      <div className='w-full absolute inset-0 z-99 bg-boxdark flex text-white'>
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <DomainSidebar
              setSidebar={setSidebarOpen}
              sidebar={sidebarOpen}
              token={token}
            >
              <div className='w-full flex flex-col gap-4 py-8 px-4'>
                <div className='w-full'>
                  <img
                    src={domain?.domainLogo ? `${url}domain/domainLogo/${domain?.domainLogo}` : "../image/logo/logo-icon.svg"}
                    alt=""
                    className='w-[200px] h-[200px] object-cover object-center rounded-lg p-2 bg-white'
                  />
                </div>

                <div className="w-full">
                  <p>{domain.domainCode || "-"}</p>
                  <h3 className='text-lg lg:text-title-lg font-semibold'>{domain?.domainName || "-"}</h3>
                </div>

                <div className="w-full">
                  <span>{domain?.domainStatus || "-"}</span>
                </div>

                <div className="w-full">
                  <div className='w-full flex flex-col gap-2'>
                    <p>Description :</p>
                    <p>
                      {domain?.domainDescription || "-"}
                    </p>
                  </div>
                </div>

                <div className='border-b-2 w-full'></div>

                <div className="w-full flex flex-col gap-2">
                  <h3 className='mb-3'>Contact Info</h3>
                  <div className='w-full flex gap-2'>
                    <div><MdOutlinePhone className='w-5 h-5' /></div>
                    <p>{domain?.phoneNumber ? formatPhone("+", domain?.phoneNumber) : "-"}</p>
                  </div>
                  <div className='w-full flex gap-2'>
                    <div><MdMailOutline className='w-5 h-5' /></div>
                    <p>{domain?.email ? domain?.email : "-"}</p>
                  </div>
                  <div className='w-full flex gap-2'>
                    <div><MdOutlinePublic className='w-5 h-5' /></div>
                    <p>{domain?.website ? domain?.website : "-"}</p>
                  </div>
                  <div className='w-full flex gap-2'>
                    <div><MdOutlinePlace className='w-5 h-5' /></div>
                    <p>{domain?.gpsLocation ? domain?.gpsLocation : "-"}</p>
                  </div>
                </div>
              </div>
            </DomainSidebar>

            <div className='w-full relative tracking-wide text-left text-boxdark-2 mt-20 overflow-hidden'>
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className='sticky z-40 top-0 w-full grid grid-cols-1 lg:grid-cols-5 gap-2.5 py-6 px-8 bg-gray'>
                  <div className='w-full lg:col-span-3'>
                    <SearchInput
                      className='w-full text-sm rounded-xl'
                      classNamePrefix=''
                      filter={search}
                      setFilter={setSearch}
                      placeholder='Search...'
                    />
                  </div>
                  <div className='w-full flex flex-col lg:flex-row items-center gap-2'>
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
                  <Button
                    type="button"
                    variant="primary"
                    className="rounded-lg"
                    onClick={isOpenForm}
                  >
                    New Property
                    <MdAdd className='w-5 h-5' />
                  </Button>
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5">
                  <div className='px-8'>
                    <h3 className='text-lg lg:text-title-lg font-semibold'>Property List</h3>
                  </div>
                  <CardTables
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
                    isInfiniteScroll
                    classTable="px-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal
        isOpen={isForm}
        onClose={isCloseForm}
        size='small'
      >
        <div>
          <ModalHeader
            className='border-b-2 border-gray p-4'
            isClose
            onClick={isCloseForm}
          >
            <div className='w-full flex'>
              <h3>New Property</h3>
            </div>
          </ModalHeader>
          <div className='w-full'>
            <PropertyForm onClose={isCloseForm} isOpen={isForm} />
          </div>
        </div>
      </Modal>
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

export default DomainProperty;