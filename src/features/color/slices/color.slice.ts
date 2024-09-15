import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { HsvaColor, HsvColor } from "colord";
import { ColorState } from "../types/color.type";

export interface ColorSliceState {
    primaryColor: HsvaColor,
    secondaryColor: HsvaColor,
    colorState: ColorState
}

export interface ColorSliceActions {
    setColor: (color: HsvaColor, colorState: ColorState) => void,
    setColorState: (colorState: ColorState) => void, 
}

export type ColorSlice = ColorSliceState & ColorSliceActions;

export const initialColorState: ColorSliceState = {
    primaryColor: {h: 180, s: 100, v: 100, a: 1},
    secondaryColor: {h: 180, s: 0, v: 0, a: 1},
    colorState: ColorState.PRIMARY
}

export const createColorSlice: StateCreator<
    BoundStore,
    [],
    [],
    ColorSlice
> = (set) => ({
    ...initialColorState,
    setColor: (color: HsvColor, colorState: ColorState) => set(() => ({ [colorState]: color })),
    setColorState: (colorState: ColorState) => set(() => ({colorState: colorState}))
});