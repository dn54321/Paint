import { useRef, useState } from "react";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { DisplayActions, MouseDisplayActionPayload } from "../../display/types/camera-action.types";
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

    function onMouseClick({event}: MouseDisplayActionPayload) {
        if (event.button === MouseButtons.LEFT_CLICK) {
            onGrabEnable();
        }
    }

    function onMouseUp({viewportRef, scene}: MouseDisplayActionPayload) {
        if (!viewportRef.current) {
            return;
        }
        const maxScrollX = viewportRef.current.scrollWidth - viewportRef.current.clientWidth;
        const maxScrollY = viewportRef.current.scrollHeight - viewportRef.current.clientHeight;
        const scrollX = viewportRef.current.scrollLeft/maxScrollX;
        const scrollY = viewportRef.current.scrollTop/maxScrollY;
        scene.setScrollPositionPercentage({x: scrollX, y: scrollY});
        setToolPointer(HandToolPointer.DEFAULT);    
        isMouseDown.current = false;
        
    }

    function onMouseMove({event, viewportRef}: MouseDisplayActionPayload) {
        if (!isMouseDown.current || !viewportRef.current) {
            return;
        }
        const dy = event.movementY;
        const dx = event.movementX;
        
        viewportRef.current.scrollLeft -= dx;
        viewportRef.current.scrollTop -= dy;
    }

    const actions = [
        {
            eventName: DisplayActions.ON_MOUSE_UP,
            actionName: "TOOL.HAND.GRAB",
            action: onMouseUp
        },
        {
            eventName: DisplayActions.ON_MOUSE_DOWN,
            actionName: "TOOL.HAND.UNGRAB",
            action: onMouseClick
        },
        {
            eventName: DisplayActions.ON_MOUSE_MOVE,
            actionName: "TOOL.HAND.MOVE",
            action: onMouseMove
        },
        {
            eventName: DisplayActions.ON_MOUSE_EXIT,
            actionName: "TOOL.HAND.EXIT_SCREEN",
            action: onMouseUp
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