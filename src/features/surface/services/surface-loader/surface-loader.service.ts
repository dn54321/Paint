import { inject, injectable } from "inversify";
import { Surface } from "../../entities/surface.entity"
import { SurfaceStoreData } from "../../types/surface.types";
import { LayerStoreLoaderService } from "../../../layer/services/layer-store-loader.service";

@injectable()
export class SurfaceStoreLoaderService {
    constructor(
        @inject(LayerStoreLoaderService) private layerLoaderService: LayerStoreLoaderService
    ) {}

    loadSurface(surfaceData: SurfaceStoreData): Surface {
        const layerFs = this.layerLoaderService.loadLayerFileSystem(surfaceData.layerDirectoryData);
        const surface = new Surface({
            dimension: {width: surfaceData.width, height: surfaceData.height},
            name: surfaceData.name,
            id: surfaceData.id,
            layerDirectory: layerFs,
            activeLayerId: surfaceData.activeLayerId,
        });

        return surface;
    }

    convertSurfaceToJSON(surface: Surface): SurfaceStoreData {
        const surfaceDimensions = surface.getDimensions();
        const layersFsStoreData = this.layerLoaderService.convertFileSystemToJson(surface.getLayerFileSystem());

        return {
            id: surface.getId(),
            name: surface.getName(),
            width: surfaceDimensions.width,
            height: surfaceDimensions.height,
            layerDirectoryData: layersFsStoreData,
            activeLayerId: surface.getActiveLayer()?.getId(),
        }
    }   
}