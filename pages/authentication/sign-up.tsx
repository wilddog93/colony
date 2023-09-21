import React, { useEffect, useState, Fragment } from "react";
import AuthLayout from "../../components/Layouts/AuthLayouts";
import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";
import Tooltip from "../../components/Tooltip/Tooltip";
import { useAppDispatch, useAppSelector } from "../../redux/Hook";
import { getCookies } from "cookies-next";
import { GetServerSideProps, NextPage } from "next";
import { resetAuth, selectAuth } from "../../redux/features/auth/authReducers";
import Modal from "../../components/Modal";
import { FaCircleNotch } from "react-icons/fa";
import Button from "../../components/Button/Button";
import Link from "next/link";
import {
  ModalFooter,
  ModalHeader,
} from "../../components/Modal/ModalComponent";
import LoadingPage from "../../components/LoadingPage";
import SignInComponent from "../../components/Forms/authentication/SignInComponent";
import SignUpComponent from "../../components/Forms/authentication/SignUpComponent";

interface PageProps {
  page?: string;
  token: any;
  firebaseToken: any;
  id: number;
  title: string;
  content: string;
}

type Props = {
  pageProps: PageProps;
};

const Authentication: NextPage<Props> = ({ pageProps }) => {
  const router = useRouter();
  const { pathname, query, asPath } = router;
  const { page, token, firebaseToken } = pageProps;

  // auth me
  const dispatch = useAppDispatch();
  const { data, isLogin, error, pending, message } = useAppSelector(selectAuth);

  //   loading page
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  // state
  const [isNotif, setIsNotif] = useState(false);

  const [form, setForm] = useState<any | undefined>({});

  useEffect(() => {
    let notif = message === "Email Not Registered!";
    if (error && notif) {
      setIsNotif(true);
    } else {
      setIsNotif(false);
      setForm({});
    }
  }, [error, message]);

  useEffect(() => {
    let notif = message === "firebaseToken should not be empty";
    if (error && notif) {
      setTimeout(() => {
        router.replace({ pathname, query });
      }, 1000);
    }
  }, [error, message]);

  return (
    <AuthLayout
      title="Authentication"
      logo="../image/logo/logo-icon.svg"
      description="">
      <LoadingPage loading={pending} />
      <div className="bg-gray w-full p-0 lg:py-10 lg:px-44">
        <div className="relative overflow-hidden w-full h-screen lg:h-full flex items-center rounded-xl bg-white shadow-default p-10">
          <div
            className={`relative hidden w-full lg:w-1/2 h-full lg:inline-block transition-transform duration-300 ease-in-out border bg-primary text-white border-stroke rounded-3xl ${
              !loading ? "" : "translate-x-full"
            }`}>
            <div className="w-full h-full flex flex-col items-center justify-between">
              <Link
                className={`w-full pt-5.5 flex items-center gap-4 px-10`}
                href="/">
                <img src="../image/logo/logo-icon-white.png" alt="logo" />
                <h2 className="text-lg text-white sm:text-title-lg">Colony.</h2>
              </Link>
              <div
                className={`w-full flex flex-col px-10 justify-center h-full`}>
                <div className="flex flex-col justify-center">
                  <h2 className="text-title-md2 lg:text-title-lg mb-5">
                    Welcome to Colony Manage Your Property as Convenient Living.
                  </h2>

                  <p className="leading-1 text-sm">
                    We are comprehensive property management solutions for
                    commercial and residential properties.
                  </p>
                </div>
              </div>
              <div className="w-full flex flex-col justify-end py-10 px-10 tracking-wider">
                <div className="w-full p-6 rounded-lg bg-[#111f2c3d] text-sm">
                  <p>
                    "Thank you for choosing our app! We're here to make your day
                    brighter and your tasks easier. Enjoy your time with us!"
                  </p>
                </div>
              </div>
            </div>

            <div className={`absolute z-40 inset-y-1/2`}>
              <Tooltip
                className={`tooltip w-full text-sm bg-[#111F2C3D] p-2 rounded-lg focus:outline-none rounded-tl-none rounded-bl-none`}
                classTooltip="p-5 rounded-xl shadow-lg z-1 font-bold w-full min-w-max"
                tooltip={"Go to Sign in"}
                color="light"
                position={"right"}>
                <MdArrowBack
                  onClick={() =>
                    router.push({
                      pathname: "/authentication/sign-in",
                    })
                  }
                  className={`w-10 h-10 transition-transform ease-in-out duration-1000 ${
                    !loading ? "rotate-180" : ""
                  }`}
                />
              </Tooltip>
            </div>
          </div>

          <div
            className={`absolute bg-white top-0 z-50 flex w-full lg:w-1/2 h-full flex-col overflow-hidden duration-300 ${
              loading ? "translate-x-full invisible" : "right-0 visible"
            }`}>
            <SignUpComponent firebaseToken={firebaseToken} />
          </div>
        </div>
      </div>

      <Modal isOpen={isNotif} onClose={() => setIsNotif(false)} size="small">
        <Fragment>
          <ModalHeader
            className="p-6 border-b-2 border-gray"
            isClose
            onClick={() => {
              setIsNotif(false);
              dispatch(resetAuth());
            }}>
            <div className="w-full flex-col items-start text-graydark">
              <h3 className="text-[22px] font-bold">
                Do you want to register ?
              </h3>
              <p className="text-sm text-gray-5">
                this email hasn’t been registered in our system
              </p>
            </div>
          </ModalHeader>
          <ModalFooter className="px-8 py-4">
            <div className="w-full flex items-center gap-2 justify-end">
              <Button
                variant="secondary-outline"
                className="rounded-lg px-4 border-gray-4 shadow-lg text-sm"
                type="button"
                onClick={() => {
                  setIsNotif(false);
                  dispatch(resetAuth());
                }}>
                Discard
              </Button>
              <Button
                className="rounded-lg px-4 text-sm shadow-lg"
                variant="primary"
                type="button"
                onClick={() => {
                  router.push("/authentication/sign-up");
                  setIsNotif(false);
                  dispatch(resetAuth());
                }}>
                {pending ? (
                  <Fragment>
                    <FaCircleNotch className="w-5 h-5 animate-spin-2" />
                    Loading ....
                  </Fragment>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Fragment>
      </Modal>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cookies = getCookies({ req, res });
  const token = cookies["accessToken"] || null;
  const firebaseToken = cookies["firebaseToken"] || null;

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token, firebaseToken, page: query },
  };
};

export default Authentication;
