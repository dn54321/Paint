import { Dimension, Position } from "../../../types/geometry.types";
import { Surface } from "../../surface/entities/surface.entity";

export interface SceneOptions {
    zoom: number;
    rotation: number;
    scrollPosPercentage: Position;
    paddingDimensions: Dimension;
}


export class Scene {
    private surface: Surface;
    private zoom: number;
    private rotation: number;
    private scrollPosPercentage: Position;
    private paddingDimensions: Dimension;

    constructor(surface: Surface, options?: Partial<SceneOptions>) {
        this.surface = surface;
        this.zoom = options?.zoom ?? 1;
        this.rotation = options?.rotation ?? 1;
        this.paddingDimensions = options?.paddingDimensions ?? {width: 0, height: 0};
        this.scrollPosPercentage = options?.scrollPosPercentage ?? {x: 0, y: 0};
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
        this.zoom = zoom;
    }

    getRotation() {
        return this.rotation;
    }

    setRotation(rotation: number) {
        this.rotation = rotation;
    }

    getPaddingDimensions() {
        return this.paddingDimensions;
    } 

    setPaddingDimensions(paddingDimensions: Dimension) {
        this.paddingDimensions = paddingDimensions;
    }

    getScrollPositionPercentage() {
        return this.scrollPosPercentage;
    }

    setScrollPositionPercentage(scrollPosition: Position) {
        this.scrollPosPercentage = scrollPosition;
    }

    getCanvasImages() {
        return this.surface.getLayers().map(layer => layer.getImage());
    }
}