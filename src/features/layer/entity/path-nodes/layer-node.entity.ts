import { createId } from "@paralleldrive/cuid2";
import { Persistable } from "../../../../types/writable.types";
import { LayerDirectoryNodes, LayerLeafNodeData } from "../../types/layer-directory.types";
import { Layer } from "../../types/layer.types";
import { isPersistable } from "../../../../utils/instance-of";
import { LayerData } from "../../types/layer-loader.types";

export class LayerLeafNode implements Persistable<LayerLeafNodeData> {
    name: string;
    layer: Layer;
    id: string;
    constructor(name: string, layer: Layer, id?: string) {
        this.name = name;
        this.layer = layer;
        this.id = id ?? createId();
    }

    getLayer() {
        return this.layer;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    toJson(parent?: string): LayerLeafNodeData {
        if (!isPersistable<LayerData>(this.layer)) {
            throw new Error("Layer is not persistable");
        }
        
        return {
            name: this.name,
            layer: this.layer.toJson(),
            type: LayerDirectoryNodes.ITEM,
            id: this.id,
            parent: parent, 
        }
    }

}