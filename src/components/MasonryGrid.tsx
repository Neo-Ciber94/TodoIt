import imagesLoaded from "imagesloaded";
import React, { useEffect } from "react";

/**
 * A custom masonry layout implementation.
 * 
 * @see https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
 */
export const MasonryGrid: React.FC = ({ children }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const gridItemsRef = React.useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    const allItems = gridItemsRef.current.filter((e) => e != null);

    if (grid && allItems.length > 0) {
      resizeAllGridItems(grid, allItems);

      const resizeAllGridItemsCallback = () =>
        resizeAllGridItems(grid, allItems);
      window.addEventListener("resize", resizeAllGridItemsCallback);

      for (let x = 0; x < allItems.length; x++) {
        imagesLoaded(allItems[x], (e) => resizeInstance(grid, e));
      }

      return () => {
        window.removeEventListener("resize", resizeAllGridItemsCallback);
      };
    }
  }, [gridRef, gridItemsRef, children]);

  const masonryItems = React.Children.map(children, (child, index) => (
    <div
      ref={(divElement) => {
        if (divElement != null) {
          gridItemsRef.current[index] = divElement;
        }
      }}
      className="masonry-grid-item flex flex-col justify-center items-stretch"
    >
      {child}
    </div>
  ));

  return (
    <div ref={gridRef} className="masonry-grid">
      {masonryItems}
    </div>
  );
};

// prettier-ignore
function resizeGridItem(grid: Element, item: HTMLElement) {
  if (grid == null || item == null) {
    return;
  }

  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));
  const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"));

  const firstChild = item.firstElementChild;
  const firstChildHeight = firstChild?.getBoundingClientRect().height || 0;
  const rowSpan = Math.ceil((firstChildHeight + rowGap) / (rowHeight + rowGap));
  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems(grid: Element, allItems: HTMLDivElement[]) {
  for (let x = 0; x < allItems.length; x++) {
    resizeGridItem(grid, allItems[x] as HTMLElement);
  }
}

function resizeInstance(grid: Element, instance: any) {
  const item = instance.elements[0];

  if (item) {
    resizeGridItem(grid, item);
  }
}
