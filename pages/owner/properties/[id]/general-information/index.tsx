import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import DomainLayouts from '../../../../../components/Layouts/DomainLayouts'
import { MdAdd, MdArrowCircleRight, MdArrowRight, MdArrowRightAlt, MdChevronLeft, MdEdit, MdHome, MdMailOutline, MdMapsHomeWork, MdMuseum, MdOutlineHome, MdOutlineMailOutline, MdOutlinePeople, MdOutlinePhone, MdOutlinePlace, MdOutlinePublic, MdOutlineWarning, MdPhone, MdPlace } from 'react-icons/md';
import Button from '../../../../../components/Button/Button';
import Cards from '../../../../../components/Cards/Cards';
import Barcharts from '../../../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import SidebarBody from '../../../../../components/Layouts/Sidebar/SidebarBody';
import DomainSidebar from '../../../../../components/Layouts/Sidebar/Domain';
import { SearchInput } from '../../../../../components/Forms/SearchInput';
import DropdownSelect from '../../../../../components/Dropdown/DropdownSelect';
import CardTables from '../../../../../components/tables/layouts/CardTables';
import { DivisionProps, createDivisionArr } from '../../../../../components/tables/components/taskData';
import { ColumnDef } from '@tanstack/react-table';
import Teams from '../../../../../components/Task/Teams';
import { getDomainProperty, getDomainPropertyById, selectDomainProperty } from '../../../../../redux/features/domain/domainProperty';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { getDomainId, selectAccessDomain } from '../../../../../redux/features/accessDomain/accessDomainReducers';
import { formatPhone } from '../../../../../utils/useHooks/useFunction';
import Modal from '../../../../../components/Modal';
import { ModalFooter, ModalHeader } from '../../../../../components/Modal/ModalComponent';
import PropertyForm from '../../../../../components/Forms/owner/PropertyForm';
import FormInfoDomain from '../../../../../components/Forms/owner/general-information/FormInfoDomain';
import FormInfoProperty from '../../../../../components/Forms/owner/general-information/PropertyFormUpdate';

type Props = {
    pageProps: any
};

type FormValues = {
    id?: number | string | null;
    propertyName?: string | null;
    propertyLogo?: string | null;
    propertyDescription?: string | null;
    legalEntityName?: string | null;
    url?: any | null;
    website?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    country?: any | null;
    province?: any | null;
    city?: any | null;
    postCode?: string | null;
    street?: string | null;
    gpsLatitude?: string | null;
    gpsLongitude?: string | null;
    searchGoogleMap?: any;
    createdAt?: Date | string;
    updatedAt?: Date | string;
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

    // form
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState<FormValues>({})
    // chart tab

    const isOpenForm = () => {
        setIsForm(true)
    }
    const isCloseForm = () => {
        setIsForm(false)
    }

    // redux
    const dispatch = useAppDispatch();
    const { properties, property, pending, error } = useAppSelector(selectDomainProperty);
    const { domain } = useAppSelector(selectAccessDomain);

    useEffect(() => {
        if (token) {
            dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
        }
    }, [token]);

    const filters = useMemo(() => {
        const qb = RequestQueryBuilder.create();
        const search: any = {
            $and: [],
        };

        qb.search(search);
        qb.query();
        return qb;
    }, [query])

    useEffect(() => {
        if (accessId) {
            dispatch(getDomainId({ id: accessId, token }))
        }
    }, [accessId])

    useEffect(() => {
        if (query?.id) {
            dispatch(getDomainPropertyById({ id: query?.id, token, params: filters.queryObject }))
        }
    }, [query?.id])

    const getWebString = (value: any) => {
        let condition = value?.slice(0, 8) === "https://";
        if (!value) {
            return ({
                website: null,
                url: null,
            })
        } else {
            if (condition) {
                return { website: value?.slice(8), url: { value: value?.slice(0, 8), label: value?.slice(0, 8) } }
            } else {
                return { website: value?.slice(7), url: { value: value?.slice(0, 7), label: value?.slice(0, 7) } }
            }
        }
    }

    useEffect(() => {
        if (property) {
            setFormData({
                ...property,
                url: getWebString(property?.website).url,
                website: getWebString(property?.website).website,
                phoneNumber: !property?.phoneNumber ? "" : property?.phoneNumber,
                country: property?.country ? { value: property?.country, label: property?.country } : null,
                province: property?.province ? { value: property?.province, label: property?.province } : null,
                city: property?.city ? { label: property?.city, value: property?.city } : null,
            })
        }
    }, [property])


    return (
        <DomainLayouts
            title="Colony"
            header="Owner"
            head="Property Details"
            logo="../../../image/logo/logo-icon.svg"
            description=""
            images="../../../image/logo/building-logo.svg"
            userDefault="../../../image/user/user-01.png"
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
                                        src={domain?.domainLogo ? `${url}domain/domainLogo/${domain?.domainLogo}` : "../../../image/no-image.jpeg"}
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

                        <div className='w-full relative tracking-wide text-left text-boxdark-2 mt-16 overflow-hidden'>
                            <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                                {/* filters */}
                                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5">
                                    {/* Form */}
                                    <FormInfoProperty items={formData} token={token} id={query} />
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