import { inject, injectable } from "inversify";
import { Dimension } from "../../../../types/geometry.types";
import { Surface } from "../../entities/surface.entity";
import { LayerDirectoryService } from "../../../layer/services/layer-directory.service";
import { Layers, LayersMap } from "../../../layer/types/layer.types";
import { LayerFactoryService } from "../../../layer/services/layer-factory.service";


@injectable()
export class SurfaceService {
    constructor(
        @inject(LayerDirectoryService) private layerDirectoryService: LayerDirectoryService,
        @inject(LayerFactoryService) private layerFactoryService: LayerFactoryService,
    ) {}

    updateName(surface: Surface, name: string) {
        surface.setName(name);
    }

    updateId(surface: Surface, id: string) {
        surface.setId(id);
    }

    updateDimensions(surface: Surface, dimension: Dimension) {
        surface.setDimensions(dimension);
    }

    addLayer<T extends Layers>(surface: Surface, name: string, layerType: T): LayersMap<T> {
        const layer = this.layerFactoryService.createLayer(layerType, surface.getDimensions());
        const leafNode = this.layerDirectoryService.createLayerNode(name, layer);
        surface.addLayer(leafNode);
        return layer;
    }

    // updateBitmap(layerId?: Layer) {

    // }
}