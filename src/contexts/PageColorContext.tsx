import React, { createContext, useEffect } from "react";

// Pastel orange
const DEFAULT_PAGE_COLOR = "#FED7AA";

export interface PageColorProps {
  pageColor: string;
  setPageColor: (color: string) => void;
}

const PageColorContext = createContext<PageColorProps>({} as PageColorProps);

export const PageColorProvider: React.FC = (props) => {
  const [pageColor, setPageColor] = React.useState<string>(DEFAULT_PAGE_COLOR);

  useEffect(() => {
    document.body.style.backgroundColor = pageColor;
  }, [pageColor]);

  return (
    <PageColorContext.Provider value={{ pageColor, setPageColor }}>
      <div style={{ minHeight: "100%" }}>{props.children}</div>
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
      context.setPageColor(DEFAULT_PAGE_COLOR);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (context === undefined) {
    throw new Error("usePageColor must be used within a PageColorProvider");
  }

  return context;
}
