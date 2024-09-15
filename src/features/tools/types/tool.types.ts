import React from "react";
import { CameraActionPayload, DisplayActions } from "../../display/types/camera-action.types";
import { ToolFormComponent } from "./tool-forms.types";

export interface ToolAction {
    eventName: DisplayActions,
    actionName: string,
    action: (payload: CameraActionPayload) => void
}

export interface Subtool<T=string> {
    key: T,
    name: string,
    icon: React.ReactNode
}

export interface ToolHookResponse<T=string> {
    name: string;
    toolPointer: string;
    actions: Array<ToolAction>;
    settingsTemplate?: Array<ToolFormComponent>
    subtools?: Array<Subtool<T>>
    activeSubtool?: T;
    setActiveSubtool?: (subtool: T) => void
}



export enum Tools {
    HAND = "hand",
    BRUSH = "brush", 
    MAGNIFY = "magnify",
    ERASER = "eraser",
    SELECT = "select"
}
