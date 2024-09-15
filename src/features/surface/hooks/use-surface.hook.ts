import { useEffect } from "react";
import useBoundStore from "../../../hooks/use-bound-store";
import { Surface } from "../entities/surface.entity";

export function useSurface() {
    const surfaceList = useBoundStore(state => state.surfaceList);
    const getSurfaces = useBoundStore(state => state.getSurfaces);
    const addSurface = useBoundStore(state => state.addSurface);
    const removeSurface = useBoundStore(state => state.removeSurface);
    let surfaces: Array<Surface> = [];

    useEffect(() => {
        surfaces = getSurfaces();
    }, [surfaceList]);
 
    return {
        surfaceList: surfaces,
        addSurface,
        removeSurface,
    }
}