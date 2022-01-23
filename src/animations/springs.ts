import { UseSpringProps } from "react-spring";

export type SpringPropFactory = (delay?: number) => UseSpringProps;

export interface SpringAnimations {
  [key: string]: SpringPropFactory;
}

export const animations: SpringAnimations = {
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
