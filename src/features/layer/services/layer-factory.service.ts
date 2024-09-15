import { injectable } from "inversify";
import { DenseLayer } from "../entity/layers/dense-layer.entity";
import { SingleColorLayer } from "../entity/layers/single-color-layer.entity";
import { SparseLayer } from "../entity/layers/sparse-layer.entity";
import { Layers, LayersMap } from "../types/layer.types";
import { Dimension } from "../../../types/geometry.types";

@injectable()
export class LayerFactoryService {
    createLayer<T extends Layers>(layer: T, dimension: Dimension): LayersMap<T>  {
        if (layer === Layers.DENSE) {
            return new DenseLayer(dimension) as LayersMap<T>;
        }

        if (layer === Layers.SPARSE) {
            return new SparseLayer(dimension) as LayersMap<T>;
        }

        if (layer === Layers.SINGLE_COLOR) {
            return new SingleColorLayer(dimension) as LayersMap<T>;
        }

        throw new Error("Invalid layer name");
    }
}