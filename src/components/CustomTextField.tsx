import { TextField } from "@mui/material";
import styled from "styled-components";

export const CustomTextField = styled(TextField)({
  "& input.MuiInput-input": {
    color: "white",
  },
  "& label.MuiInputLabel-root": {
    color: "white",
  },
  "& div.MuiInput-underline.MuiInput-root:before": {
    borderBottomColor: "gray",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});
