import { useEffect, useRef, useState } from "react";
import { useColorSquare } from "../../../hooks/color-components/use-color-square.hook";
import { useHueRing } from "../../../hooks/color-components/use-hue-ring.hook";
import { useColor } from "../../../hooks/use-color.hook";

export function CircleColorWheel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState<number>(-1);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
        });

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => {
            canvasRef.current && observer.unobserve(canvasRef.current);
        };
    }, []);


    const {color, setColor} = useColor();
    const {HueRingPointer, redrawHueRing, color: HueRingColor} = useHueRing(canvasRef, {color, setColor});
    const {SquarePointer, redrawColorSquare} = useColorSquare(canvasRef, {color: HueRingColor, setColor});
    useEffect(() => {
        if (canvasRef.current) {
            redrawColorSquare();
            redrawHueRing();
        }
    }, [canvasRef, width]);

    return (
        <div className="aspect-square w-full p-5 color max-w-60 select-none">
            <div className="relative w-full h-full">
                <canvas ref={canvasRef} width="400" height="400" className="w-full h-full" />
                <SquarePointer/>
                <HueRingPointer/>
            </div>
        </div>
    )
}