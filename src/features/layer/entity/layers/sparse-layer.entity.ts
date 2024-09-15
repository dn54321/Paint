import { createId } from "@paralleldrive/cuid2";
import { Color } from "../../../../types/color.types";
import { Dimension, Position } from "../../../../types/geometry.types";
import { Drawable, Erasable } from "../../../../types/surface.types";
import { Persistable } from "../../../../types/writable.types";
import { SparseLayerJsonData } from "../../types/layer-loader.types";
import { Layer, Layers } from "../../types/layer.types";

/**
 * Time Complexity
 * Peek: O(c)
 * Draw: O(c)
 * Erase: O(c)
 * 
 * Space Complexity: O(l*h)
 */

export interface SparseLayerData {
    id: string,
    colorGridMap: Map<number, Color>
}

export class SparseLayer implements Layer, Drawable, Erasable, Persistable<SparseLayerJsonData> {
    private colorGridMap: Map<number, Color>;
    private width: number;
    private height: number;
    private id: string;
    constructor(dimension: Dimension, data?: Partial<SparseLayerData>) {
        this.width = dimension.width;
        this.height = dimension.height;
        this.colorGridMap = data?.colorGridMap ?? new Map();
        this.id = data?.id ?? createId();
    }

    draw(pos: Position, color: Color): void {
        const key = 4*(pos.y*this.width+pos.x);
        this.colorGridMap.set(key, color);
    }

    peek(pos: Position): Color {
        const key = 4*(pos.y*this.width+pos.x);
        return this.colorGridMap.get(key) ?? {r: 0, g: 0, b: 0, a: 0};
    }

    erase(pos: Position): void {
        const key = pos.y*this.width+pos.x;
        this.colorGridMap.delete(key);
    }

    getId() {
        return this.id
    }

    getBitmap() {
        const arr = new Uint8ClampedArray(this.height*this.width*4);
        this.colorGridMap.forEach((v,pos) => {
            const key = pos;
            arr[key] = v.r;
            arr[key+1] = v.g;
            arr[key+2] = v.b;
            arr[key+3] = v.a ?? 255;
        });

        return arr;
    }

    toJson(): SparseLayerJsonData {
        return {
           // colorGridMap: this.colorGridMap,
            width: this.width,
            height: this.height,
            type: Layers.SPARSE,
            id: this.id,
        }
    }
}