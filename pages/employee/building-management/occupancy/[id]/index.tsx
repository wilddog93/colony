import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import DefaultLayout from "../../../../../components/Layouts/DefaultLayouts";
import {
  MdAdd,
  MdArrowRightAlt,
  MdClose,
  MdDelete,
  MdEdit,
  MdEmail,
  MdFileUpload,
  MdLayers,
  MdLocalParking,
  MdLocationCity,
  MdMap,
  MdMuseum,
} from "react-icons/md";
import Button from "../../../../../components/Button/Button";
import Modal from "../../../../../components/Modal";

import {
  ModalFooter,
  ModalHeader,
} from "../../../../../components/Modal/ModalComponent";
import { useRouter } from "next/router";
import {
  ColumnItems,
  makeData,
} from "../../../../../components/tables/components/makeData";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook";
import { selectAuth } from "../../../../../redux/features/auth/authReducers";
import { getAuthMe } from "../../../../../redux/features/auth/authReducers";
import Breadcrumb from "../../../../../components/Breadcrumb/Breadcrumb";
import SidebarComponent from "../../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuBM } from "../../../../../utils/routes";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import {
  getUnitsTenant,
  selectUnitManagement,
  updateUnitsImage,
} from "../../../../../redux/features/building-management/unit/unitReducers";
import OccupantForm from "../../../../../components/Forms/employee/occupant/OccupantForm";
import { isBase64 } from "../../../../../utils/useHooks/useFunction";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";
import {
  usersPropertyDeleteOccupant,
  usersPropertyDeleteTenant,
} from "../../../../../redux/features/building-management/users/propertyUserReducers";

type FormValues = {
  id?: number | string | any;
  floor?: any;
  occupant?: any;
  tenant?: any;
  totalAmenity?: number;
  totalOngoingBill?: number;
  totalUnreadMessageLocalshop?: number;
  unitDescription?: string | any;
  unitImage?: any | string;
  unitName?: string | any;
  unitOrder?: number;
  unitSize?: number;
  createdAt: string | any;
  updatedAt?: any;
};

type Props = {
  pageProps: any;
};

