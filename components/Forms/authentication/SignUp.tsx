import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdEmail, MdLockOutline, MdOutlineCalendarToday, MdOutlineEmail, MdOutlinePerson } from 'react-icons/md'
import Button from '../../Button/Button'
import DropdownSelect from '../../Dropdown/DropdownSelect'
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    onChangePage: () => void
    isOpen: boolean
};

const genderOption = [
    {
        value: 1,
        gender: "male",
        label: "Mr"
    },
    {
        value: 2,
        gender: "female",
        label: "Mrs"
    },
    {
        value: 3,
        gender: "female",
        label: "Miss"
    },
    {
        value: 4,
        gender: "any",
        label: "Any"
    }
];

const stylesSelect = {
    indicatorSeparator: (provided: any) => ({
        ...provided,
        display: 'none',
    }),
    dropdownIndicator: (provided: any) => {
        return ({
            ...provided,
            // color: '#5F59F7',
            padding: "1rem"
        })
    },
    clearIndicator: (provided: any) => {
        return ({
            ...provided,
            // color: '#5F59F7',
            padding: "1rem"
        })
    },
    singleValue: (provided: any) => {
        return (provided)
    },
    control: (provided: any, state: any) => {
        return ({
            ...provided,
            background: "#F5F9FD",
            borderColor: state.isFocused ? "#5F59F7" : "#E2E8F0",
            minHeight: 38
        })
    }
};

const SignUp = (props: Props) => {
    const { onChangePage, isOpen } = props;
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

    console.log(dateOfBirth?.toDateString(), 'date')

    return (
        <div className={`absolute bg-white right-0 top-0 z-50 flex w-full lg:w-1/2 h-full flex-col overflow-hidden duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full opacity-0'}`}>
            <div className='relative bg-white z-50 w-full h-full flex flex-col justify-between gap-2.5 text-gray-5 py-6 lg:10'>
                <div className=' w-full flex flex-col gap-2 p-6 xl:pl-10'>
                    <h2 className='font-bold text-2xl text-graydark dark:text-white sm:text-title-xl2'>Register</h2>
                    <p className='text-gray-5 text-sm sm:text-title-sm'>Sign your informations to continue</p>
                </div>

                <form className='relative overflow-auto p-6 xl:px-10'>
                    <div className='mb-3'>
                        <label htmlFor='name' className='mb-2.5 block font-medium text-black dark:text-white'>
                            Contact Name *
                        </label>
                        <div className="w-full flex flex-col lg:flex-row items-center gap-2">
                            <div className="w-full lg:w-1/3">
                                <DropdownSelect
                                    customStyles={stylesSelect}
                                    value={gender}
                                    onChange={setGender}
                                    error=""
                                    className='text-sm lg:text-md font-normal'
                                    classNamePrefix=""
                                    formatOptionLabel=""
                                    instanceId='1'
                                    isDisabled={false}
                                    isMulti={false}
                                    placeholder='Choose...'
                                    options={genderOption}
                                    icon=''
                                />
                            </div>

                            <div className="w-full lg:w-2/3 flex flex-col lg:flex-row items-start lg:items-center gap-2">
                                <div className='w-full lg:w-1/2 relative'>
                                    <input
                                        id='name'
                                        type='text'
                                        placeholder='Firstname'
                                        className='text-sm lg:text-md w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />

                                    <MdOutlinePerson className='absolute right-4 top-4 h-6 w-6 text-gray-5' />
                                </div>
                                <div className='w-full lg:w-1/2 relative'>
                                    <input
                                        id='name'
                                        type='text'
                                        placeholder='Lastname'
                                        className='text-sm lg:text-md w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />

                                    <MdOutlinePerson className='absolute right-4 top-4 h-6 w-6 text-gray-5' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row mb-0 lg:mb-3 gap-2">
                        <div className='w-full lg:w-1/2 mb-3 lg:mb-0'>
                            <label htmlFor='phone' className='mb-2.5 block font-medium text-black dark:text-white'>
                                Phone Number *
                            </label>
                            <div className='text-gray-5'>
                                <PhoneInput
                                    specialLabel=''
                                    country={"id"}
                                    value={phone}
                                    onChange={setPhone}
                                    buttonClass='shadow-default'
                                    placeholder='1 123 4567 8910'
                                    inputClass='form-control py-4 px-6 border border-stroke focus:border-primary rounded-lg text-sm lg:text-md'
                                    dropdownClass='right-0 text-sm lg:text-md'
                                    searchClass='p-2 outline-none sticky z-10 bg-white top-0 shadow-2'
                                    containerClass='flex flex-row-reverse'
                                    enableSearch
                                // disableSearchIcon
                                />
                            </div>
                        </div>

                        <div className='w-full lg:w-1/2 mb-3 lg:mb-0'>
                            <label className='w-full text-gray-5 overflow-hidden'>
                                <span className='mb-2.5 block font-medium text-black dark:text-white'>Date of Birth *</span>
                                <div className='relative'>
                                    <DatePicker
                                        selected={dateOfBirth}
                                        onChange={setDateOfBirth}
                                        placeholderText={"Date of birth"}
                                        // customInput={<ExampleCustomInput />}
                                        dropdownMode="select"                              
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        className='text-sm lg:text-md w-full text-gray-5 rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                    />
                                    <MdOutlineCalendarToday className='absolute right-4 top-4 h-6 w-6 text-gray-5' />
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='email' className='mb-2.5 block font-medium text-black dark:text-white'>
                            Email *
                        </label>
                        <div className='relative'>
                            <input
                                type='email'
                                placeholder='Enter your email'
                                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />

                            <MdOutlineEmail className='absolute right-4 top-4 h-6 w-6 text-gray-5' />
                        </div>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password" className='mb-2.5 block font-medium text-black dark:text-white'>
                            Password *
                        </label>
                        <div className='relative'>
                            <input
                                id="password"
                                type='password'
                                placeholder='Enter your password'
                                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />

                            <MdLockOutline className='w-6 h-6 absolute right-4 top-4 text-gray-5' />
                        </div>
                    </div>

                    <div className='mb-5 sm:mb-20'>
                        <label htmlFor="verify-password" className='mb-2.5 block font-medium text-black dark:text-white'>
                            Verify Password *
                        </label>
                        <div className='relative'>
                            <input
                                id="verify-password"
                                type='password'
                                placeholder='Enter your verify password'
                                className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />

                            <MdLockOutline className='w-6 h-6 absolute right-4 top-4 text-gray-5' />
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-2 items-center mb-5'>
                        <div className='w-full'>
                            <Button
                                type='submit'
                                variant="primary"
                                className='w-full cursor-pointer rounded-lg border py-4 text-white transition hover:bg-opacity-90'
                            >
                                Sign Up
                            </Button>
                        </div>

                        <div className='w-full flex flex-col items-center justify-center'>
                            <p>Already have an account?</p>
                            <Button
                                type="button"
                                className='text-primary px-0 py-0 text-left'
                                onClick={onChangePage}
                            >
                                Sign in Here
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default SignUp