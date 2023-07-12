import React, { useEffect, useMemo, useState } from "react";
import Cards from "../../Cards/Cards";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import Button from "../../Button/Button";
import { MdAdd, MdEdit } from "react-icons/md";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import axios from "axios";

type Props = {
  id?: number;
  floorName?: string;
  floorOrder?: number;
  tower?: any;
  token?: any;
};

const options = [
  // { label: "Select All", value: "all" },
  { value: "restaurant", label: "Restaurant" },
  { value: "unit-001", label: "Unit - 001" },
  { value: "unit-002", label: "Unit - 002" },
  { value: "unit-003", label: "Unit - 003" },
];

const customStylesSelect = {
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
      padding: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  },
  clearIndicator: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
      padding: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  },
  singleValue: (provided: any) => {
    return {
      ...provided,
      color: "#5F59F7",
    };
  },
  control: (provided: any, state: any) => {
    console.log(provided, "control");
    return {
      ...provided,
      background: "#F5F9FD",
      borderColor: state.isFocused ? "#5F59F7" : "#5F59F7",
      color: "#5F59F7",
      "&:hover": {
        color: state.isFocused ? "gray" : "#5F59F7",
        borderColor: state.isFocused ? "gray" : "#5F59F7",
      },
      minHeight: 20,
    };
  },
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
};

const FloorUnit = (props: Props) => {
  const { id, token } = props;
  const [unit, setUnit] = useState({
    value: "restaurant",
    label: "Restaurant",
  });

  const [unitData, setUnitData] = useState<any[]>([]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [{ "floor.id": { $eq: id } }],
        },
      ],
    };

    qb.search(search);
    qb.query();
    return qb;
  }, [id]);

  // get floor
  const getUnitsData = async (params: any) => {
    let config = {
      params: params.params,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    try {
      const response = await axios.get("unit", config);
      const { data, status } = response;
      if (status == 200) {
        setUnitData(data?.data);
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      console.log(newError, "errors");
    }
  };

  useEffect(() => {
    if (token) getUnitsData({ params: filters.queryObject, token: token });
  }, [token, filters]);

  console.log(unitData, "unit data");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-6 2xl:gap-7.5 border-b border-gray bg-[#F5F9FD] p-4 h-full max-h-70 overflow-y-auto overflow-x-hidden">
      <Button
        className="text-sm py-6 px-8 font-semibold rounded-md mr-4"
        variant="primary-outline-none"
        type="button"
        onClick={() => console.log("add unit")}>
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-primary rounded-md">
            <MdAdd className="w-4 h-4 text-white" />
          </div>
          <span className="">Add Room</span>
        </div>
      </Button>

      {/* unit */}
      <Cards className="relative rounded-lg border border-gray shadow-1 bg-white p-2 text-sm flex flex-col justify-between">
        <div>
          <DropdownSelect
            customStyles={customStylesSelect}
            value={unit}
            onChange={setUnit}
            error=""
            className="text-xs"
            classNamePrefix=""
            formatOptionLabel=""
            instanceId="1"
            isDisabled={false}
            isMulti={false}
            placeholder="Unit"
            options={options}
            icon=""
          />

          <div className="border border-t w-full border-gray mt-3"></div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">101</h3>

            <Button
              type="button"
              className="py-1 px-1"
              variant="primary-outline-none"
              onClick={() => console.log("edit")}>
              <MdEdit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-gray-4 text-xs">
          <h3 className="">5 amenities</h3>
          <p>123m2</p>
        </div>
      </Cards>
    </div>
  );
};

export default FloorUnit;
