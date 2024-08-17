import { Tools } from "../types/tool.types";
import { BoundStore } from "../../../hooks/use-bound-store";
import { StateCreator } from "zustand";
import { MagnifySubtool } from "../hooks/use-magnify-tool.hook";
import { produce } from 'immer';
import { HandSubtool } from "../hooks/use-hand-tool.hook";
import { BrushSubtool } from "../hooks/use-brush-tool.hook";

export interface SubtoolSliceState<T extends string, S extends object> {
    activeSubtool: T,
    settings: S
}

export interface ToolSubtoolListMap {
    [Tools.MAGNIFY]: MagnifySubtool,
    [Tools.HAND]: HandSubtool,
    [Tools.BRUSH]: BrushSubtool,
    [key: string]: string
}

export interface ToolMagnifySettings {
    zoomOffset: number
}

export interface ToolBrushSettings {
    brushSize: number,
    brushOpacity: number,
}

export interface ToolMagnifyState extends GenericToolState {
    activeTool: Tools.MAGNIFY;
    magnifyState: SubtoolSliceState<MagnifySubtool, ToolMagnifySettings>;
}

export interface ToolHandState extends GenericToolState {
    activeTool: Tools.HAND;
    handState: SubtoolSliceState<HandSubtool, object>;
}

export interface ToolBrushState extends GenericToolState {
    activeTool: Tools.BRUSH;
    handState: SubtoolSliceState<BrushSubtool, ToolBrushSettings>;
}

export interface GenericToolState {
    activeTool: string;
}

export interface ToolSliceAction<T = ToolSubtoolListMap[ToolSliceState['activeTool']]> {
    setActiveTool: (tool: Exclude<keyof ToolSubtoolListMap, number>) => void,
    setActiveSubtool: (subtool: T) => void,
    setToolSetting:  (attribute: string, value: string | number) => void,
}

export type ToolSliceState = 
    Omit<ToolMagnifyState, 'activeTool'> & 
    Omit<ToolHandState, 'activeTool'> &
    Omit<ToolBrushState, 'activeTool'> &
    GenericToolState;
    
export type ToolSlice = (ToolSliceState) & ToolSliceAction;

export const initialToolSliceState: ToolSliceState = {
    activeTool: Tools.HAND,
    magnifyState: {
        activeSubtool: MagnifySubtool.ZOOM_IN,
        settings: {
            zoomOffset: 10
        }
    },
    brushState: {
        activeSubtool: BrushSubtool.BRUSH,
        settings: {
            brushSize: 7,
            brushOpacity: 100,
        }
    },
    handState: {
        activeSubtool: HandSubtool.HAND,
        settings: {}
    },
}

export const createToolSlice: StateCreator<
    BoundStore,
    [],
    [],
    ToolSlice
> = (set) => ({
    ...initialToolSliceState,
    setActiveTool: (tool) => set(() => ({ activeTool: tool })),
    setActiveSubtool: (subtool) => 
        set(produce((state) => { state[state.activeTool + 'State'].activeSubtool = subtool })),
    setToolSetting: (attribute: string, value: string | number) => 
        set(produce((state) => { state[state.activeTool + 'State'].settings[attribute] = value }))
})

