import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/TodoNote.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Layout } from "src/components/Layout";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ErrorBoundary } from "src/components/error-boundary";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
