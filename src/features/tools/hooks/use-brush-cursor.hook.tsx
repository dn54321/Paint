
import { bresenhamCircleGenerator } from "../utils/math2d.utils";

export interface brushCursorProps {
    brushSize: number,
} 
export function useBrushCursor(brushSize: number) {
    if (typeof window === 'undefined') {
        return {uri: ''}
    }

    const canvas = document.createElement("canvas");
    const canvasSize = brushSize + 21;
    const center = Math.floor(canvasSize/2);
    const crosshairCenterOffset = 5;
    const crosshairLength = 8;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error("ctx object is undefined");
    }

    canvas.width = canvasSize;
    canvas.height =  canvasSize;
        
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
    if (brushSize < 3) {
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

    const dataURL = canvas.toDataURL();
    return {uri: `url(${dataURL}) ${center} ${center}`};
}