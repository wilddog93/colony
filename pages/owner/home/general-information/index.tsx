import React, { useEffect, useMemo, useRef, useState } from 'react'
import DomainLayouts from '../../../../components/Layouts/DomainLayouts'
import { MdChevronLeft, MdDelete, MdEdit, MdMuseum, MdWarning } from 'react-icons/md';
import Button from '../../../../components/Button/Button';
import Cards from '../../../../components/Cards/Cards';
import Barcharts from '../../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import PieCharts from '../../../../components/Chart/Piecharts';
import Tabs from '../../../../components/Layouts/Tabs';
import { menuManageDomainOwner, menuParkings } from '../../../../utils/routes';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { multiBase64, toBase64 } from '../../../../utils/useHooks/useFunction';
import { toast } from 'react-toastify';
import CurrencyFormat from 'react-currency-format';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import DropdownSelect from '../../../../components/Dropdown/DropdownSelect';
import GoogleMaps from '../../../../components/Map';

// googlemap

type Props = {
  pageProps: any
}

type FormValues = {
  id?: number | string | null;
  domainCode: string | null;
  domainName: string | null;
  domainLogo: string | null;
  domainDescription: string | null;
  domainOwner: any | any[];
  legalEntityName: string | null;
  domainWebsite: string | null;
  domainEmail: string | null;
  domainPhoneNumber: string | null;
  domainCountry: any | null;
  domainState: any | null;
  domainCity: any | null;
  domainPostalCode: string | null;
  domainGpsLocation: string | null;
  domainAddress: string | null;
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
      padding: '0',
      borderRadius: ".5rem",
      borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "#E2E8F0" : "#5F59F7",
        borderColor: state.isFocused ? "#E2E8F0" : "#5F59F7"
      },
      minHeight: 38,
      // flexDirection: "row-reverse"
    })
  },
  menuList: (provided: any) => (provided)
};

