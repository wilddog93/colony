import { useAppDispatch, useAppSelector } from "../../../redux/Hook";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import DefaultLayout from "../../../components/Layouts/DefaultLayouts";
import {
  getAuthMe,
  selectAuth,
  webDomainAccess,
  webLogout,
} from "../../../redux/features/auth/authReducers";
import AuthLayout from "../../../components/Layouts/AuthLayouts";
import Link from "next/link";
import {
  MdAdd,
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdLogin,
  MdLogout,
  MdMail,
  MdMailOutline,
  MdOutlineBusiness,
  MdOutlineHome,
  MdWarning,
} from "react-icons/md";
import Button from "../../../components/Button/Button";
import Cards from "../../../components/Cards/Cards";
import Modal from "../../../components/Modal";
import { FaCircleNotch, FaRegQuestionCircle } from "react-icons/fa";
import LoadingPage from "../../../components/LoadingPage";
import {
  getAccessProperty,
  selectPropertyAccess,
} from "../../../redux/features/propertyAccess/propertyAccessReducers";
import { webPropertyAccess } from "../../../redux/features/auth/authReducers";
import {
  createAccessDomain,
  getAccessDomain,
  selectAccessDomain,
} from "../../../redux/features/accessDomain/accessDomainReducers";
import { EventType, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  ModalFooter,
  ModalHeader,
} from "../../../components/Modal/ModalComponent";

interface PageProps {
  page: string;
  access: any;
  token: any;
  firebaseToken: any;
}

type Props = {
  pageProps: PageProps;
};

type FormValues = {
  id?: any;
  domainName?: string | any;
  domainDescription?: string | any;
};

type WatchProps = {
  value?: any | null;
};

type WatchChangeProps = {
  name?: any | null;
  type?: EventType | any;
};

