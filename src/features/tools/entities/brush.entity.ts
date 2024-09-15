import { Color } from "../../../types/color.types";
import { ToolBrushSettings } from "../slices/tools.slice";

export class Brush {
    private brushSettings: ToolBrushSettings;
    constructor(brushSettings?: Partial<ToolBrushSettings>) {
        this.brushSettings = {
            brushSize: 1,
            brushOpacity: 1,
            color: {r: 0, g: 0, b: 0, a: 1},
            ...brushSettings
        }
    }

    getOpacity() {
        return this.brushSettings.brushOpacity;
    }

    getSize() {
        return this.brushSettings.brushSize;
    }

    setSize(size: number) {
        this.brushSettings.brushSize = size;
    }

    setOpacity(opacity: number) {
        this.brushSettings.brushOpacity = opacity;
    }

    getColor() {
        return this.brushSettings.color;
    }

    setColor(color: Color) {
        this.brushSettings.color = color;
    }
}