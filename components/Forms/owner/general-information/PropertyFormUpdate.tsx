import { City, Country, State } from 'country-state-city';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import Button from '../../../Button/Button';
import Cards from '../../../Cards/Cards';
import { MdChevronLeft, MdDelete, MdOutlineSave, MdWarning } from 'react-icons/md';
import DropdownSelect from '../../../Dropdown/DropdownSelect';
import PhoneInput from 'react-phone-input-2';
import GoogleMaps from '../../../Map';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { FaCircleNotch } from 'react-icons/fa';
import { isBase64 } from '../../../../utils/useHooks/useFunction';
import { toast } from 'react-toastify';
import { getDomainPropertyById, selectDomainProperty, updateDomainProperty } from '../../../../redux/features/domain/domainProperty';
import { useRouter } from 'next/router';

type Props = {
    token?: string | any;
    id?: string | number | any;
    items?: any
    isUpdate?: boolean;
}

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
    gpsLatitude?: string | number | null;
    gpsLongitude?: string | number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

type Options = {
    value?: any;
    label?: any;
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
    control: (provided: any, state: any) => {
        // console.log(provided, "control")
        return ({
            ...provided,
            background: "",
            padding: '.2rem',
            borderRadius: ".5rem",
            borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
            color: "#5F59F7",
            "&:hover": {
                color: state.isFocused ? "#E2E8F0" : "#5F59F7",
                borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7"
            },
            minHeight: 33,
            // flexDirection: "row-reverse"
        })
    },
    menuList: (provided: any) => (provided)
};

const WebOptions: Options[] = [
    {
        value: "https://",
        label: "https://"
    },
    {
        value: "http://",
        label: "http://"
    }
]

