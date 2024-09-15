import Queue from 'mnemonist/queue';
import { Persistable } from "../../../types/writable.types";
import { LayerDirectory } from "../entity/layer-directory.entity";
import { DenseLayer } from "../entity/layers/dense-layer.entity";
import { SingleColorLayer } from "../entity/layers/single-color-layer.entity";
import { SparseLayer } from "../entity/layers/sparse-layer.entity";
import { LayerLeafNode } from "../entity/path-nodes/layer-node.entity";
import { LayerPathNode } from "../entity/path-nodes/layer-path-node.entity";
import { LayerDirectoryData, LayerDirectoryNodes } from "../types/layer-directory.types";
import { LayerData } from "../types/layer-loader.types";
import { Layers } from "../types/layer.types";
import { injectable } from "inversify";

@injectable()
export class LayerStoreLoaderService {
    convertLayerToJSON<T extends LayerData>(layer: Persistable<T>): ReturnType<typeof layer.toJson> {
        return layer.toJson();
    }

    loadLayer(layerData: LayerData) {
        if (layerData.type === Layers.SINGLE_COLOR) {
            const dimension = {height: layerData.height, width: layerData.width};
            const savedData = {id: layerData.id, color: layerData.color};
            const singleColorLayer = new SingleColorLayer(dimension, savedData);
            return singleColorLayer;
        }

        if (layerData.type === Layers.DENSE) {
            const dimension = {height: layerData.height, width: layerData.width};
            const savedData = {id: layerData.id}; // colorGrid:layerData.colorGrid, 
            const denseLayer = new DenseLayer(dimension, savedData);
            return denseLayer;
        }

        if (layerData.type === Layers.SPARSE) {
            const dimension = {height: layerData.height, width: layerData.width};
            const savedData = {id: layerData.id}; //colorGridMap: layerData.colorGrid, 
            const sparseLayer = new SparseLayer(dimension, savedData);
            return sparseLayer;
        }

        throw new Error("Invalid Layer");
    }
    
    convertFileSystemToJson(layerFileSystem: LayerDirectory): LayerDirectoryData {
        const rootNode = layerFileSystem.getLayerDirectoryTree();
        const jsonArray: LayerDirectoryData = [];
        const queue = new Queue<{node: LayerPathNode | LayerLeafNode, parent?: string}>();
        queue.enqueue({node: rootNode});

        while (queue.size) {
            const element = queue.dequeue()!;
            const node = element.node;
            const type = "children" in node ? LayerDirectoryNodes.FOLDER : LayerDirectoryNodes.ITEM;

            if (type === LayerDirectoryNodes.FOLDER) {
                const folderNode = node as LayerPathNode;
                const jsonData = folderNode.toJson(element.parent);
                jsonArray.push(jsonData);
                for (const childNode of folderNode.children) {
                    queue.enqueue({node: childNode, parent: folderNode.getId()})
                }

            }

            else if (type === LayerDirectoryNodes.ITEM) {
                const itemNode = node as LayerLeafNode;
                const jsonData = itemNode.toJson(element.parent);
                jsonArray.push(jsonData);
            }
        }

        return jsonArray;
    }

    loadLayerFileSystem(layerFileStructureData: LayerDirectoryData): LayerDirectory {
        const folderHashmap = new Map<string, LayerPathNode>();
        for (const node of layerFileStructureData) {
            if (node.type === LayerDirectoryNodes.FOLDER) {
                const folderNode = new LayerPathNode(node.name);
                folderHashmap.set(node.id, folderNode);
                if (node.parent) {
                    const parentNode = folderHashmap.get(node.parent);
                    parentNode?.addNode(folderNode)
                }
            }
            else if (node.type === LayerDirectoryNodes.ITEM) {
                const layer = this.loadLayer(node.layer);
                const itemNode = new LayerLeafNode(node.name, layer);
                if (node.parent) {
                    const parentNode = folderHashmap.get(node.parent);
                    parentNode?.addNode(itemNode);
                }
            }
        }
        
        const rootElementId = layerFileStructureData[0]?.id;
        const rootNode = folderHashmap.get(rootElementId);
        return new LayerDirectory(rootNode);
    }
}