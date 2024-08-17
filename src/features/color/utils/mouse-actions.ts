import { MutableRefObject, RefObject } from "react";

export function move<T extends RefObject<HTMLElement> | MutableRefObject<HTMLElement | undefined>>(e: MouseEvent, container: T, callbackFunction: (e: MouseEvent) => void) {
    return new Promise(end => {
        callbackFunction(e); // trigger it now also
        document.addEventListener(
            'mouseup',
            ev => {
                container.current?.removeEventListener('mousemove', callbackFunction);
                end(ev);
            },
        { once: true },
      );
      container.current?.addEventListener('mousemove', callbackFunction);
    });
  }