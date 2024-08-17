import { useEffect, useState } from "react";

type WidthAndHeightTuple = [number, number];

function getCurrentWidthAndHeight(): WidthAndHeightTuple {
    return [window.innerWidth, window.innerHeight];
}

export function useWindowResize() {
  const [widthAndHeight, setWidthAndHeight] = useState([0,0]);

  function handler() {
    setWidthAndHeight(getCurrentWidthAndHeight());
  }

  useEffect(() => {
    if (window !== undefined) {
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
      }
  });

  return widthAndHeight;
}