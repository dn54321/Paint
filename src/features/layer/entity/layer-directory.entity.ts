
import { Layer } from "../types/layer.types";
import { LayerLeafNode } from "./path-nodes/layer-node.entity";
import { LayerPathNode } from "./path-nodes/layer-path-node.entity";
import { LayerDirectoryOperations } from "../types/layer-directory.types";

export class LayerDirectory {
    private root: LayerPathNode;
    private layerNodeMap: Map<string, LayerLeafNode>;

    constructor(rootNode?: LayerPathNode) {
        this.root = rootNode ?? new LayerPathNode('root');
        this.layerNodeMap = new Map();
        this.indexTree(this.root);
    }

    private indexTree(node: LayerPathNode, operation=LayerDirectoryOperations.INSERT) {
        for (const child of node.getChildren()) {
            if (child instanceof LayerLeafNode) {
                if (operation === LayerDirectoryOperations.INSERT) {
                    this.layerNodeMap.set(child.layer.getId(), child);
                }

                else if (operation === LayerDirectoryOperations.REMOVE) {
                    this.layerNodeMap.delete(child.layer.getId());
                }
            }
            else if (child instanceof LayerPathNode) {
                this.indexTree(node);
            }
        }
    }

    private tranverseTree(path: Array<string>) {
        return path.reduce<LayerPathNode>((parent: LayerPathNode, nextPath: string) => {
            const nextSegment = parent.children
                .filter(child => child instanceof LayerPathNode)    
                .find(child => child.name === nextPath);

            if (nextSegment === undefined) {
                throw new Error("Invalid Layer Path.");
            }

            return (nextSegment ?? parent) as LayerPathNode;
        }, this.root);
    }

    private addNode(path: Array<string>, layerNode: LayerLeafNode | LayerPathNode, index?: number) {
        const pathNode = this.tranverseTree(path);
        const spliceIndex = index === undefined ? pathNode.children.length : index;
        pathNode.children.splice(spliceIndex, 0, layerNode);

        if (layerNode instanceof LayerLeafNode) {
            const layer = layerNode.getLayer();
            this.layerNodeMap.set(layer.getId(), layerNode);
        }
    }

    addLayer(path: Array<string>, layerNode: LayerLeafNode, index?: number) {
        this.addNode(path, layerNode, index);
        const layer = layerNode.layer;
        this.layerNodeMap.set(layer.getId(), layerNode);
    }

    
    removeLayer(path: Array<string>): LayerLeafNode {
        const node = path.pop();
        const pathNode = this.tranverseTree(path);
        const layerIndex = pathNode.children.findIndex(
            child => child instanceof LayerLeafNode && child.name === node
        );
        const removedNode = pathNode.children[layerIndex] as LayerLeafNode;
        pathNode.children.splice(layerIndex, 1);

        const layer = removedNode.getLayer();
        this.layerNodeMap.delete(layer.getId());

        return removedNode;
    }

    addFolder(path: Array<string>, layerNode: LayerPathNode, index?: number) {
        this.addNode(path, layerNode, index);
        this.indexTree(layerNode);
    }

    removeFolder(path:  Array<string>): LayerPathNode {
        const node = path.pop();
        const pathNode = this.tranverseTree(path);
        const layerIndex = pathNode.children.findIndex(
            child => child instanceof LayerPathNode && child.name === node
        );
        const removedNode = pathNode.children[layerIndex] as LayerPathNode;
        pathNode.children.splice(layerIndex, 1);
        this.indexTree(removedNode, LayerDirectoryOperations.REMOVE);
        return removedNode;
    } 

    moveLayer(oldPath: Array<string>, newPath: Array<string>, index?: number) {
        const node = this.removeLayer(oldPath);
        this.addLayer(newPath, node, index);
    }

    moveFolder(oldPath: Array<string>, newPath: Array<string>, index?: number) {
        const node = this.removeFolder(oldPath);
        this.addFolder(newPath, node, index);
    }

    getLayerDirectoryTree() {
        return this.root;
    }

    getLayerById(layerId: string) {
        const node = this.layerNodeMap.get(layerId);
        if (!node) {
            throw new Error("Layer does not exist");
        }

        return node.layer;
    }

    getLayers() {
        const arr: Array<Layer> = [];
        this.getLayersRecursiveHelper(this.root, arr);
        return arr;
    }

    private getLayersRecursiveHelper(node: LayerPathNode, res: Array<Layer>) {
        for (const child of node.getChildren()) {
            if (child instanceof LayerLeafNode) {
                res.push(child.layer);
            }

            if (child instanceof LayerPathNode) {
                this.getLayersRecursiveHelper(node, res);
            }
        }

        return res;
    }
}