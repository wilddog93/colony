import '../styles/globals.css'
import type { AppProps } from 'next/app'
import axios from "axios";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  axios.defaults.baseURL = process.env.API_ENDPOINT;
  return <Component {...pageProps} />
}
