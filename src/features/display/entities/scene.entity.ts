import { Dimension, Position } from "../../../types/geometry.types";
import { Surface } from "../../surface/entities/surface.entity";
import { SceneAction } from "../types/scene-action.types";

export interface SceneOptions {
    zoom: number;
    rotation: number;
    scrollPosPercentage: Position;
    paddingDimensions: Dimension;
    onChange: (scene: Scene, sceneAction: SceneAction) => void;
}


export class Scene {
    private surface: Surface;
    private zoom: number;
    private rotation: number;
    private scrollPosPercentage: Position;
    private paddingDimensions: Dimension;
    private onChange?: (scene: Scene, sceneAction: SceneAction) => void;
    constructor(surface: Surface, options?: Partial<SceneOptions>) {
        this.surface = surface;
        this.zoom = options?.zoom ?? 1;
        this.rotation = options?.rotation ?? 1;
        this.paddingDimensions = options?.paddingDimensions ?? {width: 0, height: 0};
        this.scrollPosPercentage = options?.scrollPosPercentage ?? {x: 0, y: 0};
        this.onChange = options?.onChange;
    }

    getZoom() {
        return this.zoom;
    }

    getSurface() {
        return this.surface;
    }

    getId() {
        return this.surface.getId();
    }

    setZoom(zoom: number) {
        console.log("Setting zoom to " + zoom);
        this.zoom = zoom;
        this.onChange?.(this, SceneAction.ZOOM);
    }

    getRotation() {
        return this.rotation;
    }

    setRotation(rotation: number) {
        this.rotation = rotation;
        this.onChange?.(this, SceneAction.ROTATE_SCENE);
    }

    getPaddingDimensions() {
        return this.paddingDimensions;
    } 

    setPaddingDimensions(paddingDimensions: Dimension) {
        this.paddingDimensions = paddingDimensions;
        this.onChange?.(this, SceneAction.CHANGE_PADDING);
    }

    getScrollPositionPercentage() {
        return this.scrollPosPercentage;
    }

    setScrollPositionPercentage(scrollPosition: Position) {
        console.log("Setting scroll to " + JSON.stringify(scrollPosition));
        this.scrollPosPercentage = scrollPosition;
        this.onChange?.(this, SceneAction.CHANGE_SCROLL);
    }

    setOnChange(fn: (scene: Scene, sceneAction: SceneAction) => void) {
        this.onChange = fn;
    }

    getCanvasImages() {
        return this.surface.getLayers().map(layer => layer.getBitmap());
    }
}