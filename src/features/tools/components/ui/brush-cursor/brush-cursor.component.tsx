import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { bresenhamCircleGenerator } from "../../../utils/math2d.utils";

export interface BrushCursorProps {
    size: number;
    style?: React.CSSProperties;
}


export const BrushCursor = forwardRef(function BrushCursor(
    props: BrushCursorProps,
    ref: React.ForwardedRef<HTMLCanvasElement | undefined>
) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const brushSize = Math.ceil(props.size); 
    const canvasSize = brushSize + 21;
    const center = Math.floor(canvasSize/2);
    const crosshairCenterOffset = 5;
    const crosshairLength = 8;
    useImperativeHandle(ref, () => canvasRef.current!);
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d');

        if (!ctx) {
            throw new Error("ctx object is undefined");
        }

        canvasRef.current.width = canvasSize;
        canvasRef.current.height =  canvasSize;
        canvasRef.current.style.width = `${canvasSize}px`;
        canvasRef.current.style.height = `${canvasSize}px`;
        
        const circleArr = new Uint8ClampedArray(canvasSize*canvasSize*4);
        for (const point of bresenhamCircleGenerator({x: center, y: center}, Math.round(brushSize/2))) {
            const idx = 4*(point.y*canvasSize + point.x);
            circleArr[idx+0] = 255;
            circleArr[idx+1] = 255;
            circleArr[idx+2] = 255;
            circleArr[idx+3] = 255;
        }
        
        const circleImage = new ImageData(circleArr, canvasSize, canvasSize);
        ctx.putImageData(circleImage, 0, 0);
        if (props.size < 3) {
            ctx.imageSmoothingEnabled
            ctx.strokeStyle = "white";
            ctx.lineWidth = 0;
            ctx.translate(0.5, 0.5);

            ctx.beginPath();
            ctx.moveTo(center + crosshairCenterOffset, center);
            ctx.lineTo(center + crosshairCenterOffset + crosshairLength, center); 
            ctx.stroke(); 

            ctx.beginPath();
            ctx.moveTo(center - crosshairCenterOffset, center);
            ctx.lineTo(center - crosshairCenterOffset - crosshairLength, center); 
            ctx.stroke(); 

            ctx.beginPath();
            ctx.moveTo(center, center + crosshairCenterOffset);
            ctx.lineTo(center, center + crosshairCenterOffset + crosshairLength); 
            ctx.stroke(); 

            ctx.beginPath();
            ctx.moveTo(center, center - crosshairCenterOffset);
            ctx.lineTo(center, center - crosshairCenterOffset - crosshairLength); 
            ctx.stroke(); 
        }

    }, [canvasRef, props.size]);

    return (
        <canvas ref={canvasRef} className="absolute pointer-events-none mix-blend-difference hidden" style={{
            left: `-${canvasSize/2}px`,
            top: `-${canvasSize/2}px`,
            imageRendering: "pixelated",

            ...props.style
        }}/>    
    )
})