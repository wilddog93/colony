import React, { useEffect, useMemo, useState } from 'react'
import DropdownSelect from '../../../Dropdown/DropdownSelect'
import { Controller, EventType, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { MdWarning } from 'react-icons/md'
import { ModalFooter } from '../../../Modal/ModalComponent'
import Button from '../../../Button/Button';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook'
import { FaCircleNotch } from 'react-icons/fa'
import { createDomainAccessGroup, getDomainAccessGroup, selectDomainAccessGroup, updateDomainAccessGroup } from '../../../../redux/features/domain/user-management/domainAccessGroupReducers'
import { toast } from 'react-toastify'
import { createDomainStructures, getDomainStructures, selectDomainStructures, updateDomainStructures } from '../../../../redux/features/domain/domainStructure'
import { getDomainAccess, selectDomainAccess } from '../../../../redux/features/domain/user-management/domainAccessReducers '
import { RequestQueryBuilder } from '@nestjsx/crud-request'

type Options = {
    value: any,
    label: any
};

type Props = {
    items?: any
    isOpen?: boolean;
    onClose: () => void;
    token?: any;
    options: Options[];
    isUpdate?: boolean;
    filters?: any;
}

type FormValues = {
    id?: any,
    domainStructureName?: string | any,
    domainAccessGroup?: any | any[];
    domainAccess?: any | any[]
}

type WatchProps = {
    value?: any | null
}

type WatchChangeProps = {
    name?: any | null;
    type?: EventType | any
};

const stylesSelect = {
    indicatorSeparator: (provided: any) => ({
        ...provided,
        display: 'none',
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
            padding: '0',
            paddingTop: '.335rem',
            paddingBottom: '.335rem',
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

const DomainRolesForm = ({ items, isOpen, onClose, token, options, isUpdate, filters }: Props) => {
    const [watchValue, setWatchValue] = useState<FormValues | any>();
    const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

    const [optionAccess, setOptionAccess] = useState<Options[]>([]);

    const dispatch = useAppDispatch();
    const { pending } = useAppSelector(selectDomainStructures);
    const { domainAccesses } = useAppSelector(selectDomainAccess);

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
            domainStructureName: items?.domainStructureName,
            domainAccessGroup: items?.domainStructureAccessGroups,
            domainAccess: items?.domainAccess,
        }), [items])
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }): any => {
            if (value) {
                setWatchValue(value)
                setWatchChangeValue({ name, type })
            }
        }
        );
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        reset({
            id: items?.id,
            domainStructureName: items?.domainStructureName,
            domainAccessGroup: items?.domainStructureAccessGroups,
            domainAccess: items?.domainAccess,
        })
    }, [items])

    const onSubmit: SubmitHandler<FormValues> = (value) => {
        let formData: FormValues = {
            domainStructureName: value?.domainStructureName,
            domainAccessGroup: value?.domainAccessGroup?.length > 0 ? value?.domainAccessGroup?.map((item: any) => item?.id) : [],
            domainAccess: value?.domainAccess?.length > 0 ? value?.domainAccess?.map((item: any) => item?.id) : [],
        };
        if (!isUpdate) {
            dispatch(createDomainStructures({
                data: formData,
                token,
                isSuccess: () => {
                    toast.dark("Create roles has been successful!")
                    reset();
                    dispatch(getDomainStructures({ params: filters, token }))
                    onClose();
                },
                isError: () => {
                    toast.dark("Create roles's fail!")
                },
            }))
        } else {
            dispatch(updateDomainStructures({
                id: value?.id,
                data: formData,
                token,
                isSuccess: () => {
                    toast.dark("Update roles has been successful!")
                    reset();
                    dispatch(getDomainStructures({ params: filters, token }))
                    onClose();
                },
                isError: () => {
                    toast.error("Update roles's fail!")
                },
            }))
        }
        console.log(formData, 'new form')
    };

    const domainAccessGroupValue = useWatch({
        name: "domainAccessGroup",
        control
    });

    const domainAccessGroupId = useMemo(() => {
        let array = domainAccessGroupValue?.length > 0 ? domainAccessGroupValue?.map((e: any) => e.id) : [];
        return array;
    }, [domainAccessGroupValue])

    const domainAccessId = useMemo(() => {
        let newArr: any[] = [];
        let newArrId: any[] = [];
        domainAccessGroupValue?.length > 0 ? domainAccessGroupValue?.map((e: any) => {
            e?.domainAccessGroupAcceses?.length > 0 ?
                e?.domainAccessGroupAcceses?.map((x: any) => {
                    newArr?.push(x)
                }) : newArr
        }) : [];
        let res = newArr?.length > 0 ? newArr.filter((v, i, a) => a.findIndex(v2 => (v2?.domainAccess?.id === v?.domainAccess?.id)) === i) : []
        res?.length > 0 ? newArrId = res?.map(x => x.domainAccess?.id) : newArrId
        return newArrId;
    }, [domainAccessGroupValue]);

    useEffect(() => {
        if (watchChangeValue?.name == "domainAccessGroup") {
            setValue("domainAccess", null)
        }
    }, [watchChangeValue])

    const filterAccess = useMemo(() => {
        const qb = RequestQueryBuilder.create();
        const search: any = {
            $and: [],
        };

        if (domainAccessId?.length > 0) search["$and"].push({ "id": { $notin: domainAccessId } })

        qb.search(search);
        qb.sortBy({ field: "domainAccessName", order: "ASC" });
        qb.query();
        return qb;
    }, [domainAccessId]);

    console.log(filterAccess, 'filter domainAccess')

    useEffect(() => {
        if (token) dispatch(getDomainAccess({ params: filterAccess.queryObject, token }))
    }, [token, filterAccess]);

    // set access options
    useEffect(() => {
        let acc: any[] = [{ value: "all", label: "Select All" }];
        const { data } = domainAccesses;
        console.log(data, 'option res')
        if (data || data?.length > 0) {
            data?.forEach((e: any) => {
                acc.push({
                    ...e,
                    value: e?.id,
                    label: e?.domainAccessName,
                    domainStructureAccessId: e?.id
                });
            });
            setOptionAccess(acc);
        } else {
            setOptionAccess([])
        }
    }, [domainAccesses.data, domainAccessGroupId]);

    return (
        <form className='w-full p-4 text-sm' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full px-4 mb-3'>
                <label htmlFor='domainStructureName' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Roles Name
                </label>
                <div className='relative'>
                    <input
                        id='domainStructureName'
                        type='text'
                        placeholder='Roles Name...'
                        className='w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        {...register("domainStructureName", {
                            required: {
                                value: true,
                                message: "Roles Name is required"
                            }
                        })}
                    />
                    {errors?.domainStructureName && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                                {errors.domainStructureName.message as any}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full px-4 mb-3'>
                <label htmlFor='domainAccessGroup' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Access Group
                </label>
                <div className='relative'>
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
                                formatOptionLabel=""
                                instanceId='domainAccessGroup'
                                isDisabled={false}
                                isMulti={true}
                                placeholder='Access Group...'
                                options={options}
                                icon=''
                            />
                        )}
                        name={`domainAccessGroup`}
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "Domain Access Group is required."
                            }
                        }}
                    />
                    {errors?.domainAccessGroup && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                                {errors?.domainAccessGroup?.message as any}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full px-4 mb-3'>
                <label htmlFor='domainAccess' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Additional New Access
                </label>
                <div className='relative'>
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
                                formatOptionLabel=""
                                instanceId='domainAccess'
                                isDisabled={false}
                                isMulti={true}
                                placeholder='Access...'
                                options={optionAccess}
                                icon=''
                            />
                        )}
                        name={`domainAccess`}
                        control={control}
                    />
                    {errors?.domainAccess && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                                {errors?.domainAccess?.message as any}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <ModalFooter
                className='px-4'
                isClose
                onClick={onClose}
            >
                <div className=''>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        variant="primary"
                        className="text-sm rounded-lg"
                        disabled={pending}
                    >
                        {pending ?
                            <div className='flex items-center gap-2'>
                                <span>Loading...</span>
                                <FaCircleNotch className='w-4 h-4 animate-spin-1.5' />
                            </div> : isUpdate ? "Update" : "Save"}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default DomainRolesForm