import Select, { components } from "react-select";
import React from "react";
import { MdArrowDropDown, MdSearch } from "react-icons/md";

type Props = {
    value: any,
    onChange: any,
    options: any,
    error: any,
    isSearch: any,
    placeholder: string,
    formatOptionLabel: any,
    instanceId: string,
    isMulti: boolean,
    isDisabled: boolean,
    className: string,
    classNamePrefix: string
}

export default function DropdownSelect({
    value,
    onChange,
    options,
    error,
    isSearch,
    placeholder,
    formatOptionLabel,
    instanceId,
    isMulti,
    isDisabled,
    className,
    classNamePrefix
}: Props) {
    const DropdownIndicator = (p: any) => {
        const style = {
            indicatorsContainer: (provided: any, state: any) => {
                return {
                    ...provided,
                    padding: '0px',
                    paddingLeft: '0px',
                    paddingTop: '0px',
                    paddingRight: '0px',
                    paddingDown: '0px',
                };
            }
        }
        console.log(p, 'indicator')
        if (isSearch) {
            return (
                <components.DropdownIndicator {...p} styles={style}>
                    <MdSearch className={`text-gray-600 w-5 h-5`} />
                </components.DropdownIndicator>
            );
        }
        return (
            <components.DropdownIndicator {...p} styles={style}>
                <MdArrowDropDown
                    className={`transform transition-all duration-700 text-gray-600 w-5 h-5 p-0 ${p.isFocused && !p.hasValue ? "" : "-rotate-90"
                        }`}
                />
            </components.DropdownIndicator>
        );
    };

    const NoOptionsMessage = (props: any) => {
        return <components.NoOptionsMessage {...props} />;
    };

    const customStyles = {
        // menu: (provided: any, state: any) => {
        //     console.log(provided, 'menu')
        //     return ({
        //         ...provided,
        //         marginBottom: 0,
        //         marginTop: 0
        //     })
        // },
        control: (provided: any, state: any) => {
            console.log(provided, "control")
            return ({
                ...provided,
                background: "#F5F9FD",
                borderColor: state.isFocused ? "#5F59F7" : "#5F59F7",
                "&:hover": {
                    borderColor: state.isFocused ? "gray" : "#5F59F7"
                },
                minHeight: 20
            })
        }
    }

    return (
        <Select
            instanceId={instanceId || "id"}
            components={{ DropdownIndicator, NoOptionsMessage }}
            placeholder={placeholder || "Choose..."}
            isClearable
            defaultValue={value}
            onChange={onChange}
            options={options}
            isMulti={isMulti || false}
            value={value}
            className={`text-xs font-semibold ${className}`}
            aria-errormessage={error}
            classNamePrefix={classNamePrefix}
            isDisabled={isDisabled}
            formatOptionLabel={formatOptionLabel}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                paddingTop: 0,
                colors: {
                    ...theme.colors,
                    primary25: "#F5F9FD",
                    primary: "#5F59F7",
                },
            })}
            styles={customStyles}
        />
    );
}
