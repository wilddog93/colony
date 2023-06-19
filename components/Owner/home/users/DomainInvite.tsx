import React, { useEffect, useMemo, useState } from 'react'
import DropdownSelect from '../../../Dropdown/DropdownSelect'
import { Controller, EventType, SubmitHandler, useForm } from 'react-hook-form'
import { MdWarning } from 'react-icons/md'
import { ModalFooter } from '../../../Modal/ModalComponent'
import Button from '../../../Button/Button';
import { useAppDispatch, useAppSelector } from '../../../../redux/Hook'
import { FaCircleNotch } from 'react-icons/fa'
import { createDomainAccessGroup, getDomainAccessGroup, selectDomainAccessGroup, updateDomainAccessGroup } from '../../../../redux/features/domain/user-management/domainAccessGroupReducers'
import { toast } from 'react-toastify'
import axios from 'axios'

type Props = {
    items?: any
    isOpen?: boolean;
    onClose: () => void;
    token?: any;
}

type FormValues = {
    email?: string;
    domainStructure?: number | string;
}

type WatchProps = {
    value?: any | null
}

type WatchChangeProps = {
    name?: any | null;
    type?: EventType | any
};

const DomainInviteForm = ({ items, isOpen, onClose, token }: Props) => {
    const [watchValue, setWatchValue] = useState<FormValues | any>();
    const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

    const [isLoading, setIsLoading] = useState(false);

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
            email: items.email,
            domainStructure: items.domainStructure,
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
            email: items?.email,
            domainStructure: items?.domainStructure,
        })
    }, [items])

    const onInviteUser = async ({ formData, token, isSuccess }: any) => {
        setIsLoading(true);
        let config = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
        try {
            const res = await axios.post("user/domain/invite/register", formData, config);
            const { data, status } = res;
            if (status == 201) {
                toast.dark(`${formData.email} has been invited!`)
                isSuccess()
            } else {
                throw res
            }
        } catch (error: any) {
            const { data, status } = error.response;
            let newError: any = { message: data.message[0] }
            toast.error(newError.message)
            if (error.response && error.response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error(newError.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValues> = (value) => {
        let formData: FormValues = {
            email: value.email,
            domainStructure: value.domainStructure,
        }
        console.log({ value, formData }, 'form values')

        onInviteUser({
            token,
            formData,
            isSuccess: () => {
                reset({ email: "" })
                toast.dark("Invite User is successfully.")
                onClose()
            }
        })
    }

    return (
        <form className='w-full p-4 text-sm' onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full px-4 mb-3'>
                <label htmlFor='email' className='mb-2.5 block font-medium text-black dark:text-white'>
                    Email
                </label>
                <div className='relative'>
                    <input
                        id='email'
                        type='text'
                        placeholder='Email...'
                        className='w-full rounded-xl border border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Email is required"
                            },
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email is invalid"
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
                        disabled={isLoading}
                    >
                        {isLoading ?
                            <div className='flex items-center gap-2'>
                                <span>Loading...</span>
                                <FaCircleNotch className='w-4 h-4 animate-spin-1.5' />
                            </div> : "Invite"}
                    </Button>
                </div>
            </ModalFooter>
        </form>
    )
}

export default DomainInviteForm