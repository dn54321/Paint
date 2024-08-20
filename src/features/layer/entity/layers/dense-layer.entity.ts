import { Color } from "../../../../types/color.types";
import { Position } from "../../../../types/geometry.types";
import { Drawable, Erasable } from "../../../../types/surface.types";
import { Layer } from "../../types/layer.types";

/**
 * Time Complexity
 * Peek: O(c)
 * Draw: O(c)
 * Erase: O(c)
 * 
 * Space Complexity: O(l*h)
 */

export class DenseLayer implements Layer, Drawable, Erasable {
    // private colorGrid: Array<Array<Color | undefined>>;
    private colorGrid: Uint8ClampedArray;
    private width: number;
    private height: number;
    constructor(height: number, width: number) {
        this.colorGrid = new Uint8ClampedArray(height*width*4);
        this.height = height;
        this.width = width;
    }

    draw(pos: Position, color: Color): void {
        const index = pos.y*this.width*4 + pos.x;
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

    getImage() {
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