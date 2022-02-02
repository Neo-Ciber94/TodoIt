import "../styles/globals.css";
import "../styles/animations.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Layout } from "src/components/Layout";
import { UserProvider } from "@auth0/nextjs-auth0";
import { createTheme, ThemeProvider } from "@mui/material";
import type { ThemeOptions } from "@mui/system";
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "src/contexts/ModalContext";

export const themeOptions: ThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#000000",
      light: "#161616",
      dark: "#0e0e0e",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      paper: "#fed7aa",
    },
    text: {
      primary: "#fffffff",
      secondary: "#fffffff",
      disabled: "rgba(255,255,255,0)",
      hint: "#f9f9f9",
    },
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: themeOptions.palette,
  });

  return (
    <>
      <UserProvider>
        <ModalProvider>
          <SWRConfig value={{ provider: () => new Map() }}>
            <ThemeProvider theme={theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </SWRConfig>
        </ModalProvider>
      </UserProvider>
      <ToastContainer theme="colored" />
    </>
  );
}

export default MyApp;
