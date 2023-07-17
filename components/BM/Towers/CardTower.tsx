import React, { Fragment, useEffect, useMemo, useState } from "react";
import Cards from "../../Cards/Cards";
import {
  MdAdd,
  MdArrowDropDown,
  MdDelete,
  MdEdit,
  MdLocationOn,
  MdMoreHoriz,
} from "react-icons/md";
import Button from "../../Button/Button";
import DropdownDefault from "../../Dropdown/DropdownDefault";
import DropdownSelect from "../../Dropdown/DropdownSelect";
import FloorUnit from "./FloorUnit";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  deleteFloors,
  getFloors,
  selectFloorManagement,
} from "../../../redux/features/building-management/floor/floorReducers";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import axios from "axios";
import Link from "next/link";
import TowerForm from "../../Forms/employee/TowerForm";
import Modal from "../../Modal";
import FloorBatchForm from "../../Forms/employee/FloorBatchForm";
import Menus from "../../Layouts/Header/Menus";
import { startAt } from "@firebase/database";
import { ModalFooter, ModalHeader } from "../../Modal/ModalComponent";
import {
  getTowers,
  selectTowerManagement,
} from "../../../redux/features/building-management/tower/towerReducers";
import { FaCircleNotch } from "react-icons/fa";
import UnitBatchForm from "../../Forms/employee/UnitBatchForm";
import Dropdown from "../../Dropdown";
import { Router, useRouter } from "next/router";
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
  items?: any;
  token?: any;
  filterTower?: any;
  amenityOpt?: OptionProps[] | any[];
  unitTypeOpt?: OptionProps[] | any[];
};

type FloorProps = {
  floorName?: string;
  floorOrder?: number | any;
  id?: number;
  tower?: any;
  floorType?: any;
  startAt?: number | string | any;
  length?: number | string | any;
  addText?: number | string | any;
  addTextPosition?: number | string | any;
};

