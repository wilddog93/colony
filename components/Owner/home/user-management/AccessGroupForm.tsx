import React, { useEffect, useMemo, useState } from 'react'
import DropdownSelect from '../../../Dropdown/DropdownSelect'
import { Controller, EventType, SubmitHandler, useForm } from 'react-hook-form'
import { MdWarning } from 'react-icons/md'
import { ModalFooter } from '../../../Modal/ModalComponent'
import Button from '../../../Button/Button';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook'
import { selectDomainAccess } from '../../../../redux/features/domain/user-management/domainAccessReducers '
import { FaCircleNotch } from 'react-icons/fa'
import { createDomainAccessGroup, getDomainAccessGroup } from '../../../../redux/features/domain/user-management/domainAccessGroupReducers'

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
}

type FormValues = {
    id?: any,
    domainAccessGroupName?: string | any,
    domainAccess?: any | any[],
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

const AccessGroupForm = ({ items, isOpen, onClose, token, options }: Props) => {
    const [watchValue, setWatchValue] = useState<FormValues | any>();
    const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

    const dispatch = useAppDispatch();
    const { domainAccesses, domainAccess, pending, error, message } = useAppSelector(selectDomainAccess)

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
            id: null,
            domainAccessGroupName: null,
            domainAccess: null,
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
            id: items.id,
            domainAccessGroupName: items.domainAccessGroupName,
            domainAccess: items.domainAccess,
        })
    }, [items])

    const onSubmit: SubmitHandler<FormValues> = (value) => {
        let formData: FormValues = {
            domainAccessGroupName: value.domainAccessGroupName,
            domainAccess: value.domainAccess?.length > 0 ? value.domainAccess?.map(({ id }: any) => id) : [],
        }
        console.log({ value, formData }, 'form values')
        dispatch(createDomainAccessGroup({
            token,
            data: formData,
            isSuccess: () => {
                dispatch(getDomainAccessGroup({ token }))
                reset({ domainAccessGroupName: null, domainAccess: null })
                onClose()
            },
            isError: () => console.log(""),
        }))
    }

    return (
        <form className='w-full p-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full px-4 mb-3'>
                <label htmlFor='accessGroupName' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Access Group Name
                </label>
                <div className='relative'>
                    <input
                        id='accessGroupName'
                        type='text'
                        placeholder='Access Group Name...'
                        className='w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        {...register("domainAccessGroupName", {
                            required: {
                                value: true,
                                message: "Access Group Name is required"
                            }
                        })}
                    />
                    {errors?.domainAccessGroupName && (
                        <div className="mt-1 text-xs flex items-center text-red-300">
                            <MdWarning className="w-4 h-4 mr-1" />
                            <span className="text-red-300">
                                {errors.domainAccessGroupName.message as any}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full px-4 mb-3'>
                <label htmlFor='taxType' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Domain Access
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
                                placeholder='Domain Access...'
                                options={options}
                                icon=''
                            />
                        )}
                        name={`domainAccess`}
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "Domain Access is required."
                            }
                        }}
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
                            </div> : "save"}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default AccessGroupForm