const UnitDetails = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, accessToken, firebaseToken } = pageProps;

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { units, unit, pending } = useAppSelector(selectUnitManagement);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenDeleteOwner, setIsOpenDeleteOwner] = useState(false);
  const [isOpenDeleteOccupant, setIsOpenDeleteOccupant] = useState(false);
  const [isOpenAddOwner, setIsOpenAddOwner] = useState(false);
  const [isOpenAddOccupant, setIsOpenAddOccupant] = useState(false);
  const [formData, setFormData] = useState<FormValues | any>(null);

  const [files, setFiles] = useState<any | any[]>("");
  let imageRef = useRef<HTMLInputElement>(null);

  // data-table
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    const search = {
      $and: [
        {
          $or: [{ id: { $eq: Number(query?.id) } }],
        },
      ],
    };

    if (query?.id) qb.search(search);

    qb.sortBy({
      field: "updatedAt",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [query?.id]);

  useEffect(() => {
    if (token && filters)
      dispatch(getUnitsTenant({ token, params: filters.queryObject }));
  }, [token, filters]);

  useEffect(() => {
    let newArr: any[] = [];
    const { data, pageCount, total } = units;
    if (data && data?.length == 1) {
      data?.map((item: any) => {
        newArr.push(item);
      });
    }
    setDataTable(newArr);
  }, [units]);

  const unitData = useMemo(() => {
    let newObj: any = dataTable?.length == 1 ? dataTable[0] : null;
    return newObj;
  }, [dataTable]);

  // add owner modal
  const onOpenAddOwner = (items: any) => {
    setFormData(items);
    setIsOpenAddOwner(true);
  };
  const onCloseAddOwner = () => {
    setFormData(null);
    setIsOpenAddOwner(false);
  };
  // add owner modal end

  // add Occupant modal
  const onOpenAddOccupant = (items: any) => {
    setFormData(items);
    setIsOpenAddOccupant(true);
  };
  const onCloseAddOccupant = () => {
    setFormData(null);
    setIsOpenAddOccupant(false);
  };
  // add occupant modal end

  // delete owner modal
  const onOpenDeleteOwner = (items: any) => {
    setFormData(items);
    setIsOpenDeleteOwner(true);
  };
  const onCloseDeleteOwner = () => {
    setFormData(null);
    setIsOpenDeleteOwner(false);
  };
  // delete owner modal end

  // delete occupant modal
  const onOpenDeleteOccupant = (items: any) => {
    setFormData(items);
    setIsOpenDeleteOccupant(true);
  };
  const onCloseDeleteOccupant = () => {
    setFormData(null);
    setIsOpenDeleteOccupant(false);
  };
  // delete occupant modal end

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication?page=sign-in"),
        })
      );
    }
  }, [token]);

  // images
  const imageStatus = useMemo(() => {
    return isBase64(files);
  }, [files]);

  const onSelectImage = (e: any) => {
    console.log(e?.target?.files[0]);
    if (e?.target?.files[0]?.size > 3000000) {
      toast.dark("file is too bigger");
    } else {
      var reader = new FileReader();
      const preview = () => {
        console.log(1, e?.target?.files[0]?.size);

        if (!e.target.files || e.target.files.length == 0) {
          setFiles(undefined);
          toast.dark("files not found");
          return;
        }
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
          let val = reader.result;
          setFiles(val);
        };
      };
      preview();
    }
  };

  const onDeleteImage = () => {
    if (imageRef.current) {
      imageRef.current.value = "";
      setFiles(undefined);
    }
  };

  useEffect(() => {
    if (!unitData?.unitImage || unitData?.unitImage == null) {
      setFiles(null);
    } else setFiles(unitData?.unitImage);
  }, [unitData]);

  const onUploadImages = (value: any) => {
    if (!value) {
      toast.dark("Unit image is required");
    } else {
      let newData: any = {
        unitImage: value?.files,
      };
      dispatch(
        updateUnitsImage({
          token,
          data: newData,
          id: value?.id,
          isSuccess() {
            dispatch(getUnitsTenant({ token, params: filters?.queryObject }));
            toast.dark("Unit image has been updated");
          },
          isError() {
            console.log("error uploading file!");
          },
        })
      );
    }
  };
  // images-end

  // function delete owner
  const onDeleteOwner = async (value: any) => {
    if (!value?.id) return;
    let newObj: any = {
      unit: value?.id,
      date: new Date().toISOString(),
    };
    setLoading(true);
    await dispatch(
      usersPropertyDeleteTenant({
        token,
        data: newObj,
        isSuccess() {
          setLoading(false);
          toast.dark("User as an owner has been deleted");
          onCloseDeleteOwner();
          dispatch(getUnitsTenant({ token, params: filters.queryObject }));
        },
      })
    );
    await setTimeout(() => {
      setLoading(false);
    }, 5000);
  };
  // function delete owner end

  // function delete occupant
  const onDeleteOccupant = async (value: any) => {
    if (!value?.id) return;
    let newObj: any = {
      unit: value?.id,
      date: new Date().toISOString(),
    };
    setLoading(true);
    await dispatch(
      usersPropertyDeleteOccupant({
        token,
        data: newObj,
        isSuccess() {
          setLoading(false);
          toast.dark("User as an occupant has been deleted");
          onCloseDeleteOccupant();
          dispatch(getUnitsTenant({ token, params: filters.queryObject }));
        },
      })
    );
    await setTimeout(() => {
      setLoading(false);
    }, 5000);
  };
  // function delete occupant end

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Units"
      logo="../../../image/logo/logo-icon.svg"
      images="../../../image/logo/building-logo.svg"
      userDefault="../../../image/user/user-01.png"
      description=""
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          className=""
          menus={menuBM}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <div className="relative w-full lg:h-full bg-white lg:rounded-tl-[3rem] overflow-y-auto">
          {/* content */}
          <main className="w-full lg:h-full flex flex-col sm:flex-row tracking-wider text-left text-boxdark-2 text-base">
            {/* col 1 */}
            <section className="w-full lg:w-1/2 flex flex-col lg:h-full overflow-auto">
              <div className="w-full p-4 2xl:p-6 static lg:sticky top-0 z-20 bg-white shadow-1">
                <button
                  aria-controls="sidebar"
                  aria-expanded={sidebarOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSidebarOpen(!sidebarOpen);
                  }}
                  className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden text-gray">
                  <MdArrowRightAlt
                    className={`w-5 h-5 delay-700 ease-in-out ${
                      sidebarOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <Breadcrumb
                  className="text-lg"
                  page={{
                    pathname: "Occupancy",
                    url: "/employee/building-management/occupancy",
                  }}
                  pageName="Units"
                />
              </div>

              {/* detail unit */}
              <div className="w-full shadow-1">
                <div className="w-full flex flex-col lg:flex-row gap-4 p-6 2xl:p-10">
                  <div className="w-full lg:w-1/3 gap-2 flex flex-col">
                    <div className="flex flex-col gap-4">
                      <div className="w-full relative flex gap-2 group hover:cursor-pointer">
                        <label
                          htmlFor="logo"
                          className="w-full h-full hover:cursor-pointer">
                          {!files ? (
                            <img
                              src={"../../../image/no-image.jpeg"}
                              alt="logo"
                              className="w-full max-w-[200px] h-full min-h-[180px] object-cover object-center border border-gray shadow-card rounded-lg p-4 mx-auto"
                            />
                          ) : (
                            <img
                              src={
                                imageStatus
                                  ? files
                                  : `${url}domain/domainLogo/${files}`
                              }
                              alt="logo"
                              className="w-full max-w-[200px] h-full min-h-[180px] object-cover object-center border border-gray shadow-card rounded-lg p-4 mx-auto"
                            />
                          )}
                        </label>

                        {/* delete filte */}
                        <div
                          className={`${
                            !files ? "hidden " : ""
                          }absolute inset-0 flex`}>
                          <Button
                            type="button"
                            variant="danger"
                            className={`rounded-lg text-sm py-1 px-2 shadow-card opacity-0 group-hover:opacity-50 m-auto`}
                            onClick={onDeleteImage}>
                            Delete
                            <MdDelete className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className={`${imageStatus ? "hidden" : ""}`}>
                        <input
                          type="file"
                          id="logo"
                          placeholder="Domain Logo..."
                          autoFocus
                          className={`w-full focus:outline-none max-w-max text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-700 hover:file:bg-violet-100`}
                          onChange={onSelectImage}
                          ref={imageRef}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary-outline-none"
                      onClick={() => onUploadImages({ files, id: query?.id })}
                      className={`border border-gray rounded-xl shadow-1 text-sm w-full max-w-[200px] mx-auto ${
                        imageStatus ? "" : "hidden"
                      }`}>
                      Upload
                      {pending ? (
                        <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                      ) : (
                        <MdFileUpload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="w-full lg:w-2/3 gap-4 flex flex-col">
                    <h3 className="text-lg font-semibold">
                      {unitData?.unitName || "-"}
                    </h3>
                    <p className="text-gray-5 text-sm">
                      {unitData?.description || "-"}
                    </p>
                    <div className="w-full flex flex-wrap text-gray-5 text-sm gap-2">
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdLocationCity className="w-4 h-4" />
                        <span>{unitData?.floor?.tower?.towerName || "-"}</span>
                      </div>
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdLayers className="w-4 h-4" />
                        <span>{unitData?.floor?.floorName || "-"}</span>
                      </div>
                      <div className="w-full max-w-max flex items-center gap-2">
                        <MdMap className="w-4 h-4" />
                        <span>
                          {unitData?.unitSize || 0} m<sup>2</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* owner - occupant */}
              <div className="w-full shadow-1">
                <div className="w-full flex flex-col gap-4 p-6 2xl:p-10">
                  <div className="w-full flex flex-col gap-2">
                    <h3 className="text-gray-5">Owner</h3>
                    {unitData?.tenant?.user == undefined ||
                    !unitData?.tenant?.user ? (
                      <div className="w-full flex flex-col lg:flex-row gap-2 p-4 rounded-xl shadow-card-2 border-2 border-dashed border-gray-4 bg-gray">
                        <div className="w-full lg:w-4/5 flex flex-col text-sm gap-1 text-center lg:text-left">
                          <h3 className="font-semibold">Set an owner</h3>
                          <div className="text-gray-5">
                            There is no owner in this unit
                          </div>
                        </div>
                        <div className="w-full lg:w-1/5 flex">
                          <Button
                            variant="primary"
                            type="button"
                            className="rounded-lg py-1 px-1.5 my-auto mx-auto lg:mx-0 lg:ml-auto"
                            onClick={() => onOpenAddOwner(unitData)}>
                            <MdAdd className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-1 p-4 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <h3 className="font-semibold">
                            {`${unitData?.tenant?.user?.firstName || "-"} ${
                              unitData?.tenant?.user?.lastName || "-"
                            }`}
                          </h3>
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdEmail className="w-4 h-4" />
                            {unitData?.tenant?.user?.email || "-"}
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full max-w-max inline-flex bg-gray-4 border-2 border-gray-4 shadow-card py-0.5 px-0.5 rounded-lg text-white"
                            onClick={() => onOpenDeleteOwner(unitData)}>
                            <MdClose className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <h3 className="text-gray-5">Occupant</h3>
                    {unitData?.occupant?.user == undefined ||
                    !unitData?.occupant?.user ? (
                      <div className="w-full flex flex-col lg:flex-row gap-2 p-4 rounded-xl shadow-card-2 border-2 border-dashed border-gray-4 bg-gray">
                        <div className="w-full lg:w-4/5 flex flex-col text-sm gap-1 text-center lg:text-left">
                          <h3 className="font-semibold">Set an occupant</h3>
                          <div className="text-gray-5">
                            There is no occupant in this unit
                          </div>
                        </div>
                        <div className="w-full lg:w-1/5 flex">
                          <Button
                            variant="primary"
                            type="button"
                            className="rounded-lg py-1 px-1.5 my-auto mx-auto lg:mx-0 lg:ml-auto"
                            onClick={() => onOpenAddOccupant(unitData)}>
                            <MdAdd className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-1 p-4 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <h3 className="font-semibold">
                            {`${unitData?.tenant?.user?.firstName || "-"} ${
                              unitData?.tenant?.user?.lastName || "-"
                            }`}
                          </h3>
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdEmail className="w-4 h-4" />
                            {unitData?.tenant?.user?.email || "-"}
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="w-full max-w-max inline-flex bg-gray-4 border-2 border-gray-4 shadow-card py-0.5 px-0.5 rounded-lg text-white"
                            onClick={() => onOpenDeleteOccupant(unitData)}>
                            <MdClose className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* access */}
              <div className="w-full shadow-1">
                <div className="w-full flex flex-col gap-4 p-6 2xl:p-10">
                  <div className="w-full flex flex-col gap-2">
                    <h3 className="text-gray-5">Access</h3>
                    <div className="grid col-span-1 lg:grid-cols-2 gap-2">
                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex p-2 rounded-xl shadow-card-2 border border-gray">
                        <div className="w-full flex flex-col text-sm gap-1">
                          <div className="w-full max-w-max flex items-center gap-2 text-gray-5">
                            <MdLocalParking className="w-5 h-5" />
                            <span className="font-semibold text-graydark">
                              12333 - 1444
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* col 2 */}
            <section className="w-full lg:w-1/2 flex flex-col bg-gray lg:h-full overflow-auto">
              <div className="w-full p-4 2xl:p-6 static lg:sticky top-0 z-20 bg-gray shadow-1">
                <h3 className="py-5 font-bold text-lg">Activity History</h3>
              </div>
              <div className="w-full flex flex-col lg:flex-row gap-4 p-6 2xl:p-10">
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex p-2.5 rounded-xl shadow-card-2 border border-gray bg-white">
                    <div className="w-full flex flex-row items-center text-sm gap-2">
                      <div className="p-2.5 bg-gray rounded-xl text-gray-5">
                        <MdEdit className="w-6 h-6" />
                      </div>
                      <div className="w-full max-w-max flex flex-col gap-1 text-gray-5">
                        <p className="text-graydark">
                          <strong>Admin_2</strong> changed the unit picture
                        </p>
                        <p className="text-xs">15/02/2023, 15:33</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex p-2.5 rounded-xl shadow-card-2 border border-gray bg-white">
                    <div className="w-full flex flex-row items-center text-sm gap-2">
                      <div className="p-2.5 bg-gray rounded-xl text-gray-5">
                        <MdEdit className="w-6 h-6" />
                      </div>
                      <div className="w-full max-w-max flex flex-col gap-1 text-gray-5">
                        <p className="text-graydark">
                          <strong>Admin_2</strong> changed the unit picture
                        </p>
                        <p className="text-xs">15/02/2023, 15:33</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex p-2.5 rounded-xl shadow-card-2 border border-gray bg-white">
                    <div className="w-full flex flex-row items-center text-sm gap-2">
                      <div className="p-2.5 bg-gray rounded-xl text-gray-5">
                        <MdEdit className="w-6 h-6" />
                      </div>
                      <div className="w-full max-w-max flex flex-col gap-1 text-gray-5">
                        <p className="text-graydark">
                          <strong>Admin_2</strong> changed the unit picture
                        </p>
                        <p className="text-xs">15/02/2023, 15:33</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex p-2.5 rounded-xl shadow-card-2 border border-gray bg-white">
                    <div className="w-full flex flex-row items-center text-sm gap-2">
                      <div className="p-2.5 bg-gray rounded-xl text-gray-5">
                        <MdEdit className="w-6 h-6" />
                      </div>
                      <div className="w-full max-w-max flex flex-col gap-1 text-gray-5">
                        <p className="text-graydark">
                          <strong>Admin_2</strong> changed the unit picture
                        </p>
                        <p className="text-xs">15/02/2023, 15:33</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* add owner */}
      <Modal size="small" onClose={onCloseAddOwner} isOpen={isOpenAddOwner}>
        <Fragment>
          <OccupantForm
            items={formData}
            token={token}
            isOwner
            isOpen={isOpenAddOwner}
            getData={() =>
              dispatch(getUnitsTenant({ token, params: filters.queryObject }))
            }
            isCloseModal={onCloseAddOwner}
          />
        </Fragment>
      </Modal>

      {/* add occupant */}
      <Modal
        size="small"
        onClose={onCloseAddOccupant}
        isOpen={isOpenAddOccupant}>
        <Fragment>
          <OccupantForm
            items={formData}
            token={token}
            isOccupant
            isOpen={isOpenAddOccupant}
            getData={() =>
              dispatch(getUnitsTenant({ token, params: filters.queryObject }))
            }
            isCloseModal={onCloseAddOccupant}
          />
        </Fragment>
      </Modal>

      {/* delete owner*/}
      <Modal
        size="small"
        onClose={onCloseDeleteOwner}
        isOpen={isOpenDeleteOwner}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDeleteOwner}>
            <div className="text-gray-6">
              <h3 className="text-md font-semibold">Delete Owner</h3>
              <p className="text-xs">
                Are you sure to delete owner {formData?.tenant?.user?.nickName}
              </p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2"
              onClick={onCloseDeleteOwner}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary"
              onClick={() => onDeleteOwner(formData)}
              disabled={loading}>
              {loading ? (
                <Fragment>
                  <span className="text-xs">Deleting...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </Fragment>
              ) : (
                <span className="text-xs">Yes, Delete it!</span>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>

      {/* delete occupant*/}
      <Modal
        size="small"
        onClose={onCloseDeleteOccupant}
        isOpen={isOpenDeleteOccupant}>
        <Fragment>
          <ModalHeader
            className="p-4 border-b-2 border-gray mb-3"
            isClose={true}
            onClick={onCloseDeleteOccupant}>
            <div className="text-gray-6">
              <h3 className="text-md font-semibold">Delete Occupant</h3>
              <p className="text-xs">
                Are you sure to delete occupant{" "}
                {formData?.tenant?.user?.nickName}
              </p>
            </div>
          </ModalHeader>
          <div className="w-full flex items-center px-4 justify-end gap-2 mb-3">
            <Button
              type="button"
              variant="secondary-outline"
              className="rounded-lg border-2 border-gray-2 shadow-2"
              onClick={onCloseDeleteOccupant}>
              <span className="text-xs font-semibold">Discard</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              className="rounded-lg border-2 border-primary"
              onClick={() => onDeleteOccupant(formData)}
              disabled={loading}>
              {loading ? (
                <Fragment>
                  <span className="text-xs">Deleting...</span>
                  <FaCircleNotch className="w-4 h-4 animate-spin-1.5" />
                </Fragment>
              ) : (
                <span className="text-xs">Yes, Delete it!</span>
              )}
            </Button>
          </div>
        </Fragment>
      </Modal>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token) {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default UnitDetails;
