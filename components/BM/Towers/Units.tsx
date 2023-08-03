import React, { Fragment, useEffect, useMemo, useState } from "react";
import Cards from "../../Cards/Cards";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import Button from "../../Button/Button";
import { MdEdit } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  getUnitTypes,
  selectUnitTypeManagement,
} from "../../../redux/features/building-management/unitType/unitTypeReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { OptionProps } from "../../../utils/useHooks/PropTypes";
import Modal from "../../Modal";
import UnitBatchForm from "../../Forms/employee/UnitBatchForm";

type Props = {
  units?: any;
  token?: any;
  getData: () => void;
  unitTypeOpt?: any[];
  amenityOpt?: any[];
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

const Units = (props: Props) => {
  // redux
  const dispatch = useAppDispatch();

  const { units, token, unitTypeOpt, amenityOpt, getData } = props;
  const [unitType, setUnitType] = useState<OptionProps | any>(null);

  const [isOpenEditUnit, setIsOpenEditUnit] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const openEditUnit = (value: any) => {
    let newObj = {
      ...value,
      amenity:
        value?.unitAmenities?.length > 0
          ? value?.unitAmenities?.map((item: any) => ({
              ...item?.amenity,
              totalAmenity: item?.totalAmenity,
            }))
          : [],
    };
    // console.log(newObj, "edit");
    setFormData(newObj);
    setIsOpenEditUnit(true);
  };

  const closeEditUnit = () => {
    setFormData(null);
    setIsOpenEditUnit(false);
  };

  useEffect(() => {
    let newObj: any = {};
    const { unitType } = units;
    if (unitType) {
      newObj = unitType;
    }
    setUnitType(newObj);
  }, [units]);

  return (
    <Fragment>
      <Cards className="relative rounded-lg border border-gray shadow-1 bg-white p-2 text-sm flex flex-col justify-between">
        <div>
          <DropdownSelect
            customStyles={customStylesSelect}
            value={unitType}
            onChange={setUnitType}
            error=""
            className="text-xs"
            classNamePrefix=""
            formatOptionLabel=""
            instanceId="unitType"
            isDisabled={true}
            isMulti={false}
            placeholder="Unit"
            options={unitTypeOpt}
            icon=""
          />

          <div className="border border-t w-full border-gray mt-3"></div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">
              {units?.unitName ? units?.unitName : "-"}
            </h3>

            <Button
              type="button"
              className="py-1 px-1"
              variant="primary-outline-none"
              onClick={() => openEditUnit(units)}>
              <MdEdit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-gray-4 text-xs">
          <h3 className="">
            {units?.totalAmenity > 1
              ? `${units?.totalAmenity} Amenities`
              : units?.totalAmenity == 0
              ? "0 Amenity"
              : `${units?.totalAmenity} Amenity`}
          </h3>
          <div>
            <p>
              {units?.unitSize ? units?.unitSize : 0} m<sup>2</sup>
            </p>
          </div>
        </div>
      </Cards>

      {/* modal edit unit*/}
      <Modal isOpen={isOpenEditUnit} onClose={closeEditUnit} size="">
        <UnitBatchForm
          isCloseModal={closeEditUnit}
          isOpen={isOpenEditUnit}
          token={token}
          items={formData}
          getData={() => getData()}
          amenityOpt={amenityOpt}
          unitTypeOpt={unitTypeOpt}
          isUpdate
        />
      </Modal>
    </Fragment>
  );
};

export default Units;
