import React, { RefObject } from "react";

export function useMutationObserver<T>(
    ref: RefObject<T>,
    callback: () => void,
    options = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    }
) {
    React.useEffect(() => {
      if (ref.current) {
        const observer = new MutationObserver(callback);
        observer.observe(ref.current as unknown as Node, options);
        return () => observer.disconnect();
      }
    }, [callback, options]);
  }