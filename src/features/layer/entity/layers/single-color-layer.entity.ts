import { Color } from "../../../../types/color.types";
import { Layer } from "../../types/layer.types";

/**
 * Time Complexity
 * Peek: O(c)
 * Draw: O(c)
 * Erase: O(c)
 * Space Complexity: O(c)
 */


export class SingleColorLayer implements Layer {
    private color: Color;
    constructor() {
        this.color = {r: 0, g: 0, b: 0, a: 0}
    }

    fill(color: Color): void {
        this.color = color;
    }

    peek(): Color {
        return this.color ?? {r: 0, g: 0, b: 0, a: 0};
    }
}