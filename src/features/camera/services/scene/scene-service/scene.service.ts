import { boundBetween } from "../../../../../utils/math";
import { Scene } from "../../../entities/scene.entity";
import { SceneAction } from "../../../types/scene-action.types";
import { SceneNotifier } from "./scene-notifier.service";

export class SceneService {
    private sceneNotifier?: SceneNotifier;
    constructor(sceneNotifier?: SceneNotifier) {
        this.sceneNotifier = sceneNotifier;
    }

    centerScene(scene: Scene) {
        scene.setScrollPositionPercentage({x: 0.5, y: 0.5});

        const id = scene.getId();
        this.sceneNotifier?.notify(id, SceneAction.MOVE_SCENE);
    }

    rotateScene(scene: Scene, radians: number): void {
        const rotation = scene.getRotation();
        scene.setRotation(rotation + radians);

        const id = scene.getId();
        this.sceneNotifier?.notify(id, SceneAction.ROTATE_SCENE);
    }

    moveSceneByPercentage(scene: Scene, yPercentageOffset: number, xPercentageOffset: number): void {
        const sceneScrollPosition = scene.getScrollPositionPercentage();
        const xPercentage = boundBetween(sceneScrollPosition.x + xPercentageOffset, 0, 1);
        const yPercentage = boundBetween(sceneScrollPosition.y + yPercentageOffset, 0, 1);
        scene.setScrollPositionPercentage({x: xPercentage, y: yPercentage});

        const id = scene.getId();
        this.sceneNotifier?.notify(id, SceneAction.MOVE_SCENE);
    }

    zoomScene(scene: Scene, zoomOffset: number) {
        const zoom = scene.getZoom();
        scene.setZoom(zoom + zoomOffset); 

        const id = scene.getId();
        this.sceneNotifier?.notify(id, SceneAction.ZOOM);
    }
}