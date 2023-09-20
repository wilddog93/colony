import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import DomainLayouts from "../../../../components/Layouts/DomainLayouts";
import {
  MdAdd,
  MdArrowCircleRight,
  MdArrowRight,
  MdArrowRightAlt,
  MdChevronLeft,
  MdEdit,
  MdHome,
  MdMailOutline,
  MdMapsHomeWork,
  MdMuseum,
  MdOutlineHome,
  MdOutlineMailOutline,
  MdOutlinePeople,
  MdOutlinePhone,
  MdOutlinePlace,
  MdOutlinePublic,
  MdOutlineWarning,
  MdPhone,
  MdPlace,
} from "react-icons/md";
import Button from "../../../../components/Button/Button";
import Cards from "../../../../components/Cards/Cards";
import Barcharts from "../../../../components/Chart/Barcharts";
import Doughnutcharts from "../../../../components/Chart/Doughnutcharts";
import { getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { useRouter } from "next/router";
import SidebarBody from "../../../../components/Layouts/Sidebar/SidebarBody";
import DomainSidebar from "../../../../components/Layouts/Sidebar/Domain";
import { SearchInput } from "../../../../components/Forms/SearchInput";
import DropdownSelect from "../../../../components/Dropdown/DropdownSelect";
import CardTables from "../../../../components/tables/layouts/CardTables";
import {
  DivisionProps,
  createDivisionArr,
} from "../../../../components/tables/components/taskData";
import { ColumnDef } from "@tanstack/react-table";
import Teams from "../../../../components/Task/Teams";
import {
  getDomainProperty,
  getDomainPropertyById,
  selectDomainProperty,
} from "../../../../redux/features/domain/domainProperty";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  getDomainId,
  selectAccessDomain,
} from "../../../../redux/features/accessDomain/accessDomainReducers";
import { formatPhone } from "../../../../utils/useHooks/useFunction";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import PropertyForm from "../../../../components/Forms/owner/PropertyForm";

type Props = {
  pageProps: any;
};

type PropertyData = {
  id?: number | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  propertyName?: string;
  propertyDescription?: string;
  propertyLogo?: string;
  totalAdmin?: number;
  totalUnit?: number;
  totalUnitTenant?: number;
  totalOngoingComplaint?: number;
  website?: string;
  email?: string;
  phoneNumber?: number | string;
  street?: string;
  aditionalInfo?: string;
  postCode?: string;
  city?: string;
  province?: string;
  country?: string;
  gpsLocation?: string;
  legalEntityName?: string;
  legalEntityDescription?: string;
  legalEntityLogo?: string | any;
  status?: string;
  legalEntity?: PropertyData;
};

type Options = {
  value: any;
  label: any;
};

