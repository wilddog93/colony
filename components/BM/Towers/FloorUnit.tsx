import React, { Fragment, useEffect, useMemo, useState } from "react";
import Cards from "../../Cards/Cards";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import Button from "../../Button/Button";
import { MdAdd, MdEdit } from "react-icons/md";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import axios from "axios";
import Units from "./Units";
import { FaCircleNotch } from "react-icons/fa";

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

const FloorUnit = (props: Props) => {
  const { id, token } = props;
  const [unit, setUnit] = useState({
    value: "restaurant",
    label: "Restaurant",
  });

  const [unitData, setUnitData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = { $and: [{ "floor.id": { $eq: id } }] };

    qb.search(search);
    qb.query();
    return qb;
  }, [id]);

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

    setLoading(true);

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
        }
        setLoading(false);
      } else {
        throw response;
      }
    } catch (error: any) {
      const { data, status } = error.response;
      let newError: any = { message: data.message[0] };
      console.log(newError, "errors");
      setLoading(false);
    }
    setUnitData(newArr);
  };

  useEffect(() => {
    if (token) {
      getUnitsData({ params: filters.queryObject, token: token });
    }
  }, [token, filters, id]);

  console.log(unitData, "id units");

  return (
    <Fragment>
      {/* unit */}
      {loading ? (
        <FaCircleNotch className="text-gray-5 w-10 h-10 animate-spin-1.5 m-auto" />
      ) : null}
      {unitData?.length > 0 ? (
        unitData?.map((unit: any) => {
          return (
            <Fragment key={unit.id}>
              <Units units={unit} token={token} />
            </Fragment>
          );
        })
      ) : (
        <span className="text-gray-5 text-sm m-auto">
          This floor doesn't has any unit
        </span>
      )}
    </Fragment>
  );
};

export default FloorUnit;
