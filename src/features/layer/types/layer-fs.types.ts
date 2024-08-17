import { Layer } from "./layer.types";

export interface LayerNode {
    name: string
    layer: Layer
}

export interface PathNode {
    name: string;
    children: Array<PathNode | LayerNode>
}

export interface RootNode extends PathNode {
    name: "root",
    children: []
}

export interface LayerFileStructure {
    root: RootNode
}