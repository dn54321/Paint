import { ZoomIn, ZoomOut } from "lucide-react";
import useBoundStore from "../../../hooks/use-bound-store";
import { MouseButtons } from "../../../types/mouse.types";
import { CameraActionPayload, CameraActions } from "../../camera/types/camera-action.types";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { ToolFormComponent, ToolFormComponents } from "../types/tool-forms.types";

export enum MagnifySubtool {
    ZOOM_IN = "zoom-in",
    ZOOM_OUT = "zoom-out"
}

function onClick(payload: CameraActionPayload, zoomLevel: number) {
    const event = payload.event;
    
    if (event.button === MouseButtons.LEFT_CLICK) {
        const camera = payload.camera; 
        if (!camera.isReady()) {
            return;
        }

        const newZoom = camera.getZoom() + zoomLevel;
        if (0 < newZoom && newZoom <= 16) {
            camera.zoomCamera(zoomLevel, {x: event.offsetX, y: event.offsetY});
        }
    }
}

export function useMagnifyTool(): ToolHookResponse<MagnifySubtool> {
    const name = Tools.MAGNIFY;
    const magnifyState = useBoundStore(state => state.magnifyState);
    const setActiveSubtool = useBoundStore(state => state.setActiveSubtool);
    const activeSubtool = magnifyState?.activeSubtool as MagnifySubtool;
    const toolPointer = magnifyState.activeSubtool;

    const actions = [{
        eventName: CameraActions.ON_MOUSE_UP,
        actionName: "TOOL.MAGNIFY.ZOOM",
        action: (payload: CameraActionPayload) => {
            switch (activeSubtool) {
                case MagnifySubtool.ZOOM_IN: return onClick(payload, magnifyState.settings.zoomOffset/100);
                case MagnifySubtool.ZOOM_OUT: return onClick(payload, -magnifyState.settings.zoomOffset/100);
            }   
        }
    }];
   
    const subtools = [
        {
            key: MagnifySubtool.ZOOM_IN,
            name: "Zoom In",
            icon: <ZoomIn />
        }, 
        {
            key: MagnifySubtool.ZOOM_OUT,
            name: "Zoom Out",
            icon: <ZoomOut />
        }
    ]

    const settingsTemplate: Array<ToolFormComponent> = [
        {
            type: ToolFormComponents.SLIDER,
            handle: "zoomOffset",
            name: "Zoom Offset (%)",
            min: 1,
            max: 100,
            defaultValue: 10,
            step: 1
        }
    ]

    return { 
        name, 
        actions, 
        subtools, 
        activeSubtool, 
        setActiveSubtool, 
        toolPointer,
        settingsTemplate,
    }
}