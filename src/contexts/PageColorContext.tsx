import { PASTEL_COLORS } from "@shared/config";
import React, { createContext, useEffect } from "react";

export interface PageColorProps {
  pageColor: string;
  setPageColor: (color: string) => void;
}

const PageColorContext = createContext<PageColorProps>({} as PageColorProps);

export const PageColorProvider: React.FC = (props) => {
  const [pageColor, setPageColor] = React.useState<string>(PASTEL_COLORS[0]);

  return (
    <PageColorContext.Provider value={{ pageColor, setPageColor }}>
      <div style={{ backgroundColor: pageColor, minHeight: "100%" }}>
        {props.children}
      </div>
    </PageColorContext.Provider>
  );
};

export function usePageColor(initialColor?: string) {
  const context = React.useContext(PageColorContext);

  useEffect(() => {
    if (initialColor) {
      context.setPageColor(initialColor);
    }

    return () => {
      context.setPageColor(PASTEL_COLORS[0]);
    };
  }, [context, initialColor]);

  if (context === undefined) {
    throw new Error("usePageColor must be used within a PageColorProvider");
  }

  return context;
}
