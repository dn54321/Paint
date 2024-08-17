import React from "react";
import { CameraActionPayload, CameraActions } from "../../camera/types/camera-action-subscriber.types";
import { ToolFormComponent } from "./tool-forms.types";

export interface ToolAction {
    eventName: CameraActions,
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
