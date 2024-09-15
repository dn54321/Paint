import { Color } from "../../../types/color.types";
import { Layers } from "./layer.types";

export interface SingleColorLayerJsonData {
    color: Required<Color>;
    type: Layers.SINGLE_COLOR;
    id: string;
    width: number;
    height: number;
}

export interface DenseLayerJsonData {
    width: number;
    height: number;
    //colorGrid: Uint8ClampedArray;
    type: Layers.DENSE;
    id: string;
} 

export interface SparseLayerJsonData {
    //colorGridMap: Map<number, Color>;
    width: number;
    height: number;
    type: Layers.SPARSE;
    id: string;
}



export type LayerData = SingleColorLayerJsonData | DenseLayerJsonData | SparseLayerJsonData;