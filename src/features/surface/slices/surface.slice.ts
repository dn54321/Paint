import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { Surface } from "../entities/surface.entity";


export type SurfaceState = {
    surfaceList: Array<string>,
} 

export type SurfaceRecord = {
    [key: `surface@${string}`]: Surface,
}

export interface SurfaceActions {
    addSurface(surface: Surface): void,
    removeSurface(surfaceId: string): void,
    getSurfaces(): Array<Surface>
}

export type SurfaceSlice = SurfaceState & SurfaceActions;

export const initialSurfaceSliceState: SurfaceState = {surfaceList: []}

export const createSurfaceSlice: StateCreator<
    BoundStore,
    [],
    [],
    SurfaceSlice
> = (set, get) => ({
    ...initialSurfaceSliceState,
    addSurface: (surface: Surface) => set((state) => ({ [`surface@${surface.getId()}`]: surface, surfaceList: [...state.surfaceList, surface.getId()]})),
    removeSurface: (surfaceId: string) => set((state) => ({ surfaceList: state.surfaceList.filter(item => surfaceId != item) })),
    getSurfaces: () => get().surfaceList.filter(surfaceId => `surface@${surfaceId}` in get()).map(surfaceId => get()[`surface@${surfaceId}` as keyof BoundStore] as unknown as Surface),
});