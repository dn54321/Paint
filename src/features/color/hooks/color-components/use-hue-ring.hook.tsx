import { MutableRefObject, useEffect, useRef, useState } from "react";
import { MouseButtons } from "../../../../types/mouse.types";
import HueRingPointer from "../../components/particles/hue-ring-pointer/hue-ring-pointer.component";
import { move } from "../../utils/mouse-actions";
import { HsvColor } from "colord";

export interface HueRingOptions { 
    ringThickness: number, // Percentange of canvas
    color: HsvColor,
    setColor: (color: HsvColor) => void,
}

function drawHueRing(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: HueRingOptions
) {
    if (!canvasRef.current) {
        throw new Error("Canvas ref has not been properly initialised");
    }

    if (canvasRef.current.scrollWidth != canvasRef.current.scrollHeight) {
        console.log("Canvas must be a perfect square");
    }

    const ctx = canvasRef.current.getContext("2d");
    if (ctx === null) {
        throw new Error("ctx cannot be null");
    }
    const width = canvasRef.current.clientWidth*2;
    const height = canvasRef.current.clientHeight*2;


    const radius = width/2-1;
    const center = {x: width/2, y: height/2};
    for (let i = 0; i < 360; ++i) {
        const color = `hsl(${i}, 100%, 50%)`;
        const arcStart = -(i + 1) * Math.PI / 180;
        const arcEnd = -i * Math.PI / 180;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, arcStart, arcEnd);
        ctx.arc(center.x, center.y, radius-(width*options.ringThickness), arcEnd, arcStart, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
    }
}

function getPointerProps(
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: HueRingOptions
) {
    if (!canvasRef.current) {
        throw new Error("Canvas ref has not been properly initialised");
    }

    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};

    const rads = Math.PI/180*options.color.h;
    const radius = canvasDims.width*(0.5 - options.ringThickness*0.5);
    
    return {style: {transform: `
        translateX(${radius*Math.cos(rads)}px) 
        translateY(${-radius*Math.sin(rads)}px) 
        rotate(${-rads-Math.PI/2}rad)
    `}};
}

function setHueByMousePos(
    mouseEvent: MouseEvent, 
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: HueRingOptions,
) {
    if (!canvasRef.current) {
        return;
    }

    const mousePos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};
    const center = {x: canvasDims.width/2, y: canvasDims.height/2};
    const rads = Math.atan2(-(mousePos.y - center.y), mousePos.x - center.x);
    console.log(rads);
    options.setColor({...options.color, h: (360 + rads*180/Math.PI) % 360});
}

function isMouseWithinRing(
    mouseEvent: MouseEvent, 
    canvasRef: MutableRefObject<HTMLCanvasElement | null>, 
    options: HueRingOptions
) {
    if (!canvasRef.current) {
        return;
    }

    const mousePos = {x: mouseEvent.offsetX, y: mouseEvent.offsetY};
    const canvasDims = {width: canvasRef.current.clientWidth, height: canvasRef.current.clientHeight};
    const center = {x: canvasDims.width/2, y: canvasDims.height/2};
    const annulusOuterRadii = canvasDims.width/2 - 1;
    const annulusInnerRadii = annulusOuterRadii - options.ringThickness*canvasDims.width;
    const distanceFromCenter = Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.y - center.y, 2);
    return (distanceFromCenter <= Math.pow(annulusOuterRadii, 2) && distanceFromCenter >= Math.pow(annulusInnerRadii, 2));
}

export function useHueRing(canvasRef: MutableRefObject<HTMLCanvasElement | null>, options?: Partial<HueRingOptions>) {
    const colorRef = useRef(options?.color ?? {h: 180, s: 0, v: 0});
    const [pointerProps, setPointerProps] = useState({});
    const hueRingOptions: HueRingOptions = {
        ringThickness: 0.08,
        ...options,
        color: colorRef.current,
        setColor: (color: HsvColor) => {
            setPointerProps(getPointerProps(canvasRef, {...hueRingOptions, color}));
            colorRef.current = color;
        },
    }
    
    const HueRingComponent = () => <HueRingPointer width={0.1} height={0.1} {...pointerProps}/>
    const redrawHueRing = () => {
        //drawHueRing(canvasRef, hueOptions);
        setPointerProps(getPointerProps(canvasRef, hueRingOptions));
    }    


    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        drawHueRing(canvasRef, hueRingOptions);
        setPointerProps(getPointerProps(canvasRef, hueRingOptions));

    }, [canvasRef.current]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const onMouseDown = (event: MouseEvent) => {
            console.log("Hue wheel event triggered");
            if (event.button != MouseButtons.LEFT_CLICK) {
                return;
            }
    
            if (isMouseWithinRing(event, canvasRef, hueRingOptions)) {
                console.log("Detected mouse click in hue wheel. Updating hue pointer...");
                move(event, canvasRef, (e) => setHueByMousePos(e, canvasRef, hueRingOptions));
            }
        }

        const onMouseUp = () => {
            if (options?.color === colorRef.current) {
                return;
            }
            console.log("Persisting color " + JSON.stringify(colorRef.current));
            options?.setColor && options.setColor(colorRef.current);
        }

        canvasRef.current.addEventListener('mousedown', onMouseDown);
        canvasRef.current.addEventListener('mouseup', onMouseUp);
        return () => {
            if (!canvasRef.current) {
                return;
            }
            canvasRef.current.removeEventListener('mousedown', onMouseDown);
            canvasRef.current.removeEventListener('mouseup', onMouseUp);
        };

    }, [hueRingOptions, canvasRef.current]);

    useEffect(() => {
        if (canvasRef.current && options?.color) {
            setPointerProps(getPointerProps(canvasRef, {...hueRingOptions, color: options.color}));
            colorRef.current = options.color;
        }
    }, [options?.color]);



    return {
        color: hueRingOptions.color, 
        setColor: hueRingOptions.setColor, 
        HueRingPointer: HueRingComponent, 
        redrawHueRing
    }
}