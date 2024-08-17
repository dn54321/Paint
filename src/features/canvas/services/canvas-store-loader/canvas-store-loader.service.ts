import { LayerDirectoryService } from "../../../layer/services/layer-directory.service";
import { LayerFileSystemStoreLoaderService } from "../../../layer/services/layer-file-system-loader.service";
import { LayerFactory } from "../../../layer/services/layer.factory";
import { LayerFileStructure } from "../../../layer/types/layer-fs.types";
import { Canvas } from "../../entities/canvas.entity";

export interface CanvasStoreData {
    height: number,
    width: number,
    id: string,
    layerFs: {
        layerFileStructure: LayerFileStructure,
    }
    name: string,
}

export class CanvasStoreLoader {
    private layerFsLoaderService: LayerFileSystemStoreLoaderService;
    constructor(
        LayerFsLoaderService: LayerFileSystemStoreLoaderService
    ) {
        this.layerFsLoaderService = LayerFsLoaderService;
    }
    
    load(canvasStoreData: CanvasStoreData) {
        const canvas = new Canvas(
            new LayerFactory(), 
            new LayerDirectoryService(), 
            canvasStoreData.height, 
            canvasStoreData.width, 
            canvasStoreData.name
        )
        const layerFs = this.layerFsLoaderService.load(canvasStoreData.layerFs.layerFileStructure);
        canvas.setId(canvasStoreData.id);
        canvas.setLayerFs(layerFs);
        return canvas;
    }
}