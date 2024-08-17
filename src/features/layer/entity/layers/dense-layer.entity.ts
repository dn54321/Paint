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
    private colorGrid: Array<Array<Color | undefined>>
    
    constructor(height: number, width: number) {
        this.colorGrid = Array(height).fill(Array(width));
    }

    draw(pos: Position, color: Color): void {
        this.colorGrid[pos.y][pos.x] = color;
    }

    peek(pos: Position): Color {
        const color = this.colorGrid[pos.y][pos.x];
        return color ?? {r: 0, g: 0, b: 0, a: 0};
    }

    erase(pos: Position): void {
        this.colorGrid[pos.y][pos.x] = undefined;
    }
}