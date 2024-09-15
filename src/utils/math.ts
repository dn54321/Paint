import { Dimension, Position } from "../types/geometry.types";

export function boundBetween(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function isPositionEqual(pos1: Position, pos2: Position) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function isDimensionEqual(dim1: Dimension, dim2: Dimension) {
    return dim1.width === dim2.width && dim1.height === dim2.height;
}