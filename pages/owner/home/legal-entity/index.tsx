import React, { useEffect, useState } from "react";
import DomainLayouts from "../../../../components/Layouts/DomainLayouts";
import { MdChevronLeft, MdEdit, MdMuseum } from "react-icons/md";
import Button from "../../../../components/Button/Button";
import Cards from "../../../../components/Cards/Cards";
import Barcharts from "../../../../components/Chart/Barcharts";
import Doughnutcharts from "../../../../components/Chart/Doughnutcharts";
import { getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook";
import {
  getAuthMe,
  selectAuth,
} from "../../../../redux/features/auth/authReducers";
import { useRouter } from "next/router";
import PieCharts from "../../../../components/Chart/Piecharts";
import Tabs from "../../../../components/Layouts/Tabs";
import { menuManageDomainOwner, menuParkings } from "../../../../utils/routes";

type Props = {
  pageProps: any;
};

const DomainInformation = ({ pageProps }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  useEffect(() => {
    if (token) {
      dispatch(
        getAuthMe({
          token,
          callback: () => router.push("/authentication/sign-in"),
        })
      );
    }
  }, [token]);

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Home"
      logo="../../image/logo/logo-icon.svg"
      description=""
      images="../../image/logo/building-logo.svg"
      userDefault="../../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5",
      }}>
      <div className="w-full absolute inset-0 z-99 bg-boxdark flex text-white">
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full h-full flex">
            <div className="w-full relative tracking-wide text-left text-boxdark-2 mt-20 overflow-hidden">
              <div className="w-full h-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6 overflow-y-auto">
                {/* filters */}
                <div className="static z-40 top-0 w-full mt-6 px-8 bg-gray">
                  <div className="w-full mb-5">
                    <button
                      className="focus:outline-none flex items-center gap-2"
                      onClick={() => router.push("/owner/home")}>
                      <MdChevronLeft className="w-5 h-5" />
                      <h3 className="text-lg lg:text-title-lg font-semibold">
                        Manage Domain
                      </h3>
                    </button>
                  </div>

                  <div className="w-full mb-5">
                    <Tabs menus={menuManageDomainOwner} />
                  </div>

                  {/* <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2.5">
                    <div className='w-full lg:col-span-3'>
                      <SearchInput
                        className='w-full text-sm rounded-xl'
                        classNamePrefix=''
                        filter={search}
                        setFilter={setSearch}
                        placeholder='Search...'
                      />
                    </div>
                    <div className='w-full flex flex-col lg:flex-row items-center gap-2'>
                      <DropdownSelect
                        customStyles={stylesSelectSort}
                        value={sort}
                        onChange={setSort}
                        error=""
                        className='text-sm font-normal text-gray-5 w-full lg:w-2/10'
                        classNamePrefix=""
                        formatOptionLabel=""
                        instanceId='1'
                        isDisabled={false}
                        isMulti={false}
                        placeholder='Sorts...'
                        options={sortOpt}
                        icon='MdSort'
                      />
                    </div>
                  </div> */}
                </div>

                <div className="sticky z-40 top-0 w-full px-8">
                  <div className="w-full flex items-center gap-4 justify-between mb-5 bg-white p-4 rounded-lg shadow-card">
                    <h3 className="text-base lg:text-title-md font-semibold">
                      General Information
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary-outline"
                        onClick={() => console.log("save")}
                        className="rounded-lg text-sm">
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => console.log("save")}
                        className="rounded-lg text-sm">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full grid col-span-1 gap-4 tracking-wider mb-5 px-6">
                  {/* <SelectTables
                    loading={loading}
                    setLoading={setLoading}
                    pages={pages}
                    setPages={setPages}
                    limit={limit}
                    setLimit={setLimit}
                    pageCount={pageCount}
                    columns={columns}
                    dataTable={dataTable}
                    total={total}
                    setIsSelected={setIsSelectedRow}
                    classTable="px-4"
                  /> */}
                  <div className="px-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Modi nam eum deserunt laboriosam natus? Quasi harum impedit
                    architecto maxime minus tempore a, veniam quaerat dolore.
                    Eius adipisci officiis similique molestias fugit, culpa
                    ullam dolores facere, sint esse, voluptatum quis? Odit
                    aspernatur tempora eos repellendus soluta nostrum facere
                    nam, perferendis est blanditiis quos corporis incidunt
                    suscipit nesciunt dicta aliquid molestias inventore velit
                    itaque nobis quia minima exercitationem repudiandae. Ducimus
                    nostrum quasi molestiae tenetur delectus ab hic sequi neque,
                    mollitia similique soluta cum, inventore aliquam obcaecati
                    aspernatur praesentium deleniti reiciendis ex natus! Culpa,
                    quibusdam tempora, delectus veniam deserunt animi
                    exercitationem ducimus possimus, perspiciatis dolorum id.
                    Laudantium quidem perspiciatis deleniti assumenda eligendi,
                    modi quasi ipsum accusantium nisi sequi dicta, cupiditate
                    molestias asperiores amet distinctio magnam quibusdam
                    necessitatibus facilis at reprehenderit velit? Cum, velit.
                    Necessitatibus delectus corrupti magni reiciendis. Repellat
                    porro et ea sed molestias expedita fugit tempore cupiditate,
                    nostrum dignissimos eligendi cumque nam quo corporis aperiam
                    natus asperiores atque quasi temporibus. Ipsa aut, error
                    obcaecati nulla pariatur, possimus corporis debitis facilis
                    veritatis labore earum odit culpa sapiente rem! Amet
                    obcaecati odit exercitationem accusantium atque beatae
                    dignissimos alias, at, itaque eius, vero libero minima sequi
                    explicabo debitis mollitia tempora suscipit rerum officia?
                    Nisi ex numquam ad impedit quasi nostrum tempora commodi
                    sequi. In, voluptatibus iure? Earum, tempore! Corporis esse
                    placeat voluptatibus non quos fugit excepturi voluptas nam.
                    Repellat dolorum vitae non obcaecati. Amet minus nam
                    maiores. Enim harum est amet molestias ea aliquid!
                    Consequatur officia labore praesentium, quae iure
                    dignissimos ipsam odio eius sed dolorum quibusdam provident
                    debitis non, quas illo facilis earum repellendus ex eum
                    neque et ut fuga aperiam. Rem ullam, dolores odit ea
                    numquam, quis totam facilis inventore, distinctio sunt
                    neque! Necessitatibus facilis aspernatur est, quae fuga ex
                    laboriosam nam iusto a ullam quidem magni reprehenderit
                    alias odit molestiae suscipit deleniti molestias? Esse
                    explicabo delectus ab voluptatem consequuntur a, quisquam
                    tempora eos culpa nesciunt, sint, dolores facilis! Ea sequi
                    optio libero quod quisquam modi voluptate consectetur
                    consequatur, totam, in, est repellat placeat saepe. Ex fuga
                    inventore, quidem minima quas culpa cum asperiores deleniti
                    illum mollitia non, minus sapiente fugit ipsam a sunt
                    voluptates. Cumque, quaerat. Eius suscipit aliquam earum
                    quasi vitae ducimus excepturi. Totam quis eveniet iste
                    cupiditate id laboriosam quasi nesciunt, aspernatur ratione
                    accusantium odit minima facilis in provident voluptas nihil,
                    tenetur a repellendus sint corrupti animi pariatur unde
                    praesentium quaerat? Sit eveniet exercitationem adipisci
                    soluta earum. Quis iste beatae sit facilis est quae veniam
                    illum nisi quia. Recusandae eum ipsum voluptatibus neque
                    quis laborum modi libero possimus fugit a ut numquam amet
                    quae, impedit officiis officia quisquam? Vel quis ab facere
                    asperiores, harum dolores, sunt consectetur similique
                    deleniti ad cupiditate ipsam ratione voluptatum ullam
                    voluptas mollitia id dolorem rem officia doloremque
                    exercitationem placeat sapiente corporis! Placeat, nam eius?
                    Corporis nesciunt, rem esse neque commodi ratione ducimus
                    expedita distinctio modi nihil quibusdam facilis nemo
                    eveniet maiores culpa iusto atque quasi eos ab! Nulla,
                    deleniti amet vel consequuntur beatae aut quae tempore,
                    placeat quibusdam, hic nihil labore officia ad atque.
                    Repellendus molestias veniam explicabo eveniet, nobis neque!
                    Culpa in sint minus eaque magnam eligendi voluptate, non
                    tempore doloremque animi ad nulla aut quasi earum, modi eum
                    et quos nihil exercitationem quae? Magni maxime sequi autem,
                    commodi ullam dolore dolorem aut placeat et debitis voluptas
                    error. Tempora corrupti consectetur earum exercitationem,
                    eos non obcaecati voluptatem facere officiis quae assumenda
                    quibusdam, aliquam iure incidunt at omnis quam ducimus ut,
                    eius molestias! Beatae nisi accusamus totam maiores odit est
                    officia modi soluta nesciunt esse recusandae sequi fugiat,
                    alias qui voluptatibus tempore ex cumque aliquid quas itaque
                    ducimus. Iste deserunt error dolor blanditiis sed delectus
                    ullam, esse minus eum, animi sapiente officia, placeat
                    voluptatibus praesentium voluptate libero. Natus nam
                    possimus sed ab minima, quas dolorem quae excepturi nulla
                    deserunt! Impedit, blanditiis neque exercitationem assumenda
                    et eaque ipsam minus, placeat dicta corrupti in eum labore
                    id dignissimos ad natus quia, nemo distinctio! Nam expedita
                    accusantium eos, error cum totam esse dolores! Voluptate
                    odio, laudantium officia suscipit deserunt quod amet error
                    recusandae voluptatibus fugiat, itaque harum dolore. Totam
                    sint sapiente facere placeat fugit, mollitia soluta
                    asperiores reprehenderit delectus tenetur nulla! Nulla
                    maiores alias obcaecati a voluptates error debitis, saepe,
                    doloremque repellendus officiis similique expedita
                    aspernatur aliquid earum doloribus, veritatis sint enim
                    repudiandae fugiat quam! Eos consectetur adipisci officia,
                    neque officiis blanditiis voluptatem sint necessitatibus.
                    Autem deleniti suscipit, doloremque dolores, reiciendis quod
                    accusantium nihil in quia pariatur eligendi harum magnam.
                    Eaque aliquam fuga quas iste sequi repudiandae quod aperiam
                    molestias quo voluptate incidunt, consequatur voluptas
                    voluptatum fugiat esse consequuntur non, doloremque cum
                    culpa numquam, veritatis cumque! Autem atque temporibus quos
                    facilis cumque laboriosam delectus dolor, ad, corrupti
                    laborum adipisci illum beatae. Facere molestias voluptas,
                    repudiandae cupiditate esse iste enim deleniti veniam
                    asperiores, ullam laborum nostrum consectetur dolore omnis
                    illo ipsa, fuga doloremque ducimus quia perspiciatis saepe
                    velit dolor neque natus? Incidunt dicta maxime
                    necessitatibus unde suscipit dolorem expedita eum
                    perferendis provident mollitia accusantium minus ratione
                    odit natus, distinctio reiciendis velit ipsa nostrum dolor
                    iste saepe? Amet minima enim ipsam, voluptate ex obcaecati
                    voluptas incidunt! Deleniti fuga non assumenda voluptas
                    quisquam beatae eos veritatis aliquam est. Perspiciatis ex
                    veritatis dolorem reprehenderit quidem doloribus omnis
                    eligendi officiis dolore exercitationem, nam nihil est
                    dolorum dicta error, repellendus voluptatum hic adipisci
                    accusantium quam. Sit quasi voluptas reiciendis? Cum soluta
                    voluptatum ratione incidunt praesentium, at voluptatibus ex
                    quisquam earum! Mollitia, odio assumenda, error enim
                    molestiae explicabo soluta nemo, voluptatibus pariatur sequi
                    at earum eveniet neque adipisci asperiores! Eius ex quos
                    odio fugit, culpa est voluptatem ullam perferendis quisquam
                    debitis doloremque numquam. Maxime quae nemo aut voluptatum
                    distinctio, inventore sunt quia incidunt illo ullam, eum
                    corrupti quidem aliquam vel earum qui ab reiciendis unde
                    corporis debitis ducimus laborum architecto est aspernatur?
                    Dolorem laboriosam, provident consectetur at nemo harum,
                    neque corporis doloremque corrupti qui beatae accusamus
                    accusantium unde odio dolore a. Repudiandae, est odit. Dolor
                    deserunt accusantium dicta laboriosam, ipsam praesentium
                    culpa corrupti porro delectus eligendi! Nobis vitae natus
                    facilis suscipit, expedita repellendus ullam quasi
                    voluptatum modi exercitationem quos at eaque eius! Soluta,
                    officia porro.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DomainLayouts>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context);

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication/sign-in", // Redirect to the home page
        permanent: false,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default DomainInformation;
