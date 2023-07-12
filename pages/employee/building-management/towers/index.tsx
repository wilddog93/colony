import React, { Fragment, useEffect, useMemo, useState } from "react";
import DefaultLayout from "../../../../components/Layouts/DefaultLayouts";
import SidebarBM from "../../../../components/Layouts/Sidebar/Building-Management";
import Button from "../../../../components/Button/Button";
import {
  MdAdd,
  MdArrowRightAlt,
  MdCleaningServices,
  MdLocalHotel,
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

type Props = {
  pageProps: any;
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

  // function
  useEffect(() => {
    if (query?.page) setPage(Number(query?.page) || 1);
    if (query?.limit) setLimit(Number(query?.limit) || 10);
    if (query?.search) setSearch(query?.search);
  }, []);

  useEffect(() => {
    let qr: any = {
      page: page,
      limit: limit,
    };
    if (search) qr = { ...qr, search: search };

    router.replace({ pathname, query: qr });
  }, [search]);

  const filters = useMemo(() => {
    const qb = RequestQueryBuilder.create();
    const search = {
      $and: [
        {
          $or: [
            // { email: { $contL: query?.search } },
            // { firstName: { $contL: query?.search } },
            // { lastName: { $contL: query?.search } },
            // { nickName: { $contL: query?.search } },
            // { gender: { $contL: query?.search } },
          ],
        },
      ],
    };
    // query?.status && search["$and"].push({ status: query?.status });

    qb.search(search);

    if (query?.page) qb.setPage(Number(query?.page) || 1);
    if (query?.limit) qb.setLimit(Number(query?.limit) || 10);

    // if (query?.sort)
    qb.sortBy({
      field: "createdAt",
      order: "DESC",
    });
    qb.query();
    return qb;
  }, [query]);

  useEffect(() => {
    if (token) dispatch(getTowers({ params: filters.queryObject, token }));
  }, [token, filters]);

  console.log(towers, "tower data");

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

  return (
    <DefaultLayout
      title="Colony"
      header="Building Management"
      head="Tower Management"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      token={token}>
      <div className="absolute inset-0 mt-20 z-9 bg-boxdark flex text-white">
        <SidebarComponent
          className=""
          menus={menuBM}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
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
                  router.push("/property/building-management/towers/amenities")
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
              {dataTable?.length > 0
                ? dataTable?.map((tower: any) => {
                    return (
                      <Fragment key={tower.id}>
                        <CardTower items={tower} token={token} />
                      </Fragment>
                    );
                  })
                : null}
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
