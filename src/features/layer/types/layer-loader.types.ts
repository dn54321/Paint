import { Color } from "../../../types/color.types";

export interface SingleColorLayerData {
    color: Color;
}

export interface DenseLayerData {
    colorGrid: Array<Array<Color | undefined>>
} 

export interface SparseLayerData {
    colorGridMap: Record<number, Color>;
    width: number;
    height: number;
}

export type LayerData = SingleColorLayerData | DenseLayerData | SparseLayerData;