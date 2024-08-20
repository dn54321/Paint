import { Dimension, Position } from "../../../../../types/geometry.types";
import { LayerDirectoryService } from "../../../../layer/services/layer-directory.service";
import { LayerFileSystemStoreLoaderService } from "../../../../layer/services/layer-file-system-loader.service";
import { LayerFactory } from "../../../../layer/services/layer.factory";
import { LayerFileStructure } from "../../../../layer/types/layer-fs.types";
import { Surface } from "../../../../surface/entities/surface.entity";
import { Scene } from "../../../entities/scene.entity";

export interface SurfaceStoreData {
    height: number,
    width: number,
    id: string,
    layerFs: {
        layerFileStructure: LayerFileStructure,
    }
    name: string,
}

export interface SceneStoreData {
    surface: SurfaceStoreData;
    zoom: number;
    rotation: number;
    scrollPosPercentage: Position;
    paddingDimensions: Dimension;
}

export class SceneStoreLoader {
    private layerFsLoaderService: LayerFileSystemStoreLoaderService;
    constructor(
        LayerFsLoaderService: LayerFileSystemStoreLoaderService
    ) {
        this.layerFsLoaderService = LayerFsLoaderService;
    }
    
    loadScene(sceneStoreData: SceneStoreData) {
        const {surface: surfaceData, ...surfaceOptionsData} = sceneStoreData
        const surface = this.loadSceneSurface(surfaceData);
        const scene = new Scene(surface, surfaceOptionsData);
        return scene;
    }

    loadSceneSurface(sceneStoreData: SurfaceStoreData) {
        const surface = new Surface(
            new LayerFactory(), 
            new LayerDirectoryService(), 
            sceneStoreData.height, 
            sceneStoreData.width, 
            sceneStoreData.name
        )
        const layerFs = this.layerFsLoaderService.load(sceneStoreData.layerFs.layerFileStructure);
        surface.setId(sceneStoreData.id);
        surface.setLayerFs(layerFs);
        return surface;
    }
}