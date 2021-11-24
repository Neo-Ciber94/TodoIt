import { Button } from "@mui/material";
import React from "react";

type Props = React.HTMLProps<HTMLButtonElement>;

export const CustomButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, href, onClick }, ref) => {
    return (
      <Button
        ref={ref}
        href={href}
        onClick={onClick}
        color="inherit"
        variant="contained"
        className="text-white bg-gray-400 hover:bg-black sm:w-auto w-full"
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
