import React, { useCallback, useRef, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

type Props = {
    filter: any,
    setFilter: any,
    placeholder: string,
    className: string,
    classNamePrefix: string
}

export const SearchInput = ({ filter, setFilter, placeholder, className, classNamePrefix }: Props) => {
    const [value, setValue] = useState("");
    let inputRef = useRef<HTMLInputElement | null>(null);

    function handleChange(e: any) {
        setValue(e.target.value);
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setFilter(value);
        // setValue("");
    }

    const handleDeleteSearch = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
            setValue(inputRef.current.value);
            setFilter(inputRef.current.value);
        }
        // console.log(inputRef.current?.value, 'input')
    }, []);

    // console.log(value, 'value')

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit}
                className="flex my-auto items-center relative w-full mr-6 text-gray-500 focus-within:text-primary"
            >
                <div className='relative'>
                    <input
                        type='text'
                        placeholder={placeholder}
                        onChange={handleChange}
                        ref={inputRef}
                        className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${className}`}
                    />
                    {filter ? (
                        <MdClose
                            onClick={handleDeleteSearch}
                            className={`w-6 h-6 absolute z-20 right-4 top-4 hover:cursor-pointer ${classNamePrefix}`}
                        />

                    ) :
                        <MdSearch onClick={handleSubmit} className={`w-6 h-6 absolute z-20 right-4 top-4 hover:cursor-pointer ${classNamePrefix}`} />
                    }
                </div>
                {/* <button
                    type="submit"
                    className="px-4 py-2 bg-green-300 ml-1 rounded-md text-white focus:outline-none focus:ring-4 focus:ring-green-100 disabled:opacity-50"
                >
                    <MdSearch className="w-5 h-5" />
                </button> */}
            </form>
        </div>
    );
};