const PropertyFormUpdate = ({ token, items, id, isUpdate }: Props) => {
    const googleMapAPI = process.env.GOOGLE_MAP_API;
    const url = process.env.API_ENDPOINT;
    const router = useRouter();
    const { pathname, query } = router;
    // form country opt
    const [countries, setCountries] = useState<Options[]>([]);
    const [states, setStates] = useState<Options[]>([]);
    const [cities, setCities] = useState<Options[]>([]);
    // form
    const [search, setSearch] = useState<any>();
    const [watchValue, setWatchValue] = useState<FormValues | any>()
    const [watchChange, setWatchChange] = useState<any | null>(null)
    const [previewImg, setPreviewImg] = useState<string | any>();
    const [files, setFiles] = useState<any | any[]>("");
    let imageRef = useRef<HTMLInputElement>(null)

    // redux
    const dispatch = useAppDispatch();
    const { property, pending, error, message } = useAppSelector(selectDomainProperty);

    // form
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        watch,
        reset,
        setError,
        clearErrors,
        formState: { errors, isValid },
        control,
    } = useForm({
        mode: "all",
        defaultValues: useMemo<FormValues>(() => ({
            id: items?.id,
            propertyName: items?.propertyName,
            propertyLogo: items?.propertyLogo,
            propertyDescription: items?.propertyDescription,
            legalEntityName: items?.legalEntityName,
            url: items?.url,
            website: items?.website,
            email: items?.email,
            phoneNumber: items?.phoneNumber,
            country: items?.country,
            province: items?.province,
            city: items?.city,
            postCode: items?.postCode,
            street: items?.street,
            gpsLatitude: items?.gpsLatitude,
            gpsLongitude: items?.gpsLongitude,
        }), [items])
    });

    useEffect(() => {
        if (items) {
            reset({
                id: items?.id,
                propertyName: items?.propertyName,
                propertyLogo: items?.propertyLogo,
                propertyDescription: items?.propertyDescription,
                legalEntityName: items?.legalEntityName,
                url: items?.url,
                website: items?.website,
                email: items?.email,
                phoneNumber: items?.phoneNumber,
                country: items?.country,
                province: items?.province,
                city: items?.city,
                postCode: items?.postCode,
                street: items?.street ? items?.street : "",
                gpsLatitude: items?.gpsLatitude ? Number(items?.gpsLatitude) : 0,
                gpsLongitude: items?.gpsLongitude ? Number(items?.gpsLongitude) : 0,
            })
            setSearch({
                address: items?.street ? items?.street : "",
                lat: items?.gpsLatitude ? Number(items?.gpsLatitude) : 0,
                lng: items?.gpsLongitude ? Number(items?.gpsLongitude) : 0
            })
            setFiles(items?.propertyLogo)
        }
    }, [items]);

    useEffect(() => {
        const subscription = watch((value, { name, type }): any => {
            if (value) {
                setWatchValue(value)
                setWatchChange({ name, type })
            }
        }
        );
        return () => subscription.unsubscribe();
    }, [watch]);

    const images = useWatch({
        name: "propertyLogo",
        control
    });

    const imageStatus = useMemo(() => {
        return isBase64(files)
    }, [files])

    const onSubmit: SubmitHandler<FormValues> = (value) => {
        let formData: FormValues = {
            propertyName: value.propertyName,
            propertyDescription: value.propertyDescription,
            propertyLogo: imageStatus ? value.propertyLogo : undefined,
            legalEntityName: value.legalEntityName,
            email: value.email,
            phoneNumber: value.phoneNumber,
            website: `${value.url.value}${value.website}`,
            country: value.country?.name,
            province: value.province?.name,
            city: value.city?.name,
            postCode: value.postCode,
            gpsLatitude: value.gpsLatitude,
            gpsLongitude: value.gpsLongitude,
            street: value.street
        }
        if (isUpdate) {
            dispatch(updateDomainProperty({
                id: value.id,
                data: formData,
                token,
                isError: () => {
                    console.log("error")
                },
                isSuccess: () => {
                    dispatch(getDomainPropertyById({ id: value.id, token }))
                    toast.dark(`General Information has been updated.`)
                },
            }))
        }
    }

    const descriptionValue = useWatch({
        name: "propertyDescription",
        control
    });

    const onSelectImage = (e: any) => {
        console.log(e?.target?.files[0]);
        if (e?.target?.files[0]?.size > 3000000) {
            setError("propertyLogo", {
                type: "onChange",
                message: "File can not more than 3MB"
            })
        } else {
            var reader = new FileReader();
            const preview = () => {
                console.log(1, e?.target?.files[0]?.size);

                if (!e.target.files || e.target.files.length == 0) {
                    setFiles(undefined);
                    setError("propertyLogo", {
                        type: "required",
                        message: "File is required"
                    })
                    return;
                };
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function () {
                    let val = reader.result
                    setFiles(val)
                    setValue('propertyLogo', val as string)
                    clearErrors("propertyLogo")
                };
            };
            preview();
        }
    };

    const onDeleteImage = () => {
        if (imageRef.current) {
            imageRef.current.value = '';
            setFiles(undefined)
            setValue('propertyLogo', null)
            clearErrors("propertyLogo")
        }
    }

    // console.log(Country.getCountryByCode("ID"), "country")
    // console.log(State.getAllStates(), "state")

    const formatOptionsLabel = (props: any) => {
        return (
            <div className='w-full flex items-center gap-2'>
                <div>{props.flag}</div>
                <div>{props.label}</div>
            </div>
        )
    };

    const valueCountry = useWatch({
        name: "country",
        control
    });

    const valueState = useWatch({
        name: "province",
        control
    });

    const valueCity = useWatch({
        name: "city",
        control
    });

    useEffect(() => {
        let arr: Options[] = [];
        let countries = Country.getAllCountries();
        countries.map((item: any) => {
            arr.push({
                ...item,
                label: item.name,
                value: item.name
            })
        })
        setCountries(arr);
    }, []);

    useEffect(() => {
        let arr: any[] = [];
        if (valueCountry) {
            State.getStatesOfCountry(valueCountry?.isoCode).map((item: any) => {
                arr.push({
                    ...item,
                    value: item.name,
                    label: item.name
                })
            })
        }
        setStates(arr);
    }, [valueCountry]);

    useEffect(() => {
        let arr: any[] = [];
        if (valueState) {
            City.getCitiesOfState(valueState?.countryCode, valueState?.isoCode).map((item: any) => {
                arr.push({
                    ...item,
                    value: item.name,
                    label: item.name
                })
            })
        }
        setCities(arr);
    }, [valueState]);

    useEffect(() => {
        if (watchChange?.name == "country") setValue("province", null)
        if (watchChange?.name == "province") setValue("city", null)
    }, [watchChange?.name]);

    // console.log(errors, 'errors form')

    // console.log({ googleMapAPI, url }, 'country API')

    // console.log(search, 'search')

    useEffect(() => {
        if (search?.lat) (setValue('gpsLatitude', search.lat), clearErrors("gpsLatitude"))
        if (search?.lng) (setValue('gpsLongitude', search.lng), clearErrors("gpsLongitude"))
        if (search?.address) (setValue('street', search.address), clearErrors("street"))
    }, [search])
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <div className='sticky z-40 top-0 bottom-0 w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5 py-6 px-8 bg-gray'>
                <div className='w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2'>
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        variant=""
                        className="bg-white border-2 border-gray shadow-card rounded-lg text-sm py-4 px-4"
                    >
                        <MdChevronLeft className='w-5 h-5' />
                        <span>Back to list</span>
                    </Button>
                </div>
                <div className='w-full lg:col-span-2 flex flex-col lg:flex-row items-center gap-2 justify-end'>
                    <Button
                        type="button"
                        onClick={() => console.log("delete")}
                        variant=""
                        className="bg-white border-2 border-gray shadow-card rounded-lg text-sm py-4 px-4 text-gray-5"
                    >
                        <MdDelete className='w-5 h-5' />
                        <span>Delete Property</span>
                    </Button>

                    <Button
                        type="submit"
                        onSubmit={handleSubmit(onSubmit)}
                        variant="primary"
                        className="border-2 rounded-lg py-4 px-4 text-sm"
                        disabled={pending}
                    >
                        {!pending ?
                            <Fragment>
                                <span>Manage Property</span>
                                <MdOutlineSave className='w-5 h-5' />
                            </Fragment> :
                            <Fragment>
                                <span>Loading...</span>
                                <FaCircleNotch className='w-5 h-5 animate-spin-1.5' />
                            </Fragment>
                        }
                    </Button>
                </div>
            </div>

            <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                <div className='w-full px-2'>
                    <Cards
                        className='w-full bg-white p-6 shadow-card rounded-xl'
                    >
                        <div className='w-full grid col-span-1 sm:grid-cols-5 gap-4'>
                            {/* domain name */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="propertyName">
                                Property Name
                            </label>
                            <div className='w-full col-span-4'>
                                <input
                                    id='propertyName'
                                    type='text'
                                    placeholder='Property Name...'
                                    autoFocus
                                    className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                                    {...register("propertyName", {
                                        required: {
                                            value: true,
                                            message: "Property Name is required."
                                        }
                                    })}
                                />
                                {errors?.propertyName && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.propertyName.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* image logo */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="propertyLogo">
                                Display Picture
                            </label>
                            <div className='w-full col-span-4'>
                                <div className='flex flex-col lg:flex-row gap-4'>
                                    <div className='w-[200px] h-[200px] relative flex gap-2 group hover:cursor-pointer'>
                                        <label htmlFor='logo' className='w-full h-full hover:cursor-pointer'>
                                            {!files ?
                                                <img
                                                    src={"../../../image/no-image.jpeg"} alt="logo"
                                                    className='w-full max-w-[200px] h-full min-h-[200px] object-cover object-center border border-gray shadow-card rounded-lg p-4'
                                                />
                                                : <img
                                                    src={imageStatus ? files : `${url}property/propertyLogo/${files}`} alt="logo"
                                                    className='w-full max-w-[200px] h-full min-h-[200px] object-cover object-center border border-gray shadow-card rounded-lg p-4'
                                                />
                                            }
                                        </label>
                                        <div className={`${!files ? "hidden " : ""}absolute inset-0 flex`}>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                className={`rounded-lg text-sm py-1 px-2 shadow-card opacity-0 group-hover:opacity-50 m-auto`}
                                                onClick={onDeleteImage}
                                            >
                                                Delete
                                                <MdDelete className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type='file'
                                            id='logo'
                                            placeholder='Property Logo...'
                                            autoFocus
                                            className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100`}
                                            onChange={onSelectImage}
                                            ref={imageRef}
                                            accept="image/*"
                                        />
                                        {errors?.propertyLogo && (
                                            <div className="mt-1 text-xs flex items-center text-red-300">
                                                <MdWarning className="w-4 h-4 mr-1" />
                                                <span className="text-red-300">
                                                    {errors.propertyLogo.message as any}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* domain owner */}

                            {/* domain description */}
                            <label className='col-span-1 font-semibold' htmlFor="propertyDescription">
                                Property Description
                            </label>
                            <div className='w-full col-span-4'>
                                <div className='relative'>
                                    <textarea
                                        cols={0.5}
                                        rows={5}
                                        maxLength={400}
                                        placeholder='Property Description...'
                                        className='w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        {...register("propertyDescription")}
                                    />
                                    <div className="mt-1 text-xs flex items-center">
                                        <span className="text-graydark">
                                            {descriptionValue?.length || 0} / 400 characters.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* legal entity name */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="propertyLegalEntityName">
                                Legal Entity Name
                            </label>
                            <div className='w-full col-span-4'>
                                <input
                                    type='text'
                                    placeholder='Legal Entity Name...'
                                    autoFocus
                                    className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                                    {...register("legalEntityName", {
                                        required: {
                                            value: true,
                                            message: "Legal Entity Name is required."
                                        }
                                    })}
                                />
                                {errors?.legalEntityName && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.legalEntityName.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* website */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="website">
                                Website
                            </label>
                            <div className='w-full col-span-4'>
                                <div className="relative flex gap-2">
                                    <div className='w-full max-w-max'>
                                        <Controller
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { invalid, isTouched, isDirty, error },
                                            }) => (
                                                <DropdownSelect
                                                    customStyles={stylesSelect}
                                                    value={value}
                                                    onChange={onChange}
                                                    error=""
                                                    className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                                                    classNamePrefix=""
                                                    formatOptionLabel={""}
                                                    instanceId='state'
                                                    isDisabled={false}
                                                    isMulti={false}
                                                    placeholder='URL...'
                                                    options={WebOptions}
                                                    icon=''
                                                />
                                            )}
                                            name="url"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "URL is required."
                                                }
                                            }}
                                        />
                                        {errors?.url && (
                                            <div className="mt-1 text-xs flex items-center text-red-300">
                                                <MdWarning className="w-4 h-4 mr-1" />
                                                <span className="text-red-300">
                                                    {errors.url.message as any}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='w-full'>
                                        <input
                                            type='text'
                                            placeholder='Website...'
                                            autoFocus
                                            className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                                            {...register("website", {
                                                required: {
                                                    value: true,
                                                    message: "Website is required."
                                                }
                                            })}
                                        />
                                        {errors?.website && (
                                            <div className="mt-1 text-xs flex items-center text-red-300">
                                                <MdWarning className="w-4 h-4 mr-1" />
                                                <span className="text-red-300">
                                                    {errors.website.message as any}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* email */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="email">
                                Email
                            </label>
                            <div className='w-full col-span-4'>
                                <input
                                    type='email'
                                    placeholder='Email...'
                                    autoFocus
                                    className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "Email is required."
                                        },
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Email is invalid."
                                        }
                                    })}
                                />
                                {errors?.email && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.email.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* phone */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="phoneNumber">
                                Phone No.
                            </label>
                            <div className='w-full col-span-4'>
                                <div className='relative'>
                                    <Controller
                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                            fieldState: { invalid, isTouched, isDirty, error },
                                        }) => (
                                            <PhoneInput
                                                specialLabel=''
                                                country={"id"}
                                                value={value}
                                                onChange={onChange}
                                                buttonClass='shadow-default'
                                                placeholder='1 123 4567 8910'
                                                inputClass='form-control w-full max-w-max py-3 px-6 pl-14 border border-stroke focus:border-primary rounded-lg text-sm lg:text-md'
                                                dropdownClass='left-0 text-sm lg:text-md'
                                                searchClass='p-2 outline-none sticky z-10 bg-white top-0 shadow-2'
                                                containerClass='flex'
                                                enableSearch
                                            // disableSearchIcon
                                            />
                                        )}
                                        name={`phoneNumber`}
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Phone No. is required."
                                            }
                                        }}
                                    />
                                </div>
                                {errors?.phoneNumber && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.phoneNumber.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* country */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="country">
                                Country
                            </label>
                            <div className='w-full col-span-4'>
                                <Controller
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                    }) => (
                                        <DropdownSelect
                                            customStyles={stylesSelect}
                                            value={value}
                                            onChange={onChange}
                                            error=""
                                            className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                                            classNamePrefix=""
                                            formatOptionLabel={formatOptionsLabel}
                                            instanceId='country'
                                            isDisabled={false}
                                            isMulti={false}
                                            placeholder='Choose country...'
                                            options={countries}
                                            icon=''
                                        />
                                    )}
                                    name="country"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Country is required."
                                        }
                                    }}
                                />
                                {errors?.country && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.country.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* states */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="province">
                                Province / States
                            </label>
                            <div className='w-full col-span-4'>
                                <Controller
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                    }) => (
                                        <DropdownSelect
                                            customStyles={stylesSelect}
                                            value={value}
                                            onChange={onChange}
                                            error=""
                                            className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                                            classNamePrefix=""
                                            formatOptionLabel={""}
                                            instanceId='state'
                                            isDisabled={false}
                                            isMulti={false}
                                            placeholder='Choose states...'
                                            options={states}
                                            icon=''
                                        />
                                    )}
                                    name="province"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "State is required."
                                        }
                                    }}
                                />
                                {errors?.province && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.province.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* city */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="city">
                                City
                            </label>
                            <div className='w-full col-span-4'>
                                <Controller
                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                        fieldState: { invalid, isTouched, isDirty, error },
                                    }) => (
                                        <DropdownSelect
                                            customStyles={stylesSelect}
                                            value={value}
                                            onChange={onChange}
                                            error=""
                                            className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                                            classNamePrefix=""
                                            formatOptionLabel={""}
                                            instanceId='city'
                                            isDisabled={false}
                                            isMulti={false}
                                            placeholder='Choose Cities...'
                                            options={cities}
                                            icon=''
                                        />
                                    )}
                                    name="city"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "City is required."
                                        }
                                    }}
                                />
                                {errors?.city && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.city.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* postal Code */}
                            <label className='col-span-1 my-auto font-semibold' htmlFor="postCode">
                                Post Code
                            </label>
                            <div className='w-full col-span-4'>
                                <input
                                    type='text'
                                    placeholder='Post Code...'
                                    autoFocus
                                    className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                                    {...register("postCode", {
                                        required: {
                                            value: true,
                                            message: "Post code is required."
                                        }
                                    })}
                                />
                                {errors?.postCode && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.postCode.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* address */}
                            <label className='col-span-1 font-semibold' htmlFor="domainCode">
                                Street Address
                            </label>
                            <div className='w-full col-span-4'>
                                <textarea
                                    cols={0.5}
                                    rows={5}
                                    maxLength={400}
                                    autoFocus
                                    placeholder='Street Address...'
                                    className='w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    {...register("street", {
                                        required: {
                                            value: true,
                                            message: "Street Address is required."
                                        }
                                    })}
                                />
                                {errors?.street && (
                                    <div className="mt-1 text-xs flex items-center text-red-300">
                                        <MdWarning className="w-4 h-4 mr-1" />
                                        <span className="text-red-300">
                                            {errors.street.message as any}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* gps location */}
                            <label className='col-span-1 font-semibold' htmlFor="gpsLocation">
                                Location
                            </label>
                            <div className='w-full col-span-4'>
                                <div className='w-full'>
                                    <GoogleMaps apiKey={googleMapAPI as string} value={search} setValue={setSearch} />
                                </div>
                            </div>
                        </div>
                    </Cards>
                </div>
            </div>
        </form>
    )
}

export default PropertyFormUpdate