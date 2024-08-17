import { LayerNode, PathNode } from "../../types/layer-fs.types";

export class LayerPathNode implements PathNode {
    name: string;
    children: Array<LayerNode | PathNode>;

    constructor(name: string) {
        this.name = name;
        this.children = [];
    }

    addNode(node: LayerNode | PathNode, index?: number) {
        if (index) {
            this.children.splice(index, 0, node);
        } else {
            this.children.push(node);
        }
    }

    getChildren() {
        return this.children;
    }

    getName() {
        return this.name;
    }
}