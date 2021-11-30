import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/TodoNote.css";
import type { AppProps } from "next/app";
import { Layout } from "src/components/Layout";
import { UserProvider } from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
