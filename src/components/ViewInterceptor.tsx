import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export interface InterceptorProps {
  inView: (inView: boolean) => void;
}

export const ViewInterceptor: React.FC<InterceptorProps> = (props) => {
  const { ref, inView } = useInView();
  const [wasInView, setWasInView] = React.useState(inView);

  useEffect(() => {
    if (inView != wasInView) {
      props.inView(inView);
      setWasInView(inView);
    }
  }, [props, inView, wasInView]);

  return <div ref={ref}></div>;
};
