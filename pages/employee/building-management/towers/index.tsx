import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import SidebarBM from "../../../../components/Layouts/Sidebar/Building-Management";
import Button from "../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCleaningServices,
  MdLocalHotel,
  MdMuseum,
} from "react-icons/md";
import CardTower from "../../../../components/BM/Towers/CardTower";
import Modal from "../../../../components/Modal";
import {
  ModalFooter,
  ModalHeader,
} from "../../../../components/Modal/ModalComponent";
import ExampleForm from "../../../../components/Forms/ExampleForm";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import SidebarComponent from "../../../../components/Layouts/Sidebar/SidebarComponent";
import { menuBM } from "../../../../utils/routes";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getTowers,
  selectTowerManagement,
} from "../../../../redux/features/building-management/tower/towerReducers";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { getAuthMe } from "../../../../redux/features/auth/authReducers";
import TowerForm from "../../../../components/Forms/employee/TowerForm";
import {
  getUnitTypes,
  selectUnitTypeManagement,
} from "../../../../redux/features/building-management/unitType/unitTypeReducers";
import {
  getAmenities,
  selectAmenityManagement,
} from "../../../../redux/features/building-management/amenity/amenityReducers";
import {
  getFloors,
  selectFloorManagement,
} from "../../../../redux/features/building-management/floor/floorReducers";

type OptionProps = {
  value: string | null;
  label: React.ReactNode;
};

type Props = {
  pageProps: any;
};

type FormValues = {
  id?: number | string;
  towerName?: string;
  towerDescription?: string;
  gpsLocation?: string;
};

