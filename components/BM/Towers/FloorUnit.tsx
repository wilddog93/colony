import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cards from "../../Cards/Cards";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import Button from "../../Button/Button";
import { MdAdd, MdEdit } from "react-icons/md";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import axios from "axios";
import Units from "./Units";
import { FaCircleNotch } from "react-icons/fa";
import Modal from "../../Modal";
import UnitBatchForm from "../../Forms/employee/UnitBatchForm";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import {
  getUnitTypes,
  selectUnitTypeManagement,
} from "../../../redux/features/building-management/unitType/unitTypeReducers";
import {
  getAmenities,
  selectAmenityManagement,
} from "../../../redux/features/building-management/amenity/amenityReducers";

type OptionProps = {
  value: string | null;
  label: React.ReactNode;
};

type Props = {
  id?: number;
  floorName?: string;
  floorOrder?: number;
  tower?: any;
  token?: any;
  floor?: any;
  amenityOpt?: OptionProps[] | any[];
  unitTypeOpt?: OptionProps[] | any[];
};

type UnitProps = {
  floor?: any;
  unitNameType?: any;
  unitType?: any;
  unitDescription?: string | any;
  unitSize?: number | string | any;
  amenity?: any | any[];
  startAt?: number | any;
  length?: number | any;
  addText?: string | any;
  addTextPosition?: any;
  unitOrder?: any;
  isBulk?: boolean | any;
};

const options = [
  // { label: "Select All", value: "all" },
  { value: "restaurant", label: "Restaurant" },
  { value: "unit-001", label: "Unit - 001" },
  { value: "unit-002", label: "Unit - 002" },
  { value: "unit-003", label: "Unit - 003" },
];

const FloorUnit = (props: Props) => {
  const { id, floor, token, amenityOpt, unitTypeOpt } = props;
  const [unit, setUnit] = useState({
    value: "restaurant",
    label: "Restaurant",
  });

  const [unitData, setUnitData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // unit type
  const dispatch = useAppDispatch();

  // modal unit
  const [isOpenAddUnit, setIsOpenAddUnit] = useState(false);
  const [formData, setFormData] = useState<any | null>(null);

  // open add unit modal
  const openAddUnitModal = (value: UnitProps) => {
    setFormData(value);
    setIsOpenAddUnit(true);
  };

  // close edit floor modal
  const closeAddUnitModal = () => {
    setFormData(null);
    setIsOpenAddUnit(false);
  };

  const newId = useMemo(() => floor?.id, [floor]);

  console.log("floor in unit : ", newId);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = { $and: [{ "floor.id": { $eq: newId } }] };

    qb.search(search);
    qb.query();
    return qb;
  }, [newId]);

  // get unit
  const getUnitsData = async (params: any) => {
    let newArr: any[] = [];
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
        if (data?.data?.length > 0) {
          data?.data?.map((item: any) => {
            newArr.push({
              ...item,
              unitType: !item?.unitType?.id
                ? null
                : {
                    ...item.unitType,
                    label: item?.unitType?.unitTypeName,
                    value: item?.unitType?.id,
                  },
            });
          });

          console.log("data unit ini running...");
        }
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      console.log(newError, "errors");
    }
    setUnitData(newArr);
  };

  useEffect(() => {
    if (token && newId) {
      getUnitsData({ params: filters.queryObject, token: token });
    }
  }, [token, filters, newId]);

  console.log(id, "id floor");

  return (
    <Fragment>
      {/* unit */}
      {loading ? (
        <FaCircleNotch className="text-gray-5 w-10 h-10 animate-spin-1.5 m-auto" />
      ) : null}
      <Button
        className="text-sm py-6 px-8 font-semibold rounded-md mr-4"
        variant="primary-outline-none"
        type="button"
        onClick={() => openAddUnitModal({ floor, isBulk: false })}>
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-primary rounded-md">
            <MdAdd className="w-4 h-4 text-white" />
          </div>
          <span className="">Add Room</span>
        </div>
      </Button>
      {unitData?.length > 0 ? (
        unitData?.map((unit: any) => {
          return (
            <Fragment key={unit.id}>
              <Units
                units={unit}
                token={token}
                getData={() =>
                  getUnitsData({ params: filters.queryObject, token: token })
                }
                amenityOpt={amenityOpt}
                unitTypeOpt={unitTypeOpt}
              />
            </Fragment>
          );
        })
      ) : (
        <span className="text-gray-5 text-sm m-auto">
          This floor doesn't has any unit
        </span>
      )}

      {/* modal add unit*/}
      <Modal isOpen={isOpenAddUnit} onClose={closeAddUnitModal} size="">
        <UnitBatchForm
          isCloseModal={closeAddUnitModal}
          isOpen={isOpenAddUnit}
          token={token}
          items={formData}
          getData={() =>
            getUnitsData({ params: filters.queryObject, token: token })
          }
          amenityOpt={amenityOpt}
          unitTypeOpt={unitTypeOpt}
        />
      </Modal>
    </Fragment>
  );
};

export default FloorUnit;
