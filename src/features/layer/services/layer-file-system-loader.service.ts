import { LayerFileSystem } from "../entity/layer-file-system.entity";
import { LayerLeafNode } from "../entity/path-nodes/layer-node.entity";
import { LayerPathNode } from "../entity/path-nodes/layer-path-node.entity";
import { LayerDataLeafNode, LayerDataPathNode } from "../types/layer-fs-data.types";
import { LayerFileStructure, PathNode, RootNode } from "../types/layer-fs.types";
import { LayerData } from "../types/layer-loader.types";
import { LayerStoreLoaderService } from "./layer-store-loader.service";

export class LayerFileSystemStoreLoaderService {
    private layerStoreLoaderService: LayerStoreLoaderService;
    constructor() {
        this.layerStoreLoaderService = new LayerStoreLoaderService();
    }
    load(layerFileStructure: LayerFileStructure) {
        const rootNode = this.loadNode(layerFileStructure.root) as PathNode as RootNode;
        return new LayerFileSystem(rootNode);
    }

    private loadNode(node: LayerDataLeafNode | LayerDataPathNode) {
        if ("layer" in node) {
            const layer = this.layerStoreLoaderService.load(node.layer as unknown as LayerData);
            return new LayerLeafNode(node.name, layer);
        }

        else if ("children" in node) {
            const pathNode = new LayerPathNode(node.name);
            const childNodes = node.children.map((childNode) => this.loadNode(childNode));
            for (const childNode of childNodes) {
                pathNode.addNode(childNode);
            }

            return pathNode;
        }

        throw new Error("Received unexpected error");
    }
}