import { LayerData } from "./layer-loader.types";

export interface LayerDataLeafNode {
    name: string
    layer: LayerData
}

export interface LayerDataPathNode {
    name: string;
    children: Array<LayerDataPathNode | LayerDataLeafNode>
}