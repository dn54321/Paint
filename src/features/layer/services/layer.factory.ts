import { DenseLayer } from "../entity/layers/dense-layer.entity";
import { SingleColorLayer } from "../entity/layers/single-color-layer.entity";
import { SparseLayer } from "../entity/layers/sparse-layer.entity";
import { Layers } from "../types/layer.types";

type LayerMap<T> = 
    T extends Layers.DENSE ? DenseLayer :
    T extends Layers.SINGLE_COLOR ? SingleColorLayer :
    T extends Layers.SPARSE ? SparseLayer :
    never;

export class LayerFactory {
    createLayer<T extends Layers>(layer: T, height: number, width: number): LayerMap<T>  {
        if (layer === Layers.DENSE) {
            return new DenseLayer(width, height) as LayerMap<T>;
        }

        if (layer === Layers.SPARSE) {
            return new SparseLayer(width, height) as LayerMap<T>;
        }

        if (layer === Layers.SINGLE_COLOR) {
            return new SingleColorLayer() as LayerMap<T>;
        }

        throw new Error("Invalid layer name");
    }
}