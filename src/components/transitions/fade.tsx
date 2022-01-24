import React, { forwardRef } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";

export const FadeTransition = forwardRef<HTMLDivElement, FadeProps>(
  function FadeTransition(props, ref) {
    const { in: open, children, ...rest } = props;

    return (
      <Fade in={open} ref={ref} {...rest}>
        {children}
      </Fade>
    );
  }
);
