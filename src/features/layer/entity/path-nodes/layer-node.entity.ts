import { LayerNode } from "../../types/layer-fs.types";
import { Layer } from "../../types/layer.types";

export class LayerLeafNode implements LayerNode {
    name: string;
    layer: Layer;

    constructor(name: string, layer: Layer) {
        this.name = name;
        this.layer = layer;
    }

    getLayer() {
        return this.layer;
    }

    getName() {
        return this.name;
    }
}