import { Camera, Paintbrush } from "lucide-react";
import { MouseButtons } from "../../../types/mouse.types";
import { CameraActionPayload, CameraActions } from "../../camera/types/camera-action-subscriber.types";
import { ToolHookResponse, Tools } from "../types/tool.types";
import { ToolFormComponent, ToolFormComponents } from "../types/tool-forms.types";
import { useRef } from "react";
import { Position } from "../../../types/geometry.types";

export enum HandToolPointer {
    DEFAULT = 'grab',
    GRAB = 'grabbing'
}

export enum BrushSubtool {
    BRUSH = "none"
}


export function useBrushTool(): ToolHookResponse {
    const toolPointer = BrushSubtool.BRUSH;
    const name = Tools.BRUSH;
    const mousePos = useRef<Position>({x:0, y:0});
    const scrollPos = useRef<Position>({x:0, y:0});

    function onMouseMove({event, cursorRef, camera}: CameraActionPayload) {
        const scrollRef = camera.getScrollRef();
        if (!cursorRef?.current || !scrollRef?.current) {
            return;
        }

        mousePos.current = {x: event.offsetX, y: event.offsetY};
        scrollPos.current = {x: scrollRef.current.scrollLeft, y: scrollRef.current.scrollTop}
        cursorRef.current.style.transform = `translate(${event.offsetX}px, ${event.offsetY}px)`;
    }

    function onScroll({cursorRef, camera}: CameraActionPayload) {
        const scrollRef = camera.getScrollRef();
        if (!scrollRef?.current || !cursorRef?.current) {
            return;
        }
        const x = mousePos.current.x + scrollRef.current.scrollLeft - scrollPos.current.x;
        const y = mousePos.current.y + scrollRef.current.scrollTop - scrollPos.current.y;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }


    function setPointerDisplay({cursorRef}: CameraActionPayload, display: string) {
        if (!cursorRef?.current) {
            return;
        }
        cursorRef.current.style.display = display;
    }

    const actions = [
        {
            eventName: CameraActions.ON_MOUSE_MOVE,
            actionName: "TOOL.HAND.MOVE",
            action: onMouseMove
        },
        {
            eventName: CameraActions.ON_MOUSE_EXIT,
            actionName: "TOOL.HAND.EXIT",
            action: (e: CameraActionPayload) => setPointerDisplay(e, "none")
        },
        {
            eventName: CameraActions.ON_MOUSE_ENTER,
            actionName: "TOOL.HAND.ENTER",
            action: (e: CameraActionPayload) => setPointerDisplay(e, "initial")
        },
        {
            eventName: CameraActions.ON_SCROLL,
            actionName: "TOOL.HAND.SCROLL",
            action: onScroll
        }
    ];

    const activeSubtool = BrushSubtool.BRUSH;
    
    const subtools = [
        {
            key: BrushSubtool.BRUSH,
            name: "Brush",
            icon: <Paintbrush />
        }, 
    ]

    const settingsTemplate: Array<ToolFormComponent> = [
        {
            type: ToolFormComponents.SLIDER,
            handle: "brushSize",
            name: "Brush Size (px)",
            min: 1,
            max: 2000,
            defaultValue: 7,
            step: 1
        },
        {
            type: ToolFormComponents.SLIDER,
            handle: "brushOpacity",
            name: "Opacity (%)",
            min: 1,
            max: 100,
            defaultValue: 100,
            step: 1
        },
    ]


    return {toolPointer, name, actions, subtools, activeSubtool, settingsTemplate}
}