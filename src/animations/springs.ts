import { UseSpringProps, animated } from "react-spring";
import { Box } from "@mui/material"

export type SpringPropFactory = (delay?: number) => UseSpringProps;

export interface AnimationSpringsCollection {
  [key: string]: SpringPropFactory;
}

export const animationSprings: AnimationSpringsCollection = {
  slideLeftFadeIn: (delay?: number) => ({
    from: { opacity: 0, transform: `translateX(-100%)` },
    to: { opacity: 1, transform: "translateX(0%)" },
    delay: delay || 0,
  }),

  slideRightFadeIn: (delay?: number) => ({
    from: { opacity: 0, transform: `translateX(100%)` },
    to: { opacity: 1, transform: "translateX(0%)" },
    delay: delay || 0,
  }),
};
