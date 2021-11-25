import "../styles/globals.css";
import "../styles/TodoNote.css";
import type { AppProps } from "next/app";
import { Layout } from "src/components/Layout";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Script src="sweetalert2/dist/sweetalert2.min.js"></Script>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