type FormTowerValues = {
  id?: number | string;
  towerName?: string;
  towerDescription?: string;
  gpsLocation?: string;
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

const CardTower = ({
  items,
  token,
  filterTower,
  amenityOpt,
  unitTypeOpt,
}: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [value, setValue] = useState({
    value: "restaurant",
    label: "Restaurant",
  });

  // redux
  const dispatch = useAppDispatch();
  const { towers, tower, pending, error, message } = useAppSelector(
    selectTowerManagement
  );

  const [tabFloor, setTabFloor] = useState<FloorProps>({});
  const [dataFloor, setDataFloor] = useState<any[]>([]);

  // modal edit tower
  const [isOpenEditTower, setIsOpenEditTower] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // modal floor
  const [isOpenAddFloor, setIsOpenAddFloor] = useState(false);
  const [isOpenEditFloor, setIsOpenEditFloor] = useState(false);
  const [isOpenDeleteFloor, setIsOpenDeleteFloor] = useState(false);

  // open edit modal
  const openEditModal = (value: FormTowerValues) => {
    setFormData(value);
    setIsOpenEditTower(true);
  };

  // close edit modal
  const closeEditModal = () => {
    setFormData({});
    setIsOpenEditTower(false);
  };

  // open add floor modal
  const openAddFloorModal = (value: FormTowerValues) => {
    console.log(value, "check floor-tower-value");
    setFormData({ tower: value });
    setIsOpenAddFloor(true);
  };

  // close add floor modal
  const closeAddFloorModal = () => {
    setFormData({});
    setIsOpenAddFloor(false);
  };

  // open edit floor modal
  const openEditFloorModal = (value: FloorProps) => {
    console.log(value, "check floor-tower-value");
    setFormData(value);
    setIsOpenEditFloor(true);
  };

  // close edit floor modal
  const closeEditFloorModal = () => {
    setFormData({});
    setIsOpenEditFloor(false);
  };

  // open edit floor modal
  const openDeleteFloorModal = (value: FloorProps) => {
    setFormData(value);
    setIsOpenDeleteFloor(true);
  };

  // close delete floor modal
  const closeDeleteFloorModal = () => {
    setFormData({});
    setIsOpenDeleteFloor(false);
  };

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [{ "tower.id": { $eq: items.id } }],
        },
      ],
    };

    qb.search(search);
    qb.query();
    return qb;
  }, [items?.id]);

  // get floor
  const getFloorsData = async (params: any) => {
    let resData: FloorProps[] = [];
    let config = {
      params: params.params,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    };
    let tabs: FloorProps = tabFloor;
    try {
      const response = await axios.get("floor", config);
      const { data, status } = response;
      if (status == 200) {
        setDataFloor(data?.data);
        if (data?.data?.some((e: any) => e?.id == tabs?.id)) {
          setTabFloor(tabs);
        } else {
          setTabFloor(data?.data[0]);
        }
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
    if (token && items?.id)
      getFloorsData({ params: filters.queryObject, token: token });
  }, [token, filters, items?.id]);

  const ComponentFloorTab = (props: FloorProps) => {
    const { id, floorName, tower, floorOrder } = props;

    let editData = {
      ...props,
      floorOrder:
        floorOrder == 1
          ? { value: "Automatic", label: "Automatic" }
          : { value: "Manual", label: "Manual" },
    };
    const tabDefault = [
      {
        name: "Edit",
        icon: MdEdit,
        classIcon: "w-5 h-5",
        onClick: () => {
          openEditFloorModal(editData);
          console.log(editData, "data item1");
        },
      },
      {
        name: "Delete",
        icon: MdDelete,
        classIcon: "w-5 h-5",
        onClick: () => {
          openDeleteFloorModal({ id: props?.id });
          console.log(id, "item");
        },
      },
    ];
    if (id == tabFloor?.id) {
      return (
        <Dropdown
          menuName={floorName}
          classMenuName="text-primary border-b-4 border-primary rounded-0"
          menuIcon={MdMoreHoriz}
          menus={tabDefault}
        />
      );
    }
    return (
      <Button
        className="font-semibold w-ful max-w-max"
        variant=""
        type="button"
        onClick={() => setTabFloor(props)}>
        <span className="w-full max-w-max text-sm">{floorName || "-"}</span>
      </Button>
    );
  };

  const onDeleteFloor = (value: any) => {
    console.log(value, "delete id");
    if (!value?.id) {
      return;
    }
    dispatch(
      deleteFloors({
        token,
        id: value?.id,
        isSuccess() {
          // dispatch(getTowers({ params: filterTower, token }));
          getFloorsData({ params: filters.queryObject, token: token });
          closeDeleteFloorModal();
          console.log("berhasil");
        },
        isError() {
          console.log("error");
        },
      })
    );
  };

  console.log(items, "check floor-tower");

  return (
    <Fragment>
      <Cards className="w-full py-4 border border-gray rounded-xl shadow-1 overflow-auto">
        <div className="w-full px-4 flex items-start lg:items-center justify-between tracking-wide">
          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row items-start lg:items-center gap-2.5">
            <div className="w-full lg:max-w-max flex items-center justify-between">
              <h3 className="text-2xl lg:text-4xl font-semibold">
                {items.id || "-"}
              </h3>
              <Button
                type="button"
                onClick={() => openEditModal(items)}
                variant="primary-outline-none"
                className="rounded-lg text-md font-semibold lg:hidden">
                <span className="hidden lg:inline-block">Edit Info</span>
                <MdEdit className="w-6 h-6" />
              </Button>
            </div>
            <div className="border-t-2 lg:border-l-2 border-gray lg:h-14 hidden lg:inline-block"></div>
            <div className="w-full flex flex-col">
              <h3 className="text-xl lg:text-2xl">{items?.towerName || "-"}</h3>

              {items?.gpsLocation && items?.gpsLocation.includes("http") ? (
                <Link
                  href={items?.gpsLocation}
                  target="_blank"
                  className="w-full flex gap-2 py-2 text-meta-4 items-start hover:underline hover:text-primary hover:font-semibold">
                  <MdLocationOn className="w-1/12 my-1" />
                  <p className="text-sm w-11/12">
                    {items?.gpsLocation && items?.gpsLocation?.length > 50
                      ? `${items?.gpsLocation.substring(50, 0)}...`
                      : items?.gpsLocation || "-"}
                  </p>
                </Link>
              ) : (
                <div className="w-full flex gap-2 py-2 text-meta-4 items-start">
                  <MdLocationOn className="w-1/12 my-1" />
                  <p className="text-sm w-11/12">
                    {items?.gpsLocation && items?.gpsLocation?.length > 50
                      ? `${items?.gpsLocation.substring(50, 0)}...`
                      : items?.gpsLocation || "-"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={() => openEditModal(items)}
            variant="primary-outline-none"
            className="rounded-lg text-md font-semibold hidden lg:inline-flex">
            <span className="hidden lg:inline-block">Edit Info</span>
            <MdEdit className="w-6 h-6" />
          </Button>
        </div>

        {/* floor */}
        <div className="w-full flex items-start lg:items-center justify-between border-t border-b border-gray mt-3 gap-2">
          <div className="relative flex flex-wrap w-10/12 gap-2 items-center h-full">
            {dataFloor?.length > 0 ? (
              dataFloor?.map((floor: any) => {
                return (
                  <ComponentFloorTab
                    key={floor.id}
                    id={floor.id}
                    floorName={floor.floorName}
                    floorOrder={floor.floorOrder}
                    tower={floor.tower}
                  />
                );
              })
            ) : (
              <div className="text-base text-gray-5 px-4">
                Floor data not found!
              </div>
            )}
          </div>
          <div className="p-2">
            <Button
              className="text-xs py-1 px-2 font-semibold rounded-md"
              variant="primary"
              type="button"
              onClick={() => openAddFloorModal(items)}>
              <span className="hidden lg:inline-block">New Floor</span>
              <MdAdd className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* units */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-6 2xl:gap-7.5 border-b border-gray bg-[#F5F9FD] px-4 py-10 h-full max-h-70 overflow-y-auto overflow-x-hidden">
          {tabFloor?.id ? (
            <Fragment>
              <FloorUnit
                id={tabFloor?.id}
                floor={tabFloor}
                token={token}
                amenityOpt={amenityOpt}
                unitTypeOpt={unitTypeOpt}
              />
            </Fragment>
          ) : (
            <span className="text-gray-5 m-auto text-sm">
              Unit data not found
            </span>
          )}
        </div>

        <div className="w-full flex items-center mt-3 px-4 gap-2.5 lg:gap-6 text-sm">
          <p className="ml-auto font-semibold">Total:</p>
          <p className="text-gray-4">
            {dataFloor.length > 1
              ? `${dataFloor.length} Floors`
              : `${dataFloor.length} Floor`}
          </p>
          {/* <p className="text-gray-4">222 Units</p> */}
        </div>
      </Cards>

      {/* modal edit tower*/}
      <Modal isOpen={isOpenEditTower} onClose={closeEditModal} size="small">
        <TowerForm
          isCloseModal={closeEditModal}
          isOpen={isOpenEditTower}
          token={token}
          filters={filterTower}
          items={formData}
          isUpdate
        />
      </Modal>

      {/* modal add floor*/}
      <Modal isOpen={isOpenAddFloor} onClose={closeAddFloorModal} size="small">
        <FloorBatchForm
          isCloseModal={closeAddFloorModal}
          isOpen={isOpenAddFloor}
          token={token}
          items={formData}
          filters={filterTower}
          getData={() => getFloorsData({ token, params: filters.queryObject })}
        />
      </Modal>

      {/* modal edit floor*/}
      <Modal
        isOpen={isOpenEditFloor}
        onClose={closeEditFloorModal}
        size="small">
        <FloorBatchForm
          isCloseModal={closeEditFloorModal}
          isOpen={isOpenEditFloor}
          token={token}
          filters={filterTower}
          items={formData}
          getData={() => getFloorsData({ token, params: filters.queryObject })}
          isUpdate
        />
      </Modal>

      {/* modal delete floor*/}
      <Modal
        size="small"
        onClose={closeDeleteFloorModal}
        isOpen={isOpenDeleteFloor}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={closeDeleteFloorModal}>
            <h3 className="text-lg font-semibold">Delete Floor</h3>
          </ModalHeader>
          <div className="w-full my-5 px-4">
            <h3>Are you sure to delete floor data ?</h3>
          </div>

          <ModalFooter
            className="p-4 border-t-2 border-gray"
            isClose={true}
            onClick={closeDeleteFloorModal}>
            <Button
              variant="primary"
              className="rounded-md text-sm"
              type="button"
              onClick={() => onDeleteFloor(formData)}
              disabled={pending}>
              Yes, Delete it!
              {pending ? <FaCircleNotch className="w-4 h-4" /> : ""}
            </Button>
          </ModalFooter>
        </Fragment>
      </Modal>
    </Fragment>
  );
};

export default CardTower;
