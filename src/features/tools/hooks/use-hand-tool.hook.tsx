import { useRef, useState } from "react";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { CameraActionPayload, CameraActions } from "../../camera/types/camera-action.types";
import { Hand } from "lucide-react";
import { clearSelection } from "../../../utils/selection";
import { MouseButtons } from "../../../types/mouse.types";

export enum HandToolPointer {
    DEFAULT = 'grab',
    GRAB = 'grabbing'
}

export enum HandSubtool {
    HAND = "hand"
}


export function useHandTool(): ToolHookResponse {
    const [toolPointer, setToolPointer] = useState(HandToolPointer.DEFAULT);
    const isMouseDown = useRef(false);
    const name = Tools.HAND;

    function onGrabEnable() {
        clearSelection();
        setToolPointer(HandToolPointer.GRAB);
        isMouseDown.current = true;
    }

    function onMouseClick({event}: CameraActionPayload) {
        if (event.button === MouseButtons.LEFT_CLICK) {
            onGrabEnable();
        }
    }

    function onGrabDisable({camera}: CameraActionPayload) {
        camera.updateState();
        setToolPointer(HandToolPointer.DEFAULT);    
        isMouseDown.current = false;
    }

    function onMouseMove({camera, event}: CameraActionPayload) {
        if (!isMouseDown.current) {
            return;
        }
        console.log("Grabbing...");
        const dy = event.movementY;
        const dx = event.movementX;
        camera.moveCamera(-dy, -dx);
    }

    const actions = [
        {
            eventName: CameraActions.ON_MOUSE_UP,
            actionName: "TOOL.HAND.GRAB",
            action: onGrabDisable
        },
        {
            eventName: CameraActions.ON_MOUSE_DOWN,
            actionName: "TOOL.HAND.UNGRAB",
            action: onMouseClick
        },
        {
            eventName: CameraActions.ON_MOUSE_MOVE,
            actionName: "TOOL.HAND.MOVE",
            action: onMouseMove
        },
        {
            eventName: CameraActions.ON_MOUSE_EXIT,
            actionName: "TOOL.HAND.EXIT_SCREEN",
            action: onGrabDisable
        }
    ];

    const activeSubtool = HandSubtool.HAND;
    const subtools = [
        {
            key: HandSubtool.HAND,
            name: "Grab",
            icon: <Hand />
        }, 
    ]

    return {toolPointer, name, actions, subtools, activeSubtool}
}