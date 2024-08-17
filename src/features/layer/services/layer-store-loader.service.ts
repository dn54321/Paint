import { DenseLayer } from "../entity/layers/dense-layer.entity";
import { SingleColorLayer } from "../entity/layers/single-color-layer.entity";
import { SparseLayer } from "../entity/layers/sparse-layer.entity";
import { DenseLayerData, SingleColorLayerData, SparseLayerData } from "../types/layer-loader.types";

export class LayerStoreLoaderService {
    load(layerData: SingleColorLayerData | DenseLayerData | SparseLayerData) {
        if ("color" in layerData) { // SingleColorLayer
            const singleColorLayer = new SingleColorLayer();
            singleColorLayer.fill(layerData.color);
            return singleColorLayer;
        }

        if ("colorGrid" in layerData) { // DenseLayer
            const height = layerData.colorGrid.length;
            const width = layerData.colorGrid[0].length;
            const denseLayer = new DenseLayer(height, width);
            for (let i = 0; i < height; ++i) {
                for (let j = 0; j < width; ++j) {
                    const color =  layerData.colorGrid[i][j];
                    if (color) {
                        denseLayer.draw({y:i, x:j}, color);
                    }
                }
            }
            return denseLayer;
        }

        if ("colorGridMap" in layerData) { //SparseLayer
            const sparseLayer = new SparseLayer(layerData.height, layerData.width);
            for (const [key, value] of Object.entries(sparseLayer)) {
                const y = Math.floor(Number(key)/layerData.width);
                const x = Number(key) % layerData.width;
                sparseLayer.draw({y,x}, value);
            }
            return sparseLayer;
        }

        throw new Error("Invalid Layer");
    }
}