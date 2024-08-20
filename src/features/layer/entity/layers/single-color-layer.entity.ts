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
    private color: Required<Color>;
    constructor() {
        this.color = {r: 0, g: 0, b: 0, a: 0}
    }

    fill(color: Color): void {
        this.color = {a:255, ...color};
    }

    peek(): Color {
        return this.color ?? {r: 0, g: 0, b: 0, a: 0};
    }

    getImage() {
        const arr = new Uint8ClampedArray(4);
        arr[0] = this.color.r;
        arr[1] = this.color.g;
        arr[2] = this.color.b;
        arr[3] = this.color.a!;
        return arr;
    }
}