import { StateCreator } from "zustand";
import { BoundStore } from "../../../hooks/use-bound-store";
import { Canvas } from "../entities/canvas.entity";

export interface CanvasState {
    activeCanvas?: Canvas;
    canvasList: Array<Canvas>;
}

export interface CanvasActions {
    setActiveCanvas: (canvas: Canvas | undefined) => void;
    addCanvas: (canvas: Canvas) => void;
    removeCanvas: (canvas: Canvas) => void;
    moveCanvas: (canvas: Canvas, index: number) => void;
    setCanvasList: (canvas: Array<Canvas>) => void;
}

export type CanvasSlice = CanvasState & CanvasActions;

export const initialCanvasSliceState: CanvasState = {
    activeCanvas: undefined,
    canvasList: [],
}

export const createCanvasSlice: StateCreator<
    BoundStore,
    [],
    [],
    CanvasSlice
> = (set) => ({
    ...initialCanvasSliceState,
    setActiveCanvas: (canvas: Canvas | undefined) => set(() => ({ activeCanvas: canvas })),
    addCanvas: (canvas: Canvas) => set((state) => ({ canvasList: [...state.canvasList, canvas] })),
    removeCanvas: (canvas: Canvas) => set((state) => ({ canvasList: state.canvasList.filter(item => canvas != item) })),
    setCanvasList: (canvasList: Array<Canvas>) => set(() => ({canvasList})),
    moveCanvas: (canvas: Canvas, index: number) => set((state) => {
        const response = state.canvasList.filter(item => item != canvas);
        response.splice(index,0,canvas);
        return { canvasList: response };
    }),
});