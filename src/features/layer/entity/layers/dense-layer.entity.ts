
import { Color } from "../../../../types/color.types";
import { Dimension, Position } from "../../../../types/geometry.types";
import { Drawable, Erasable } from "../../../../types/surface.types";
import { Persistable } from "../../../../types/writable.types";
import { DenseLayerJsonData } from "../../types/layer-loader.types";
import { Layer, Layers } from "../../types/layer.types";
import { createId } from "@paralleldrive/cuid2";

/**
 * Time Complexity
 * Peek: O(c)
 * Draw: O(c)
 * Erase: O(c)
 * 
 * Space Complexity: O(l*h)
 */

export interface DenseLayerData {
    colorGrid: Uint8ClampedArray;
    id: string;
}

export class DenseLayer implements Layer, Drawable, Erasable, Persistable<DenseLayerJsonData> {
    private colorGrid: Uint8ClampedArray;
    private width: number;
    private height: number;
    private id: string;
    constructor(dimension: Dimension, data?: Partial<DenseLayerData>) {
        this.height = dimension.height;
        this.width = dimension.width;
        this.colorGrid = data?.colorGrid ?? new Uint8ClampedArray(this.height*this.width*4);
        this.id = data?.id ?? createId();
    }

    toJson(): DenseLayerJsonData {
        return {
            width: this.width,
            height: this.height,
          //  colorGrid: this.colorGrid,
            type: Layers.DENSE,
            id: this.id,
        }
    }


    draw(pos: Position, color: Color): void {
        const index = (pos.y * this.width + pos.x) * 4;
        this.colorGrid[index] = color.r;
        this.colorGrid[index + 1] = color.g;
        this.colorGrid[index + 2] = color.b;
        this.colorGrid[index + 3] = color.a ?? 255;
    }

    peek(pos: Position): Color {
        const index = (pos.y * this.width + pos.x) * 4;
        return {
            r: this.colorGrid[index], 
            g: this.colorGrid[index+1], 
            b: this.colorGrid[index+2], 
            a: this.colorGrid[index+3]
        };
    }

    getId(): string {
        return this.id;
    }

    getBitmap() {
        return this.colorGrid;
    }

    erase(pos: Position): void {
        const index = (pos.y * this.width + pos.x) * 4;
        this.colorGrid[index] = 0;
        this.colorGrid[index + 1] = 0;
        this.colorGrid[index + 2] = 0;
        this.colorGrid[index + 3] = 0;
    }
}