const sortOpt: Options[] = [
  { value: "ASC", label: "A-Z" },
  { value: "DESC", label: "Z-A" },
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
      padding: ".6rem",
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

const DomainProperty = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // state
  const [search, setSearch] = useState<string | any>("");
  const [sort, setSort] = useState<Options>();
  // table
  const [dataTable, setDataTable] = useState<PropertyData[]>([]);
  const [isSelectedRow, setIsSelectedRow] = useState({});
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // form
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [anualTabs, setAnualTabs] = useState("weekly");
  // chart tab

  const isOpenForm = () => {
    setIsForm(true);
  };
  const isCloseForm = () => {
    setIsForm(false);
  };

  // redux
  const dispatch = useAppDispatch();
  const { properties, property, pending, error } =
    useAppSelector(selectDomainProperty);
  const { domain } = useAppSelector(selectAccessDomain);

  let bardataHour = {
    labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
    datasets: [
      {
        label: "Outstanding",
        borderRadius: 4,
        data: [100, 250, 50, 30, 15, 3, 90],
        backgroundColor: "#5F59F7",
        barThickness: 40,
      },
      {
        label: "Running",
        borderRadius: 4,
        data: [100, 90, 50, 69, 8, 78, 44],
        backgroundColor: "#96B7FF",
        barThickness: 40,
      },
    ],
  };

  let barOptionsHour = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        align: "start",
        text: "Total Income (Million IDR)",
        font: {
          weight: "300",
          size: "16px",
        },
      },
      tooltip: {
        titleFont: {
          size: 20,
        },
        bodyFont: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: false,
          min: 0,
          max: 10,
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.1,
        categoryPercentage: 1,
      },
    },
  };

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication/sign-in"),
        })
      );
    }
  }, [token]);

  useEffect(() => {
    if (query?.page) setPages(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search);
    if (query?.sort)
      setSort({
        value: query?.sort,
        label: query?.sort == "ASC" ? "A-Z" : "Z-A",
      });
  }, []);

  useEffect(() => {
    let qr: any = {
      id: query?.id,
    };
    if (anualTabs) qr = { ...qr, annual: anualTabs };

    router.replace({ pathname, query: qr });
  }, [anualTabs]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search: any = {
      $and: [],
    };
    // query?.annual && search["$and"].push({ "annual": query?.annual });

    qb.search(search);
    qb.query();
    return qb;
  }, [query]);

  useEffect(() => {
    if (token)
      dispatch(getDomainProperty({ params: filters.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    if (accessId) {
      dispatch(getDomainId({ id: accessId, token }));
    }
  }, [accessId]);

  useEffect(() => {
    if (query?.id) {
      dispatch(getDomainPropertyById({ id: query?.id, token }));
    }
  }, [query?.id]);

  useEffect(() => {
    let arr: PropertyData[] = [];
    const { data, pageCount, total } = properties;
    if (data || data?.length > 0) {
      data?.map((item: PropertyData) => {
        arr.push(item);
      });
      setDataTable(data);
      setPageCount(pageCount);
      setTotal(total);
    } else {
      setDataTable([]);
      setPageCount(1);
      setTotal(0);
    }
  }, [properties.data]);

  const goToProperty = (id: number) => {
    console.log(id, "value go");
  };

  console.log(property, "data property");
  console.log(domain, "data domain");

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Property Details"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="w-full absolute inset-0 z-99 bg-boxdark flex text-white">
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <DomainSidebar
              setSidebar={setSidebarOpen}
              sidebar={sidebarOpen}
              token={token}>
              <div className="w-full flex flex-col gap-4 py-8 px-4">
                <div className="w-full">
                  <img
                    src={
                      domain?.domainLogo
                        ? `${url}domain/domainLogo/${domain?.domainLogo}`
                        : "../../image/no-image.jpeg"
                    }
                    alt=""
                    className="w-[200px] h-[200px] object-cover object-center rounded-lg p-2 bg-white"
                  />
                </div>

                <div className="w-full">
                  <p>{domain.domainCode || "-"}</p>
                  <h3 className="text-lg lg:text-title-lg font-semibold">
                    {domain?.domainName || "-"}
                  </h3>
                </div>

                <div className="w-full">
                  <span>{domain?.domainStatus || "-"}</span>
                </div>

                <div className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <p>Description :</p>
                    <p>{domain?.domainDescription || "-"}</p>
                  </div>
                </div>

                <div className="border-b-2 w-full"></div>

                <div className="w-full flex flex-col gap-2">
                  <h3 className="mb-3">Contact Info</h3>
                  <div className="w-full flex gap-2">
                    <div>
                      <MdOutlinePhone className="w-5 h-5" />
                    </div>
                    <p>
                      {domain?.phoneNumber
                        ? formatPhone("+", domain?.phoneNumber)
                        : "-"}
                    </p>
                  </div>
                  <div className="w-full flex gap-2">
                    <div>
                      <MdMailOutline className="w-5 h-5" />
                    </div>
                    <p>{domain?.email ? domain?.email : "-"}</p>
                  </div>
                  <div className="w-full flex gap-2">
                    <div>
                      <MdOutlinePublic className="w-5 h-5" />
                    </div>
                    <p>{domain?.website ? domain?.website : "-"}</p>
                  </div>
                  <div className="w-full flex gap-2">
                    <div>
                      <MdOutlinePlace className="w-5 h-5" />
                    </div>
                    <p>{domain?.gpsLocation ? domain?.gpsLocation : "-"}</p>
                  </div>
                </div>
              </div>
            </DomainSidebar>

            <div className="w-full relative tracking-wide text-left text-boxdark-2 mt-16 overflow-hidden">
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className="sticky z-40 top-0 bottom-0 w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5 py-6 px-8 bg-gray">
                  <div className="w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      variant=""
                      className="bg-white border-2 border-gray shadow-card rounded-lg text-sm py-4 px-4">
                      <MdChevronLeft className="w-5 h-5" />
                      <span>Back to list</span>
                    </Button>
                  </div>
                  <div className="w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2 justify-end">
                    <Button
                      type="button"
                      onClick={() =>
                        router.push({
                          pathname: `/owner/properties/form/${query?.id}`,
                        })
                      }
                      variant=""
                      className="bg-white border-2 border-gray shadow-card rounded-lg text-sm py-4 px-4">
                      <span>Edit info</span>
                      <MdEdit className="w-5 h-5 text-primary" />
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        router.push({
                          pathname: "/owner/home/roles",
                          query: {
                            page: 1,
                            limit: 10,
                          },
                        })
                      }
                      variant=""
                      className="bg-white border-2 border-gray shadow-card rounded-lg text-sm py-4 px-4">
                      <span>Manage Access</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => console.log("open")}
                      variant="primary"
                      className="border-2 rounded-lg py-4 px-4 text-sm">
                      <span>Manage Property</span>
                      <MdArrowRightAlt className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="w-full grid col-span-1 lg:grid-cols-3 gap-4 tracking-wider mb-5 px-8">
                  <Cards className="w-full bg-white shadow-card text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray">
                    <img
                      src={
                        property?.propertyLogo
                          ? `${url}property/propertyLogo/${property?.propertyLogo}`
                          : "../../image/no-image.jpeg"
                      }
                      alt=""
                      className="bg-white rounded-t-lg w-full h-[250px] object-cover object-center"
                    />
                    <div className="w-full flex flex-col gap-4 p-4">
                      <h3 className="font-semibold text-lg lg:text-xl text-gray-5">
                        {property?.propertyName || "-"}
                      </h3>
                      <p>{property?.propertyDescription || "-"}</p>

                      <div className="border-b-2 border-gray w-full"></div>

                      <div className="flex items-center justify-between">
                        <div>
                          Units
                          <p className="font-semibold">
                            {property?.totalUnitOccupant}/
                            <span className="text-gray-5">
                              {property?.totalUnit}
                            </span>
                          </p>
                        </div>
                        <div>
                          Tenants
                          <p className="font-semibold">
                            {property?.totalUnitTenant}
                          </p>
                        </div>
                        <div>
                          Issues
                          <p className="font-semibold">
                            {property?.totalOngoingIssue}
                          </p>
                        </div>
                      </div>

                      <div className="border-b-2 border-gray w-full"></div>

                      <div className="w-full flex flex-col gap-4 mb-4">
                        <h3 className="font-semibold text-lg lg:text-xl text-gray-5">
                          Contact info
                        </h3>
                        <div className="w-full flex gap-3">
                          <div className="text-gray-5">
                            <MdOutlinePhone className="w-6 h-6" />
                          </div>
                          <p>
                            {property?.phoneNumber
                              ? formatPhone("+", property?.phoneNumber)
                              : "-"}
                          </p>
                        </div>

                        <div className="w-full flex gap-3">
                          <div className="text-gray-5">
                            <MdOutlineMailOutline className="w-6 h-6" />
                          </div>
                          <p>{property?.email ? property?.email : "-"}</p>
                        </div>

                        <div className="w-full flex gap-3">
                          <div className="text-gray-5">
                            <MdOutlinePublic className="w-6 h-6" />
                          </div>
                          <p>{property?.website ? property?.website : "-"}</p>
                        </div>

                        <div className="w-full flex gap-3">
                          <div className="text-gray-5">
                            <MdOutlinePlace className="w-6 h-6" />
                          </div>
                          <p>{property?.street ? property?.street : "-"}</p>
                        </div>
                      </div>
                    </div>
                  </Cards>

                  <div className="w-full lg:col-span-2">
                    <Cards className="w-full bg-white shadow-card text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4">
                      <div className="w-full grid col-span-1 lg:grid-cols-2 gap-2 items-center">
                        <h3 className="font-semibold text-title-md">
                          Revenue Growth (Million IDR)
                        </h3>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            className={`px-4 py-2 ${
                              anualTabs == "weekly" ? "font-semibold" : ""
                            }`}
                            onClick={() => setAnualTabs("weekly")}>
                            Weekly
                          </button>

                          <button
                            type="button"
                            className={`px-4 py-2 ${
                              anualTabs == "monthly" ? "font-semibold" : ""
                            }`}
                            onClick={() => setAnualTabs("monthly")}>
                            Monthly
                          </button>

                          <button
                            type="button"
                            className={`px-4 py-2 ${
                              anualTabs == "yearly" ? "font-semibold" : ""
                            }`}
                            onClick={() => setAnualTabs("yearly")}>
                            Yearly
                          </button>
                        </div>
                      </div>
                      <Barcharts
                        data={bardataHour}
                        options={barOptionsHour}
                        height="250px"
                        className="w-full max-w-max"
                      />
                    </Cards>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal isOpen={isForm} onClose={isCloseForm} size="small">
        <div>
          <ModalHeader
            className="border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full flex">
              <h3>New Property</h3>
            </div>
          </ModalHeader>
          <div className="w-full">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi,
            suscipit?
          </div>
        </div>
      </Modal>
    </DomainLayouts>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const accessId = cookies["accessId"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication/sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, accessId, firebaseToken },
  };
};

export default DomainProperty;
