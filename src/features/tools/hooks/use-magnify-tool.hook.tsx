import { ZoomIn, ZoomOut } from "lucide-react";
import useBoundStore from "../../../hooks/use-bound-store";
import { MouseButtons } from "../../../types/mouse.types";
import { DisplayActions, MouseDisplayActionPayload } from "../../display/types/camera-action.types";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { ToolFormComponent, ToolFormComponents } from "../types/tool-forms.types";
import { fitBoundingBox } from "../../display/utils/camera.utils";

export enum MagnifySubtool {
    ZOOM_IN = "zoom-in",
    ZOOM_OUT = "zoom-out"
}

export interface MagnifyToolSettings {
    magnification: number
}

function onClick({scene, event, viewportRef}: MouseDisplayActionPayload, zoomLevel: number) {
    const scenePadding = scene.getPaddingDimensions();
    const sceneZoom = scene.getZoom();
    const newZoom = sceneZoom + zoomLevel;
    
    if (event.button != MouseButtons.LEFT_CLICK || !viewportRef.current) {
        return;
    }

    if ((newZoom < 0 && newZoom > 16)) {
        return;
    }

    const viewPortDimensions = {width: viewportRef.current.clientWidth, height: viewportRef.current.clientHeight };
    const boardDimensions = fitBoundingBox(scene.getSurface().getDimensions(), viewPortDimensions);
    const zoomedBoardDimension = {width: boardDimensions.width*sceneZoom, height: boardDimensions.height*sceneZoom};
    const newZoomedBoardDimension = {width: boardDimensions.width*newZoom, height: boardDimensions.height*newZoom};
    const newDisplayDimensions = {
        width: newZoomedBoardDimension.width + scenePadding.width*2, 
        height: newZoomedBoardDimension.height + scenePadding.width*2
    };

    const boardPixelPecentageX = (Number(event.offsetX) - scenePadding.width) / (zoomedBoardDimension.width);
    const boardPixelPercentageY = (Number(event.offsetY) - scenePadding.height) / (zoomedBoardDimension.height);
    const scrollX = (scenePadding.width + boardPixelPecentageX*newZoomedBoardDimension.width) / newDisplayDimensions.width;
    const scrollY = (scenePadding.height + boardPixelPercentageY*newZoomedBoardDimension.height) / newDisplayDimensions.height;

    scene.setZoom(newZoom);
    scene.setScrollPositionPercentage({x: scrollX, y: scrollY});
}

export function useMagnifyTool(): ToolHookResponse<MagnifySubtool> {
    const name = Tools.MAGNIFY;
    const magnifyState = useBoundStore(state => state.magnifyState);
    const setActiveSubtool = useBoundStore(state => state.setActiveSubtool);
    const activeSubtool = magnifyState?.activeSubtool as MagnifySubtool;
    const toolPointer = magnifyState.activeSubtool;

    const actions = [{
        eventName: DisplayActions.ON_MOUSE_UP,
        actionName: "TOOL.MAGNIFY.ZOOM",
        action: (payload: MouseDisplayActionPayload) => {
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