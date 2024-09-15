import { inject, injectable } from "inversify";
import { SurfaceStoreLoaderService } from "../../../../surface/services/surface-loader/surface-loader.service";
import { Scene } from "../../../entities/scene.entity";
import { SceneStoreData } from "../../../types/scene.types";


@injectable()
export class SceneStoreLoaderService {
    constructor(
        @inject(SurfaceStoreLoaderService) private surfaceStoreLoaderService: SurfaceStoreLoaderService,
    ) {}

    convertSceneToJson(scene: Scene): SceneStoreData {
        const surfaceData = this.surfaceStoreLoaderService.convertSurfaceToJSON(scene.getSurface());
        return {
            //surfaceId: scene.getSurface().getId(),
            surfaceData,
            zoom: scene.getZoom(),
            rotation: scene.getRotation(),
            scrollPosPercentage: scene.getScrollPositionPercentage(),
            paddingDimensions: scene.getPaddingDimensions(),
        }
    }
    
    loadScene(sceneStoreData: SceneStoreData): Scene {
        const {surfaceData, ...sceneOptions} = sceneStoreData;
        const surface = this.surfaceStoreLoaderService.loadSurface(surfaceData);
        const scene = new Scene(surface, {...sceneOptions});
        return scene;
    }
}
