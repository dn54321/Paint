import { MutableRefObject, RefObject } from "react";

export function move<T extends RefObject<HTMLElement> | MutableRefObject<HTMLElement | undefined>>(e: MouseEvent, container: T, callbackFunction: (e: MouseEvent) => void) {
    callbackFunction(e); 
    document.addEventListener(
      'mouseup',
      () => container.current?.removeEventListener('mousemove', callbackFunction),
      { once: true },
    );
    container.current?.addEventListener('mousemove', callbackFunction);

  }