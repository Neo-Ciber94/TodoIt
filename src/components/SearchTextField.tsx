import styled from "@emotion/styled";
import { ChangeEvent } from "react";
import { Theme, TextField, SxProps } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

export interface SearchTextFieldProps {
  value: string;
  onSearch: (term: string) => void;
  className?: string;
  sx?: SxProps<Theme>;
}

export function SearchTextField({
  sx,
  value,
  onSearch,
  className,
}: SearchTextFieldProps) {
  return (
    <StyledTextField
      label="Search"
      variant="standard"
      className={`w-full md:w-1/2 ${className || ""}`}
      autoComplete="off"
      value={value}
      sx={sx}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onSearch(value.trim());
        }
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value.trim());
      }}
    />
  );
}
