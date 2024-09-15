import { Position } from "../../../../../types/geometry.types";
import { boundBetween, isPositionEqual } from "../../../../../utils/math";
import { Scene } from "../../../entities/scene.entity";


export class SceneService {
    constructor() {}

    centerScene(scene: Scene) {
        const centerPosition = {x: 0.5, y: 0.5};
        if (!isPositionEqual(centerPosition, scene.getScrollPositionPercentage())) {
            scene.setScrollPositionPercentage(centerPosition);
        }
    }

    setSceneRotation(scene: Scene, rotation: number): void {
        if (rotation != scene.getRotation()) {
            scene.setRotation(rotation);
        }

    }

    rotateScene(scene: Scene, radiansOffset: number): void {
        if (radiansOffset === 0) {
            return;
        }

        const sceneRotation = scene.getRotation();
        const newRotation = (sceneRotation + radiansOffset) % Math.PI
        scene.setRotation(newRotation);
    }

    moveSceneScroll(scene: Scene, scrollPercentageOffset: Position): void {
        const sceneScrollPosition = scene.getScrollPositionPercentage();
        const xPercentage = boundBetween(sceneScrollPosition.x + scrollPercentageOffset.x, 0, 1);
        const yPercentage = boundBetween(sceneScrollPosition.y + scrollPercentageOffset.y, 0, 1);
        const newScrollPosition = {x: xPercentage, y: yPercentage};
        if (!isPositionEqual(newScrollPosition, sceneScrollPosition)) {
            scene.setScrollPositionPercentage(newScrollPosition);
        }
    }

    setSceneScroll(scene: Scene, scrollPercentage: Position) {
        const sceneScrollPosition = scene.getScrollPositionPercentage();
        if (!isPositionEqual(sceneScrollPosition, scrollPercentage)) {
            scene.setScrollPositionPercentage(scrollPercentage);
        }
    }

    zoomScene(scene: Scene, zoomOffset: number) {
        if (zoomOffset === 0) {
            return;
        }

        const zoom = scene.getZoom();
        scene.setZoom(zoom + zoomOffset); 
    }

    setSceneZoom(scene: Scene, zoom: number) {
        const currentZoom = scene.getZoom();
        if (currentZoom === zoom) {
            return;
        }

        scene.setZoom(zoom); 
    }
}