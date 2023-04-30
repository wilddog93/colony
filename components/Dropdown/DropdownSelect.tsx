import Select, { IndicatorSeparatorProps, components } from "react-select";
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
    classNamePrefix: string,
    customStyles: any,
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
    classNamePrefix,
    customStyles
}: Props) {

    const onChangeMulti = (selected: any) => {
        isMulti && selected.length &&
            selected.find((option: any) => option.value === "all") ? onChange(options.slice(1)) : !isMulti ? onChange((selected) || null) : onChange(selected);
    }

    const DropdownIndicator = (p: any) => {

        if (isSearch) {
            return (
                <components.DropdownIndicator {...p}>
                    <MdSearch className={`text-gray-600 w-5 h-5`} />
                </components.DropdownIndicator>
            );
        }
        return (
            <components.DropdownIndicator {...p}>
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

    return (
        <Select
            instanceId={instanceId || "id"}
            components={{ DropdownIndicator, NoOptionsMessage }}
            placeholder={placeholder || "Choose..."}
            isClearable
            defaultValue={value}
            onChange={onChangeMulti}
            options={options}
            isMulti={isMulti}
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
