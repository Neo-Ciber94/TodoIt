import { Box, Typography } from "@mui/material";
import { NextPageContext } from "next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface ErrorProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  const message = getErrorMessage(statusCode);

  return (
    <Box
      className="flex flex-row justify-center"
      sx={{
        padding: [2, 5],
      }}
    >
      <Box className="flex flex-col justify-center items-center gap-4 mt-[10%]">
        <ErrorOutlineIcon sx={{ fontSize: "calc(60px + 1vw)" }} />
        <Typography
          sx={{
            // color: "red",
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: "calc(20px + 1vw)",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

function getErrorMessage(statusCode?: number) {
  if (statusCode == null) {
    return "An error occurred on client";
  }

  switch (statusCode) {
    case 401:
      return "You are not authorized to access this page";
    case 404:
      return "This page could not be found";
    default:
      break;
  }

  return `An error ${statusCode} occurred on server`;
}

export default ErrorPage;
