import { Dimension, Position } from "../../../types/geometry.types";
import { SurfaceStoreData } from "../../surface/types/surface.types";


export interface SceneStoreData {
    surfaceData: SurfaceStoreData;
    zoom: number;
    rotation: number;
    scrollPosPercentage: Position;
    paddingDimensions: Dimension;
}