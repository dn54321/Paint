import { colord, HsvColor } from "colord";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MouseButtons } from "../../../../types/mouse.types";
import { boundBetween } from "../../../../utils/math";
import { move } from "../../utils/mouse-actions";
import CirclePointer from "../../components/particles/circle-pointer.component.tsx/circle-pointer.component";

export interface ColorSquareOptions { 
    length: number, // Percentange of canvas
    ringRadius: number, // Percentange of canvas
    color: HsvColor;
    setColor: (color: HsvColor) => void;
}

function drawColorSquare(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: ColorSquareOptions
) {
    if (!canvasRef.current) {
        throw new Error("Canvas ref has not been properly initialised");
    }

    const ctx = canvasRef.current.getContext("2d");
    if (ctx === null) {
        throw new Error("ctx cannot be null");
    }
    const width = canvasRef.current.clientWidth*2;
    const height = canvasRef.current.clientHeight*2;
    const center = {x: width/2, y: height/2};
    const squareLength = width*options.length;
    const halfSquareLength = squareLength*0.5;
    const topLeftCorner = {x: center.x-halfSquareLength, y:  center.x-halfSquareLength};

    // draw square
    const imageData = ctx.createImageData(101, 101);
    const { data } = imageData;

    for (let i = 0; i <= 100; ++i) { // y
        for (let j = 0; j <= 100; ++j) { // x
            const index = (i * 101 + j) * 4;
            const rgb = colord({h: options.color.h, s: j, v: 100-i}).toRgb();
            data[index] = rgb.r;
            data[index+1] = rgb.g;
            data[index+2] = rgb.b;
            data[index+3] = 255;
        }
    }

    createImageBitmap(imageData).then(
        renderer => ctx.drawImage(renderer, topLeftCorner.x, topLeftCorner.y, squareLength, squareLength )
    );
}

function setColorByMouse(
    mouseEvent: MouseEvent, 
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    options: ColorSquareOptions
) {
    if (!canvasRef.current) {
        throw new Error("Canvas ref has not been properly initialised");
    }

    const mousePos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};
    const squareWidth = canvasDims.width*options.length;
    const halfSquareWidth = squareWidth/2;
    const center = {x: canvasDims.width/2, y: canvasDims.height/2};
    const yPercentage = mousePos.y-center.y+halfSquareWidth;
    const xPercentage = mousePos.x-center.x+halfSquareWidth;
    const value = boundBetween(Math.floor(yPercentage*100/squareWidth),0,100);
    const saturation = boundBetween(Math.floor(xPercentage*100/squareWidth),0,100);
    options.setColor({...options.color, s: saturation, v: value});
}

function getPointerProps(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: ColorSquareOptions
) {
    if (!canvasRef.current) {
        throw new Error("Canvas ref has not been properly initialised");
    }

    const {s, v} = options.color;
    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};
    const squareLength = canvasDims.width*options.length;
    const ringRadius = canvasDims.width*options.ringRadius;
    const halfSquareLength = squareLength/2;
    const halfRingRadius = ringRadius/2;
    const center = {x: canvasDims.width/2, y: canvasDims.height/2};
    const topLeft = {x: center.x-halfSquareLength, y: center.y-halfSquareLength};
    const x = topLeft.x + squareLength*s/100 - halfRingRadius;
    const y = topLeft.y + squareLength*v/100 - halfRingRadius;
    return {style: {transform: `translateX(${x}px) translateY(${y}px)`}};
}


function isMouseWithinSquare(
    mouseEvent: MouseEvent, 
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: ColorSquareOptions
) {
    if (!canvasRef.current) {
        return;
    }

    const mousePos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};
    const center = {x: canvasDims.width/2, y: canvasDims.height/2};
    const halfSquareLength = options.length*canvasDims.width/2;

    if (mousePos.x < center.x - halfSquareLength || mousePos.x > center.x + halfSquareLength) {
        return false;
    }

    if (mousePos.y < center.y - halfSquareLength || mousePos.y > center.y + halfSquareLength) {
        return false;
    }

    return true;
}

export function useColorSquare(canvasRef: MutableRefObject<HTMLCanvasElement | null>, options?: Partial<ColorSquareOptions>) {
    const [pointerProps, setPointerProps] = useState({});

    const colorRef = useRef(options?.color ?? {h: 180, s: 0, v: 0});
    const colorSquareOptions = {
        ringRadius: 0.05,
        length: 0.5,
        ...options,
        color: colorRef.current,
        setColor: (color: HsvColor) => {
            setPointerProps(getPointerProps(canvasRef, {...colorSquareOptions, color}));
            colorRef.current = color;
        },
    };
    const SquarePointer = () => <CirclePointer radius={colorSquareOptions.ringRadius} {...pointerProps}/>
    const recalculatePointerPosition = () => {
        setPointerProps(getPointerProps(canvasRef, colorSquareOptions));
    }
    const drawColorSquareHOC = () => recalculatePointerPosition();

    useEffect(() => {
        if (!canvasRef.current) {
            console.log("Failed ref");
            return;
        }
        const onMouseDown = (event: MouseEvent) => {
            if (event.button != MouseButtons.LEFT_CLICK) {
                return;
            }
    
            if (isMouseWithinSquare(event, canvasRef, colorSquareOptions)) {
                console.log("Detected mouse click in color square. Updating color pointer...");
                move(event, canvasRef, (e) => setColorByMouse(e, canvasRef, colorSquareOptions));
            }
        }

        const onMouseUp = () => {
            if (options?.color === colorRef.current) {
                return;
            }
            console.log("Persisting color " + JSON.stringify(colorRef.current));
            options?.setColor && options.setColor(colorRef.current);
        }

        drawColorSquare(canvasRef, colorSquareOptions);
        canvasRef.current.addEventListener('mousedown', onMouseDown);
        canvasRef.current.addEventListener('mouseup', onMouseUp);
        canvasRef.current.addEventListener('resize', () => console.log("RESIZED"));
        return () => {
            if (!canvasRef.current) {
                return;
            }
            canvasRef.current.removeEventListener('mousedown', onMouseDown);
            canvasRef.current.removeEventListener('mouseup', onMouseUp);
            canvasRef.current.removeEventListener('resize', recalculatePointerPosition);
        };
    }, [canvasRef.current, colorRef.current.h]);


    useEffect(() => {
        drawColorSquare(canvasRef, colorSquareOptions);
    }, [colorSquareOptions.color.h]);

    useEffect(() => {
        if (options?.color && options.color != colorSquareOptions.color) {
            colorRef.current = options.color;
            const props = getPointerProps(canvasRef, colorSquareOptions);
            setPointerProps(props);
        }
    }, [options?.color]);

    return {
        setColor: colorSquareOptions.setColor, 
        color: colorSquareOptions.color, 
        SquarePointer, 
        redrawColorSquare: drawColorSquareHOC
    }
}