const Towers = ({ pageProps }: Props) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { token, access, firebaseToken, accessId } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // modal
  const [isOpenTower, setIsOpenTower] = useState(false);
  const [isOpenAmenities, setIsOpenAmenities] = useState(false);
  const [isOpenFacilities, setIsOpenFacilities] = useState(false);

  // data table
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(1);
  const [Total, setTotal] = useState<number>(1);
  const [search, setSearch] = useState<any>("");

  // redux
  const dispatch = useAppDispatch();
  const { towers, pending, error, message } = useAppSelector(
    selectTowerManagement
  );

  const { floors } = useAppSelector(selectFloorManagement);
  const [floorData, setFloorData] = useState<any[]>([]);
  const { unitTypes } = useAppSelector(selectUnitTypeManagement);
  const { amenities } = useAppSelector(selectAmenityManagement);
  const [amenityOpt, setAmenityOpt] = useState<OptionProps[]>([]);
  const [unitTypeOpt, setUnitTypeOpt] = useState<OptionProps[]>([]);

  // function
  useEffect(() => {
    if (query?.page) setPage(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
  }, []);

  useEffect(() => {
    let qr: any = {
      page: page,
      limit: limit,
    };
    router.replace({ pathname, query: qr });
  }, [search]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    qb.sortBy({
      field: "updatedAt",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [query?.page, query?.limit]);

  useEffect(() => {
    if (token) dispatch(getTowers({ params: filters.queryObject, token }));
  }, [token, filters]);

  useEffect(() => {
    let arr: any[] = [];
    const { data, page, pageCount, total } = towers;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push(item);
      });
    }
    setDataTable(arr);
  }, [towers]);

  // auth
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

  // floor start
  const filterFloor = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "floorName",
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) dispatch(getFloors({ token, params: filterFloor.queryObject }));
  }, [token, filterFloor]);

  useEffect(() => {
    let arr: any[] = [];
    const { data } = floors;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push(item);
      });
    }
    setFloorData(arr);
  }, [floors]);
  // floor end

  // amenity
  const filterAmenity = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "amenityName",
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getAmenities({ token, params: filterAmenity.queryObject }));
    }
  }, [token, filterAmenity]);

  useEffect(() => {
    let arr: OptionProps[] = [];
    const { data } = amenities;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.id,
          label: item?.amenityName,
        });
      });
    }
    setAmenityOpt(arr);
  }, [amenities]);
  // end

  // all function unitType-start
  const filterUnitType = useMemo(() => {
    const qb = RequestQueryBuilder.create();

    qb.sortBy({
      field: "unitTypeName",
      order: "ASC",
    });
    qb.query();
    return qb;
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getUnitTypes({ token, params: filterUnitType.queryObject }));
    }
  }, [token, filterUnitType]);

  useEffect(() => {
    let arr: OptionProps[] = [];
    const { data } = unitTypes;
    if (data && data?.length > 0) {
      data?.map((item: any) => {
        arr.push({
          ...item,
          value: item?.id,
          label: item?.unitTypeName,
        });
      });
    }
    setUnitTypeOpt(arr);
  }, [unitTypes]);
  // all function unitType-end

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tower Management"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
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
          token={token}
          defaultImage="../../image/no-image.jpeg"
          isSelectProperty
          propertyId={accessId}
        />

        <div className=" w-full bg-white lg:rounded-tl-[3rem] p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className="sticky bg-white top-0 z-9 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2">
            <div className="w-full flex items-center justify-between py-3">
              <button
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
                className="rounded-sm border p-1.5 shadow-sm border-strokedark bg-boxdark lg:hidden">
                <MdArrowRightAlt
                  className={`w-5 h-5 delay-700 ease-in-out ${
                    sidebarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <h3 className="w-full lg:max-w-max text-center text-2xl font-semibold text-graydark">
                Tower Management
              </h3>
            </div>
            <div className="w-full lg:max-w-max flex items-center justify-center gap-2 lg:ml-auto">
              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={() =>
                  router.push("/employee/building-management/towers/amenities")
                }
                variant="primary-outline"
                key={"1"}>
                <span className="hidden lg:inline-block">Amenities</span>
                <MdLocalHotel className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={() => setIsOpenFacilities(true)}
                variant="primary-outline"
                key={"2"}>
                <span className="hidden lg:inline-block">Facilities</span>
                <MdCleaningServices className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                className="rounded-lg text-sm font-semibold py-3"
                onClick={() => setIsOpenTower(true)}
                variant="primary">
                <span className="hidden lg:inline-block">New Tower</span>
                <MdAdd className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <main className="relative tracking-wide text-left text-boxdark-2">
            <div className="w-full flex flex-1 flex-col gap-2.5 lg:gap-6">
              {/* cards */}
              {dataTable?.length > 0 ? (
                dataTable?.map((tower: any) => {
                  return (
                    <Fragment key={tower.id}>
                      <CardTower
                        items={tower}
                        token={token}
                        filterTower={filters.queryObject}
                        amenityOpt={amenityOpt}
                        unitTypeOpt={unitTypeOpt}
                        floorData={floorData}
                      />
                    </Fragment>
                  );
                })
              ) : (
                <div className="w-full flex justify-center items-center">
                  <span className="text-gray-5 font-semibold m-auto">
                    Data tower not found!
                  </span>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* modal tower*/}
      <Modal
        isOpen={isOpenTower}
        onClose={() => setIsOpenTower(false)}
        size="small">
        <TowerForm
          isCloseModal={() => setIsOpenTower(false)}
          isOpen={isOpenTower}
          token={token}
          filters={filters.queryObject}
        />
      </Modal>

      {/* modal Facilities*/}
      <Modal
        isOpen={isOpenFacilities}
        onClose={() => setIsOpenFacilities(false)}
        size="">
        <Fragment>
          <ModalHeader
            isClose={true}
            className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
            <h3 className="text-lg font-semibold">New Facilities</h3>
          </ModalHeader>
          <div className="w-full px-6">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit,
            distinctio ullam. Cupiditate, nostrum eligendi voluptatibus beatae
            laboriosam odit facilis ea nihil corporis id dolorum totam,
            expedita, repellendus nemo natus eius sed qui deleniti molestias
            maiores ipsam distinctio aliquam? Quaerat reprehenderit, quae in
            fugit odit mollitia molestias qui possimus nostrum rem ipsa
            consequatur corrupti sed nemo repellat optio debitis architecto
            eligendi. Pariatur sed blanditiis dicta aspernatur, cumque sunt,
            eligendi obcaecati magni eaque tempore dolorem possimus tenetur. Aut
            distinctio veniam rerum commodi laboriosam laborum reprehenderit
            earum asperiores praesentium molestiae vel consequuntur dolore,
            dolorum nihil quisquam? Similique assumenda nostrum eius esse qui
            nihil!
          </div>
          <ModalFooter
            className="sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3"
            isClose={true}></ModalFooter>
        </Fragment>
      </Modal>

      {/* modal Amenities*/}
      <Modal
        isOpen={isOpenAmenities}
        onClose={() => setIsOpenAmenities(false)}
        size="">
        <Fragment>
          <ModalHeader
            isClose={true}
            className="sticky top-0 p-4 bg-white border-b-2 border-gray mb-3">
            <h3 className="text-lg font-semibold">New Amenities</h3>
          </ModalHeader>
          <div className="w-full px-6">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit,
            distinctio ullam. Cupiditate, nostrum eligendi voluptatibus beatae
            laboriosam odit facilis ea nihil corporis id dolorum totam,
            expedita, repellendus nemo natus eius sed qui deleniti molestias
            maiores ipsam distinctio aliquam? Quaerat reprehenderit, quae in
            fugit odit mollitia molestias qui possimus nostrum rem ipsa
            consequatur corrupti sed nemo repellat optio debitis architecto
            eligendi. Pariatur sed blanditiis dicta aspernatur, cumque sunt,
            eligendi obcaecati magni eaque tempore dolorem possimus tenetur. Aut
            distinctio veniam rerum commodi laboriosam laborum reprehenderit
            earum asperiores praesentium molestiae vel consequuntur dolore,
            dolorum nihil quisquam? Similique assumenda nostrum eius esse qui
            nihil!
          </div>
          <ModalFooter
            className="sticky bottom-0 bg-white p-4 border-t-2 border-gray mt-3"
            isClose={true}></ModalFooter>
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
  const accessId = cookies["accessId"] || null;
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
    props: { token, access, firebaseToken, accessId },
  };
};

export default Towers;
