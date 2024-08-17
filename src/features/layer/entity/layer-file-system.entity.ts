import { LayerFileStructure, PathNode, RootNode } from "../types/layer-fs.types";
import { Layer } from "../types/layer.types";
import { LayerLeafNode } from "./path-nodes/layer-node.entity";
import { LayerPathNode } from "./path-nodes/layer-path-node.entity";

export class LayerFileSystem {
    private layerFileStructure: LayerFileStructure;
    constructor(rootNode: RootNode = {name: 'root', children: []}) {
        this.layerFileStructure = {
            root: rootNode
        }
    }
    private tranverseTree(path: Array<string>) {
        return path.reduce<PathNode>((parent: PathNode, nextPath: string) => {
            const nextSegment = parent.children
                .filter(child => child instanceof LayerPathNode)    
                .find(child => child.name === nextPath);

            if (nextSegment === undefined) {
                throw new Error("Invalid Layer Path.");
            }

            return (nextSegment ?? parent) as PathNode;
        }, this.layerFileStructure.root);
    }

    private addNode(path: Array<string>, layerNode: LayerLeafNode | LayerPathNode, index?: number) {
        const pathNode = this.tranverseTree(path);
        const spliceIndex = index === undefined ? pathNode.children.length - 1 : index;
        pathNode.children.splice(spliceIndex, 0, layerNode);
    }

    addLayer(path: Array<string>, layerNode: LayerLeafNode, index?: number) {
        this.addNode(path, layerNode, index);
    }

    
    removeLayer(path: Array<string>): LayerLeafNode {
        const node = path.pop();
        const pathNode = this.tranverseTree(path);
        const layerIndex = pathNode.children.findIndex(
            child => child instanceof LayerLeafNode && child.name === node
        );
        const removedNode = pathNode.children[layerIndex] as LayerLeafNode;
        pathNode.children.splice(layerIndex, 1);
        return removedNode;
    }

    addFolder(path: Array<string>, layerNode: LayerPathNode, index?: number) {
        this.addNode(path, layerNode, index);
    }

    removeFolder(path:  Array<string>): LayerPathNode {
        const node = path.pop();
        const pathNode = this.tranverseTree(path);
        const layerIndex = pathNode.children.findIndex(
            child => child instanceof LayerPathNode && child.name === node
        );
        const removedNode = pathNode.children[layerIndex] as LayerPathNode;
        pathNode.children.splice(layerIndex, 1);
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

    getLayers() {
        const arr: Array<Layer> = [];
        this.getLayersHelper(this.layerFileStructure.root, arr);
        return arr;
    }

    private getLayersHelper(root: PathNode, arr: Array<Layer>) {
        for (const node of root.children) {
            if (node instanceof LayerLeafNode) {
                arr.push(node.layer);
            }

            if (node instanceof LayerPathNode) {
                this.getLayersHelper(node, arr);
            }
        }
    }
}