import { makeStyles } from "@material-ui/core";

export const useAnimationClasses = makeStyles(() => ({
  // Keyframes
  "@keyframes slideRightFadeIn": {
    from: {
      opacity: 0,
      transform: "translateX(100%)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "@keyframes slideLeftFadeIn": {
    from: {
      opacity: 0,
      transform: "translateX(-100%)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },

  // Animation classes
  slideRightFadeIn: {
    opacity: 0,
    transform: "translateX(100%)",
    animation: "$slideRightFadeIn",
    animationDuration: "0.5s",
    animationFillMode: "forwards",
  },
  slideLeftFadeIn: {
    opacity: 0,
    transform: "translateX(-100%)",
    animation: "$slideLeftFadeIn",
    animationDuration: "0.5s",
    animationFillMode: "forwards",
  },
}));
