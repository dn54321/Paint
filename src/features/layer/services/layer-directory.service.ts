import { injectable } from "inversify";
import { LayerDirectory } from "../entity/layer-directory.entity";
import { LayerLeafNode } from "../entity/path-nodes/layer-node.entity";
import { LayerPathNode } from "../entity/path-nodes/layer-path-node.entity";
import { Layer } from "../types/layer.types";

@injectable()
export class LayerDirectoryService {
    createLayerSystem(): LayerDirectory {
        return new LayerDirectory();
    }

    createLayerNode(name: string, layer: Layer): LayerLeafNode {
        return new LayerLeafNode(name, layer);
    }

    createFolderNode(name: string): LayerPathNode {
        return new LayerPathNode(name);
    }
}