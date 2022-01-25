import { isBrowser } from "@shared/utils/utils";
import React from "react";

export enum Orientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export function useOrientation() {
  const [orientation, setOrientation] = React.useState<Orientation>(
    getOrientation()
  );

  React.useEffect(() => {
    const onChange = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener("resize", onChange);

    return () => {
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return orientation;
}

function getOrientation() {
  // We just asome portrait
  if (!isBrowser()) {
    return Orientation.PORTRAIT;
  }

  return window.matchMedia("(orientation: portrait)").matches
    ? Orientation.PORTRAIT
    : Orientation.LANDSCAPE;
}
