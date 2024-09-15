import { LayerLeafNode } from "../entity/path-nodes/layer-node.entity";
import { LayerPathNode } from "../entity/path-nodes/layer-path-node.entity";
import { LayerData } from "./layer-loader.types";

export interface LayerLeafNodeData {
    name: string;
    layer: LayerData;
    type: LayerDirectoryNodes.ITEM;
    id: string;
    parent?: string;
}

export interface LayerPathNodeData {
    name: string;
    type: LayerDirectoryNodes.FOLDER;
    id: string;
    parent?: string;
}

export enum LayerDirectoryNodes {
    FOLDER = "folder",
    ITEM = "item",
}

export enum LayerDirectoryOperations {
    INSERT = "insert",
    REMOVE = "remove"
}

export type LayerNode = LayerLeafNode | LayerPathNode;
export type LayerNodeData = LayerLeafNodeData | LayerPathNodeData;
export type LayerDirectoryData = Array<LayerNodeData>