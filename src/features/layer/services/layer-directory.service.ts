import { LayerFileSystem } from "../entity/layer-file-system.entity";
import { LayerLeafNode } from "../entity/path-nodes/layer-node.entity";
import { LayerPathNode } from "../entity/path-nodes/layer-path-node.entity";
import { Layer } from "../types/layer.types";

export class LayerDirectoryService {
    createLayerSystem(): LayerFileSystem {
        return new LayerFileSystem();
    }

    createLayerNode(name: string, layer: Layer): LayerLeafNode {
        return new LayerLeafNode(name, layer);
    }

    createFolderNode(name: string): LayerPathNode {
        return new LayerPathNode(name);
    }
}