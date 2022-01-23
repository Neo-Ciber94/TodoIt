import { forwardRef } from "react";
import { animated, useSpring } from "react-spring";
import { TransitionProps } from "./props";

export interface SlideTransitionProps extends TransitionProps {
  direction?: "left" | "right"; // default to left
}

export const SlideTransition = forwardRef<HTMLDivElement, SlideTransitionProps>(
  function Fade(props, ref) {
    const {
      in: open,
      children,
      duration = 200,
      onEnter,
      onExited,
      ...rest
    } = props;

    const onStart = () => {
      if (open && onEnter) {
        onEnter();
      }
    };

    const onRest = () => {
      if (!open && onExited) {
        onExited();
      }
    };

    const transformDir =
      props.direction === "right" ? "100%" : "-100%";

    const style = useSpring({
      config: { duration },
      from: { opacity: 0, transform: transformDir },
      to: {
        opacity: open ? 1 : 0,
        padding: open ? "0%" : transformDir,
      },
      onStart,
      onRest,
    });

    return (
      <animated.div ref={ref} style={style} {...rest}>
        {children}
      </animated.div>
    );
  }
);
