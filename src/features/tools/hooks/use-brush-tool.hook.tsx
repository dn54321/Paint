import { hsvaToRgba } from "@uiw/color-convert";
import { Paintbrush } from "lucide-react";
import { useRef } from "react";
import useBoundStore from "../../../hooks/use-bound-store";
import { Color } from "../../../types/color.types";
import { Position } from "../../../types/geometry.types";
import { MouseButtons } from "../../../types/mouse.types";
import { useColor } from "../../color/hooks/use-color.hook";
import { DisplayActions, MouseDisplayActionPayload, ScrollDisplayActionPayload } from "../../display/types/camera-action.types";
import { CircleBrush } from "../entities/circle-brush.entity";
import { ToolFormComponent, ToolFormComponents } from "../types/tool-forms.types";
import { ToolHookResponse, Tools } from "../types/tool.types";

export enum HandToolPointer {
    DEFAULT = 'grab',
    GRAB = 'grabbing'
}

export enum BrushSubtool {
    BRUSH = "none"
}

export interface brushToolSettings {
    brushSize: string, 
    brushColor: Color,
    

}

export function useBrushTool(): ToolHookResponse {
    const toolPointer = BrushSubtool.BRUSH;
    const name = Tools.BRUSH;
    const mousePos = useRef<Position>({x:0, y:0});
    const scrollPos = useRef<Position>({x:0, y:0});
    const buffer = useRef<Set<number>>(new Set<number>());
    const isMouseDown = useRef(false);
    const brush = useRef(new CircleBrush());
    const brushState = useBoundStore(state => state.brushState);

    const {color} = useColor();

    // function drawPixel(buffer: ImageData, bufferDimension: Dimension) {
    //     return (position: Position, color: Color) => {
    //         if (position.x < 0 
    //             || position.x > bufferDimension.width 
    //             || position.y < 0
    //             || position.y > bufferDimension.height
    //         ) {
    //             return;
    //         }
    //             const idx = 4*(position.y*bufferDimension.width + position.x);
    //             // const alpha = (color.a ?? 255)/255;
    //             // buffer.data[idx+0] = color.r * alpha + (1 - alpha) * buffer.data[idx+0];
    //             // buffer.data[idx+1] = color.g * alpha + (1 - alpha) * buffer.data[idx+1];
    //             // buffer.data[idx+2] = color.b * alpha + (1 - alpha) * buffer.data[idx+2];
    //             // buffer.data[idx+3] = 255;
    //             buffer.data[idx+0] = color.r;
    //             buffer.data[idx+1] = color.g;
    //             buffer.data[idx+2] = color.b;
    //             buffer.data[idx+3] = color.a ?? 1;
    //     }
    // }




    function draw({boardRef, scene, surfaceMousePos}: MouseDisplayActionPayload) {
        const boardCtx = boardRef.current?.getContext('2d');

        if (!boardCtx) {
            return;
        }


        const surfaceDimensions = scene.getSurface().getDimensions();
        const brushRadius = Math.round(brushState.settings.brushSize/2);
        const brushOpacity = Math.round(brushState.settings.brushOpacity);
        const brushSize = brushRadius*2;
        const brushColor = hsvaToRgba(color);

        brush.current.setSize(brushSize);
        brush.current.setColor({...brushColor, a: brushOpacity/100*255});
        brush.current.setBufferDimension(surfaceDimensions);

        const surface = scene.getSurface();
        const surfaceIntegerMousePos = {x: Math.round(surfaceMousePos.x), y: Math.round(surfaceMousePos.y)};


        brush.current.draw(surfaceIntegerMousePos, (pos: Position, color: Color) => {
            surface.draw(pos, color);
        });

        const arr = surface.getBitmap();
        const imgData = new ImageData(arr, surfaceDimensions.width, surfaceDimensions.height);
        boardCtx.putImageData(imgData, 0, 0);
    }


    function onMouseMove(payload: MouseDisplayActionPayload) {
        const {event, cursorRef, viewportRef} = payload;
        if (!cursorRef?.current || !viewportRef?.current) {
            return;
        }

        const mouseX = Math.floor(event.offsetX);
        const mouseY = Math.floor(event.offsetY);
        
        if (isMouseDown.current === true) {
            draw(payload);
        }

        mousePos.current = {x: mouseX, y: mouseY};
        scrollPos.current = {x: viewportRef.current.scrollLeft, y: viewportRef.current.scrollTop}
    }

    function onMouseDown(payload: MouseDisplayActionPayload) {
        if (payload.event.button != MouseButtons.LEFT_CLICK) {
            return;
        }

        isMouseDown.current = true;
        draw(payload);
    }

    function onMouseUp() {
        isMouseDown.current = false;
        brush.current.brushUp();
        buffer.current.clear();
    }

    function onScroll({cursorRef, viewportRef}: ScrollDisplayActionPayload) {
        if (!viewportRef?.current || !cursorRef?.current) {
            return;
        }
        const x = mousePos.current.x + viewportRef.current.scrollLeft - scrollPos.current.x;
        const y = mousePos.current.y + viewportRef.current.scrollTop - scrollPos.current.y;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }


    function setPointerDisplay({cursorRef}: MouseDisplayActionPayload, display: string) {
        if (!cursorRef?.current) {
            return;
        }
        cursorRef.current.style.display = display;
    }

    const actions = [
        {
            eventName: DisplayActions.ON_MOUSE_MOVE,
            actionName: "TOOL.BRUSH.MOVE",
            action: onMouseMove
        },
        {
            eventName: DisplayActions.ON_MOUSE_EXIT,
            actionName: "TOOL.BRUSH.EXIT",
            action: (e: MouseDisplayActionPayload) => {
                setPointerDisplay(e, "none"); 
                onMouseUp();
            }
        },
        {
            eventName: DisplayActions.ON_MOUSE_ENTER,
            actionName: "TOOL.BRUSH.ENTER",
            action: (e: MouseDisplayActionPayload) => setPointerDisplay(e, "initial")
        },
        {
            eventName: DisplayActions.ON_SCROLL,
            actionName: "TOOL.BRUSH.SCROLL",
            action: onScroll
        },
        {
            eventName: DisplayActions.ON_MOUSE_DOWN,
            actionName: "TOOL.BRUSH.CLICK",
            action: onMouseDown
        },
        {
            eventName: DisplayActions.ON_MOUSE_UP,
            actionName: "TOOL.BRUSH.CLICK",
            action: onMouseUp
        },
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