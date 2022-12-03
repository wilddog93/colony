import { FC } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const MyApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  axios.defaults.baseURL = process.env.API_ENDPOINT;
  return (
    <Provider store={store}>
      <Component {...props} />
      <ToastContainer position='top-right' limit={500} />
    </Provider>
  );
};

export default MyApp;