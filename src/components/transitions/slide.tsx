import React, { forwardRef } from "react";
import Slide, { SlideProps } from "@mui/material/Slide";
import { easing } from "@mui/material";

const easeOutBounce = `cubic-bezier(0, 1.3, 0.8, 1)`;

export const SlideTransition = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SlideProps>
>(function SlideTransition(props, ref) {
  const { direction = "right", children, ...rest } = props;

  return (
    <Slide
      ref={ref}
      {...rest}
      direction={direction}
      easing={{
        enter: easeOutBounce,
        exit: easing.easeInOut,
      }}
    >
      {children}
    </Slide>
  );
});
