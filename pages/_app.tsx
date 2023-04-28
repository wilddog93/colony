import { FC, useEffect, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const MyApp: FC<AppProps> = ({ Component, ...pageProps }) => {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  axios.defaults.baseURL = process.env.API_ENDPOINT;
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return (
    <div id="preloader" className="fixed left-0 top-0 z-999999 h-screen flex items-center justify-center w-screen bg-white">
      <img src="./image/logo/logo-icon.png" alt="" className="animate-spin w-12 h-12" />
    </div>
  )
  return (
    <Provider store={store}>
      <Component {...props} />
      <ToastContainer position='top-right' limit={500} />
    </Provider>
  );
};

export default MyApp;