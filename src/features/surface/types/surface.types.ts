import { Dimension } from "../../../types/geometry.types"
import { LayerDirectory } from "../../layer/entity/layer-directory.entity"
import { LayerDirectoryData } from "../../layer/types/layer-directory.types"

export interface SurfaceStoreData {
    id: string,
    height: number,
    width: number,
    name: string,
    activeLayerId?: string,
    layerDirectoryData: LayerDirectoryData,
}

export interface SurfaceCreation {
    name: string,
    dimension: Dimension
    id?: string,
    layerDirectory?: LayerDirectory,
    activeLayerId?: string
}