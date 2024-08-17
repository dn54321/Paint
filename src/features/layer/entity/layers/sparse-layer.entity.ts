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

export class SparseLayer implements Layer, Drawable, Erasable {
    private colorGridMap: Map<number, Color>;
    private width: number;
    private height: number;
    constructor(height: number, width: number) {
        this.width = width;
        this.height = height;
        this.colorGridMap = new Map();
    }

    draw(pos: Position, color: Color): void {
        const key = pos.y*this.width+pos.x;
        this.colorGridMap.set(key, color);
    }

    peek(pos: Position): Color {
        const key = pos.y*this.width+pos.x;
        return this.colorGridMap.get(key) ?? {r: 0, g: 0, b: 0, a: 0};

    }

    erase(pos: Position): void {
        const key = pos.y*this.width+pos.x;
        this.colorGridMap.delete(key);
    }
}