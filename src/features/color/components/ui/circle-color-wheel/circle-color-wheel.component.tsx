import { useEffect, useRef, useState } from "react";
import { useColorSquare } from "../../../hooks/color-components/use-color-square.hook";
import { useHueRing } from "../../../hooks/color-components/use-hue-ring.hook";
import { HsvaColor, HsvColor } from "colord";

export interface CircleColorWheelProps {
    color: HsvColor,
    setColor: (color: HsvColor | HsvaColor) => void,
}


export function CircleColorWheel(props: Partial<CircleColorWheelProps>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState<HsvColor>({h: 180, s: 0, v: 0})
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


    const colorSettings = {
        color,
        setColor,
        ...props
    }

    const {HueRingPointer, redrawHueRing} = useHueRing(canvasRef, colorSettings);
    const {SquarePointer, redrawColorSquare} = useColorSquare(canvasRef, colorSettings);
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