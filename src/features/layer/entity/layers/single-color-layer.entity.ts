import { createId } from "@paralleldrive/cuid2";
import { Color } from "../../../../types/color.types";
import { Persistable } from "../../../../types/writable.types";
import { SingleColorLayerJsonData } from "../../types/layer-loader.types";
import { Layer, Layers } from "../../types/layer.types";
import { Dimension } from "../../../../types/geometry.types";

/**
 * Time Complexity
 * Peek: O(c)
 * Draw: O(c)
 * Erase: O(c)
 * Space Complexity: O(c)
 */

export interface SingleColorLayerData {
    id: string,
    color: Required<Color>
}


export class SingleColorLayer implements Layer, Persistable<SingleColorLayerJsonData>  {
    private color: Required<Color>;
    private id: string;
    private width: number;
    private height: number;
    constructor(dimension: Dimension, data?: Partial<SingleColorLayerData>) {
        this.width = dimension.width;
        this.height = dimension.height;
        this.color = data?.color ?? {r: 0, g: 0, b: 0, a: 0};
        this.id = data?.id ?? createId();
    }

    fill(color: Color): void {
        this.color = {a:255, ...color};
    }

    peek(): Color {
        return this.color ?? {r: 0, g: 0, b: 0, a: 0};
    }

    getBitmap() {
        const arrLength = this.height*this.width*4;
        const arr = new Uint8ClampedArray(arrLength);
        for (let i = 0; i < arrLength; i += 4) {
            arr[i] = this.color.r;
            arr[i+1] = this.color.g;
            arr[i+2] = this.color.b;
            arr[i+3] = this.color.a!;
        }
 
        return arr;
    }

    getId() {
        return this.id;
    }

    toJson(): SingleColorLayerJsonData {
        return {
            color: this.color,
            type: Layers.SINGLE_COLOR,
            id: this.id,
            width: this.width,
            height: this.height
        }
    }

}