const DomainInformation = ({ pageProps }: Props) => {
  const googleMapAPI = process.env.GOOGLE_MAP_API;
  const url = process.env.API_ENDPOINT
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  // form country opt
  const [countries, setCountries] = useState<Options[]>([]);
  const [states, setStates] = useState<Options[]>([]);
  const [cities, setCities] = useState<Options[]>([]);
  // form
  const [search, setSearch] = useState<any>();
  const [watchValue, setWatchValue] = useState<FormValues | any>()
  const [watchChange, setWatchChange] = useState<any | null>(null)
  const [previewImg, setPreviewImg] = useState<string | any>();
  const [files, setFiles] = useState<any | any[]>();
  let imageRef = useRef<HTMLInputElement>(null)

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
      id: "",
      domainCode: "",
      domainName: "",
      domainLogo: "",
      domainDescription: "",
      domainOwner: null,
      legalEntityName: "",
      domainWebsite: "",
      domainEmail: "",
      domainPhoneNumber: "",
      domainCountry: null,
      domainState: null,
      domainCity: null,
      domainPostalCode: "",
      domainAddress: "",
      domainGpsLocation: "",
    }), [])
  });

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

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    console.log(value, 'event form')
  }

  const images = useWatch({
    name: "domainLogo",
    control
  });

  const descriptionValue = useWatch({
    name: "domainDescription",
    control
  });

  const onSelectImage = (e: any) => {
    console.log(e?.target?.files[0]);
    if (e?.target?.files[0]?.size > 3000000) {
      setError("domainLogo", {
        type: "onChange",
        message: "File can not more than 3MB"
      })
    } else {
      var reader = new FileReader();
      const preview = () => {
        console.log(1, e?.target?.files[0]?.size);

        if (!e.target.files || e.target.files.length == 0) {
          setFiles(undefined);
          setError("domainLogo", {
            type: "required",
            message: "File is required"
          })
          return;
        };
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
          let val = reader.result
          setFiles(val)
          setValue('domainLogo', val as string)
          clearErrors("domainLogo")
        };
      };
      preview();
    }
  };

  const onDeleteImage = () => {
    if (imageRef.current) {
      imageRef.current.value = '';
      setFiles(undefined)
      setValue('domainLogo', null)
      clearErrors("domainLogo")
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
    name: "domainCountry",
    control
  });

  const valueState = useWatch({
    name: "domainState",
    control
  });

  const valueCity = useWatch({
    name: "domainCity",
    control
  });

  useEffect(() => {
    let arr: Options[] = [];
    let countries = Country.getAllCountries();
    countries.map((item: any) => {
      arr.push({
        ...item,
        label: item.name,
        value: item.isoCode
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
          value: item.isoCode,
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
    if (watchChange?.name == "domainCountry") setValue("domainState", null)
    if (watchChange?.name == "domainState") setValue("domainCity", null)
  }, [watchChange?.name]);

  console.log(errors, 'errors form')

  console.log({ googleMapAPI, url }, 'country API')

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
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
                      type='button'
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

                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                  <div className='sticky z-40 top-0 w-full px-8'>
                    <div className='w-full flex items-center gap-4 justify-between mb-5 bg-white p-4 rounded-lg shadow-card'>
                      <h3 className='text-base lg:text-title-md font-semibold'>General Information</h3>
                      <div className='flex items-center gap-2'>
                        <Button
                          type="button"
                          variant='secondary-outline'
                          onClick={() => console.log("save")}
                          className="rounded-lg text-sm"
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          variant='primary'
                          onClick={handleSubmit(onSubmit)}
                          className="rounded-lg text-sm"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                    <div className='w-full px-2'>
                      <Cards
                        className='w-full bg-white p-6 shadow-card rounded-xl'
                      >
                        <div className='w-full grid col-span-1 sm:grid-cols-5 gap-4'>
                          {/* domain code */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainCode">
                            Domain Code
                          </label>
                          <div className='w-full col-span-4'>
                            <input
                              id='domainCode'
                              type='text'
                              placeholder='Domain code...'
                              autoFocus
                              className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                              {...register("domainCode")}
                            />
                            {errors?.domainCode && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainCode.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* domain name */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainName">
                            Domain Name
                          </label>
                          <div className='w-full col-span-4'>
                            <input
                              id='domainName'
                              type='text'
                              placeholder='Domain Name...'
                              autoFocus
                              className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                              {...register("domainName", {
                                required: {
                                  value: true,
                                  message: "Domain Name is required."
                                }
                              })}
                            />
                            {errors?.domainName && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainName.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* image logo */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainLogo">
                            Display Picture
                          </label>
                          <div className='w-full col-span-4'>
                            <div className='flex flex-col lg:flex-row gap-4'>
                              <div className='w-[200px] h-[200px] relative flex gap-2 group hover:cursor-pointer'>
                                <label htmlFor='logo' className='w-full h-full hover:cursor-pointer'>
                                  <img
                                    src={files ? files : "../../image/logo/logo-icon.svg"} alt="logo"
                                    className='w-full max-w-[200px] h-full min-h-[200px] object-cover object-center border border-gray shadow-card rounded-lg p-4'
                                  />
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
                                  placeholder='Domain Logo...'
                                  autoFocus
                                  className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100`}
                                  onChange={onSelectImage}
                                  ref={imageRef}
                                  accept="image/*"
                                />
                                {errors?.domainLogo && (
                                  <div className="mt-1 text-xs flex items-center text-red-300">
                                    <MdWarning className="w-4 h-4 mr-1" />
                                    <span className="text-red-300">
                                      {errors.domainLogo.message as any}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* domain owner */}

                          {/* domain description */}
                          <label className='col-span-1 font-semibold' htmlFor="domainDescription">
                            Domain Description
                          </label>
                          <div className='w-full col-span-4'>
                            <div className='relative'>
                              <textarea
                                cols={0.5}
                                rows={5}
                                maxLength={400}
                                placeholder='Domain Description...'
                                className='w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                {...register("domainDescription")}
                              />
                              <div className="mt-1 text-xs flex items-center">
                                <span className="text-graydark">
                                  {descriptionValue?.length || 0} / 400 characters.
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* legal entity name */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainLegalEntityName">
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

                          {/* email */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainEmail">
                            Email
                          </label>
                          <div className='w-full col-span-4'>
                            <input
                              type='email'
                              placeholder='Email...'
                              autoFocus
                              className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                              {...register("domainEmail", {
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
                            {errors?.domainEmail && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainEmail.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* phone */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainPhoneNumber">
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
                                name={`domainPhoneNumber`}
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Phone No. is required."
                                  }
                                }}
                              />
                            </div>
                            {errors?.domainPhoneNumber && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainPhoneNumber.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* country */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainCountry">
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
                              name="domainCountry"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "Country is required."
                                }
                              }}
                            />
                            {errors?.domainCountry && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainCountry.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* states */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainState">
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
                              name="domainState"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "State is required."
                                }
                              }}
                            />
                            {errors?.domainState && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainState.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* city */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainCity">
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
                              name="domainCity"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "City is required."
                                }
                              }}
                            />
                            {errors?.domainCity && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainCity.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* postal Code */}
                          <label className='col-span-1 my-auto font-semibold' htmlFor="domainPostalCode">
                            Post Code
                          </label>
                          <div className='w-full col-span-4'>
                            <input
                              type='text'
                              placeholder='Post Code...'
                              autoFocus
                              className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:border-0 disabled:bg-transparent`}
                              {...register("domainPostalCode", {
                                required: {
                                  value: true,
                                  message: "Post code is required."
                                }
                              })}
                            />
                            {errors?.domainPostalCode && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainPostalCode.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* address */}
                          <label className='col-span-1 font-semibold' htmlFor="domainCode">
                            Address
                          </label>
                          <div className='w-full col-span-4'>
                            <textarea
                              cols={0.5}
                              rows={5}
                              maxLength={400}
                              autoFocus
                              placeholder='Address...'
                              className='w-full text-sm rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                              {...register("domainAddress", {
                                required: {
                                  value: true,
                                  message: "Address is required."
                                }
                              })}
                            />
                            {errors?.domainAddress && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainAddress.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* gps location */}
                          <label className='col-span-1 font-semibold' htmlFor="domainGpsLocation">
                            Location
                          </label>
                          <div className='w-full col-span-4'>
                            <textarea
                              cols={0.5}
                              rows={5}
                              maxLength={400}
                              placeholder='Street address...'
                              className={`w-full text-sm rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:bg-transparent`}
                              value={search?.address as any}
                              disabled
                            />
                            <div className='w-full mt-3'>
                              <GoogleMaps apiKey={googleMapAPI as string} value={search} setValue={setSearch} />
                            </div>
                            {errors?.domainPostalCode && (
                              <div className="mt-1 text-xs flex items-center text-red-300">
                                <MdWarning className="w-4 h-4 mr-1" />
                                <span className="text-red-300">
                                  {errors.domainPostalCode.message as any}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </Cards>
                    </div>
                  </div>
                </form>
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
    props: { token, access, firebaseToken },
  };
};

export default DomainInformation;