const OwnerAccess = ({ pageProps }: Props) => {
  // props
  const { token, access, firebaseToken, page } = pageProps;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLogin, pending, error, message } = useAppSelector(selectAuth);
  const domain = useAppSelector(selectAccessDomain);
  const { user } = data;

  // sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false);

  // form data
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState<FormValues>({});
  const [watchValue, setWatchValue] = useState<FormValues | any>();
  const [watchChangeValue, setWatchChangeValue] = useState<WatchChangeProps>();

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: "all",
    defaultValues: useMemo<FormValues>(
      () => ({
        id: null,
        domainName: null,
        domainDescription: null,
      }),
      []
    ),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value) {
        setWatchValue(value);
        setWatchChangeValue({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const isOpenForm = () => {
    setIsForm(true);
  };

  const isCloseForm = () => {
    setIsForm(false);
    reset({
      id: null,
      domainName: null,
      domainDescription: null,
    });
  };

  const descriptionValue = useWatch({
    name: "domainDescription",
    control,
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(
      getAuthMe({
        token,
        callback: () => {
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
          deleteCookie("access");
          router.push("/authentication/sign-in");
        },
      })
    );
  }, [token]);

  useEffect(() => {
    if (token) dispatch(getAccessDomain({ token }));
  }, [token]);

  const isOpenSignOut = () => setIsSignOut(true);
  const isCloseSignOut = () => setIsSignOut(false);

  const onSignOut = () => {
    let data = { token };
    dispatch(
      webLogout({
        data,
        callback: () => router.push("/"),
      })
    );
  };

  const domains = useMemo(() => {
    const { data } = domain.domains;
    return data || [];
  }, [domain?.domains]);

  const gotToAccess = (access: any) => {
    setCookie("access", access, { maxAge: 60 * 60 * 24 });
    router.push({ pathname: `/access/${access}` });
  };

  const goToDomainAccess = (id: number) => {
    dispatch(
      webDomainAccess({
        id,
        token,
        callback: () => router.push({ pathname: "/owner/home" }),
      })
    );
  };

  console.log(domain.domains?.data, "loading");

  const Merchants = (props: any) => {
    const { id, domainStructureName, domain } = props?.items;
    return (
      <button
        type="button"
        className="w-full divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-gray h-full tracking-wide flex flex-col lg:flex-row bg-white border border-gray shadow-card-2 p-4 rounded-xl gap-2 focus:outline-none"
        onClick={() => {
          router.push("/merchant/detail");
        }}>
        <img
          src={domain?.propertyLogo || "../../.../../image/logo/logo-icon.svg"}
          alt="icon"
          className="w-full max-w-[200px] lg:w-[20%] object-cover object-center m-auto"
        />
        <div className="w-full divide-y-2 divide-gray flex flex-col justify-between lg:w-[70%] p-2">
          <div className="w-full text-left p-2">
            <h3 className="font-semibold text-lg">
              {domain?.domainName || "-"}
            </h3>
            <p className="text-sm">{domain?.domainDescription || "lorem"}</p>
          </div>
          <div className="w-full flex items-center text-left p-2 gap-2">
            <div className="font-semibold text-gray-5 flex items-center gap-2">
              <MdOutlineBusiness className="w-4 h-4" />
              <span>
                {domain?.totalProperty && domain?.totalProperty > 1
                  ? `${domain?.totalProperty} Properties`
                  : `${domain?.totalProperty || 0} Property`}
              </span>
            </div>
            <div className="font-semibold text-gray-5 flex items-center gap-2">
              <MdOutlineHome className="w-4 h-4" />
              <span>
                {domain?.totalUnit && domain?.totalUnit > 1
                  ? `${domain?.totalUnit} Units`
                  : `${domain?.totalUnit || 0} Unit`}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-full hidden lg:flex justify-start lg:w-[10%]">
          <MdChevronRight className="w-7 h-7 m-auto" />
        </div>
      </button>
    );
  };

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    console.log(value, "event form");
    dispatch(
      createAccessDomain({
        data: {
          domainName: value.domainName,
          domainDescription: value.domainDescription,
        },
        token,
        isSuccess: () => {
          dispatch(getAccessDomain({ token }));
          isCloseForm();
        },
        isError: () => console.log(),
      })
    );
  };

  return (
    <AuthLayout
      title="Select Owner"
      logo="../../.../../image/logo/logo-icon.svg"
      description="">
      <div className="bg-gray w-full lg:px-44 lg:py-10">
        <div className="relative w-full lg:h-full flex flex-col lg:flex-row items-center rounded-xl bg-white shadow-default p-10 overflow-x-hidden overflow-y-auto">
          <div
            className={`relative w-full lg:w-1/2 h-full flex flex-col p-6 lg:pr-10 gap-2 text-gray-5 justify-between lg:overflow-auto`}>
            <div className="w-full flex flex-col justify-center gap-6">
              <div className="w-full flex flex-col gap-2 sticky top-0 inset-x-0 bg-white p-4 lg:p-0">
                <div className="w-full">
                  <Button
                    type="button"
                    onClick={() => {
                      setCookie("access", "login");
                      router.push({ pathname: "/" });
                    }}
                    variant="primary-outline-none"
                    className="rounded-lg lg:px-0">
                    <MdChevronLeft className="w-5 h-5" />
                    <span className="font-semibold">Back</span>
                  </Button>
                </div>
                <div className="w-full flex flex-col lg:flex-row items-center">
                  <h2 className="font-bold text-2xl text-graydark dark:text-white sm:text-title-xl2 text-center sm:text-left">
                    Welcome Back {user?.lastName || "-"}
                  </h2>
                  <Button
                    onClick={() => console.log("profile")}
                    type="button"
                    variant="primary-outline-none"
                    className="font-semibold ml-0 lg:ml-auto">
                    <h2 className="text-sm sm:text-base">Manage Profile.</h2>
                  </Button>
                </div>
                <p className="text-gray-5 text-sm sm:text-title-sm text-center lg:text-left">
                  Do you have any plan today?
                </p>
              </div>

              <Cards className="mt-3 lg:mt-0 w-full flex flex-col lg:flex-row items-center sm:items-start justify-center bg-gray p-6 rounded-xl overflow-y-hidden overflow-x-auto">
                <div className="w-full lg:w-1/5">
                  <img
                    src="../../../image/user/user-01.png"
                    alt="avatar"
                    className="rounded-full shadow-1 object-cover object-center w-14 h-14 mx-auto"
                  />
                </div>
                <div className="w-full lg:w-5/5">
                  <div className="w-full flex flex-col lg:flex-row items-center justify-center sm:justify-start gap-2 my-3 sm:my-0">
                    <div className="font-semibold text-graydark text-base lg:text-title-md">
                      {user?.lastName || "-"}
                    </div>
                    <h3 className="text-sm lg:text-base">{`${
                      user?.firstName || ""
                    } ${user?.lastName || ""}`}</h3>
                  </div>
                  <div className="w-full flex flex-1 gap-2 justify-center sm:justify-start">
                    <div>
                      <MdMail className="w-6 h-6" />
                    </div>
                    <p>{user?.email || "-"}</p>
                  </div>
                </div>
              </Cards>
            </div>

            {/* data-property */}
            <div className="w-full h-full flex flex-col justify-center gap-2 mt-3">
              <h3 className="text-lg tracking-wide">Select Your Access :</h3>
              <div className="w-full">
                <div className="w-full grid cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => gotToAccess("owner")}
                    className={`tracking-wide w-full flex flex-col flex-1 border border-gray shadow-card-2 p-4 rounded-xl gap-2 text-left ${
                      router.pathname.includes("owner") ? "bg-gray" : "bg-white"
                    }`}>
                    <img
                      src="../../image/logo/logo-icon.svg"
                      alt="icon"
                      className="w-14 h-14 object-contain"
                    />
                    <h3 className="font-semibold">Owner</h3>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Atque, beatae!
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => gotToAccess("employee")}
                    className="tracking-wide w-full flex flex-col flex-1 border border-gray shadow-card-2 p-4 rounded-xl gap-2 text-left">
                    <img
                      src="../../image/logo/logo-icon.svg"
                      alt="icon"
                      className="w-14 h-14 object-contain"
                    />
                    <h3 className="font-semibold">Employee</h3>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Atque, beatae!
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => gotToAccess("tenant")}
                    className="tracking-wide w-full flex flex-col flex-1 border border-gray shadow-card-2 p-4 rounded-xl gap-2 text-left">
                    <img
                      src="../../image/logo/logo-icon.svg"
                      alt="icon"
                      className="w-14 h-14 object-contain"
                    />
                    <h3 className="font-semibold">Tenant</h3>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Atque, beatae!
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => gotToAccess("merchant")}
                    className={`tracking-wide w-full flex flex-col flex-1 border border-gray shadow-card-2 p-4 rounded-xl gap-2 text-left ${
                      router.pathname.includes("merchant")
                        ? "bg-gray"
                        : "bg-white"
                    }`}>
                    <img
                      src="../../image/logo/logo-icon.svg"
                      alt="icon"
                      className="w-14 h-14 object-contain"
                    />
                    <h3 className="font-semibold">Merchant</h3>
                    <p className="text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Atque, beatae!
                    </p>
                  </button>
                </div>
                <div className="w-full flex flex-col justify-center gap-6">
                  <div className="w-full flex flex-col gap-2 items-start text-left">
                    <Button
                      onClick={isOpenSignOut}
                      type="button"
                      variant="primary-outline-none"
                      className="px-0 py-0">
                      <span className="p-2 rounded-lg bg-primary text-white hover:opacity-80 hover:shadow-1">
                        <MdLogin className="w-6 h-6 rotate-180" />
                      </span>
                      <h2 className="text-base lg:text-lg text-graydark dark:text-white">
                        Sign Out.
                      </h2>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative w-full lg:w-1/2 h-full transition-transform duration-500 border-2 bg-gray text-graydark border-stroke rounded-3xl ease-in-out overflow-y-auto lg:overflow-x-hidden`}>
            <div className="w-full h-full flex flex-col items-center">
              <div className="w-full grid col-span-1 lg:grid-cols-2 items-center p-8">
                <div className="w-full">
                  <h3 className="text-title-lg font-semibold">Access List</h3>
                  <p className="text-base text-gray-5">Select your workspace</p>
                </div>
                <div className="w-full flex">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={isOpenForm}
                    className="lg:ml-auto rounded-lg">
                    <span>New Shop</span>
                    <MdAdd className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="w-full overflow-auto p-8">
                <div className="w-full h-full flex flex-col gap-4 ">
                  {/* {domains?.length > 0 ? domains?.map((item: any, index: any) => {
                                    return (
                                        <Merchants
                                            key={index}
                                            items={item}
                                        />
                                    )
                                }) :
                                    <div className='w-full'>
                                        <span className='font-semibold text-lg'>Data not found!</span>
                                    </div>
                                } */}

                  <button
                    type="button"
                    className="w-full divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-gray h-full tracking-wide flex flex-col lg:flex-row bg-white border border-gray shadow-card-2 p-4 rounded-xl gap-2 focus:outline-none"
                    onClick={() => {
                      router.push("/merchant/detail");
                    }}>
                    <img
                      src={"../../.../../image/logo/logo-icon.svg"}
                      alt="icon"
                      className="w-full max-w-[200px] lg:w-[20%] object-cover object-center m-auto"
                    />
                    <div className="w-full divide-y-2 divide-gray flex flex-col justify-between lg:w-[70%] p-2">
                      <div className="w-full text-left p-2">
                        <h3 className="font-semibold text-lg">
                          {"Merchant Name"}
                        </h3>
                        <p className="text-sm">{"lorem"}</p>
                      </div>
                      <div className="w-full flex items-center text-left p-2 gap-2">
                        <div className="font-semibold text-gray-5 flex items-center gap-2">
                          <MdOutlineBusiness className="w-4 h-4" />
                          <span>0 Shop</span>
                        </div>
                        <div className="font-semibold text-gray-5 flex items-center gap-2">
                          <MdOutlineHome className="w-4 h-4" />
                          <span>0 Unit</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full hidden lg:flex justify-start lg:w-[10%]">
                      <MdChevronRight className="w-7 h-7 m-auto" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* signout */}
      <Modal isOpen={isSignOut} onClose={isCloseSignOut} size="small">
        <div className="w-full px-6 flex flex-col items-center justify-center min-h-full h-[350px] max-h-[650px] gap-4 text-graydark tracking-wider">
          <h3 className="text-title-xl2 font-bold">Sign Out</h3>
          <FaRegQuestionCircle className="w-20 h-20 text-primary" />
          <p>Are you sure to Sign Out ?</p>
          <div className="w-full flex items-center gap-2 justify-center">
            <Button
              className="rounded-lg px-4"
              variant="primary"
              type="button"
              onClick={onSignOut}
              disabled={pending}>
              {pending ? (
                <Fragment>
                  Signing out ....
                  <FaCircleNotch className="w-5 h-5 animate-spin-2" />
                </Fragment>
              ) : (
                "Yes, Sign out!"
              )}
            </Button>
            <Button
              className="rounded-lg px-4"
              variant="danger"
              type="button"
              onClick={isCloseSignOut}>
              No
            </Button>
          </div>
        </div>
      </Modal>

      {/* new form */}
      <Modal isOpen={isForm} onClose={isCloseForm} size="small">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <ModalHeader
            className="mb-3 border-b-2 border-gray p-4"
            isClose
            onClick={isCloseForm}>
            <div className="w-full">
              <h3 className="text-lg font-bold">New Shop</h3>
            </div>
          </ModalHeader>

          <div className="w-full p-4">
            <div className="w-full mb-3 px-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Shop Name
                <span>*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Company Name..."
                  className="w-full rounded-xl border border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  {...register("domainName", {
                    required: {
                      value: true,
                      message: "Company Name is required.",
                    },
                  })}
                />
              </div>
              {errors?.domainName && (
                <div className="mt-1 text-xs flex items-center text-red-300">
                  <MdWarning className="w-4 h-4 mr-1" />
                  <span className="text-red-300">
                    {errors?.domainName?.message as any}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mb-3 px-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Shop Description
                <span>*</span>
              </label>
              <div className="relative">
                <textarea
                  cols={0.5}
                  rows={5}
                  maxLength={400}
                  autoFocus
                  placeholder="Domain Description..."
                  className="w-full rounded-lg border border-stroke bg-white py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  {...register("domainDescription")}
                />
                <div className="mt-1 text-xs flex items-center">
                  <span className="text-graydark">
                    {descriptionValue?.length || 0} / 400 characters.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ModalFooter
            isClose
            onClick={isCloseForm}
            className="border-t-2 border-gray p-4">
            <Button
              type="submit"
              onSubmit={handleSubmit(onSubmit)}
              variant="primary"
              className="rounded-lg text-sm"
              disabled={domain.pending}>
              {domain.pending ? (
                <Fragment>
                  Loading ....
                  <FaCircleNotch className="w-5 h-5 animate-spin-2" />
                </Fragment>
              ) : (
                "Save"
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  // Parse cookies from the request headers
  const cookies = getCookies({ req, res });

  // Access cookies using the cookie name
  const token = cookies["accessToken"] || null;
  const access = cookies["access"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (token && access !== "merchant") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/authentication/sign-in",
        permanent: true,
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default OwnerAccess;
