import { Container, interfaces } from "inversify";
import { createContext, useContext } from "react";

export const InversifyContainerContext = createContext<Container | undefined>(undefined);
export function useInjection<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    const containerContext = useContext(InversifyContainerContext);
    if (containerContext === undefined) {
        throw new Error("Container cannot be undefined")
    }
    return containerContext.get(serviceIdentifier);
}