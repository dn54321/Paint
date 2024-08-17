import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { Camera } from "../entities/camera.entity";

export interface CameraSliceState {
    camera?: Camera
}

export interface CameraSliceActions {
    setCamera: (camera: Camera) => void
}

export type CameraSlice = CameraSliceState & CameraSliceActions;

export const initialCameraSlice: CameraSliceState = {
    camera: undefined,
}

export const createCameraSlice: StateCreator<
    BoundStore,
    [],
    [],
    CameraSlice
> = (set) => ({
    ...initialCameraSlice,
    setCamera: (camera: Camera) => set(() => ({ camera })),
});