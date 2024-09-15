import { Color } from "../../../types/color.types";
import { Position } from "../../../types/geometry.types";
import { DenseLayer } from "../entity/layers/dense-layer.entity";
import { SingleColorLayer } from "../entity/layers/single-color-layer.entity";
import { SparseLayer } from "../entity/layers/sparse-layer.entity";

export enum Layers {
    DENSE = 'dense',
    SINGLE_COLOR = 'single_color',
    SPARSE = 'sparse',
}

export type LayersMap<T> = 
    T extends Layers.DENSE ? DenseLayer :
    T extends Layers.SINGLE_COLOR ? SingleColorLayer :
    T extends Layers.SPARSE ? SparseLayer :
    never;


export interface Layer {
    peek(pos: Position): Color
    getBitmap(): Uint8ClampedArray
    getId(): string
}

