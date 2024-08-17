import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

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
    const canvasSize = brushSize + (brushSize % 2) + 11;
    const center = Math.floor(canvasSize/2)+1;
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
        ctx.beginPath();
        ctx.arc(center, center, props.size/2, 0, 2 * Math.PI);
        ctx.strokeStyle = "white";
        ctx.stroke();

    }, [canvasRef, props.size]);

    return (
        <canvas ref={canvasRef} className="absolute pointer-events-none mix-blend-difference" style={{
            left: `-${canvasSize/2}px`,
            top: `-${canvasSize/2}px`,
            ...props.style
        }}/>    
    )
})