import { forwardRef } from "react";
import { animated, useSpring } from "react-spring";
import { TransitionProps } from "./props";

export const FadeTransition = forwardRef<HTMLDivElement, TransitionProps>(
  function Fade(props, ref) {
    const {
      in: open,
      children,
      duration = 200,
      onEnter,
      onExited,
      ...other
    } = props;
    
    const style = useSpring({
      config: { duration },
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });

    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
  }
);
