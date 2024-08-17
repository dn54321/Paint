import { Color } from "../../../types/color.types";
import { Position } from "../../../types/geometry.types";

export enum Layers {
    DENSE = 'dense',
    SINGLE_COLOR = 'single_color',
    SPARSE = 'sparse',
}

export interface Layer {
    peek(pos: Position): Color
}