import { createId } from "@paralleldrive/cuid2";
import { Persistable } from "../../../../types/writable.types";
import { LayerDirectoryNodes, LayerPathNodeData } from "../../types/layer-directory.types";
import { LayerLeafNode } from "./layer-node.entity";

export class LayerPathNode implements Persistable<LayerPathNodeData>  {
    name: string;
    children: Array<LayerLeafNode | LayerPathNode>;
    id: string;

    constructor(name: string, id?: string) {
        this.name = name;
        this.children = [];
        this.id = id ?? createId();
    }

    addNode(node: LayerLeafNode | LayerPathNode, index?: number) {
        if (index) {
            this.children.splice(index, 0, node);
        } else {
            this.children.push(node);
        }
    }

    getId() {
        return this.id;
    }

    getChildren() {
        return this.children;
    }

    getName() {
        return this.name;
    }

    toJson(parent?: string): LayerPathNodeData {
        return {
            name: this.name,
            type: LayerDirectoryNodes.FOLDER,
            id: this.id,
            parent: parent,
        }
    }
}