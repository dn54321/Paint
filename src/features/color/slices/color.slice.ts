import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { HsvColor } from "colord";

export interface ColorSliceState {
    color: HsvColor
}

export interface ColorSliceActions {
    setColor: (color: HsvColor) => void
}

export type ColorSlice = ColorSliceState & ColorSliceActions;

export const initialColorState: ColorSliceState = {
    color: {h: 180, s: 0, v: 0},
}

export const createColorSlice: StateCreator<
    BoundStore,
    [],
    [],
    ColorSlice
> = (set) => ({
    ...initialColorState,
    setColor: (color: HsvColor) => set(() => ({ color }))
});